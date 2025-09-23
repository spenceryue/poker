
export const nChooseK = Array.from({ length: 52 + 1 }, () => new Uint32Array(7 + 1));
nChooseK.init = () => {
    for (let n = 0; n < nChooseK.length; ++n) {
        nChooseK[n][0] = 1;
        for (let k = 1; k < nChooseK[n].length && k <= n; ++k) {
            nChooseK[n][k] = nChooseK[n - 1][k - 1] + nChooseK[n - 1][k];
        }
    }
};
