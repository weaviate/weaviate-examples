import weaviate
import cv2
import os,sys
import pandas as pd
from student_test import getFaces, testImage, test_own_vector
from custom_exception import NoFaceDetectedError

def markAttendance(faces,own=False):
    print("------------mark attendance function called---------------")
    '''
    This function takes in a list of image paths (paths of face images)
    and then uses weaviate's image2vec-neural module to classify
    each image depending upon the images initially uploaded to weaviate.
    It then classifies the image (ie identifies the student) and marks their attendance.
    '''
    data = pd.DataFrame(columns=['Name','Present'])
    error_frame = pd.DataFrame(columns=["Error"])
    if(len(faces)==0):
        # raise NoFaceDetectedError("No face was detected in the uploaded Image")
        error_frame = error_frame.append({"Error":"No Face was detected in the uploaded Image. Please try again."},ignore_index=True)

    # This for loop will work only if the faces list is not empty
    for img in faces:
    
        if own:
            print("------calling test own vector funciton-----------")
            name = test_own_vector(img)
        else:
            print("-------calling testImage function--------")
            name = testImage({"image":"{}".format(img)})
        print("Test own vector function returned:",name)
        
        if name=="No match found" or name=="Not a face":
            # print("Error frame edit")
            error_frame = error_frame.append({"Error":name},ignore_index=True)
            print("Checking error frame:")
            # print(error_frame)
        else:
            print("Marking attendace")
            dict = {"Name":name,"Present":'P'}
            data = data.append(dict,ignore_index=True)


    print("--------------------Attendance dataframe---------")
    print(data)
    print("--------------------Error dataframe--------------")
    print(error_frame)
    
    print("-------mark attendance function ENDS-------------")
    return data,error_frame