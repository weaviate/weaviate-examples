import os, re, json
import weaviate

WEAVIATE_URL = os.getenv('WEAVIATE_URL')
if not WEAVIATE_URL:
    WEAVIATE_URL = 'http://localhost:8080'

def set_up_batch():
    """
    Prepare batching configuration to speed up deleting and importing data.
    """
    client.batch.configure(
        batch_size=100, 
        dynamic=True,
        timeout_retries=3,
        callback=None,
    )

def import_data(client):
    """
    Process all data and upload them to Weaviate
    """

    with client.batch as batch:
        with open('./data/products.jsonl', 'r') as json_file:
            json_list = list(json_file)

        for json_str in json_list:
            try: 
                result = json.loads(json_str) # result = {'id': '2273984', 'name': 'Duplex Multimode 62.5/125 Fiber Patch Cable (LC/LC), 6M', 'title': 'Tripp Lite Duplex Multimode 62.5/125 Fiber Patch Cable (LC/LC), 6M', 'ean': '0037332138644', 'short_description': 'Duplex Multimode 62.5/125 Fiber Patch Cable (LC/LC), 6M', 'img_high': 'http://images.icecat.biz/img/gallery/2273984_5192633862.jpg', 'img_low': 'http://images.icecat.biz/img/gallery_lows/2273984_5192633862.jpg', 'img_500x500': 'http://images.icecat.biz/img/gallery_mediums/2273984_5192633862.jpg', 'img_thumb': 'http://images.icecat.biz/img/gallery_thumbs/2273984_5192633862.jpg', 'date_released': '2009-05-15T00:00:00Z', 'supplier': 'Tripp Lite', 'price': '2395', 'attr_t_type': '6', 'attr_t_printing_colours': 'OFNR', 'attr_t_print_technology': '2x LC', 'attr_t_compatibility': '2x LC', 'attr_n_quantity_per_pack': 'Male connector/Male connector', 'attr_n_black_toner_page_yield': 'Orange,Grey'}
                # The properties from our schema

                data_properties = {
                    "productId": str(result["id"]),
                    "name": str(result["name"]),
                    "title": str(result["title"]),
                    "ean": str(result["ean"]),
                    "description": str(result["short_description"]),
                    "imageLink": str(result["img_high"]),
                    "releaseDate": str(result["date_released"]),
                    # "supplier": result["supplier"],
                    "price": int(result["price"])
                }
  
                batch.add_data_object(data_properties, "Product")

            except:
                print("The following object was not added to Weaviate")
                print(result)


    
client = weaviate.Client(WEAVIATE_URL)
set_up_batch()
import_data(client)

print("The objects have been uploaded to Weaviate.")