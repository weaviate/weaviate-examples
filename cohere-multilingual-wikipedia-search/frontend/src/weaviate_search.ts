import type { IWeaviateClient } from "weaviate-ts-client";

export type Result = {
  text: string;
  title: string;
};

const searchWeaviate = (
  client: IWeaviateClient,
  query: string
): Promise<Result[]> => {
  return client.graphql
    .get()
    .withClassName("Articles")
    .withFields("title text")
    .withBm25({
      query: query,
    })
    .do()
    .then((res: any) => {
      if (res.errors) {
        throw new Error(res.errors);
      }

      return res.data.Get.Articles.map((obj: any) => {
        let out: Result = {
          text: typeof obj.text === "string" ? obj.text : "",
          title: typeof obj.text === "string" ? obj.title : "",
        };
        return out;
      });
    });
};

export default searchWeaviate;
