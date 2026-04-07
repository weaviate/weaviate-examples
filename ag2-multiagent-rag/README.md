# AG2 Multi-Agent RAG with Weaviate

This example demonstrates how to use [AG2](https://ag2.ai/) (formerly AutoGen)
multi-agent conversations with [Weaviate](https://weaviate.io/) for
Retrieval-Augmented Generation (RAG).

## Overview

Two AG2 agents collaborate to answer questions using documents stored in Weaviate:

- **Research Agent** retrieves relevant documents via Weaviate semantic search
- **Analyst Agent** synthesizes the information into comprehensive answers

## Prerequisites

- Python >= 3.10
- OpenAI API key

## Quick Start

```bash
pip install "ag2[openai]>=0.11.4,<1.0" weaviate-client
```

Set your API key:

```bash
export OPENAI_API_KEY="your-api-key"
```

Run the notebook:

```bash
jupyter notebook ag2_multiagent_rag_with_weaviate.ipynb
```

Or open directly in Google Colab:

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/weaviate/weaviate-examples/blob/main/ag2-multiagent-rag/ag2_multiagent_rag_with_weaviate.ipynb)

## Tech Stack

- [AG2](https://ag2.ai/) — Multi-agent conversation framework (500K+ monthly PyPI downloads)
- [Weaviate](https://weaviate.io/) — Open-source vector database
- [Weaviate Embedded](https://weaviate.io/developers/weaviate/connections/connect-embedded) — In-process mode (no Docker needed)
- [text2vec-openai](https://weaviate.io/developers/weaviate/model-providers/openai/embeddings) — Automatic embedding generation

## How It Works

1. Documents are indexed into Weaviate (auto-embedded via `text2vec-openai`)
2. AG2 Research Agent uses a registered `search_documents` tool to query Weaviate
3. AG2 Analyst Agent synthesizes retrieved information into grounded answers
4. Agents collaborate via AG2 GroupChat with automatic tool execution
