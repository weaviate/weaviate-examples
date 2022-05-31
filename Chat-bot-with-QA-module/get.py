def getAnswer(question,client):
    ask = {
    "question": question,
    "properties": ["text"]
    }
    result = client.query.get("Apollo", ["text", "_additional {answer {hasAnswer certainty property result startPosition endPosition} }"]).with_ask(ask).with_limit(1).do()

    answer = result['data']['Get']['Apollo'][0]['_additional']['answer']['result']
    return answer