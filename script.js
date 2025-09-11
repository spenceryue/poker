const nChooseK = Array.from({ length: 52 + 1 }, () => new Uint32Array(7 + 1));
const choose5 = new Uint16Array(2_598_960 ?? nChooseK[5][2]);
const choose7 = new Uint16Array(133_784_560 ?? nChooseK[7][2]);
const category = new Uint32Array(7462);

nChooseK.init = () => {};

choose5.init = () => {
  let ranking = 0;

  STRAIGHT_FLUSH: for (const rank of Array(13 - 3).keys()) {
    for (const suit of Array(4).keys()) {
      const index = superFormula(
        suit + 4 * rank,
        suit + 4 * (rank + 1),
        suit + 4 * (rank + 2),
        suit + 4 * (rank + 3),
        suit + 4 * (rank + 4)  /*Howard: changed rank - 1/2/3/4 to rank + 1/2/3/4, since A has rank index 0, 2 is 12) */
          //also, need to add if rank + 4 > 12, then use 0, for the 5432A straightflush 
      );
      choose5[index] = ranking;
    }

    ranking++;
  }

  _4_KIND: for (const rank of Array(13).keys()) {
    for (const kicker of Array(13).keys()) {
      if (rank === kicker) {
        continue;
      }

      for (const suit of Array(4).keys()) {
        const index = superFormula(
          ...(rank < kicker
            ? [0 + 4 * rank, 1 + 4 * rank, 2 + 4 * rank, 3 + 4 * rank, suit + 4 * kicker]
            : [suit + 4 * kicker, 0 + 4 * rank, 1 + 4 * rank, 2 + 4 * rank, 3 + 4 * rank])
        );
        choose5[index] = ranking;
      }

      //what if rank > kicker, like 3333Q?

      ranking++;
    }
  }

  FULL_HOUSE: for (const _3rank of Array(13).keys()) {
    for (const _2rank of Array(13).keys()) {
      if (_3rank === _2rank) {
        continue;
      }

      for (const _3suits of Array(4 ?? nChooseK[4][3]).keys()) {
        for (const _2suits of Array(6 ?? nChoosek[4][2]).keys()) {
          // 0 1 ... 5
          // 0 -> [S] [H]
          // 1 -> [S] [C]
          // 2 -> [S] [D]
          // const
        }
      }
      choose5[superFormula()];
    }
  }
};

const superFormula = (...cards) => {
  // TODO
  // k = 0..cards[0]-1
  // sum( nChooseK(51 - k, cards.length-1) )
};
