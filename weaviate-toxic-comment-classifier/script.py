import weaviate
from tkinter import *

#setting up client
client = weaviate.Client("http://localhost:8080")

#Function to get label for a certain text
def get_label(text):
    get_articles_query = """
    {
        Get{
        Comments(
            nearText: {
            concepts: ["%s"],
            certainty: 0.7,
            }
        )
        {
            label
        }
        }
    }
    """%(text)

    query_result = client.query.raw(get_articles_query)
    return query_result['data']['Get']['Comments'][0]['label']


#on click function for classify button
def activate():
    text=e1.get()
    print(text)
    result=get_label(text)
    l2.config(text=result)

#creating GUI for Tkinter window
window=Tk()
window.title("Weaviate Toxicity Classifier")
l1=Label(window,text="Enter your text here :")
l1.grid(row=0,column=0)
text_field=StringVar()
e1=Entry(window,textvariable=text_field,width=50)
e1.grid(row=0,column=1)
start=Button(window,text="Classify",width=20,pady=5,command=activate)
start.grid(row=1,column=0)
l2=Label(window,text="")
l2.grid(row=1,column=1)

window.mainloop()