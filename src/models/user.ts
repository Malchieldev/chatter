import { ObjectId, Filter } from "mongodb";
import mongo from "../db/mongo";

interface Data {
  googleId?: string;
  name?: string;
  description?: string;
  photo?: string;
  creationDate?: Date;
  loginDate?: Date;
  testUser?: boolean;
}

interface User extends Data {}

class User {
  _id!: ObjectId;
  constructor(data?: Data) {
    //default values:
    this.googleId = "";
    this.name = "";
    this.description = "";
    this.photo = "";
    this.creationDate = new Date();
    this.loginDate = new Date(0);
    this.testUser = false;
    //fill from params:
    Object.assign(this, data);
  }
  private validate() {
    if (!this.name) {
      return false;
    }
    return true;
  }
  async create() {
    const collection = mongo.db.collection("users");
    if (this.validate()) {
      const newUser = await collection.insertOne(this);
      this._id = newUser.insertedId;
    }
  }
  async get() {
    const collection = mongo.db.collection("users");
    const result = (await collection.findOne({
      _id: this._id,
    })) as Data;
    const user = new User(result);
    Object.assign(this, user);
  }
  static async getById(id: string) {
    const collection = mongo.db.collection("users");
    const foundUser = (await collection.findOne({
      _id: new ObjectId(id),
    })) as Data;
    return foundUser ? new User(foundUser) : null;
  }
  static async getUsersByFilter(filter: Filter<Data>) {
    const collection = mongo.db.collection("users");
    const foundUsers = (await collection.find(filter).toArray()) as Data[];
    return foundUsers.map((el) => new User(el));
  }
  async update(update: {}) {
    const collection = mongo.db.collection("users");
    const result = await collection.findOneAndUpdate(
      { _id: this._id },
      update,
      { returnDocument: "after" }
    );
    const userData = result.value as Data;
    const user = new User(userData);
    Object.assign(this, user);
  }
  static async updateById(id: string, update: {}) {
    const collection = mongo.db.collection("users");
    const result = (
      await collection.findOneAndUpdate({ _id: new ObjectId(id) }, update, {
        returnDocument: "after",
      })
    ).value as Data;
    return result ? new User(result) : null;
  }
  async delete() {
    const collection = mongo.db.collection("users");
    await collection.deleteOne({ _id: this._id });
    Object.assign(this, new User());
  }
}

export default User;
