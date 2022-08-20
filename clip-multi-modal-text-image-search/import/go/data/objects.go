package data

import (
	"context"
	"errors"
	"fmt"
	"io/ioutil"

	b64 "encoding/base64"

	"github.com/semi-technologies/weaviate-go-client/v4/weaviate"
	"github.com/semi-technologies/weaviate/entities/models"
)

func ImportObjects(ctx context.Context, client *weaviate.Client) error {
	basePath := "../../images"
	files, err := ioutil.ReadDir(basePath)
	if err != nil {
		return err
	}

	objects := []*models.Object{}
	for _, f := range files {
		if f.Name() != "licenses.txt" {
			data, err := ioutil.ReadFile(fmt.Sprintf("%s/%s", basePath, f.Name()))
			if err != nil {
				return err
			}
			image := b64.StdEncoding.EncodeToString([]byte(data))
			object := &models.Object{
				Class: "MultiModal",
				Properties: map[string]interface{}{
					"filename": f.Name(),
					"image":    image,
				},
			}
			objects = append(objects, object)
		}
	}

	batcher := client.Batch().ObjectsBatcher()
	for i := range objects {
		batcher.WithObject(objects[i])
	}
	resp, err := batcher.Do(ctx)
	if err != nil {
		return err
	}
	if len(resp) != len(objects) {
		return errors.New("not all objects imported")
	}
	return nil
}
