import weaviate 

client = weaviate.Client("http://localhost:8080")

get_short_query = """
{
    Get {
        WeaviateShorts (limit: 1) {
            content
        }
    }
}
"""
short = client.query.raw(get_short_query)["data"]["Get"]["WeaviateShorts"][0]["content"]
print(short)

prompt = """
Here is an example of a Weaviate Short: 

%s 

Please write a Weaviate Short based on the content in this podcast clip:

{content}

""" % short

generate_query = """
{
    Get {
        PodClip (
            hybrid: {
                query: "What is Ref2Vec?"
                alpha: 0.5
            })
            {
                content
                _additional {
                    generate(
                        singleResult: {
                            prompt: \"\"\"
                            %s
                            \"\"\"
                        }
                    ){
                    singleResult
                    }
                }
            }
    }
}
""" % prompt

#print(generate_query)
short_from_podClip = client.query.raw(generate_query)["data"]["Get"]["PodClip"][0]["_additional"]["generate"]["singleResult"]
print("\n")
print(short_from_podClip)