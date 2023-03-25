import { ObjectId, Filter } from "mongodb";
import mongo from "../db/mongo";
import User from "./user";

interface ChatData {
  users?: User[];
  lastMessage?: { text: string; date: number };
}
interface Chat extends ChatData {}

class Chat {
  _id!: ObjectId;
  constructor(data?: ChatData) {
    //default values:
    this.users = [];
    //fill from params:
    Object.assign(this, data);
  }
  private validate() {
    if (this.users?.length !== 2) {
      return false;
    }
    return true;
  }
  async create() {
    const collection = mongo.db.collection("chats");
    if (this.validate()) {
      const newChat = await collection.insertOne(this);
      this._id = newChat.insertedId;
    }
  }
  async get() {
    const collection = mongo.db.collection("chats");
    const result = (await collection.findOne({
      _id: this._id,
    })) as ChatData;
    const chat = new Chat(result);
    Object.assign(this, chat);
  }
  static async getById(id: string) {
    const collection = mongo.db.collection("chats");
    const foundChat = (await collection.findOne({
      _id: new ObjectId(id),
    })) as ChatData;
    return foundChat ? new Chat(foundChat) : null;
  }
  static async getChatsByFilter(filter: Filter<ChatData>) {
    const collection = mongo.db.collection("chats");
    const foundChats = (await collection.find(filter).toArray()) as ChatData[];
    return foundChats.map((el) => new Chat(el));
  }
  async update(update: {}) {
    const collection = mongo.db.collection("chats");
    const result = await collection.findOneAndUpdate(
      { _id: this._id },
      update,
      { returnDocument: "after" }
    );
    const chatData = result.value as ChatData;
    const chat = new Chat(chatData);
    Object.assign(this, chat);
  }
  static async updateById(id: string, update: {}) {
    const collection = mongo.db.collection("chats");
    const result = (
      await collection.findOneAndUpdate({ _id: new ObjectId(id) }, update, {
        returnDocument: "after",
      })
    ).value as ChatData;
    return result ? new Chat(result) : null;
  }
  async delete() {
    const collection = mongo.db.collection("chats");
    await collection.deleteOne({ _id: this._id });
    Object.assign(this, new Chat());
  }
}
export default Chat;
