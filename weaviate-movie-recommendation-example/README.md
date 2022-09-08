# weaviate-movie-recommendation

The Dataset used for this example can be found here: https://www.kaggle.com/datasets/lucifierx/movie-recommendation
 
0. navigate into the project folder:
    ```
    cd weaviate-movie-recommendation-example
    ```
0. install all the required node modules:
    ```
    npm install
    ```
0. make sure the docker file is running
0. import movies data - here you can use `Node` or `Python`:
    
    For `Node`, run the following command: 
    ```
    node add_data.js
    ```
    For `Python`, run the following command:
    ```
    python3 add_data.py
    ```
0. Start the project
    ```
    node index.js
    ``` 
0. Navigate to the demo page, [http://localhost:4000/](http://localhost:4000/){:target="_blank"}
0. To use, enter name of a movie name in search bar and run search!

https://user-images.githubusercontent.com/75658681/163725672-9543a6ac-2d0a-45d5-bf4c-e3670e697058.mp4
