import pandas as pd
import urllib.request
data=pd.read_csv("/home/hp/Documents/weaviate-movie-recommendation/final_data.csv")
for i in range(0,len(data)):
    try:
        f = open('/home/hp/Documents/weaviate-movie-recommendation/posters/'+str(data.iloc[i]['id'])+'.jpg','wb')
        f.write(urllib.request.urlopen(data.iloc[i]['PosterLink']).read())
        f.close()
    except:
        print("failed")

    print (i)