import { sha256_gpu } from "../index";

async function test1() {
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
    for (let i = 0; i < hashes.length; i += 32) {
        console.log(hashes.subarray(i, i + 32).reduce((a, b) => a + b.toString(16).padStart(2, '0'), ''));
    }
}

async function test2() {
    const messages = [];
    for (let i = 0; i < 131000; i++) {
        const message = new Uint8Array(576);
        message.fill(1);
        messages.push(message);
    }
    // each message in messages must have the same size
    const start = new Date().getTime();
    await sha256_gpu(messages);
    const end = new Date().getTime();
    console.log("time " + (end - start) + "ms");
}

async function test3() {

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

    async function hash(message) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', message);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((bytes) => bytes.toString(16).padStart(2, '0'))
            .join('');
        return hashHex;
    }

    // each message in messages must have the same size
    const hashes = await sha256_gpu(messages);
    let hashes1 = [];
    for (let i = 0; i < hashes.length; i += 32) {
        hashes1.push(hashes.subarray(i, i + 32).reduce((a, b) => a + b.toString(16).padStart(2, '0'), ''));
    }
    let hashes2 = [];
    for (const message of messages) {
        hashes2.push(await hash(message));
    }
    console.log(JSON.stringify(hashes1) === JSON.stringify(hashes2));
}

async function test4() {
    const messages = [];
    for (let i = 0; i < 131000; i++) {
        const message = new Uint8Array(576);
        message.fill(1);
        messages.push(message);
    }
    // each message in messages must have the same size
    let start = new Date().getTime();
    await sha256_gpu(messages);
    let end = new Date().getTime();
    console.log("GPU time " + (end - start) + "ms");

    start = new Date().getTime();
    for (const message of messages) {
        await crypto.subtle.digest('SHA-256', message);
    }
    end = new Date().getTime();
    console.log("CPU time " + (end - start) + "ms");
}

await test1();
await test1();
await test1();

await test2();
await test2();
await test2();

await test3();
await test3();
await test3();

await test4();
await test4();
await test4();
