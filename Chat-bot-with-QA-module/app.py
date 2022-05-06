#from chatbot import CB
from flask import Flask, render_template, request
import pickle, random, json
import requests
import weaviate
from get import getAnswer
app = Flask(__name__)
client = weaviate.Client("http://localhost:8080")
print("Client created")


@app.route("/chatbot")
def home():
    return render_template("index.html")

@app.route("/get")
def get_bot_response():
   userText = request.args.get('msg')
   return getAnswer(userText,client)

if __name__ == "__main__":
    app.run(debug = True)