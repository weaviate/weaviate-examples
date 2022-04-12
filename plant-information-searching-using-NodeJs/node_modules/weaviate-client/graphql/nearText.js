export default class GraphQLNearText {
  constructor(nearTextObj) {
    this.source = nearTextObj;
  }

  toString(wrap = true) {
    this.parse();
    this.validate();

    let args = [`concepts:${JSON.stringify(this.concepts)}`]; // concepts must always be set

    if (this.certainty) {
      args = [...args, `certainty:${this.certainty}`];
    }

    if (this.moveTo) {
      let moveToArgs = [`concepts:${JSON.stringify(this.moveToConcepts)}`];
      if (this.moveToForce) {
        moveToArgs = [...moveToArgs, `force:${this.moveToForce}`];
      }
      args = [...args, `moveTo:{${moveToArgs.join(",")}}`];
    }

    if (this.moveAwayFrom) {
      let moveAwayFromArgs = [
        `concepts:${JSON.stringify(this.moveAwayFromConcepts)}`,
      ];
      if (this.moveAwayFromForce) {
        moveAwayFromArgs = [
          ...moveAwayFromArgs,
          `force:${this.moveAwayFromForce}`,
        ];
      }
      args = [...args, `moveAwayFrom:{${moveAwayFromArgs.join(",")}}`];
    }

    if (!wrap) {
      return `${args.join(",")}`;
    }
    return `{${args.join(",")}}`;
  }

  validate() {
    if (!this.concepts) {
      throw new Error("nearText filter: concepts cannot be empty");
    }

    if (this.moveTo) {
      if (!this.moveToForce || !this.moveToConcepts) {
        throw new Error(
          "nearText filter: moveTo must have fields 'concepts' and 'force'"
        );
      }
    }

    if (this.moveAwayFrom) {
      if (!this.moveAwayFromForce || !this.moveAwayFromConcepts) {
        throw new Error(
          "nearText filter: moveAwayFrom must have fields 'concepts' and 'force'"
        );
      }
    }
  }

  parse() {
    for (let key in this.source) {
      switch (key) {
        case "concepts":
          this.parseConcepts(this.source[key]);
          break;
        case "certainty":
          this.parseCertainty(this.source[key]);
          break;
        case "moveTo":
          this.parseMoveTo(this.source[key]);
          break;
        case "moveAwayFrom":
          this.parseMoveAwayFrom(this.source[key]);
          break;
        default:
          throw new Error("nearText filter: unrecognized key '" + key + "'");
      }
    }
  }

  parseConcepts(concepts) {
    if (!Array.isArray(concepts)) {
      throw new Error("nearText filter: concepts must be an array");
    }

    this.concepts = concepts;
  }

  parseCertainty(cert) {
    if (typeof cert !== "number") {
      throw new Error("nearText filter: certainty must be a number");
    }

    this.certainty = cert;
  }

  parseMoveTo(target) {
    if (typeof target !== "object") {
      throw new Error("nearText filter: moveTo must be object");
    }

    if (!Array.isArray(target.concepts)) {
      throw new Error("nearText filter: moveTo.concepts must be an array");
    }

    if (target.force && typeof target.force != "number") {
      throw new Error("nearText filter: moveTo.force must be a number");
    }

    this.moveTo = true;
    this.moveToConcepts = target.concepts;
    this.moveToForce = target.force;
  }

  parseMoveAwayFrom(target) {
    if (typeof target !== "object") {
      throw new Error("nearText filter: moveAwayFrom must be object");
    }

    if (!Array.isArray(target.concepts)) {
      throw new Error(
        "nearText filter: moveAwayFrom.concepts must be an array"
      );
    }

    if (target.force && typeof target.force != "number") {
      throw new Error("nearText filter: moveAwayFrom.force must be a number");
    }

    this.moveAwayFrom = true;
    this.moveAwayFromConcepts = target.concepts;
    this.moveAwayFromForce = target.force;
  }
}
