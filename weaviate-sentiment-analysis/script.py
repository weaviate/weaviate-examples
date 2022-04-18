import weaviate

client = weaviate.Client("http://localhost:8080")
def query(text):
    get_comment_query = """
    {
        Get{
        Comments(
            nearText: {
            concepts: ["%s"],
            certainty: 0.7,
            }
        )
        {
            sentiment
        }
        }
    }
    """%(text)

    query_result = client.query.raw(get_comment_query)
    return query_result['data']['Get']['Comments'][0]['sentiment']

def func_choice():
    choice = input("Do you want to continue? Y/N \n")
    if(choice == "y" or choice == "Y"):
        flag = True
    elif(choice == "n" or choice == "N"):
        flag = False
    else:
        print("Please enter a suitable character.")
        flag = func_choice()
    return flag


if __name__ == "__main__":
    flag = True
    while flag==True:
        text = input("Enter the sentence. \n")
        sentiment = query(text)
        print(sentiment)
        flag = func_choice()



    
    