# sha256-gpu
SHA-256 implementation in WebGPU (a new web API for GPU computing).
## Warning
Since WebGPU is still experimental you can play with it on [Chrome Canary](https://www.google.com/intl/it/chrome/canary/) by enabling `chrome://flags/#enable-unsafe-webgpu`. Or [Firefox Nightly](https://www.mozilla.org/it/firefox/channel/desktop/) by enabling WebGPU in settings.
## How to use
```javascript
import { sha256 } from "@marco_ciaramella/sha256-gpu";

// at the current version of WGSL u64 is not supported. This force the max message length to be ((2^32) - 1) / 32
const messages = [
    [0x01, 0x00, 0x00, 0x00], // int 1
    [0x02, 0x00, 0x00, 0x00], // int 2
    [0x03, 0x00, 0x00, 0x00], // int 3
    [0x04, 0x00, 0x00, 0x00], // int 4
    [0x05, 0x00, 0x00, 0x00], // int 5
    [0x06, 0x00, 0x00, 0x00], // int 6
    [0x07, 0x00, 0x00, 0x00], // int 7
    [0x08, 0x00, 0x00, 0x00], // int 8
    [0x09, 0x00, 0x00, 0x00]  // int 9
];
// each message in messages must have the same size
const hashes = await sha256(messages);
for (let hash of hashes) {
    console.log(hash.reduce((a, b) => a + b.toString(16).padStart(2, '0'), '0x'));
}
```