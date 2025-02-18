//server/src/room.js
import { nanoid } from "nanoid";

export default class Room {
  constructor(name) {
    this.id = nanoid();
    this.users = [];
    this.name = name;
  }
  addUser(user) {
    this.users.push(user);
  }
  removeUser(user) {
    this.users = this.users.filter((u) => u.userName !== user.userName);
  }
}
