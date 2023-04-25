# sha256-gpu
SHA-256 run over GPU throught WebGPU.
## Install
```
npm i @marco_ciaramella/sha256-gpu
```
## Usage
```javascript
import { sha256_gpu } from "@marco_ciaramella/sha256-gpu";

const messages = [
    new Uint8Array([0x01, 0x00, 0x00, 0x00]), // int 1
    new Uint8Array([0x02, 0x00, 0x00, 0x00]), // int 2
    new Uint8Array([0x03, 0x00, 0x00, 0x00]), // int 3
    new Uint8Array([0x04, 0x00, 0x00, 0x00]), // int 4
    new Uint8Array([0x05, 0x00, 0x00, 0x00]), // int 5
    new Uint8Array([0x06, 0x00, 0x00, 0x00]), // int 6
    new Uint8Array([0x07, 0x00, 0x00, 0x00]), // int 7
    new Uint8Array([0x08, 0x00, 0x00, 0x00]), // int 8
    new Uint8Array([0x09, 0x00, 0x00, 0x00])  // int 9
];
// each message in messages must have the same size
const hashes = await sha256_gpu(messages);
for (let hash of hashes) {
    console.log(hash.reduce((a, b) => a + b.toString(16).padStart(2, '0'), ''));
}
```