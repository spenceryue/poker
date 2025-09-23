import { IS_BROWSER } from './IS_BROWSER.js'

export const codec = IS_BROWSER ? {
    decompress:
        async (filePath) => {
            const { ZstdInit, ZstdSimple } = await import("@oneidentity/zstd-js/wasm/decompress")
            const [bytes] = await Promise.all([fetch(`./src/${filePath}`).then((r) => r.bytes()), ZstdInit()])
            return ZstdSimple.decompress(bytes).buffer
        },
} : {
    compress: async (filePath, data) => {
        const { resolve } = await import('path')
        const { writeFileSync } = await import('fs')
        const { ZstdInit, ZstdSimple } = await import("@oneidentity/zstd-js/wasm/index.cjs.js")
        await ZstdInit()
        writeFileSync(resolve(import.meta.dirname, filePath), ZstdSimple.compress(new Uint8Array(data.buffer)));
    }
} 