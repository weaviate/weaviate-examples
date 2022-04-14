import weaviate from "../index";

describe("the graphql journey", () => {
  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  it("creates a schema class", () => {
    // this is just test setup, not part of what we want to test here
    return setup(client);
  });

  test("graphql get method with minimal fields", () => {
    return client.graphql
      .get()
      .withClassName("Article")
      .withFields("title url wordCount")
      .do()
      .then(function (result) {
        expect(result.data.Get.Article.length).toEqual(3);
      });
  });

  test("graphql get method with optional fields", () => {
    return client.graphql
      .get()
      .withClassName("Article")
      .withFields("title url wordCount")
      .withNearText({ concepts: ["news"], certainty: 0.1 })
      .withWhere({
        operator: "GreaterThanEqual",
        path: ["wordCount"],
        valueInt: 50,
      })
      .withLimit(7)
      .do()
      .then(function (result) {
        expect(result.data.Get.Article.length).toBeLessThan(3);
        expect(result.data.Get.Article[0]["title"].length).toBeGreaterThan(0);
        expect(result.data.Get.Article[0]["url"].length).toBeGreaterThan(0);
        expect(result.data.Get.Article[0]["wordCount"]).toBeGreaterThanOrEqual(
          50
        );
      });
  });

  test("graphql get with group", () => {
    return client.graphql
      .get()
      .withClassName("Article")
      .withFields("title url wordCount")
      .withGroup({ type: "merge", force: 1.0 })
      .withLimit(7)
      .do()
      .then(function (result) {
        // merging with a force of 1 means we merge everyting into a single
        // element
        expect(result.data.Get.Article.length).toBe(1);
      });
  });

  test("graphql aggregate method with minimal fields", () => {
    return client.graphql
      .aggregate()
      .withClassName("Article")
      .withFields("meta { count }")
      .do()
      .then((res) => {
        const count = res.data.Aggregate.Article[0].meta.count;
        expect(count).toEqual(3);
      })
      .catch((e) => fail("it should not have error'd" + e));
  });

  test("graphql aggregate method optional fields", () => {
    // Note this test is ignoring `.withGroupBy()` due to
    // https://github.com/semi-technologies/weaviate/issues/1238

    return client.graphql
      .aggregate()
      .withClassName("Article")
      .withWhere({
        path: ["title"],
        valueString: "apple",
        operator: "Equal",
      })
      .withLimit(10)
      .withFields("meta { count }")
      .do()
      .then((res) => {
        const count = res.data.Aggregate.Article[0].meta.count;
        expect(count).toEqual(1);
      })
      .catch((e) => fail("it should not have error'd" + e));
  });

  test("graphql explore with minimal fields", () => {
    return client.graphql
      .explore()
      .withNearText({ concepts: ["iphone"] })
      .withFields("beacon certainty className")
      .do()
      .then((res) => {
        expect(res.data.Explore.length).toBeGreaterThan(0);
      })
      .catch((e) => fail("it should not have error'd" + e));
  });

  test("graphql explore with optional fields", () => {
    return client.graphql
      .explore()
      .withNearText({ concepts: ["iphone"] })
      .withFields("beacon certainty className")
      .withLimit(1)
      .do()
      .then((res) => {
        expect(res.data.Explore.length).toEqual(1);
      })
      .catch((e) => fail("it should not have error'd" + e));
  });

  test("graphql explore with nearObject field", () => {
    return client.graphql
      .explore()
      .withNearObject({ id: "abefd256-8574-442b-9293-9205193737ee" })
      .withFields("beacon certainty className")
      .do()
      .then((res) => {
        expect(res.data.Explore.length).toBeGreaterThan(0);
      })
      .catch((e) => fail("it should not have error'd" + e));
  });

  it("tears down and cleans up", () => {
    return Promise.all([
      client.schema.classDeleter().withClassName("Article").do(),
    ]);
  });
});

const setup = async (client) => {
  const thing = {
    class: "Article",
    properties: [
      {
        name: "title",
        dataType: ["text"],
      },
      {
        name: "url",
        dataType: ["string"],
      },
      {
        name: "wordCount",
        dataType: ["int"],
      },
    ],
  };

  await Promise.all([client.schema.classCreator().withClass(thing).do()]);

  const toImport = [
    {
      id: "abefd256-8574-442b-9293-9205193737ee",
      class: "Article",
      properties: {
        wordCount: 60,
        url: "http://articles.local/my-article-1",
        title: "Article 1",
      },
    },
    {
      class: "Article",
      properties: {
        wordCount: 40,
        url: "http://articles.local/my-article-2",
        title: "Article 2",
      },
    },
    {
      class: "Article",
      properties: {
        wordCount: 600,
        url: "http://articles.local/my-article-3",
        title: "Article about Apple",
      },
    },
  ];

  let batch = client.batch.objectsBatcher();

  toImport.forEach((elem) => {
    batch = batch.withObject(elem);
  });

  await batch.do();
  return new Promise((resolve) => setTimeout(resolve, 1000));
};
