import "./ui.js";
import { choose7 } from './choose7.js'
import { nChooseK } from "./nChooseK.js";
import { choose5 } from "./choose5.js";

nChooseK.init();

choose5.init();

// const card = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"].flatMap((rank) =>
//   ["♠️", "♥️", "♦️", "♣️"].map((suit) => rank + suit)
// );

Object.assign(globalThis, {
  nChooseK,
  choose5,
  choose7,
  category,
});
