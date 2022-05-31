import os
from app import app
import urllib.request
from flask import Flask, flash, request, redirect, url_for, render_template
from werkzeug.utils import secure_filename
from student_test import testImage, getFaces
from mark import markAttendance

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
	
@app.route('/')
def upload_form():
	return render_template('upload.html')

@app.route('/', methods=['POST'])
def upload_image():
    # Function to upload an image. You can upload images from test folder or from the internet and classify them.
	if 'file' not in request.files:
		flash('No file part')
		return redirect(request.url)

	file = request.files['file']

	if file.filename == '':
		flash('No image selected for uploading')
		return redirect(request.url)

	if file and allowed_file(file.filename):
		filename = secure_filename(file.filename)
		file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
		
		flash('Image successfully uploaded and displayed below')
        
		# caption = testImage({"image":"static/uploads/{}".format(filename)})
		# return render_template('upload.html', filename=filename,caption=caption)

        # Using the getFaces function to get all different faces from the uploaded image
		faces = getFaces("static/uploads/{}".format(filename))

        # Using the markAttendance function to mark attendance of recognized faces.
		attendance,error = markAttendance(faces,own=True)
		attendance = attendance.drop_duplicates()
		# error = error.drop_duplicates()

		htl = attendance.to_html() # convert to html so as to render in the 
		err = error.to_html()
		# print(attendance.to_html())
        
		return render_template('upload.html', filename=filename,htl=htl,err=err)

	else:
		flash('Allowed image types are -> png, jpg, jpeg, gif')
		return redirect(request.url)

@app.route('/display/<filename>')
def display_image(filename):
    # Function to display uploaded image
    print("Display image called")
    
    return redirect(url_for('static', filename='uploads/' + filename), code=301)


if __name__ == "__main__":
    app.run(debug=True)