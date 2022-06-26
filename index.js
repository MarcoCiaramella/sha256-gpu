async function getGPUDevice() {
    const adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
    if (!adapter) {
        alert("No adapter");
    }
    else {
        return await adapter.requestDevice();
    }
}

function padMessage(bytes, size) {
    const arrBuff = new ArrayBuffer(size * 4);
    new Uint8Array(arrBuff).set(bytes);
    return new Uint32Array(arrBuff);
}

function getMessageSizes(bytes) {
    const lenBit = bytes.length * 8;
    const k = 512 - (lenBit + 1 + 64) % 512;
    const padding = 1 + k + 64;
    const lenBitPadded = lenBit + padding;
    const arrBuff = new ArrayBuffer(2 * Uint32Array.BYTES_PER_ELEMENT);
    const u32Arr = new Uint32Array(arrBuff);
    u32Arr[0] = lenBit / 32;
    u32Arr[1] = lenBitPadded / 32;
    return u32Arr;
}

function calcNumWorkgroups(device, bytesArray) {
    const numWorkgroups = Math.ceil(bytesArray.length / 256);
    if (numWorkgroups > device.limits.maxComputeWorkgroupsPerDimension) {
        throw `Input array is too large. Max is ${device.limits.maxComputeWorkgroupsPerDimension / 256} arrays.`;
    }
    return numWorkgroups;
}

/**
 * 
 * @param {array} bytesArray array of array of bytes (array of bytes must be 32-bit aligned)
 * @returns {Uint8Array[]} hashes
 */
export async function sha256(bytesArray) {

    try {
        const device = await getGPUDevice();

        const numWorkgroups = calcNumWorkgroups(device, bytesArray);

        const messages = [];
        let bufferSize = 0;
        const messageSizes = getMessageSizes(bytesArray[0]);
        bytesArray.forEach(bytes => {
            if (bytes.length % 4 !== 0) throw "Message must be 32-bit aligned";
            const message = padMessage(bytes, messageSizes[1]);
            // message is the padded version of the input message as dscribed by SHA-256 specification
            messages.push(message);
            // messages has same size
            bufferSize += message.byteLength;
        });
        const numMessages = messages.length;

        // build shader input data
        const messageArray = new Uint32Array(new ArrayBuffer(bufferSize));
        let offset = 0;
        messages.forEach(message => {
            messageArray.set(message, offset);
            offset += message.length;
        });

        // messages
        const messageArrayBuffer = device.createBuffer({
            mappedAtCreation: true,
            size: messageArray.byteLength,
            usage: GPUBufferUsage.STORAGE
        });
        new Uint32Array(messageArrayBuffer.getMappedRange()).set(messageArray);
        messageArrayBuffer.unmap();

        // num_messages
        const numMessagesBuffer = device.createBuffer({
            mappedAtCreation: true,
            size: Uint32Array.BYTES_PER_ELEMENT,
            usage: GPUBufferUsage.STORAGE
        });
        new Uint32Array(numMessagesBuffer.getMappedRange()).set([bytesArray.length]);
        numMessagesBuffer.unmap();

        // message_sizes
        const messageSizesBuffer = device.createBuffer({
            mappedAtCreation: true,
            size: messageSizes.byteLength,
            usage: GPUBufferUsage.STORAGE
        });
        new Uint32Array(messageSizesBuffer.getMappedRange()).set(messageSizes);
        messageSizesBuffer.unmap();

        // Result
        const resultBufferSize = (256 / 8) * numMessages;
        const resultBuffer = device.createBuffer({
            size: resultBufferSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        });

        const shaderModule = device.createShaderModule({
            code: await (await fetch("shader.wgsl")).text()
        });

        const computePipeline = device.createComputePipeline({
            compute: {
                module: shaderModule,
                entryPoint: "sha256"
            },
            layout: 'auto'
        });

        const bindGroup = device.createBindGroup({
            layout: computePipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: messageArrayBuffer
                    }
                },
                {
                    binding: 1,
                    resource: {
                        buffer: numMessagesBuffer
                    }
                },
                {
                    binding: 2,
                    resource: {
                        buffer: messageSizesBuffer
                    }
                },
                {
                    binding: 3,
                    resource: {
                        buffer: resultBuffer
                    }
                }
            ]
        });

        const commandEncoder = device.createCommandEncoder();

        const passEncoder = commandEncoder.beginComputePass();
        passEncoder.setPipeline(computePipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.dispatchWorkgroups(numWorkgroups);
        passEncoder.end();

        const gpuReadBuffer = device.createBuffer({
            size: resultBufferSize,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });
        commandEncoder.copyBufferToBuffer(
            resultBuffer,
            0,
            gpuReadBuffer,
            0,
            resultBufferSize
        );

        const gpuCommands = commandEncoder.finish();
        device.queue.submit([gpuCommands]);

        await gpuReadBuffer.mapAsync(GPUMapMode.READ);

        const hashSize = 256 / 8;
        const hashes = [];
        for (let i = 0; i < numMessages; i++) {
            hashes.push(new Uint8Array(gpuReadBuffer.getMappedRange(i * hashSize, hashSize)));
        }

        return hashes;
    }
    catch (error) {
        console.error(error);
    }
}
