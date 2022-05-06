import pickle
import weaviate
import uuid
import datetime
import base64, json, os

def generate_uuid(class_name: str, identifier: str,
                  test: str = 'teststrong') -> str:
    """ Generate a uuid based on an identifier
    :param identifier: characters used to generate the uuid
    :type identifier: str, required
    :param class_name: classname of the object to create a uuid for
    :type class_name: str, required
    """
    test = 'overwritten'
    return str(uuid.uuid5(uuid.NAMESPACE_DNS, class_name + identifier))

client = weaviate.Client("http://localhost:8080")
print("Client created")

# client.schema.delete_all()
class_obj = {
        "class": "Apollo",
        "description": "Each example is a text related to Apollo 11",
        "properties": [
            {
                "dataType": [
                    "text"
                ],
                "description": "Text about apollo 11",
                "name": "text"
            }
        ]
    }

texts_about_a11 = [
    '''Apollo 11, the first space mission to put people on the Moon, was launched on July 16, 1969. 
    Almost every major aspect of the flight of Apollo 11 was witnessed via television by hundreds of millions of people in nearly every part of the globe, 
    until splashdown in the Pacific Ocean on July 24.''',

    '''The six crews that landed on the Moon brought back 842 pounds (382 kilograms) of rocks, 
    sand and dust from the lunar surface. Each time, they were transferred to Johnson Space Center’s 
    Lunar Receiving Laboratory, a building that also housed the astronauts during their three weeks of quarantine. 
    Today the building now houses other science divisions, but the lunar samples are preserved in the Lunar Sample Receiving Laboratory.
    Built in 1979, the laboratory is the chief repository of the Apollo samples.''',

    '''As Neil Armstrong and Buzz Aldrin worked on the lunar surface, Command Module pilot Michael Collins orbited 
    the Moon, alone, for the next 21.5 hours. On board he ran systems checks, made surface observations and 
    communicated with Mission Control when there wasn’t a communications blackout.''',
    
    '''Artemis missions to the Moon will mark humanity’s first permanent presence on another world. 
    The first woman and the next man to explore the lunar surface will land where nobody has ever 
    attempted to land before – on the Moon’s south pole where there are billions of tons of water ice 
    that can be used for oxygen and fuel.'''
]

def addData(data,class_obj,client):

    client.schema.delete_all()
    client.schema.create_class(class_obj)
    print("Schema class created")
    for txt in data:
        data_obj = {
        "text": txt
        }
        client.data_object.create(
        data_obj,
        "Apollo",
        generate_uuid('Apollo',txt)
        )
    print("All texts added to weaviate")
    print("=====================================================")

addData(data=texts_about_a11, class_obj = class_obj, client = client)