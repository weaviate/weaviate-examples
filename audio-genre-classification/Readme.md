# audio-genre-classifier
 
This Demo demonstrates the usage of weaviate img2vec module, Which is a module that converts images to vectors using neural network and then allow us to perform various operations. More information for this module can be found [here](https://weaviate.io/developers/weaviate/current/retriever-vectorizer-modules/img2vec-neural.html) . 

The Dataset used for this example can be found [here](https://www.kaggle.com/datasets/yashgupta24/audio-genre-classification) \
It is data of spectrogram of audios of 10 categories namely 'blues','classical','country','disco','hiphop','jazz','metal','pop','reggae','rock'. \
Note: These spectrograms were created from audios of length 30 seconds, So they will best classify audios with similar length

This example uses HTML,CSS,Js for frontend and Flask for the backend. 

Follow the following steps to reproduce the example 
1. Download the dataset from [here](https://www.kaggle.com/datasets/yashgupta24/audio-genre-classification) and paste it in the directory where add_data.py file exists 
2. Run the following command to run the weaviate docker file 
```bash
sudo docker-compose up -d
``` 

3. Run the following command in directory to install all required dependencies 
```bash
pip install -r requirements.txt
``` 
4. Run the following command to add all the data objects,you can change path of dataset at line 115 if necessary. You can also decrease the number of data objects at line 119 so that it takes less time.
```bash
python add_data.py
``` 
5. After adding data and installing all modules run the following command and navigate to http://127.0.0.1:5000/ to perform searching. You can try uploading some sample audios from 'sample test audios' folder.
```bash
python upload.py
``` 
A short demo usage:-

https://user-images.githubusercontent.com/75658681/189474112-b991c834-15ad-4da7-a3b7-418c121bb5ae.mp4

Note: This demo supports the .wav extensions. If you want to use .mp3 extensions as well, You need to download a specific library according to your OS from here: https://github.com/librosa/librosa#audioread-and-mp3-support
