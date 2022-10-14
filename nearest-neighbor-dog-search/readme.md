### Welcome to the Dog Search Demo! 

### Dataset 
This demo contains 10 images of different dog breeds. 

### To run this demo, follow the order below:
1. Make sure you have Weaviate installed and set up. [Check out the documentation](https://weaviate.io/developers/weaviate/current/installation/index.html) for more information!
2. Run the docker file 
    ```bash
    docker compose up
    ```
3. Run the schema file
    ```bash
    python create-schema.py
    ```
4. Run the images to base64 file 
    ```bash
    python images-to-base64.py
    ```
5. Upload the encoded images 
    ```bash
    python upload-encoded-images.py
    ```

### Run the application
Run the Python Flask application and run http://localhost:5000
```bash
python application.py 
```
