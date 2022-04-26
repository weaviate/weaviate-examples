import sys
from getpass import getpass # hide password
import weaviate # to communicate to the Weaviate instance
from weaviate.wcs import WCS
import time
import pandas as pd
import pandas_profiling as pp


#PRE PROCESSING FUNCTION TO CREATE PANDAS DATAFRAME AND THEN GENERATE PROFILE
def get_columns():
  obj =client.schema.get()
  column_names=[]
  for i in range (0,len(obj['classes'])):
    for j in range (0,len(obj['classes'][i]['properties'])):
      column_names.append(obj['classes'][i]['properties'][j]['name'])

  return column_names 

def get_size(class_name):
  result = client.query.aggregate(class_name) \
    .with_fields('meta { count }') \
    .do()
  return result['data']['Aggregate'][class_name][0]['meta']['count']

def get_classname(i):
  obj =client.schema.get()
  return obj['classes'][i]['class']

def generate_profile():
  column_names=get_columns()
  class_name=get_classname(0)
  data_size=get_size(class_name)
  result = client.query.get(class_name=class_name, properties=column_names)\
      .with_limit(data_size)\
      .do()
  data={}
  for i in range(0,len(column_names)):
    column_data=[]
    for j in range (0,data_size):
      try:
        column_data.append(result['data']['Get'][class_name][j][column_names[i]])
      except:
        print(i,j)
    name=column_names[i]
    d={name:column_data}
    data.update(d)
  df = pd.DataFrame(data)
  profile = pp.ProfileReport(df)
  profile.to_file("/home/yash/Documents/weaviate-data-profiling/views/output.html")


#SETTING UP CLIENT
my_credentials = weaviate.auth.AuthClientPassword(username=sys.argv[1], password=sys.argv[2])
print(my_credentials)
try:
  my_wcs = WCS(my_credentials)
except:
    print("Invalid creds")
    exit()


cluster_url=sys.argv[3]
try:
  client = weaviate.Client(cluster_url,my_credentials)
except:
    print("INVALID URL!!!!!!!!")
    exit()

if(client.is_ready()== True):
    print("Client is Ready!")
    generate_profile()
else:
    print("INVALID URL!!!!!!!!")


