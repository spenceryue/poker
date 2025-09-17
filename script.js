const nChooseK = Array.from({ length: 52 + 1 }, () => new Uint32Array(7 + 1));
const choose5 = new Uint16Array(2_598_960 ?? nChooseK[52][5]);
const choose7 = new Uint16Array(133_784_560 ?? nChooseK[52][7]);
const category = new Uint8Array(7462);

nChooseK.init = () => {
  for (let n = 0; n < nChooseK.length; ++n) {
    nChooseK[n][0] = 1;
    for (let k = 1; k < nChooseK[n].length && k <= n; ++k) {
      nChooseK[n][k] = nChooseK[n - 1][k - 1] + nChooseK[n - 1][k];
    }
  }
};

choose5.init = () => {
  let ranking = 0;

  STRAIGHT_FLUSH: {
    for (const rank of Array(13 - 3).keys()) {
      for (const suit of Array(4).keys()) {
        choose5[
          rank === 9 // 5432A "Five high"
            ? choose5.index(
                suit + 4 * 0,
                suit + 4 * rank,
                suit + 4 * (rank + 1),
                suit + 4 * (rank + 2),
                suit + 4 * (rank + 3)
              )
            : choose5.index(
                suit + 4 * rank,
                suit + 4 * (rank + 1),
                suit + 4 * (rank + 2),
                suit + 4 * (rank + 3),
                suit + 4 * (rank + 4)
              )
        ] = ranking;
      }

      category[ranking++] = 0;
    }
  }

  _4_KIND: {
    for (const rank of Array(13).keys()) {
      for (const kicker of Array(13).keys()) {
        if (rank === kicker) {
          continue;
        }

        for (const suit of Array(4).keys()) {
          choose5[
            rank < kicker
              ? choose5.index(0 + 4 * rank, 1 + 4 * rank, 2 + 4 * rank, 3 + 4 * rank, suit + 4 * kicker)
              : choose5.index(suit + 4 * kicker, 0 + 4 * rank, 1 + 4 * rank, 2 + 4 * rank, 3 + 4 * rank)
          ] = ranking;
        }

        category[ranking++] = 1;
      }
    }
  }

  FULL_HOUSE: {
    for (const _3rank of Array(13).keys()) {
      for (const _2rank of Array(13).keys()) {
        if (_3rank === _2rank) {
          continue;
        }

        for (const _3suits of [
          [0, 1, 2],
          [0, 1, 3],
          [0, 2, 3],
          [1, 2, 3],
        ]) {
          for (const _2suits of [
            [0, 1],
            [0, 2],
            [0, 3],
            [1, 2],
            [1, 3],
            [2, 3],
          ]) {
            choose5[
              _3rank < _2rank
                ? choose5.index(
                    _3suits[0] + 4 * _3rank,
                    _3suits[1] + 4 * _3rank,
                    _3suits[2] + 4 * _3rank,
                    _2suits[0] + 4 * _2rank,
                    _2suits[1] + 4 * _2rank
                  )
                : choose5.index(
                    _2suits[0] + 4 * _2rank,
                    _2suits[1] + 4 * _2rank,
                    _3suits[0] + 4 * _3rank,
                    _3suits[1] + 4 * _3rank,
                    _3suits[2] + 4 * _3rank
                  )
            ] = ranking;
          }
        }

        category[ranking++] = 2;
      }
    }
  }

  FLUSH: {
    for (let r0 = 0 + 0; r0 < 13 - 4; ++r0) {
      for (let r1 = r0 + 1; r1 < 13 - 3; ++r1) {
        // 5432A "Five high"
        if (r0 === 0 && r1 === 9) {
          continue;
        }
        for (let r2 = r1 + 1; r2 < 13 - 2; ++r2) {
          for (let r3 = r2 + 1; r3 < 13 - 1; ++r3) {
            for (let r4 = r3 + 1; r4 < 13; ++r4) {
              if (r0 + 1 === r1 && r1 + 1 === r2 && r2 + 1 === r3 && r3 + 1 === r4) {
                continue;
              }
              for (const suit of Array(4).keys()) {
                choose5[choose5.index(suit + 4 * r0, suit + 4 * r1, suit + 4 * r2, suit + 4 * r3, suit + 4 * r4)] =
                  ranking;
              }
              category[ranking++] = 3;
            }
          }
        }
      }
    }
  }

  STRAIGHT: {
    for (const rank of Array(13 - 3).keys()) {
      for (const s0 of Array(4).keys()) {
        for (const s1 of Array(4).keys()) {
          for (const s2 of Array(4).keys()) {
            for (const s3 of Array(4).keys()) {
              for (const s4 of Array(4).keys()) {
                if (s0 === s1 && s1 === s2 && s2 === s3 && s3 === s4) {
                  continue;
                }

                choose5[
                  rank === 9 // 5432A "Five high"
                    ? choose5.index(
                        s0 + 4 * 0,
                        s1 + 4 * (rank + 0),
                        s2 + 4 * (rank + 1),
                        s3 + 4 * (rank + 2),
                        s4 + 4 * (rank + 3)
                      )
                    : choose5.index(
                        s0 + 4 * (rank + 0),
                        s1 + 4 * (rank + 1),
                        s2 + 4 * (rank + 2),
                        s3 + 4 * (rank + 3),
                        s4 + 4 * (rank + 4)
                      )
                ] = ranking;
              }
            }
          }
        }
      }
      category[ranking++] = 4;
    }
  }

  _3_KIND: {
    for (const _3rank of Array(13).keys()) {
      for (let k0 = 0; k0 < 13 - 1; ++k0) {
        for (let k1 = k0 + 1; k1 < 13; ++k1) {
          if (_3rank === k0 || _3rank === k1) {
            continue;
          }
          for (const _3suits of [
            [0, 1, 2],
            [0, 1, 3],
            [0, 2, 3],
            [1, 2, 3],
          ]) {
            for (const s0 of Array(4).keys()) {
              for (const s1 of Array(4).keys()) {
                choose5[
                  _3rank < k0
                    ? choose5.index(
                        _3suits[0] + 4 * _3rank,
                        _3suits[1] + 4 * _3rank,
                        _3suits[2] + 4 * _3rank,
                        s0 + 4 * k0,
                        s1 + 4 * k1
                      )
                    : _3rank > k0 && _3rank < k1
                    ? choose5.index(
                        s0 + 4 * k0,
                        _3suits[0] + 4 * _3rank,
                        _3suits[1] + 4 * _3rank,
                        _3suits[2] + 4 * _3rank,
                        s1 + 4 * k1
                      )
                    : choose5.index(
                        s0 + 4 * k0,
                        s1 + 4 * k1,
                        _3suits[0] + 4 * _3rank,
                        _3suits[1] + 4 * _3rank,
                        _3suits[2] + 4 * _3rank
                      )
                ] = ranking;
              }
            }
          }
          category[ranking++] = 5;
        }
      }
    }
  }

  _2_PAIR: {
    for (let highPair = 0; highPair < 13 - 1; ++highPair) {
      for (let lowPair = highPair + 1; lowPair < 13; ++lowPair) {
        for (const kicker of Array(13).keys()) {
          if (kicker === highPair || kicker === lowPair) {
            continue;
          }
          for (const highSuit of [
            [0, 1],
            [0, 2],
            [0, 3],
            [1, 2],
            [1, 3],
            [2, 3],
          ]) {
            for (const lowSuit of [
              [0, 1],
              [0, 2],
              [0, 3],
              [1, 2],
              [1, 3],
              [2, 3],
            ]) {
              for (kickerSuit of Array(4).keys()) {
                choose5[
                  kicker < highPair
                    ? choose5.index(
                        kickerSuit + 4 * kicker,
                        highSuit[0] + 4 * highPair,
                        highSuit[1] + 4 * highPair,
                        lowSuit[0] + 4 * lowPair,
                        lowSuit[1] + 4 * lowPair
                      )
                    : kicker > highPair && kicker < lowPair
                    ? choose5.index(
                        highSuit[0] + 4 * highPair,
                        highSuit[1] + 4 * highPair,
                        kickerSuit + 4 * kicker,
                        lowSuit[0] + 4 * lowPair,
                        lowSuit[1] + 4 * lowPair
                      )
                    : choose5.index(
                        highSuit[0] + 4 * highPair,
                        highSuit[1] + 4 * highPair,
                        lowSuit[0] + 4 * lowPair,
                        lowSuit[1] + 4 * lowPair,
                        kickerSuit + 4 * kicker
                      )
                ] = ranking;
              }
            }
          }
          category[ranking++] = 6;
        }
      }
    }
  }

  _1_PAIR: {
    for (const pair of Array(13).keys()) {
      for (let r0 = 0; r0 < 13 - 2; ++r0) {
        for (let r1 = r0 + 1; r1 < 13 - 1; ++r1) {
          for (let r2 = r1 + 1; r2 < 13; ++r2) {
            if (pair === r0 || pair === r1 || pair === r2) {
              continue;
            }
            for (const pairSuit of [
              [0, 1],
              [0, 2],
              [0, 3],
              [1, 2],
              [1, 3],
              [2, 3],
            ]) {
              for (const s0 of Array(4).keys()) {
                for (const s1 of Array(4).keys()) {
                  for (const s2 of Array(4).keys()) {
                    choose5[
                      pair < r0
                        ? choose5.index(
                            pairSuit[0] + 4 * pair,
                            pairSuit[1] + 4 * pair,
                            s0 + 4 * r0,
                            s1 + 4 * r1,
                            s2 + 4 * r2
                          )
                        : pair > r0 && pair < r1
                        ? choose5.index(
                            s0 + 4 * r0,
                            pairSuit[0] + 4 * pair,
                            pairSuit[1] + 4 * pair,
                            s1 + 4 * r1,
                            s2 + 4 * r2
                          )
                        : pair > r1 && pair < r2
                        ? choose5.index(
                            s0 + 4 * r0,
                            s1 + 4 * r1,
                            pairSuit[0] + 4 * pair,
                            pairSuit[1] + 4 * pair,
                            s2 + 4 * r2
                          )
                        : choose5.index(
                            s0 + 4 * r0,
                            s1 + 4 * r1,
                            s2 + 4 * r2,
                            pairSuit[0] + 4 * pair,
                            pairSuit[1] + 4 * pair
                          )
                    ] = ranking;
                  }
                }
              }
            }
            category[ranking++] = 7;
          }
        }
      }
    }
  }

  HIGH_CARD: {
    for (let r0 = 0 + 0; r0 < 13 - 4; ++r0) {
      for (let r1 = r0 + 1; r1 < 13 - 3; ++r1) {
        // 5432A "Five high"
        if (r0 === 0 && r1 === 9) {
          continue;
        }
        for (let r2 = r1 + 1; r2 < 13 - 2; ++r2) {
          for (let r3 = r2 + 1; r3 < 13 - 1; ++r3) {
            for (let r4 = r3 + 1; r4 < 13; ++r4) {
              if (r0 + 1 === r1 && r1 + 1 === r2 && r2 + 1 === r3 && r3 + 1 === r4) {
                continue;
              }
              for (const s0 of Array(4).keys()) {
                for (const s1 of Array(4).keys()) {
                  for (const s2 of Array(4).keys()) {
                    for (const s3 of Array(4).keys()) {
                      for (const s4 of Array(4).keys()) {
                        if (s0 === s1 && s1 === s2 && s2 === s3 && s3 === s4) {
                          continue;
                        }
                        choose5[choose5.index(s0 + 4 * r0, s1 + 4 * r1, s2 + 4 * r2, s3 + 4 * r3, s4 + 4 * r4)] =
                          ranking;
                      }
                    }
                  }
                }
              }
              category[ranking++] = 8;
            }
          }
        }
      }
    }
  }
};

choose5.index = (a, b, c, d, e) => nChooseK[a][5] + nChooseK[b][4] + nChooseK[c][3] + nChooseK[d][2] + nChooseK[e][1];

choose7.index = (a, b, c, d, e, f, g) =>
  nChooseK[a][7] + nChooseK[b][6] + nChooseK[c][5] + nChooseK[d][4] + nChooseK[e][3] + nChooseK[f][2] + nChooseK[g][1];

nChooseK.init();

choose5.init();

const card = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"].flatMap((rank) =>
  ["♠️", "♥️", "♦️", "♣️"].map((suit) => rank + suit)
);

const results = [];
let i = 0;
HERE: for (let e = 4; e < 52; ++e) {
  for (let d = 3; d < e; ++d) {
    for (let c = 2; c < d; ++c) {
      for (let b = 1; b < c; ++b) {
        for (let a = 0; a < b; ++a) {
          if (results.length === 100) {
            break HERE;
          }
          results.push([[card[a], card[b], card[c], card[d], card[e]].join(" "), choose5[i++]]);
        }
      }
    }
  }
}
console.log(results);
