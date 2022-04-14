# Semantic search on podcast transcripts using Weaviate
  
Dataset: 300 Podcast transcripts from [`Changelog`](https://github.com/thechangelog/transcripts)  
[Vectorization module](https://weaviate.io/developers/weaviate/current/retriever-vectorizer-modules/text2vec-transformers.html#pre-built-images): [`sentence-transformers/msmarco-distilroberta-base-v2`](https://huggingface.co/sentence-transformers/msmarco-distilroberta-base-v2)

# Set-up Guide  
1. Set-up  Weaviate: `docker-compose up -d`*
2. Install Weaviate client: `pip install weaviate_client==3.2.2`
3. Import data: `python3 import.py`**
4. Query data: Go to [console.semi.technology](https://console.semi.technology/) on Chrome/Safari and connect to http://localhost:9999. Click on Query Module to start querying using GraphQL
 
*Change port `9999` in `docker-compose.yml`  and `import.py` to a different value (like 8888), if not able to connect  
**Could take up to 3 hrs 🙂
  
# Example Queries:

Suppose we want to listen to some Changelog episodes discussing GraphQL. We can list the desired episode titles (and transcripts too) via `nearText` for the concept `Episode about graphql`:  

![Screenshot 2022-03-29 191123](https://user-images.githubusercontent.com/72981484/160694464-38a49b47-cd8f-4492-ae25-1cffaa7d85c2.jpg)  

The Changelog #255 is [Why is GraphQL so cool?](https://changelog.com/podcast/255)  
The Changelog #297 is [Prisma and the GraphQL data layer](https://changelog.com/podcast/297)  
The Changelog #316 is [REST easy, GraphQL is here](https://changelog.com/podcast/316)  

Well, that was quite simple. In fact, a podcast search engine could have provided the same results.  
So how about we list some episodes about web development but in the context of Python and not Javascript.  
In addition to `nearText` for the concept of `Episode about web development`, we'll also add `moveTo` (for python) and `moveAwayFrom` (for javascript) arguements:  

<img width="847" alt="image" src="https://user-images.githubusercontent.com/72981484/160699867-c3ef3f3b-8eaf-4867-aac7-ac2bc2ec0282.png">  

The Changelog #301 is [Python at Microsoft](https://changelog.com/podcast/301)  
The Changelog #229 is [Python, Django, and Channels](https://changelog.com/podcast/229)  

Let's say that listening to the GraphQL and Python episodes has inspired us to create a Machine Learning startup. Thus we would now like to listen to CEOs and Founders but in the field of Machine Learning or Data Science instead of vanilla Web Development:  

![aiCeo](https://user-images.githubusercontent.com/72981484/160701102-66ae4f12-e004-447e-acb0-594b4e6309f2.jpg)  
 
The Practical AI #149 is [Trends in data labeling](https://changelog.com/practicalai/149) (With CEO of Label Studio)   
The Changelog #305 is [Putting AI in a box at MachineBox](https://changelog.com/podcast/305) (With founders of MachineBox)  
The Practical AI #134 is [Apache TVM and OctoML](https://changelog.com/practicalai/134) (With CEO and co-founder of OctoML )  
The Practical AI #148 is [Stellar inference speed via AutoNAS](https://changelog.com/practicalai/148) (With CEO and co-founder of Deci)  
The Practical AI #141 is [Towards stability and robustness](https://changelog.com/practicalai/141) (With CTO of BeyondMinds)  






