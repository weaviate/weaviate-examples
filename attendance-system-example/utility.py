import os

for folder in os.listdir("students/"):
    c = 1
    for file in os.listdir(f"students/{folder}"):
        os.rename(f"students/{folder}/{file}",f"students/{folder}/{str(c)}.jpg")
        c+=1
print("Done renaming")