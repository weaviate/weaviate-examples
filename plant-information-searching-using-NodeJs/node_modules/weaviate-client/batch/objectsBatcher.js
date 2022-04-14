export default class ObjectsBatcher {
  constructor(client) {
    this.client = client;
    this.objects = [];
    this.errors = [];
  }

  withObject = (obj) => {
    this.objects = [...this.objects, obj];
    return this;
  };

  payload = () => ({
    objects: this.objects,
  });

  validateObjectCount = () => {
    if (this.objects.length == 0) {
      this.errors = [
        ...this.errors,
        "need at least one object to send a request, " +
          "add one with .withObject(obj)",
      ];
    }
  };

  validate = () => {
    this.validateObjectCount();
  };

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }
    const path = `/batch/objects`;
    return this.client.post(path, this.payload());
  };
}
