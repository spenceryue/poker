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


/**
 * Unrank (index -> cards) for 5-card hands from a 52-card deck.
 * Result is the unique sorted 5-tuple [a,b,c,d,e] in lex order.
 *
 * Theory:
 *  - Combinatorial number system says:
 *      index = C(e,5) + C(d,4) + C(c,3) + C(b,2) + C(a,1)
 *    with 0 <= a<b<c<d<e <= 51 (lex order).
 *  - To unrank, we do a greedy search from the rightmost element:
 *      pick the largest e with C(e,5) <= index, subtract it,
 *      then the largest d<e with C(d,4) <= remaining, subtract it,
 *      ... and so on down to a.
 *
 * Why it works:
 *  - Each term C(x, position) counts how many combinations we skip by
 *    raising the current coordinate x while keeping all earlier coords fixed.
 *  - Greedy never backtracks because binomial coefficients are monotone in x:
 *      if C(x, r) <= R but C(x+1, r) > R, x is the unique maximum valid choice.
 *
 * Numerical safety:
 *  - All binomials here are integers <= C(52,5)=2,598,960, well within JS Number precision.
 *  - We precompute a small Pascal table dp[n][k] (0<=n<=52, 0<=k<=5) for exact integers.
 */

// ---- 1) Precompute binomial coefficients up to (n=52, k=5) via Pascal's triangle.
function makeBinomTable(maxN = 52, maxK = 5) {
  const dp = Array.from({ length: maxN + 1 }, () => Array(maxK + 1).fill(0));
  for (let n = 0; n <= maxN; n++) {
    dp[n][0] = 1; // C(n,0) = 1
    for (let k = 1; k <= Math.min(n, maxK); k++) {
      // Pascal: C(n,k) = C(n-1,k-1) + C(n-1,k)
      dp[n][k] = dp[n - 1][k - 1] + dp[n - 1][k];
    }
  }
  return (n, k) => (n >= 0 && k >= 0 && k <= maxK && k <= n ? dp[n][k] : 0);
}

const C = makeBinomTable(52, 5);

// ---- 2) Core: greedy unranking for k=5 from a universe {0..51}.
function unindex5(index) {
  // Valid index range: 0 .. C(52,5)-1
  const TOTAL = C(52, 5); // 2,598,960
  if (index < 0 || index >= TOTAL) {
    throw new RangeError(`index out of range (0..${TOTAL - 1}): ${index}`);
  }

  // We will recover e, d, c, b, a in that order (right to left).
  // In general: pick largest x with C(x, r) <= remaining, where r = remaining slots (5,4,3,2,1).

  let rem = index;

  // Find e: largest e with C(e,5) <= rem. Note e ∈ [4..51] because C(4,5)=0 and C(5,5)=1.
  let e = 51;
  while (C(e, 5) > rem) e--;     // monotone search downward
  rem -= C(e, 5);

  // Find d: largest d<e with C(d,4) <= rem.
  let d = e - 1;
  while (C(d, 4) > rem) d--;
  rem -= C(d, 4);

  // Find c: largest c<d with C(c,3) <= rem.
  let c = d - 1;
  while (C(c, 3) > rem) c--;
  rem -= C(c, 3);

  // Find b: largest b<c with C(b,2) <= rem.
  let b = c - 1;
  while (C(b, 2) > rem) b--;
  rem -= C(b, 2);

  // Find a: largest a<b with C(a,1) <= rem.
  let a = b - 1;
  while (C(a, 1) > rem) a--;
  rem -= C(a, 1);

  // At this point rem must be 0 if the index was valid.
  // Sanity checks (optional but nice during development):
  if (!(0 <= a && a < b && b < c && c < d && d < e && e <= 51)) {
    throw new Error(`Internal error: non-sorted result [${a},${b},${c},${d},${e}]`);
  }
  if (rem !== 0) {
    throw new Error(`Internal error: leftover remainder ${rem}`);
  }

  return [a, b, c, d, e];
}

// ---- 3) (Optional) The forward map for testing: index5([a,b,c,d,e]) = C(a,1)+C(b,2)+C(c,3)+C(d,4)+C(e,5)
function index5(tuple) {
  const [a, b, c, d, e] = tuple;
  if (!(0 <= a && a < b && b < c && c < d && d < e && e <= 51)) {
    throw new Error(`tuple must be strictly increasing within 0..51: ${tuple}`);
  }
  return C(a, 1) + C(b, 2) + C(c, 3) + C(d, 4) + C(e, 5);
}

// ---- 4) Examples and notes:

// Example A: first (index 0) should be [0,1,2,3,4]
console.log(unindex5(0)); // [0,1,2,3,4]

// Example B: last (index C(52,5)-1) should be [47,48,49,50,51]
console.log(unindex5(C(52,5)-1)); // [47,48,49,50,51]

// Example C: roundtrip check on a random index
const ix = 1_234_567;
const hand = unindex5(ix);
const ix2 = index5(hand);
console.log(ix, hand, ix2); // ix should equal ix2

/**
 * PERFORMANCE NOTES
 * - Each unindex call does at most ~52 down-steps per coordinate in the worst case,
 *   but in practice just a handful because C(x,r) grows quickly.
 * - You can accelerate searches (for very hot loops) using a precomputed monotone
 *   table of thresholds or a binary search over x in [r-1 .. 51] since C(x,r) is monotone.
 *
 * ADAPTATION NOTES
 * - For a general “n choose k”:
 *    unindexK(index, n, k) would pick x_k in [k-1..n-1] s.t. C(x_k,k) <= rem,
 *    then x_{k-1} < x_k s.t. C(x_{k-1}, k-1) <= rem, etc.
 * - For your poker project:
 *    this [a,b,c,d,e] are the **card indices 0..51** (As=0, Ah=1, …, 2c=51 in your scheme).
 *    Once you have these, you can map to (rank,suit) and evaluate hand strength.
 */
