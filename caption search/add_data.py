import weaviate
from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse, parse_qs
import sys

#Function to extract video id from video url
def video_id(value):
    query = urlparse(value)
    if query.hostname == 'youtu.be':
        return query.path[1:]
    if query.hostname in ('www.youtube.com', 'youtube.com'):
        if query.path == '/watch':
            p = parse_qs(query.query)
            return p['v'][0]
        if query.path[:7] == '/embed/':
            return query.path.split('/')[2]
        if query.path[:3] == '/v/':
            return query.path.split('/')[2]
    return None

# video_url=sys.argv[1]
video_url="https://www.youtube.com/watch?v=rBKvoIGihnY&t=16s"
# assigning srt variable with the list  
# of dictonaries obtained by the get_transcript() function
srt = YouTubeTranscriptApi.get_transcript(video_id(video_url), languages=['en'])

#setting up client
client = weaviate.Client("http://localhost:8080")

#Checking if caption schema already exists, then delete it
current_schemas = client.schema.get()['classes']
for schema in current_schemas:
    if schema['class']=='Caption':
        client.schema.delete_class('Caption')
    if schema['class']=='Timestamps':
        client.schema.delete_class('Timestamps')

#creating the caption schema
caption_schema = {    
    "class": "caption",
    "description": "caption of video",
    "properties": [
        {
            "name": "text",
            "dataType": ["string"],
            "description": "The combined caption of whole video", 
        }
    ]
}
client.schema.create_class(caption_schema)

# srt variable will be a list of dictionary where each element will be having value as {"text": caption text, "start": starting time of caption, "duration": duration for which that caption appear} 
# We introduce a new variable all_text which will store combined caption of whole video, So later we can perform our Q&A query on this text
all_text=""

# Now as our Q&A query gives starting index and ending index of the part of text where it found the answere we have to map all the indexes with 
# a particular time on which they appear. For this we introduce new variable start_time which will list of dictionaries having starting index, ending index and timestamp at which that caption appear
start_time=[]
prev_end=0
for caption in srt:
    all_text=all_text+" "+caption["text"].replace('\n', '').replace('\r', '').replace('\xa0',' ') # removing some unecessary characters
    dict={"start":prev_end,"end":len(all_text),"time":caption["start"]}    
    start_time.append(dict)
    prev_end=len(all_text)

obj = {
        "text": all_text
      }
#adding the all_text variable which is having all the caption combined into our caption class
client.data_object.create(obj, "caption")

#creating the timestamps schema
time_stamp_schema = {    
    "class": "timestamps",
    "description": "time stamps of the video",
    "properties": [
        {
            "name": "startIndex",
            "dataType": ["number"],
            "description": "The starting index of the caption of particular timestamp", 
        },
        {
            "name": "endIndex",
            "dataType": ["number"],
            "description": "The ending index of the caption of particular timestamp", 
        },
        {
            "name": "time",
            "dataType": ["number"],
            "description": "The time at which particular caption occur", 
        }
    ]
}

client.schema.create_class(time_stamp_schema)

#configuring batch import
client.batch.configure(
  batch_size=10, 
  # dynamically update the `batch_size` based on import speed
  dynamic=True,
  timeout_retries=3,
)

for caption_indexes in start_time:
    obj = {
        "startIndex":caption_indexes["start"],
        "endIndex":caption_indexes["end"],
        "time":caption_indexes["time"]
      }
    
    try:
        client.data_object.create(obj, "timestamps")
    except BaseException as error:
        print("Import Failed at: ",i)
        print("An exception occurred: {}".format(error))
        # Stop the import on error
        break
    

print("completed")