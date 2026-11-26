"""
End-to-end test for the AG2 Multi-Agent RAG with Weaviate example.

Requires:
    - OPENAI_API_KEY environment variable set with a valid key
    - pip install "ag2[openai]>=0.11.4,<1.0" weaviate-client

Usage:
    export OPENAI_API_KEY="sk-..."
    python test_e2e.py
"""

import os
import sys

from autogen import (
    AssistantAgent,
    GroupChat,
    GroupChatManager,
    LLMConfig,
    UserProxyAgent,
)
import weaviate
from weaviate.classes.config import Configure, DataType, Property
from weaviate.classes.query import MetadataQuery


def main():
    # -------------------------------------------------------------------
    # 1. Validate API key
    # -------------------------------------------------------------------
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key or api_key == "your-api-key":
        print("ERROR: Set OPENAI_API_KEY environment variable to a valid key.")
        sys.exit(1)

    # -------------------------------------------------------------------
    # 2. Connect to Weaviate Embedded
    # -------------------------------------------------------------------
    print("Connecting to Weaviate Embedded...")
    client = weaviate.connect_to_embedded(
        headers={"X-OpenAI-Api-Key": api_key},
    )
    print(f"Weaviate is ready: {client.is_ready()}")

    collection_name = "AG2_RAG_Demo"

    try:
        # ---------------------------------------------------------------
        # 3. Create collection
        # ---------------------------------------------------------------
        if client.collections.exists(collection_name):
            client.collections.delete(collection_name)

        collection = client.collections.create(
            name=collection_name,
            vector_config=Configure.Vectors.text2vec_openai(
                model="text-embedding-3-small",
            ),
            properties=[
                Property(name="text", data_type=DataType.TEXT),
                Property(name="source", data_type=DataType.TEXT),
            ],
        )
        print(f"Collection '{collection_name}' created.")

        # ---------------------------------------------------------------
        # 4. Index documents
        # ---------------------------------------------------------------
        documents = [
            {
                "text": (
                    "Retrieval-Augmented Generation (RAG) is a technique that combines "
                    "information retrieval with language model generation. It first retrieves "
                    "relevant documents from a knowledge base, then uses them as context for "
                    "generating accurate, grounded responses. RAG reduces hallucination and "
                    "enables models to access up-to-date information beyond their training data."
                ),
                "source": "ai_concepts.md",
            },
            {
                "text": (
                    "Vector databases store data as high-dimensional vectors (embeddings) "
                    "and enable fast similarity search. Weaviate is an open-source vector database "
                    "that combines vector search with structured filtering and supports multiple "
                    "vectorizer modules including OpenAI, Cohere, and Hugging Face transformers."
                ),
                "source": "vector_databases.md",
            },
            {
                "text": (
                    "Multi-agent systems use multiple AI agents that collaborate to solve "
                    "complex tasks. Each agent can have specialized roles, tools, and knowledge. "
                    "AG2 (formerly AutoGen) is a popular framework for building multi-agent "
                    "conversations where agents can use tools, write code, and coordinate "
                    "through structured dialogue patterns."
                ),
                "source": "multi_agent_systems.md",
            },
            {
                "text": (
                    "Embedding models convert text into dense numerical vectors that "
                    "capture semantic meaning. Similar texts produce similar vectors, enabling "
                    "semantic search. Popular embedding models include OpenAI text-embedding-3-small, "
                    "sentence-transformers, and BGE models. The choice of embedding model "
                    "significantly impacts retrieval quality in RAG systems."
                ),
                "source": "embeddings.md",
            },
            {
                "text": (
                    "Chunking is the process of splitting documents into smaller pieces "
                    "for embedding and retrieval. Common strategies include fixed-size chunking, "
                    "recursive character splitting, and semantic chunking. Optimal chunk size "
                    "depends on the use case: 256-512 tokens for precise retrieval, 1000+ tokens "
                    "for broader context. Overlap between chunks helps preserve context."
                ),
                "source": "chunking_strategies.md",
            },
        ]

        collection = client.collections.get(collection_name)

        with collection.batch.dynamic() as batch:
            for doc in documents:
                batch.add_object(properties=doc)

        print(
            f"Indexed {len(documents)} documents into Weaviate collection '{collection_name}'"
        )

        # ---------------------------------------------------------------
        # 5. Test semantic search
        # ---------------------------------------------------------------
        print("\n--- Testing Weaviate semantic search ---")
        results = collection.query.near_text(
            query="What is RAG?",
            limit=3,
            return_metadata=MetadataQuery(distance=True),
        )

        for obj in results.objects:
            print(
                f"Source: {obj.properties['source']} (distance: {obj.metadata.distance:.4f})"
            )
            print(f"  {obj.properties['text'][:100]}...")
            print()

        assert len(results.objects) > 0, "Weaviate search returned no results"
        print("Weaviate search OK.\n")

        # ---------------------------------------------------------------
        # 6. Define search tool
        # ---------------------------------------------------------------
        def search_weaviate(query: str, top_k: int = 3) -> str:
            results = collection.query.near_text(
                query=query,
                limit=top_k,
                return_metadata=MetadataQuery(distance=True),
            )

            formatted = []
            for i, obj in enumerate(results.objects, 1):
                source = obj.properties["source"]
                text = obj.properties["text"]
                distance = obj.metadata.distance
                formatted.append(
                    f"[{i}] Source: {source} (distance: {distance:.4f})\n{text}"
                )

            return (
                "\n\n---\n\n".join(formatted)
                if formatted
                else "No relevant documents found."
            )

        # ---------------------------------------------------------------
        # 7. Set up AG2 agents and run multi-agent conversation
        # ---------------------------------------------------------------
        print("--- Setting up AG2 agents ---")

        llm_config = LLMConfig(
            {
                "model": "gpt-4o-mini",
                "api_key": api_key,
                "api_type": "openai",
            }
        )

        researcher = AssistantAgent(
            name="researcher",
            system_message=(
                "You are a research agent. When asked a question, use the search_documents "
                "tool to retrieve relevant documents from the Weaviate knowledge base. "
                "Present your findings clearly with source references. If results are "
                "insufficient, try rephrasing your search query."
            ),
            llm_config=llm_config,
        )

        analyst = AssistantAgent(
            name="analyst",
            system_message=(
                "You are an analyst. Based on the researcher's findings, synthesize the "
                "information into a comprehensive, well-structured answer. Always reference "
                "the source documents. End with TERMINATE when done."
            ),
            llm_config=llm_config,
        )

        user_proxy = UserProxyAgent(
            name="user_proxy",
            human_input_mode="NEVER",
            max_consecutive_auto_reply=10,
            code_execution_config=False,
            is_termination_msg=lambda x: x.get("content", "")
            and "TERMINATE" in x.get("content", ""),
        )

        @user_proxy.register_for_execution()
        @researcher.register_for_llm(
            description=(
                "Search the Weaviate vector database for relevant documents. "
                "Returns document chunks with similarity distances and source references. "
                "Use specific search queries for best results."
            )
        )
        def search_documents(query: str, top_k: int = 3) -> str:
            """Search Weaviate for relevant documents."""
            return search_weaviate(query, top_k)

        group_chat = GroupChat(
            agents=[user_proxy, researcher, analyst],
            messages=[],
            max_round=12,
        )

        manager = GroupChatManager(
            groupchat=group_chat,
            llm_config=llm_config,
        )

        print("--- Running multi-agent conversation (real LLM calls) ---\n")

        user_proxy.run(
            manager,
            message=(
                "What is RAG and how does it work with vector databases? "
                "Also explain how multi-agent systems can improve RAG quality."
            ),
        ).process()

        print("\n--- Multi-agent conversation completed ---")

    finally:
        # ---------------------------------------------------------------
        # 8. Cleanup
        # ---------------------------------------------------------------
        if client.collections.exists(collection_name):
            client.collections.delete(collection_name)
            print(f"Deleted collection '{collection_name}'")
        client.close()
        print("Weaviate connection closed.")

    print("\nAll done. Test passed.")


if __name__ == "__main__":
    main()
