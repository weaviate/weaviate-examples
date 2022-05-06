import weaviate
import cv2
import os,sys
import pandas as pd
from student_test import getFaces, testImage, testit

def markAttendance(faces,own=False):
    '''
    This function takes in a list of image paths (paths of face images)
    and then uses weaviate's image2vec-neural module to classify
    each image depending upon the images initially uploaded to weaviate.
    It then classifies the image (ie identifies the student) and marks their attendance.
    '''
    data = pd.DataFrame(columns=['Name','Present'])
    for img in faces:
    
        if own:
            name = testit(img)
        else:
            name = testImage({"image":"{}".format(img)})
        #print(name)
        dict = {"Name":name,"Present":'P'}
        data = data.append(dict,ignore_index=True)
    print(data)
    return data