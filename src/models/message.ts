import { ObjectId, Filter } from "mongodb";
import User from "./user";
import Chat from "./chat";
import mongo from "../db/mongo";
interface MessageData {
  author?: User;
  chat?: Chat;
  text?: string;
  sent?: Date;
}
interface Message extends MessageData {}

class Message {
  _id!: ObjectId;
  constructor(data?: MessageData) {
    //default values:
    this.text = "";
    this.sent = new Date();
    //fill from params:
    Object.assign(this, data);
    //adding classes as properties:
    if (data?.author) {
      this.author = new User({ ...data.author });
    }
    if (data?.chat) {
      this.chat = new Chat({ ...data.chat });
    }
  }
  private validate() {
    if (!this.author || !this.chat || !this.text) {
      return false;
    }
    return true;
  }
  async create() {
    const collection = mongo.db.collection("messages");
    if (this.validate()) {
      const newMessage = await collection.insertOne(this);
      this._id = newMessage.insertedId;
    }
  }
  async get() {
    const collection = mongo.db.collection("messages");
    const result = (await collection.findOne({
      _id: this._id,
    })) as MessageData;
    const message = new Message(result);
    Object.assign(this, message);
  }
  static async getById(id: string) {
    const collection = mongo.db.collection("messages");
    const foundMessage = (await collection.findOne({
      _id: new ObjectId(id),
    })) as MessageData;
    return foundMessage ? new Message(foundMessage) : null;
  }
  async getPreviousMessage() {
    const collection = mongo.db.collection("messages");
    const sortedMessages = await collection
      .find({ "chat._id": this.chat?._id })
      .sort({ _id: -1 })
      .toArray();

    return sortedMessages.length !== 0
      ? new Message(sortedMessages[0] as MessageData)
      : null;
  }
  static async getMessagesByFilter(filter: Filter<MessageData>) {
    const collection = mongo.db.collection("messages");
    const foundMessages = (await collection
      .find(filter)
      .toArray()) as MessageData[];
    return foundMessages.map((el) => new Message(el));
  }
  async update(update: {}) {
    const collection = mongo.db.collection("messages");
    const result = await collection.findOneAndUpdate(
      { _id: this._id },
      update,
      { returnDocument: "after" }
    );
    const messageData = result.value as MessageData;
    const message = new Message(messageData);
    Object.assign(this, message);
  }

  static async updateById(id: string, update: {}) {
    const collection = mongo.db.collection("messages");
    const result = (
      await collection.findOneAndUpdate({ _id: new ObjectId(id) }, update, {
        returnDocument: "after",
      })
    ).value as MessageData;
    return result ? new Message(result) : null;
  }
  async delete() {
    const collection = mongo.db.collection("messages");
    await collection.deleteOne({ _id: this._id });
    Object.assign(this, new Message());
  }
}

export default Message;
