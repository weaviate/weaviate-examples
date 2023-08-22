import os
from app import app
from flask import Flask, flash, request, redirect, url_for, render_template
from werkzeug.utils import secure_filename
from get_label import testImage
from spectogram import create_spectrogram

ALLOWED_EXTENSIONS = set(['mp3','wav'])

def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
	
@app.route('/')
def upload_form():
	return render_template('upload.html')

@app.route('/', methods=['POST'])
def upload_image():
    # Function to upload an audio.
	print(request.files)
	if 'audio_upload' not in request.files:
		flash('No file part')
		return redirect(request.url)
	
	# make sure we have the upload folder, as it's ignored due to .gitignore
	if not os.path.exists(app.config['UPLOAD_FOLDER']):
		os.makedirs(app.config['UPLOAD_FOLDER'])

	file = request.files['audio_upload']

	if file.filename == '':
		flash('No image selected for uploading')
		return redirect(request.url)

	if file and allowed_file(file.filename):
		filename = secure_filename(file.filename)
		file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
		create_spectrogram(os.path.join(app.config['UPLOAD_FOLDER'], filename),app.config['UPLOAD_FOLDER'])
		flash('Image successfully uploaded and displayed below')
		return render_template('upload.html', filename='spec.png',track_url=os.path.join(app.config['UPLOAD_FOLDER'], filename),pred=testImage({"image":app.config['UPLOAD_FOLDER']+"spec.png"}))

	else:
		flash('Allowed audio types are -> webm,mp3')
		return redirect(request.url)

@app.route('/display/<filename>')
def display_image(filename):
    # Function to display uploaded image
    print("Display image called")
    
    return redirect(url_for('static', filename='uploads/' + filename), code=301)

if __name__ == "__main__":
    app.run(debug=True)