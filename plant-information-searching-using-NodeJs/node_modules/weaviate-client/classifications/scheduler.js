import Getter from "./getter";

export default class Scheduler {
  constructor(client) {
    this.client = client;
    this.errors = [];
    this.waitTimeout = 10 * 60 * 1000; // 10 minutes
    this.waitForCompletion = false;
  }

  withType = (type) => {
    this.type = type;
    return this;
  };

  withSettings = (settings) => {
    this.settings = settings;
    return this;
  };

  withClassName = (className) => {
    this.className = className;
    return this;
  };

  withClassifyProperties = (props) => {
    this.classifyProperties = props;
    return this;
  };

  withBasedOnProperties = (props) => {
    this.basedOnProperties = props;
    return this;
  };

  withWaitForCompletion = () => {
    this.waitForCompletion = true;
    return this;
  };

  withWaitTimeout = (timeout) => {
    this.waitTimeout = timeout;
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

  validateClassName = () => {
    this.validateIsSet(
      this.className,
      "className",
      ".withClassName(className)"
    );
  };

  validateBasedOnProperties = () => {
    this.validateIsSet(
      this.basedOnProperties,
      "basedOnProperties",
      ".withBasedOnProperties(basedOnProperties)"
    );
  };

  validateClassifyProperties = () => {
    this.validateIsSet(
      this.classifyProperties,
      "classifyProperties",
      ".withClassifyProperties(classifyProperties)"
    );
  };

  validate = () => {
    this.validateClassName();
    this.validateClassifyProperties();
    this.validateBasedOnProperties();
  };

  payload = () => ({
    type: this.type,
    settings: this.settings,
    class: this.className,
    classifyProperties: this.classifyProperties,
    basedOnProperties: this.basedOnProperties,
  });

  pollForCompletion = (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(
        () =>
          reject(
            new Error(
              "classification didn't finish within configured timeout, " +
                "set larger timeout with .withWaitTimeout(timeout)"
            )
          ),
        this.waitTimeout
      );

      setInterval(() => {
        new Getter(this.client)
          .withId(id)
          .do()
          .then((res) => {
            res.status == "completed" && resolve(res);
          });
      }, 500);
    });
  };

  do = () => {
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }
    this.validate();

    const path = `/classifications`;
    return this.client.post(path, this.payload()).then((res) => {
      if (!this.waitForCompletion) {
        return Promise.resolve(res);
      }

      return this.pollForCompletion(res.id);
    });
  };
}
