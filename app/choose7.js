import { choose5 } from "./choose5.js";
import { nChooseK } from "./nChooseK.js";
import { atMostOnce } from "./atMostOnce.js";
import { IS_BROWSER } from "./IS_BROWSER.js";
import { codec } from './codec.js'

export const choose7 = new Uint16Array(await codec.decompress?.("../assets/choose7.zst") ?? 133_784_560 ?? nChooseK[52][7])

choose7.init = atMostOnce(async (skip = IS_BROWSER) => {
    if (skip) { return }

    nChooseK.init()
    await choose5.init()

    let i = 0;
    for (let g = 6; g < 52; ++g) {
        for (let f = 5; f < g; ++f) {
            for (let e = 4; e < f; ++e) {
                for (let d = 3; d < e; ++d) {
                    for (let c = 2; c < d; ++c) {
                        for (let b = 1; b < c; ++b) {
                            for (let a = 0; a < b; ++a) {
                                //for loop to iterate C(7,5), compare ranking(0-7461), choose highest(smallest)
                                let ranking = 7461 ?? choose5.category.length - 1;
                                for (const _7choose5 of [
                                    [a, b, c, d, e],
                                    [a, b, c, d, f],
                                    [a, b, c, d, g],
                                    [a, b, c, e, f],
                                    [a, b, c, e, g],
                                    [a, b, c, f, g],
                                    [a, b, d, e, f],
                                    [a, b, d, e, g],
                                    [a, b, d, f, g],
                                    [a, b, e, f, g],
                                    [a, c, d, e, f],
                                    [a, c, d, e, g],
                                    [a, c, d, f, g],
                                    [a, c, e, f, g],
                                    [a, d, e, f, g],
                                    [b, c, d, e, f],
                                    [b, c, d, e, g],
                                    [b, c, d, f, g],
                                    [b, c, e, f, g],
                                    [b, d, e, f, g],
                                    [c, d, e, f, g],
                                ]) {
                                    ranking = Math.min(ranking, choose5[choose5.index(..._7choose5)]);
                                }
                                choose7[i++] = ranking;
                                if (i % 10e6 === 0) {
                                    console.log("choose7.init", ((i / (choose7.length - 1)) * 100).toFixed(1) + "%");
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    await codec.compress("../assets/choose7.zst", choose7)
});


choose7.index = (a, b, c, d, e, f, g) =>
    nChooseK[a][1] + nChooseK[b][2] + nChooseK[c][3] + nChooseK[d][4] + nChooseK[e][5] + nChooseK[f][6] + nChooseK[g][7];


choose7.spread = (players = [[0, 1], [4, 5], [8, 9]]) => {
    const deadCards = new Set(players.flat().sort((a, b) => a - b))

    const frequencies = Array({ length: players.length }, () => new Uint32Array(7462))

    const totalFrequency = nChooseK[52 - deadCards.length][5]

    for (let e = 4; e < 52; ++e) {
        if (deadCards.has(e)) { continue }
        for (let d = 3; d < e; ++d) {
            if (deadCards.has(d)) { continue }
            for (let c = 2; c < d; ++c) {
                if (deadCards.has(c)) { continue }
                for (let b = 1; b < c; ++b) {
                    if (deadCards.has(b)) { continue }
                    for (let a = 0; a < b; ++a) {
                        if (deadCards.has(a)) { continue }
                        for (const [i, [x, y]] of players.entries()) {
                            ++frequencies[i][choose7[
                                choose7.index(
                                    ...[a, b, c, d, e, x, y].sort((m, n) => m - n)
                                )
                            ]]
                        }
                    }
                }
            }
        }

        return frequencies.map(playerFrequencies => Float32Array.from(playerFrequencies, frequency => frequency / totalFrequency))
    }
}


