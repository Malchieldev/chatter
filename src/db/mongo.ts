import { Db, MongoClient } from "mongodb";
class Mongo {
  client: MongoClient;
  db!: Db;
  constructor() {
    const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@chatter-cluster.nxdthzk.mongodb.net/?retryWrites=true&w=majority`;
    this.client = new MongoClient(url);
  }
  async init() {
    await this.client.connect();
    this.db = this.client.db(process.env.DB_NAME);
  }
}
export default new Mongo();
