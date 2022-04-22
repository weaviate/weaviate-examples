'''Adding people's data in a csv file'''

import pandas as pd
import weaviate
info = pd.DataFrame(columns=['Name','Location','Organization'])

def fetch():
    # Function to fetch the comments /data with additional properties.
    client = weaviate.Client("http://localhost:8080")
    print("Client created (add.py   fetch function)")
    res = client.query.get('Comment', ['content', '_additional {tokens ( properties: ["content"], limit: 3, certainty: 0.5) {entity property word certainty startPosition endPosition }}']).do()
    return res['data']['Get']['Comment']

def add(name,org,place):
    # Adds information in the dataframe
    global info
    info = info.append({'Name':name,'Organization':org,'Location':place},ignore_index=True)
    print("Data added")

for i in fetch():
    print(i['content'])
    name = org = place = None
    for tok in i['_additional']['tokens']:
        
        if tok['entity']=='I-PER':
            name = tok['word']
            
        elif tok['entity']=='I-ORG':
            org = tok['word']
            
        elif tok['entity']=='I-LOC':
            place = tok['word']
            
    add(name,org,place)

# Saving the dataframe in a csv file
info.to_csv("./info.csv")