const weaviate = require("../index");

const thingClassName = "DataJourneyTestThing";
const refSourceClassName = "DataJourneyTestRefSource";

describe("data", () => {
  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  it("creates a schema class", () => {
    // this is just test setup, not part of what we want to test here
    return setup(client);
  });

  it("validates a valid thing", () => {
    const properties = { stringProp: "without-id" };

    return client.data
      .validator()
      .withId("11992f06-2eac-4f0b-973f-7d230d3bdbaf")
      .withClassName(thingClassName)
      .withProperties(properties)
      .do()
      .then((res) => {
        expect(res).toEqual(true);
      })
      .catch((e) => fail("it should not have errord: " + e));
  });

  it("(validator) errors on an invalid valid object", () => {
    const properties = { stringProp: 234 }; // number is invalid

    return client.data
      .validator()
      .withId("11992f06-2eac-4f0b-973f-7d230d3bdbaf")
      .withClassName(thingClassName)
      .withProperties(properties)
      .do()
      .catch((e) => {
        expect(e).toEqual(
          `usage error (422): {"error":[{"message":"invalid object: invalid string property 'stringProp' on class 'DataJourneyTestThing': not a string, but json.Number"}]}`
        );
      });
  });

  let implicitThingId;

  it("creates a new thing object without an explicit id", () => {
    const properties = { stringProp: "without-id" };

    return client.data
      .creator()
      .withClassName(thingClassName)
      .withProperties(properties)
      .do()
      .then((res) => {
        expect(res.properties).toEqual(properties);
        implicitThingId = res.id;
      })
      .catch((e) => fail("it should not have errord: " + e));
  });

  it("creates a new thing object with an explicit id", () => {
    const properties = { stringProp: "with-id" };
    const id = "1565c06c-463f-466c-9092-5930dbac3887";

    return client.data
      .creator()
      .withClassName(thingClassName)
      .withProperties(properties)
      .withId(id)
      .do()
      .then((res) => {
        expect(res.properties).toEqual(properties);
        expect(res.id).toEqual(id);
      })
      .catch((e) => fail("it should not have errord: " + e));
  });

  it("creates another thing", () => {
    // we need this later for the reference test!
    const properties = {};
    const id = "599a0c64-5ed5-4d30-978b-6c9c45516db1";

    return client.data
      .creator()
      .withClassName(refSourceClassName)
      .withProperties(properties)
      .withId(id)
      .do()
      .then((res) => {
        expect(res.properties).toEqual(properties);
        expect(res.id).toEqual(id);
      })
      .catch((e) => fail("it should not have errord: " + e));
  });

  it("waits for es index updates", () => {
    return new Promise((resolve, reject) => {
      // TODO: remove in 1.0.0
      setTimeout(resolve, 1000);
    });
  });

  it("errors without a className", () => {
    return client.data
      .creator()
      .do()
      .then(() => fail("it should have errord"))
      .catch((err) => {
        expect(err).toEqual(
          new Error(
            "invalid usage: className must be set - set with .withClassName(className)"
          )
        );
      });
  });

  it("gets all things", () => {
    return client.data
      .getter()
      .do()
      .then((res) => {
        expect(res.objects).toHaveLength(3);
        expect(res.objects).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: "1565c06c-463f-466c-9092-5930dbac3887",
              properties: { stringProp: "with-id" },
            }),
            expect.objectContaining({
              properties: { stringProp: "without-id" },
            }),
          ])
        );
      })
      .catch((e) => fail("it should not have errord: " + e));
  });

  it("gets all things with all optional _additional params", () => {
    return client.data
      .getter()
      .withAdditional("classification")
      .withAdditional("interpretation")
      .withAdditional("nearestNeighbors")
      .withAdditional("featureProjection")
      .withVector()
      .withLimit(2)
      .do()
      .then((res) => {
        expect(res.objects).toHaveLength(2);
        expect(res.objects[0].vector.length).toBeGreaterThan(10);
        expect(res.objects[0].additional.interpretation).toBeDefined();
        expect(res.objects[0].additional.featureProjection).toBeDefined();
        expect(res.objects[0].additional.nearestNeighbors).toBeDefined();
        // not testing for classification as that's only set if the object was
        // actually classified, this one wasn't
      })
      .catch((e) => fail("it should not have errord: " + e));
  });

  it("gets one thing by id", () => {
    return client.data
      .getterById()
      .withId("1565c06c-463f-466c-9092-5930dbac3887")
      .do()
      .then((res) => {
        expect(res).toEqual(
          expect.objectContaining({
            id: "1565c06c-463f-466c-9092-5930dbac3887",
            properties: { stringProp: "with-id" },
          })
        );
      })
      .catch((e) => fail("it should not have errord: " + e));
  });

  it("gets one thing by id with all optional additional props", () => {
    return client.data
      .getterById()
      .withId("1565c06c-463f-466c-9092-5930dbac3887")
      .withAdditional("classification")
      .withAdditional("interpretation")
      .withAdditional("nearestNeighbors")
      .withVector()
      .do()
      .then((res) => {
        expect(res.vector.length).toBeGreaterThan(10);
        expect(res.additional.interpretation).toBeDefined();
        expect(res.additional.nearestNeighbors).toBeDefined();
        // not testing for classification as that's only set if the object was
        // actually classified, this one wasn't
      })
      .catch((e) => fail("it should not have errord: " + e));
  });

  it("errors if the id is empty", () => {
    return client.data
      .getterById()
      .do()
      .then(() => fail("it should have errord"))
      .catch((e) => {
        expect(e).toEqual(
          new Error(
            "invalid usage: id must be set - initialize with getterById(id)"
          )
        );
      });
  });

  it("updates a thing", () => {
    const id = "1565c06c-463f-466c-9092-5930dbac3887";
    return client.data
      .getterById()
      .withId(id)
      .do()
      .then((res) => {
        // alter the schema
        const properties = res.properties;
        properties.stringProp = "thing-updated";
        return client.data
          .updater()
          .withId(id)
          .withClassName(thingClassName)
          .withProperties(properties)
          .do();
      })
      .then((res) => {
        expect(res.properties).toEqual({
          stringProp: "thing-updated",
        });
      })
      .catch((e) => fail("it should not have errord: " + e));
  });

  it("merges a thing", () => {
    const id = "1565c06c-463f-466c-9092-5930dbac3887";
    return client.data
      .getterById()
      .withId(id)
      .do()
      .then((res) => {
        // alter the schema
        const properties = res.properties;
        properties.intProp = 7;
        return client.data
          .merger()
          .withId(id)
          .withClassName(thingClassName)
          .withProperties(properties)
          .do();
      })
      .catch((e) => fail("it should not have errord: " + e));
  });

  it("adds a reference to a thing", () => {
    const sourceId = "599a0c64-5ed5-4d30-978b-6c9c45516db1";
    const targetId = "1565c06c-463f-466c-9092-5930dbac3887";

    return client.data
      .referenceCreator()
      .withId(sourceId)
      .withReferenceProperty("refProp")
      .withReference(
        client.data.referencePayloadBuilder().withId(targetId).payload()
      )
      .do()
      .catch((e) => fail("it should not have errord: " + e));
  });

  it("replaces all references of a thing", () => {
    const sourceId = "599a0c64-5ed5-4d30-978b-6c9c45516db1";
    const targetId = implicitThingId;

    return client.data
      .referenceReplacer()
      .withId(sourceId)
      .withReferenceProperty("refProp")
      .withReferences([
        client.data.referencePayloadBuilder().withId(targetId).payload(),
      ])
      .do()
      .catch((e) => fail("it should not have errord: " + e));
  });

  it("deletes a single reference of a thing", () => {
    const sourceId = "599a0c64-5ed5-4d30-978b-6c9c45516db1";
    const targetId = implicitThingId;

    return client.data
      .referenceDeleter()
      .withId(sourceId)
      .withReferenceProperty("refProp")
      .withReference(
        client.data.referencePayloadBuilder().withId(targetId).payload()
      )
      .do()
      .catch((e) => fail("it should not have errord: " + e));
  });

  it("deletes a thing", () => {
    return client.data
      .deleter()
      .withId("1565c06c-463f-466c-9092-5930dbac3887")
      .do()
      .catch((e) => fail("it should not have errord: " + e));
  });

  it("waits for es index updates", () => {
    return new Promise((resolve, reject) => {
      // TODO: remove in 1.0.0
      setTimeout(resolve, 1000);
    });
  });

  it("verifies there are now fewer things (after delete)", () => {
    return Promise.all([
      client.data
        .getter()
        .do()
        .then((res) => {
          expect(res.objects).toHaveLength(2);
        })
        .catch((e) => fail("it should not have errord: " + e)),
    ]);
  });

  it("tears down and cleans up", () => {
    return Promise.all([
      client.schema.classDeleter().withClassName(thingClassName).do(),
      client.schema.classDeleter().withClassName(refSourceClassName).do(),
    ]);
  });
});

const setup = async (client) => {
  const thing = {
    class: thingClassName,
    properties: [
      {
        name: "stringProp",
        dataType: ["string"],
      },
      {
        name: "intProp",
        dataType: ["int"],
      },
    ],
  };

  await Promise.all([client.schema.classCreator().withClass(thing).do()]);

  const refSource = {
    class: refSourceClassName,
    properties: [
      {
        name: "refProp",
        dataType: [thingClassName],
        cardinality: "many",
      },
    ],
  };

  return client.schema.classCreator().withClass(refSource).do();
};
