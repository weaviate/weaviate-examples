'''This file can be used to check if everything works as expected or not'''

import pickle
import weaviate
import uuid
import datetime
import base64, json, os

client = weaviate.Client("http://localhost:8080")
print("Client created (test.py)")
res = client.query.get('Comment', ['content', '_additional {tokens ( properties: ["content"], limit: 3, certainty: 0.7) {entity property word certainty startPosition endPosition }}']).do()

for i in res['data']['Get']['Comment']:

    # i['content] is the comment or text that we entered in data.py file
    print(i['content'])

    # entity here is either an organization(I-ORG), person(I-PER) or location(I-PER).
    # This model currently supports these three and I-MISC for miscellaneous.
    for tok in i['_additional']['tokens']:
        print(tok['entity'],tok['word'])
    print()