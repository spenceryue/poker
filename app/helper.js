/*by Howard. 
some helper functions for poker hand evaluation*/

// Extract rank (0 = Ace, 12 = Two)
function rank(card) {
  return Math.floor(card / 4);
}

// Extract suit (0 = Spade, 1 = Heart, 2 = Diamond, 3 = Club)
function suit(card) {
  return card % 4;
}

// Count frequencies of ranks
function rankCounts(cards) {
  const counts = Array(13).fill(0);
  for (const c of cards) counts[rank(c)]++;
  return counts.sort((a, b) => b - a); // descending
}

// Check if all suits the same
function allSameSuit(cards) {
  return cards.every(c => suit(c) === suit(cards[0]));
}

// Check if ranks form a straight
function isSequential(ranks) {
  ranks.sort((a, b) => a - b);

  // Normal straight
  let straight = ranks.every((v, i, arr) => i === 0 || v === arr[i - 1] + 1);

  // Wheel straight (A,2,3,4,5)
  let wheel = JSON.stringify(ranks) === JSON.stringify([0, 1, 2, 3, 12]);

  return straight || wheel;
}


function isStraightFlush(cards) {
  return allSameSuit(cards) && isSequential(cards.map(rank));
}

function isQuads(cards) {
  return rankCounts(cards)[0] === 4;
}

function isFullHouse(cards) {
  const counts = rankCounts(cards);
  return counts[0] === 3 && counts[1] === 2;
}

function isFlush(cards) {
  return allSameSuit(cards) && !isSequential(cards.map(rank));
}

function isStraight(cards) {
  return isSequential(cards.map(rank)) && !allSameSuit(cards);
}

function isTrips(cards) {
  const counts = rankCounts(cards);
  return counts[0] === 3 && counts[1] <= 1;
}

function isTwoPair(cards) {
  const counts = rankCounts(cards);
  return counts[0] === 2 && counts[1] === 2;
}

function isOnePair(cards) {
  const counts = rankCounts(cards);
  return counts[0] === 2 && counts[1] === 1;
}
