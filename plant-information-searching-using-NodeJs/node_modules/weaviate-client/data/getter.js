export default class Getter {
  constructor(client) {
    this.client = client;
    this.errors = [];
    this.additionals = [];
  }

  withLimit = (limit) => {
    this.limit = limit;
    return this;
  };

  extendAdditionals = (prop) => {
    this.additionals = [...this.additionals, prop];
    return this;
  };

  withAdditional = (additionalFlag) => this.extendAdditionals(additionalFlag);

  withVector = () => this.extendAdditionals("vector");

  do = () => {
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }
    let path = `/objects`;

    let params = [];
    if (this.additionals.length > 0) {
      params = [...params, `include=${this.additionals.join(",")}`];
    }

    if (this.limit) {
      params = [...params, `limit=${this.limit}`];
    }

    if (params.length > 0) {
      path += `?${params.join("&")}`;
    }

    return this.client.get(path);
  };
}
