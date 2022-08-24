package main

import (
	"context"
	"fmt"

	"github.com/semi-technologies/weaviate-go-client/v4/weaviate"

	"github.com/semi-technologies/weaviate-examples/clip-multi-modal-text-image-search/import/go/data"
)

func main() {
	ctx := context.Background()

	cfg := weaviate.Config{
		Host:   "localhost:8080",
		Scheme: "http",
	}
	client := weaviate.New(cfg)

	fmt.Printf("Create class\n")
	if err := data.CreateClass(ctx, client); err != nil {
		panic(err)
	}

	fmt.Printf("Import objects\n")
	if err := data.ImportObjects(ctx, client); err != nil {
		panic(err)
	}

	fmt.Printf("Successfully imported data\n")
}
