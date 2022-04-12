export default class GraphQLGroup {
  constructor(source) {
    this.source = source;
  }

  toString() {
    let parts = [];

    if (this.source.type) {
      // value is a graphQL enum, so doesn't need to be quoted
      parts = [...parts, `type:${this.source.type}`];
    }

    if (this.source.force) {
      parts = [...parts, `force:${this.source.force}`];
    }

    return `{${parts.join(",")}}`;
  }
}
