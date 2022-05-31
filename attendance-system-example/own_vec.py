import face_recognition
import pickle
import cv2
import os
import numpy as np
# ip = "students/Aakash/1.jpg"

# image = cv2.imread(ip)
# rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# boxes = face_recognition.face_locations(rgb,model='hog')

# encodings = face_recognition.face_encodings(rgb, boxes)

# print(encodings)

def getFaceEncoding(image_path):
    '''
    This function returns an array, which is an embedding of face
    present in the image whose path is passed as parameter.
    '''
    image = cv2.imread(image_path)
    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    boxes = face_recognition.face_locations(rgb,model='hog')
    encodings = face_recognition.face_encodings(rgb, boxes)

    # If no face vector could be extracted, return an array of zeros.
    if(len(encodings)==0):
        return np.zeros(128)

    # print("Length of face encoding:",len(encodings),"and length of vector:",len(encodings[0]))
    return encodings[0]

