import Where from "./where";

export default class Aggregator {
  constructor(client) {
    this.client = client;
    this.errors = [];
  }

  withFields = (fields) => {
    this.fields = fields;
    return this;
  };

  withClassName = (className) => {
    this.className = className;
    return this;
  };

  withWhere = (whereObj) => {
    try {
      this.whereString = new Where(whereObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }
    return this;
  };

  withLimit = (limit) => {
    this.limit = limit;
    return this;
  };

  withGroupBy = (groupBy) => {
    this.groupBy = groupBy;
    return this;
  };

  validateGroup = () => {
    if (!this.groupBy) {
      // nothing to check if this optional parameter is not set
      return;
    }

    if (!Array.isArray(this.groupBy)) {
      throw new Error("groupBy must be an array");
    }
  };

  validateIsSet = (prop, name, setter) => {
    if (prop == undefined || prop == null || prop.length == 0) {
      this.errors = [
        ...this.errors,
        `${name} must be set - set with ${setter}`,
      ];
    }
  };

  validate = () => {
    this.validateGroup();
    this.validateIsSet(
      this.className,
      "className",
      ".withClassName(className)"
    );
    this.validateIsSet(this.fields, "fields", ".withFields(fields)");
  };

  do = () => {
    let params = "";

    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }

    if (this.whereString || this.limit || this.groupBy) {
      let args = [];

      if (this.whereString) {
        args = [...args, `where:${this.whereString}`];
      }

      if (this.groupBy) {
        args = [...args, `groupBy:${JSON.stringify(this.groupBy)}`];
      }

      if (this.limit) {
        args = [...args, `limit:${this.limit}`];
      }

      params = `(${args.join(",")})`;
    }

    return this.client.query(
      `{Aggregate{${this.className}${params}{${this.fields}}}}`
    );
  };
}

module.exports = Aggregator;
