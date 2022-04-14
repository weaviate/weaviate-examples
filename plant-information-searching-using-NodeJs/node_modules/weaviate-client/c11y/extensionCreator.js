export default class ExtensionCreator {
  constructor(client) {
    this.client = client;
    this.errors = [];
  }

  withConcept = (concept) => {
    this.concept = concept;
    return this;
  };

  withDefinition = (definition) => {
    this.definition = definition;
    return this;
  };

  withWeight = (weight) => {
    this.weight = weight;
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
    this.validateIsSet(this.concept, "concept", "withConcept(concept)");
    this.validateIsSet(
      this.definition,
      "definition",
      "withDefinition(definition)"
    );
    this.validateIsSet(this.weight, "weight", "withWeight(weight)");
  };

  payload = () => ({
    concept: this.concept,
    definition: this.definition,
    weight: this.weight,
  });

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }

    const path = `/modules/text2vec-contextionary/extensions`;
    return this.client.post(path, this.payload());
  };
}
