export default class MetaGetter {
  constructor(client) {
    this.client = client;
  }

  do = () => {
    return this.client.get("/meta", true);
  };
}
