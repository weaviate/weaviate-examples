const weaviate = require("../index");
describe("c11y endpoints", () => {
  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  it("displays info about a concept", () => {
    return client.c11y
      .conceptsGetter()
      .withConcept("car")
      .do()
      .then((res) => {
        expect(res.individualWords[0].word).toEqual("car");
      });
  });

  it("extends the c11y with a custom concept", () => {
    return client.c11y
      .extensionCreator()
      .withConcept("clientalmostdonehappyness")
      .withDefinition(
        "the happyness you feel when the Weaviate Javascript client " +
          "is almost complete and ready to be released"
      )
      .withWeight(1)
      .do()
      .then((res) => {
        expect(res).toEqual({
          concept: "clientalmostdonehappyness",
          definition:
            "the happyness you feel when the Weaviate Javascript client " +
            "is almost complete and ready to be released",
          weight: 1,
        });
      });
  });
});
