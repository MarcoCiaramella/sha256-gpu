# sha256-gpu
A GPU version of SHA-256 using WebGPU.
## Install
```
npm i @marco_ciaramella/sha256-gpu
```
## Usage
Function `sha256_gpu` takes and array of messages of the same size and computes the SHA-256 for each message in parallel. A message must be in binary format as a `Uint8Array` (byte array). For example if you want the SHA-256 of integer 1 you must pass it as `new Uint8Array([0x01, 0x00, 0x00, 0x00])`.
```javascript
import { sha256_gpu } from "@marco_ciaramella/sha256-gpu";

// each message in messages must have the same size
const messages = [
    new Uint8Array([0x01, 0x00, 0x00, 0x00]), // binary representation of integer 1
    new Uint8Array([0x02, 0x00, 0x00, 0x00]), // binary representation of integer 2
    new Uint8Array([0x03, 0x00, 0x00, 0x00]), // binary representation of integer 3
    new Uint8Array([0x04, 0x00, 0x00, 0x00]), // binary representation of integer 4
    new Uint8Array([0x05, 0x00, 0x00, 0x00]), // binary representation of integer 5
    new Uint8Array([0x06, 0x00, 0x00, 0x00]), // binary representation of integer 6
    new Uint8Array([0x07, 0x00, 0x00, 0x00]), // binary representation of integer 7
    new Uint8Array([0x08, 0x00, 0x00, 0x00]), // binary representation of integer 8
    new Uint8Array([0x09, 0x00, 0x00, 0x00])  // binary representation of integer 9
];
// compute the SHA-256 in parallel
const hashes = await sha256_gpu(messages);
// print the result
for (let i = 0; i < hashes.length; i += 32) {
    console.log(hashes.subarray(i, i + 32).reduce((a, b) => a + b.toString(16).padStart(2, '0'), ''));
}
```