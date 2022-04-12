export default class GraphQLNearObject {
  constructor(nearObjectObj) {
    this.source = nearObjectObj;
  }

  toString(wrap = true) {
    this.parse();
    this.validate();

    let args = [];

    if (this.id) {
      args = [...args, `id:${JSON.stringify(this.id)}`];
    }

    if (this.beacon) {
      args = [...args, `beacon:${JSON.stringify(this.beacon)}`];
    }

    if (this.certainty) {
      args = [...args, `certainty:${this.certainty}`];
    }

    if (!wrap) {
      return `${args.join(",")}`;
    }
    return `{${args.join(",")}}`;
  }

  validate() {
    if (!this.id && !this.beacon) {
      throw new Error("nearObject filter: id or beacon needs to be set");
    }
  }

  parse() {
    for (let key in this.source) {
      switch (key) {
        case "id":
          this.parseID(this.source[key]);
          break;
        case "beacon":
          this.parseBeacon(this.source[key]);
          break;
        case "certainty":
          this.parseCertainty(this.source[key]);
          break;
        default:
          throw new Error("nearObject filter: unrecognized key '" + key + "'");
      }
    }
  }

  parseID(id) {
    if (typeof id !== "string") {
      throw new Error("nearObject filter: id must be a string");
    }

    this.id = id;
  }

  parseBeacon(beacon) {
    if (typeof beacon !== "string") {
      throw new Error("nearObject filter: beacon must be a string");
    }

    this.beacon = beacon;
  }

  parseCertainty(cert) {
    if (typeof cert !== "number") {
      throw new Error("nearObject filter: certainty must be a number");
    }

    this.certainty = cert;
  }
}
