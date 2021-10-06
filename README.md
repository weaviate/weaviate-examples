# Weaviate examples

List of examples and tutorials of how to use the Vector Search Engine
Weaviate for cool machine-learning related tasks.

### Running Weaviate

* Most examples assume you have a Weaviate running. You can run one locally by following [this installation guide](https://www.semi.technology/developers/weaviate/current/getting-started/installation.html#customize-your-weaviate-setup) in the documentation.
  * If you need a specific vectorizer module or another ML module, it will be explained in the tutorial.
* Basic links: [Documentation](https://github.com/semi-technologies/weaviate) – [Github](https://www.semi.technology/developers/weaviate/current/)

## Examples

|Title|Language|Description|
|---|---|---|
| [Information Retrieval with BERT (Weaviate without vectorizer module)](bert-information-retrieval) | Python (Jupyter Notebook) | In this example we are going to use Weaviate without vectorization module, and use it as pure vector database to use a BERT transformer to vectorize text documents, then retrieve the closest ones through Weaviate's Search | 
| [Unmask Superheroes in 5 steps using the Weaviate NLP module and the Python client](unmask-superheroes) | Python | Super simple 5 step guide to get started with the Weaviate NLP modules. This is a basic introduction to semantic search with Weaviate and the Python client.|
| [Semantic search through wine dataset](semanticsearch-transformers-wines) | Python | Easy example to get started with Weaviate and semantic search with the Transformers module |
| [Weaviate simple schema](schema-wines) | Python | Easy example of a schema and how to upload it to Weaviate with the Python client |
