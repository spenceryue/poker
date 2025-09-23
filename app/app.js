import { choose5 } from "./choose5.js";
import { choose7 } from './choose7.js'
import { IS_BROWSER } from "./IS_BROWSER.js";
import { nChooseK } from "./nChooseK.js";

if (IS_BROWSER) { await import("./ui.js"); }

nChooseK.init();
await choose5.init();
await choose7.init();

// const card = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"].flatMap((rank) =>
//   ["♠️", "♥️", "♦️", "♣️"].map((suit) => rank + suit)
// );

Object.assign(globalThis, {
  choose5,
  choose7,
  nChooseK,
});
