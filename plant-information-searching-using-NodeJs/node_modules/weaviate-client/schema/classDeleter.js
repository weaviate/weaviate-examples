import { DEFAULT_KIND, validateKind } from "../kinds";

export default class ClassDeleter {
  constructor(client) {
    this.client = client;
    this.errors = [];
  }

  withClassName = (className) => {
    this.className = className;
    return this;
  };

  validateClassName = () => {
    if (
      this.className == undefined ||
      this.className == null ||
      this.className.length == 0
    ) {
      this.errors = [
        ...this.errors,
        "className must be set - set with .withClassName(className)",
      ];
    }
  };

  validate = () => {
    this.validateClassName();
  };

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }
    const path = `/schema/${this.className}`;
    return this.client.delete(path);
  };
}
