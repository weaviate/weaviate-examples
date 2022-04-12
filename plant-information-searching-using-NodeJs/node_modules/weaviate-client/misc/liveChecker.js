export default class LiveChecker {
  constructor(client) {
    this.client = client;
  }

  do = () => {
    return this.client
      .get("/.well-known/live", false)
      .then(() => Promise.resolve(true))
      .catch(() => Promise.resolve(false));
  };
}
