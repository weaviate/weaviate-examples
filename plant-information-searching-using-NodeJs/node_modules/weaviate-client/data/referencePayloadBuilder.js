export default class ReferencePayloadBuilder {
  constructor(client) {
    this.client = client;
    this.errors = [];
  }

  withId = (id) => {
    this.id = id;
    return this;
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
    this.validateIsSet(this.id, "id", ".withId(id)");
  };

  payload = () => {
    this.validate();
    if (this.errors.length > 0) {
      throw new Error(this.errors.join(", "));
    }

    return {
      beacon: `weaviate://localhost/${this.id}`,
    };
  };
}
