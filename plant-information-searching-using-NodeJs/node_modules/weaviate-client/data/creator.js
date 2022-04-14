export default class Creator {
  constructor(client) {
    this.client = client;
    this.errors = [];
  }

  withClassName = (className) => {
    this.className = className;
    return this;
  };

  withProperties = (properties) => {
    this.properties = properties;
    return this;
  };

  withId = (id) => {
    this.id = id;
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

  payload = () => ({
    properties: this.properties,
    class: this.className,
    id: this.id,
  });

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
    const path = `/objects`;
    return this.client.post(path, this.payload());
  };
}
