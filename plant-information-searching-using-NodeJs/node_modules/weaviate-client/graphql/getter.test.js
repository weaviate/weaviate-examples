import Getter from "./getter";
import weaviate from "../index";

test("a simple query without params", () => {
  const mockClient = {
    query: jest.fn(),
  };

  const expectedQuery = `{Get{Person{name}}}`;

  new Getter(mockClient).withClassName("Person").withFields("name").do();

  expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
});

test("a simple query with a limit", () => {
  const mockClient = {
    query: jest.fn(),
  };

  const expectedQuery = `{Get{Person(limit:7){name}}}`;

  new Getter(mockClient)
    .withClassName("Person")
    .withFields("name")
    .withLimit(7)
    .do();

  expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
});

test("a simple query with a group", () => {
  const mockClient = {
    query: jest.fn(),
  };

  const expectedQuery = `{Get{Person(group:{type:merge,force:0.7}){name}}}`;

  new Getter(mockClient)
    .withClassName("Person")
    .withFields("name")
    .withGroup({ type: "merge", force: 0.7 })
    .do();

  expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
});

describe("where filters", () => {
  test("a query with a valid where filter", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const expectedQuery =
      `{Get{Person` +
      `(where:{operator:Equal,valueString:"John Doe",path:["name"]})` +
      `{name}}}`;

    new Getter(mockClient)
      .withClassName("Person")
      .withFields("name")
      .withWhere({ operator: "Equal", valueString: "John Doe", path: ["name"] })
      .do();

    expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
  });

  // to prevent a regression on
  // https://github.com/semi-technologies/weaviate-javascript-client/issues/6
  test("a query with a where filter containing a geo query", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const expectedQuery =
      `{Get{Person` +
      `(where:{operator:WithinGeoRange,valueGeoRange:` +
      `{geoCoordinates:{latitude:51.51,longitude:-0.09},distance:{max:2000}}` +
      `,path:["name"]})` +
      `{name}}}`;

    new Getter(mockClient)
      .withClassName("Person")
      .withFields("name")
      .withWhere({
        operator: "WithinGeoRange",
        valueGeoRange: {
          geoCoordinates: {
            latitude: 51.51,
            longitude: -0.09,
          },
          distance: {
            max: 2000,
          },
        },
        path: ["name"],
      })
      .do();

    expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
  });

  test("a query with a valid nested where filter", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const nestedWhere = {
      operator: "And",
      operands: [
        { valueString: "foo", operator: "Equal", path: ["foo"] },
        { valueString: "bar", operator: "NotEqual", path: ["bar"] },
      ],
    };
    const expectedQuery =
      `{Get{Person` +
      `(where:{operator:And,operands:[` +
      `{operator:Equal,valueString:"foo",path:["foo"]},` +
      `{operator:NotEqual,valueString:"bar",path:["bar"]}` +
      `]})` +
      `{name}}}`;

    new Getter(mockClient)
      .withClassName("Person")
      .withFields("name")
      .withWhere(nestedWhere)
      .do();

    expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
  });

  describe("queries with invalid nested where filters", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const tests = [
      {
        title: "an empty where",
        where: {},
        msg: "where filter: operator cannot be empty",
      },
      {
        title: "missing value",
        where: { operator: "Equal" },
        msg: "where filter: value<Type> cannot be empty",
      },
      {
        title: "missing path",
        where: { operator: "Equal", valueString: "foo" },
        msg: "where filter: path cannot be empty",
      },
      {
        title: "path is not an array",
        where: { operator: "Equal", valueString: "foo", path: "mypath" },
        msg: "where filter: path must be an array",
      },
      {
        title: "unknown value type",
        where: { operator: "Equal", valueWrong: "foo" },
        msg: "where filter: unrecognized value prop 'valueWrong'",
      },
      {
        title: "operands is not an array",
        where: { operator: "And", operands: {} },
        msg: "where filter: operands must be an array",
      },
    ];

    tests.forEach((t) => {
      test(t.title, () => {
        new Getter(mockClient)
          .withClassName("Person")
          .withFields("name")
          .withWhere(t.where)
          .do()
          .then(() => {
            fail("it should have error'd");
          })
          .catch((e) => {
            expect(e.toString()).toContain(t.msg);
          });
      });
    });
  });
});

describe("nearText searchers", () => {
  test("a query with a valid nearText", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const expectedQuery =
      `{Get{Person` + `(nearText:{concepts:["foo","bar"]})` + `{name}}}`;

    new Getter(mockClient)
      .withClassName("Person")
      .withFields("name")
      .withNearText({ concepts: ["foo", "bar"] })
      .do();

    expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
  });

  test("with optional parameters", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const expectedQuery =
      `{Get{Person` +
      `(nearText:{concepts:["foo","bar"],certainty:0.7,moveTo:{concepts:["foo"],force:0.7},moveAwayFrom:{concepts:["bar"],force:0.5}})` +
      `{name}}}`;

    new Getter(mockClient)
      .withClassName("Person")
      .withFields("name")
      .withNearText({
        concepts: ["foo", "bar"],
        certainty: 0.7,
        moveTo: { concepts: ["foo"], force: 0.7 },
        moveAwayFrom: { concepts: ["bar"], force: 0.5 },
      })
      .do();

    expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
  });

  describe("queries with invalid nearText searchers", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const tests = [
      {
        title: "an empty nearText",
        nearText: {},
        msg: "nearText filter: concepts cannot be empty",
      },
      {
        title: "concepts of wrong type",
        nearText: { concepts: {} },
        msg: "nearText filter: concepts must be an array",
      },
      {
        title: "certainty of wrong type",
        nearText: { concepts: ["foo"], certainty: "foo" },
        msg: "nearText filter: certainty must be a number",
      },
      {
        title: "moveTo without concepts",
        nearText: { concepts: ["foo"], moveTo: {} },
        msg: "nearText filter: moveTo.concepts must be an array",
      },
      {
        title: "moveTo without concepts",
        nearText: { concepts: ["foo"], moveTo: { concepts: ["foo"] } },
        msg: "nearText filter: moveTo must have fields 'concepts' and 'force'",
      },
      {
        title: "moveAwayFrom without concepts",
        nearText: { concepts: ["foo"], moveAwayFrom: {} },
        msg: "nearText filter: moveAwayFrom.concepts must be an array",
      },
      {
        title: "moveAwayFrom without concepts",
        nearText: { concepts: ["foo"], moveAwayFrom: { concepts: ["foo"] } },
        msg:
          "nearText filter: moveAwayFrom must have fields 'concepts' and 'force'",
      },
    ];

    tests.forEach((t) => {
      test(t.title, () => {
        new Getter(mockClient)
          .withClassName("Person")
          .withFields("name")
          .withNearText(t.nearText)
          .do()
          .then(() => fail("it should have error'd"))
          .catch((e) => {
            expect(e.toString()).toContain(t.msg);
          });
      });
    });
  });
});

describe("nearVector searchers", () => {
  test("a query with a valid nearVector", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const expectedQuery =
      `{Get{Person` + `(nearVector:{vector:[0.1234,0.9876]})` + `{name}}}`;

    new Getter(mockClient)
      .withClassName("Person")
      .withFields("name")
      .withNearVector({ vector: [0.1234, 0.9876] })
      .do();

    expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
  });

  test("with optional parameters", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const expectedQuery =
      `{Get{Person` +
      `(nearVector:{vector:[0.1234,0.9876],certainty:0.7})` +
      `{name}}}`;

    new Getter(mockClient)
      .withClassName("Person")
      .withFields("name")
      .withNearVector({
        vector: [0.1234, 0.9876],
        certainty: 0.7,
      })
      .do();

    expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
  });

  describe("queries with invalid nearVector searchers", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const tests = [
      {
        title: "an empty nearVector",
        nearVector: {},
        msg: "nearVector filter: vector cannot be empty",
      },
      {
        title: "vector of wrong type",
        nearVector: { vector: {} },
        msg: "nearVector filter: vector must be an array",
      },
      {
        title: "vector as array of wrong type",
        nearVector: { vector: ["foo"] },
        msg: "nearVector filter: vector elements must be a number",
      },
      {
        title: "certainty of wrong type",
        nearVector: { vector: [0.123, 0.987], certainty: "foo" },
        msg: "nearVector filter: certainty must be a number",
      },
    ];

    tests.forEach((t) => {
      test(t.title, () => {
        new Getter(mockClient)
          .withClassName("Person")
          .withFields("name")
          .withNearVector(t.nearVector)
          .do()
          .then(() => fail("it should have error'd"))
          .catch((e) => {
            expect(e.toString()).toContain(t.msg);
          });
      });
    });
  });
});

describe("nearObject searchers", () => {
  test("a query with a valid nearObject with id", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const expectedQuery =
      `{Get{Person` + `(nearObject:{id:"some-uuid"})` + `{name}}}`;

    new Getter(mockClient)
      .withClassName("Person")
      .withFields("name")
      .withNearObject({ id: "some-uuid" })
      .do();

    expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
  });

  test("a query with a valid nearObject with beacon", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const expectedQuery =
      `{Get{Person` + `(nearObject:{beacon:"weaviate/some-uuid"})` + `{name}}}`;

    new Getter(mockClient)
      .withClassName("Person")
      .withFields("name")
      .withNearObject({ beacon: "weaviate/some-uuid" })
      .do();

    expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
  });

  test("a query with a valid nearObject with all params", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const expectedQuery =
      `{Get{Person` + `(nearObject:{id:"some-uuid",beacon:"weaviate/some-uuid",certainty:0.7})` + `{name}}}`;

    new Getter(mockClient)
      .withClassName("Person")
      .withFields("name")
      .withNearObject({
        id: "some-uuid",
        beacon: "weaviate/some-uuid",
        certainty: 0.7
      })
      .do();

    expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
  });

  describe("queries with invalid nearObject searchers", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const tests = [
      {
        title: "an empty nearObject",
        nearObject: {},
        msg: "nearObject filter: id or beacon needs to be set",
      },
      {
        title: "id of wrong type",
        nearObject: { id: {} },
        msg: "nearObject filter: id must be a string",
      },
      {
        title: "beacon of wrong type",
        nearObject: { beacon: {} },
        msg: "nearObject filter: beacon must be a string",
      },
      {
        title: "certainty of wrong type",
        nearObject: { id: "foo", certainty: "foo" },
        msg: "nearObject filter: certainty must be a number",
      }
    ];

    tests.forEach((t) => {
      test(t.title, () => {
        new Getter(mockClient)
          .withClassName("Person")
          .withFields("name")
          .withNearObject(t.nearObject)
          .do()
          .then(() => fail("it should have error'd"))
          .catch((e) => {
            expect(e.toString()).toContain(t.msg);
          });
      });
    });
  });
});

describe("ask searchers", () => {
  test("a query with a valid ask with question", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const expectedQuery =
      `{Get{Person` + `(ask:{question:"What is Weaviate?"})` + `{name}}}`;

    new Getter(mockClient)
      .withClassName("Person")
      .withFields("name")
      .withAsk({ question: "What is Weaviate?" })
      .do();

    expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
  });

  test("a query with a valid ask with question and properties", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const expectedQuery =
      `{Get{Person` + `(ask:{question:"What is Weaviate?",properties:["prop1","prop2"]})` + `{name}}}`;

      new Getter(mockClient)
      .withClassName("Person")
      .withFields("name")
      .withAsk({ question: "What is Weaviate?", properties: ["prop1", "prop2"] })
      .do();

    expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
  });

  test("a query with a valid ask with all params", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const expectedQuery =
      `{Get{Person` + `(ask:{question:"What is Weaviate?",properties:["prop1","prop2"],certainty:0.8})` + `{name}}}`;

      new Getter(mockClient)
      .withClassName("Person")
      .withFields("name")
      .withAsk({
        question: "What is Weaviate?",
        properties: ["prop1", "prop2"],
        certainty: 0.8,
      })
      .do();

    expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
  });

  describe("queries with invalid ask searchers", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const tests = [
      {
        title: "an empty ask",
        ask: {},
        msg: "ask filter: question needs to be set",
      },
      {
        title: "question of wrong type",
        ask: { question: {} },
        msg: "ask filter: question must be a string",
      },
      {
        title: "properties of wrong type",
        ask: { properties: {} },
        msg: "ask filter: properties must be an array",
      },
      {
        title: "certainty of wrong type",
        ask: { question: "foo", certainty: "foo" },
        msg: "ask filter: certainty must be a number",
      }
    ];

    tests.forEach((t) => {
      test(t.title, () => {
        new Getter(mockClient)
          .withClassName("Person")
          .withFields("name")
          .withAsk(t.ask)
          .do()
          .then(() => fail("it should have error'd"))
          .catch((e) => {
            expect(e.toString()).toContain(t.msg);
          });
      });
    });
  });
});

describe("nearImage searchers", () => {
  test("a query with a valid nearImage with image", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const expectedQuery =
      `{Get{Person` + `(nearImage:{image:"iVBORw0KGgoAAAANS"})` + `{name}}}`;

    new Getter(mockClient)
      .withClassName("Person")
      .withFields("name")
      .withNearImage({ image: "iVBORw0KGgoAAAANS" })
      .do();

    expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
  });

  test("a query with a valid nearImage with all params", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const expectedQuery =
      `{Get{Person` + `(nearImage:{image:"iVBORw0KGgoAAAANS",certainty:0.8})` + `{name}}}`;

      new Getter(mockClient)
      .withClassName("Person")
      .withFields("name")
      .withNearImage({
        image: "iVBORw0KGgoAAAANS",
        certainty: 0.8,
      })
      .do();

    expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
  });

  test("a query with a valid nearImage with base64 encoded image", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const expectedQuery =
      `{Get{Person` + `(nearImage:{image:"iVBORw0KGgoAAAANS"})` + `{name}}}`;

    new Getter(mockClient)
      .withClassName("Person")
      .withFields("name")
      .withNearImage({ image: "data:image/png;base64,iVBORw0KGgoAAAANS" })
      .do();

    expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
  });

  describe("queries with invalid nearImage searchers", () => {
    const mockClient = {
      query: jest.fn(),
    };

    const tests = [
      {
        title: "an empty nearImage",
        nearImage: {},
        msg: "nearImage filter: image or imageBlob must be present",
      },
      {
        title: "image of wrong type",
        nearImage: { image: {} },
        msg: "nearImage filter: image must be a string",
      },
      {
        title: "certainty of wrong type",
        nearImage: { image: "foo", certainty: "foo" },
        msg: "nearImage filter: certainty must be a number",
      }
    ];

    tests.forEach((t) => {
      test(t.title, () => {
        new Getter(mockClient)
          .withClassName("Person")
          .withFields("name")
          .withNearImage(t.nearImage)
          .do()
          .then(() => fail("it should have error'd"))
          .catch((e) => {
            expect(e.toString()).toContain(t.msg);
          });
      });
    });
  });
});