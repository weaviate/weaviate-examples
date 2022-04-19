'''This file is to check the code by running some test in terminal.
I have named the images such that it is easy while testing in terminal
without a frontend.'''

import pickle
import weaviate
import uuid
import datetime
import base64, json, os
from test import testImage,testText

client = weaviate.Client("http://localhost:8080")
print("Client created (This is terminal_test.py)")

# You can add more text input tests here
concepts = [
    'A little puppy',
    'a sparse market',
    'a market with many people', # This is giving same image as the one above it
    'many people',
    'person playing',
    'stars in the sky',
    'king of the jungle',
    'A loyal animal', # This gives lion's image instead of dog
    'scooby the pet',
    'graduating students',
    'students chilling in college',
    'children in classroom',
    'couple marrying'
]
print("==========================================")
for con in concepts:
    print(f"Input text --> {con} --> Result -->",testText({"concepts":[con]}))
print("==========================================")


# To add more image input texts, add test images to the static/Test folder.
print("==========================================")
test_images = os.listdir("static/Test/")
for img in test_images:
    print(f"Input Image --> {img} --> Result -->",testImage({"image":f"static/Test/{img}"}))
print("==========================================")