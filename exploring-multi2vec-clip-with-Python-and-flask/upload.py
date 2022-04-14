import os
from app import app
import urllib.request
from flask import Flask, flash, request, redirect, url_for, render_template
from werkzeug.utils import secure_filename
import weaviate
from test import testImage, testText
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif','jfif'])


def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
	
@app.route('/')
def upload_form():
	return render_template('upload.html')

@ app.route('/text_description', methods=['POST'])
def text_description():
	# This function uses the testText function to get results for a text query.
	# This function has been designed taking into consideration that some users might
	# also add text data to weaviate and then the results would contain text as well as images.

	text = request.form.get("description")
	
	text_results = testText({"concepts":[text]})
	# Using two lists to store image result and text result
	images = []
	texts = []
	sym = ['.jfif','.jpg','.jpeg','.png']
	for i in text_results:
		add = 0
		for s in sym:
			if s in i:
				images.append(i)
				add = 1
				break
		if add==0:
			texts.append(i)
	# Passing text result and image names to upload.html page
	return render_template('upload.html', description=text,images=images,texts=texts)

@app.route('/', methods=['POST','GET'])
def upload_image():
    # Function to upload an image. You can upload images from test folder or from the internet and use them.
	# This function also uses the testImage function to get the top 3 similar image names from weaviate.
	# These are then passed to the upload.html page so as to display them to the user.
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
		print(" ==========\n",'File saved\n',"==========\n")
		
		# Using the testImage in the line below.
		return render_template('upload.html', filename=filename,imagePath=testImage({"image":"static/uploads/{}".format(filename)}))

	else:
		flash('Allowed image types are -> png, jpg, jpeg, gif, jfif')
		return redirect(request.url)

@app.route('/display/<filename>')
def display_image(filename,uploaded=True):
    # Function to display uploaded image
    print("Display image called")

    if uploaded:
	    print("Uploaded")

    return redirect(url_for('static', filename='uploads/' + filename), code=301)

if __name__ == "__main__":
    app.run(debug=True)