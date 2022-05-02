import face_recognition
import pickle
import cv2
import os

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
    return encodings[0]

