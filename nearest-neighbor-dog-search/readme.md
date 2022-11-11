# Welcome to the Dog Search Demo! 

## Dataset 
The dataset currently contains ten images of different dog breeds. You can also build on this and add your own images to the dataset!

### To run this demo locally, follow the order below:
Make sure you have Weaviate installed and set up. [Check out the documentation](https://weaviate.io/developers/weaviate/current/installation/index.html) for more information!

To spin up Weaviate run the following command from the `nearest-neighbor-dog-search` directory/folder:
```bash
docker compose up -d
```

### Run the application
First install all the python package dependencies:
```bash
pip install -r requirements.txt
```

Run the Python Flask application and go to http://localhost:5000
```bash
python3 app.py 
```

### Shutdown Weaviate
To shutdown Weaviate run the following command from the `nearest-neighbor-dog-search` directory/folder:
```bash
docker compose down
```
### Run this demo in docker container

In order to run the Weaviate AND Flask app in docker container run the following command:

```bash
docker compose -f ./docker-compose-flask.yml up -d --build
```

The application is running on http://localhost:80

To shutdown the application and the Weaviate instance run the following command:
```bash
docker compose -f ./docker-compose-flask.yml down 
```
