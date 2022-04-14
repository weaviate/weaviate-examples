export default class GraphQLNearVector {
  constructor(nearVectorObj) {
    this.source = nearVectorObj;
  }

  toString(wrap = true) {
    this.parse();
    this.validate();

    let args = [`vector:${JSON.stringify(this.vector)}`]; // vector must always be set

    if (this.certainty) {
      args = [...args, `certainty:${this.certainty}`];
    }

    if (!wrap) {
      return `${args.join(",")}`;
    }
    return `{${args.join(",")}}`;
  }

  validate() {
    if (!this.vector) {
      throw new Error("nearVector filter: vector cannot be empty");
    }
  }

  parse() {
    for (let key in this.source) {
      switch (key) {
        case "vector":
          this.parseVector(this.source[key]);
          break;
        case "certainty":
          this.parseCertainty(this.source[key]);
          break;
        default:
          throw new Error("nearVector filter: unrecognized key '" + key + "'");
      }
    }
  }

  parseVector(vector) {
    if (!Array.isArray(vector)) {
      throw new Error("nearVector filter: vector must be an array");
    }

    vector.forEach((elem) => {
      if (typeof elem !== "number") {
        throw new Error("nearVector filter: vector elements must be a number");
      }
    });

    this.vector = vector;
  }

  parseCertainty(cert) {
    if (typeof cert !== "number") {
      throw new Error("nearVector filter: certainty must be a number");
    }

    this.certainty = cert;
  }
}
