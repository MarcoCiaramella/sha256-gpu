/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"sha256_gpu\": () => (/* binding */ sha256_gpu)\n/* harmony export */ });\nfunction shader(device) {\r\n    return `\r\n// SHA-256 for 32-bit aligned messages\r\n\r\nfn swap_endianess32(val: u32) -> u32 {\r\n    return ((val>>24u) & 0xffu) | ((val>>8u) & 0xff00u) | ((val<<8u) & 0xff0000u) | ((val<<24u) & 0xff000000u);\r\n}\r\n\r\nfn shw(x: u32, n: u32) -> u32 {\r\n    return (x << (n & 31u)) & 0xffffffffu;\r\n}\r\n\r\nfn r(x: u32, n: u32) -> u32 {\r\n    return (x >> n) | shw(x, 32u - n);\r\n}\r\n\r\nfn g0(x: u32) -> u32 {\r\n    return r(x, 7u) ^ r(x, 18u) ^ (x >> 3u);\r\n}\r\n\r\nfn g1(x: u32) -> u32 {\r\n    return r(x, 17u) ^ r(x, 19u) ^ (x >> 10u);\r\n}\r\n\r\nfn s0(x: u32) -> u32 {\r\n    return r(x, 2u) ^ r(x, 13u) ^ r(x, 22u);\r\n}\r\n\r\nfn s1(x: u32) -> u32 {\r\n    return r(x, 6u) ^ r(x, 11u) ^ r(x, 25u);\r\n}\r\n\r\nfn maj(a: u32, b: u32, c: u32) -> u32 {\r\n    return (a & b) ^ (a & c) ^ (b & c);\r\n}\r\n\r\nfn ch(e: u32, f: u32, g: u32) -> u32 {\r\n    return (e & f) ^ ((~e) & g);\r\n}\r\n\r\n@group(0) @binding(0) var<storage, read_write> messages: array<u32>;\r\n@group(0) @binding(1) var<storage, read> num_messages: u32;\r\n@group(0) @binding(2) var<storage, read> message_sizes: array<u32>;\r\n@group(0) @binding(3) var<storage, read_write> hashes: array<u32>;\r\n\r\n@compute @workgroup_size(${device.limits.maxComputeWorkgroupSizeX})\r\nfn sha256(@builtin(global_invocation_id) global_id: vec3<u32>) {\r\n\r\n    let index = global_id.x;\r\n    if (index >= num_messages) {\r\n        return;\r\n    }\r\n    let message_base_index = index * message_sizes[1];\r\n    let hash_base_index = index * (256u / 32u);\r\n\r\n    // == padding == //\r\n\r\n    messages[message_base_index + message_sizes[0]] = 0x00000080u;\r\n    for (var i = message_sizes[0] + 1; i < message_sizes[1] - 2; i++){\r\n        messages[message_base_index + i] = 0x00000000u;\r\n    }\r\n    messages[message_base_index + message_sizes[1] - 2] = 0;\r\n    messages[message_base_index + message_sizes[1] - 1] = swap_endianess32(message_sizes[0] * 32u);\r\n\r\n    // == processing == //\r\n\r\n    hashes[hash_base_index] = 0x6a09e667u;\r\n    hashes[hash_base_index + 1] = 0xbb67ae85u;\r\n    hashes[hash_base_index + 2] = 0x3c6ef372u;\r\n    hashes[hash_base_index + 3] = 0xa54ff53au;\r\n    hashes[hash_base_index + 4] = 0x510e527fu;\r\n    hashes[hash_base_index + 5] = 0x9b05688cu;\r\n    hashes[hash_base_index + 6] = 0x1f83d9abu;\r\n    hashes[hash_base_index + 7] = 0x5be0cd19u;\r\n\r\n    let k = array<u32,64>(\r\n        0x428a2f98u, 0x71374491u, 0xb5c0fbcfu, 0xe9b5dba5u, 0x3956c25bu, 0x59f111f1u, 0x923f82a4u, 0xab1c5ed5u,\r\n        0xd807aa98u, 0x12835b01u, 0x243185beu, 0x550c7dc3u, 0x72be5d74u, 0x80deb1feu, 0x9bdc06a7u, 0xc19bf174u,\r\n        0xe49b69c1u, 0xefbe4786u, 0x0fc19dc6u, 0x240ca1ccu, 0x2de92c6fu, 0x4a7484aau, 0x5cb0a9dcu, 0x76f988dau,\r\n        0x983e5152u, 0xa831c66du, 0xb00327c8u, 0xbf597fc7u, 0xc6e00bf3u, 0xd5a79147u, 0x06ca6351u, 0x14292967u,\r\n        0x27b70a85u, 0x2e1b2138u, 0x4d2c6dfcu, 0x53380d13u, 0x650a7354u, 0x766a0abbu, 0x81c2c92eu, 0x92722c85u,\r\n        0xa2bfe8a1u, 0xa81a664bu, 0xc24b8b70u, 0xc76c51a3u, 0xd192e819u, 0xd6990624u, 0xf40e3585u, 0x106aa070u,\r\n        0x19a4c116u, 0x1e376c08u, 0x2748774cu, 0x34b0bcb5u, 0x391c0cb3u, 0x4ed8aa4au, 0x5b9cca4fu, 0x682e6ff3u,\r\n        0x748f82eeu, 0x78a5636fu, 0x84c87814u, 0x8cc70208u, 0x90befffau, 0xa4506cebu, 0xbef9a3f7u, 0xc67178f2u\r\n    );\r\n\r\n    let num_chunks = (message_sizes[1] * 32u) / 512u;\r\n    for (var i = 0u; i < num_chunks; i++){\r\n        let chunk_index = i * (512u/32u);\r\n        var w = array<u32,64>();\r\n        for (var j = 0u; j < 16u; j++){\r\n            w[j] = swap_endianess32(messages[message_base_index + chunk_index + j]);\r\n        }\r\n        for (var j = 16u; j < 64u; j++){\r\n            w[j] = w[j - 16u] + g0(w[j - 15u]) + w[j - 7u] + g1(w[j - 2u]);\r\n        }\r\n        var a = hashes[hash_base_index];\r\n        var b = hashes[hash_base_index + 1];\r\n        var c = hashes[hash_base_index + 2];\r\n        var d = hashes[hash_base_index + 3];\r\n        var e = hashes[hash_base_index + 4];\r\n        var f = hashes[hash_base_index + 5];\r\n        var g = hashes[hash_base_index + 6];\r\n        var h = hashes[hash_base_index + 7];\r\n        for (var j = 0u; j < 64u; j++){\r\n            let t2 = s0(a) + maj(a, b, c);\r\n            let t1 = h + s1(e) + ch(e, f, g) + k[j] + w[j];\r\n            h = g;\r\n            g = f;\r\n            f = e;\r\n            e = d + t1;\r\n            d = c;\r\n            c = b;\r\n            b = a;\r\n            a = t1 + t2;\r\n        }\r\n        hashes[hash_base_index] += a;\r\n        hashes[hash_base_index + 1] += b;\r\n        hashes[hash_base_index + 2] += c;\r\n        hashes[hash_base_index + 3] += d;\r\n        hashes[hash_base_index + 4] += e;\r\n        hashes[hash_base_index + 5] += f;\r\n        hashes[hash_base_index + 6] += g;\r\n        hashes[hash_base_index + 7] += h;\r\n    }\r\n    hashes[hash_base_index] = swap_endianess32(hashes[hash_base_index]);\r\n    hashes[hash_base_index + 1] = swap_endianess32(hashes[hash_base_index + 1]);\r\n    hashes[hash_base_index + 2] = swap_endianess32(hashes[hash_base_index + 2]);\r\n    hashes[hash_base_index + 3] = swap_endianess32(hashes[hash_base_index + 3]);\r\n    hashes[hash_base_index + 4] = swap_endianess32(hashes[hash_base_index + 4]);\r\n    hashes[hash_base_index + 5] = swap_endianess32(hashes[hash_base_index + 5]);\r\n    hashes[hash_base_index + 6] = swap_endianess32(hashes[hash_base_index + 6]);\r\n    hashes[hash_base_index + 7] = swap_endianess32(hashes[hash_base_index + 7]);\r\n}`;\r\n}\r\n\r\nasync function getGPUDevice() {\r\n    const adapter = await navigator.gpu.requestAdapter({ powerPreference: \"high-performance\" });\r\n    if (!adapter) {\r\n        throw \"No adapter\";\r\n    }\r\n    else {\r\n        return await adapter.requestDevice();\r\n    }\r\n}\r\n\r\nfunction padMessage(bytes, size) {\r\n    const arrBuff = new ArrayBuffer(size * 4);\r\n    new Uint8Array(arrBuff).set(bytes);\r\n    return new Uint32Array(arrBuff);\r\n}\r\n\r\nfunction getMessageSizes(bytes) {\r\n    const lenBit = bytes.length * 8;\r\n    const k = 512 - (lenBit + 1 + 64) % 512;\r\n    const padding = 1 + k + 64;\r\n    const lenBitPadded = lenBit + padding;\r\n    return new Uint32Array([lenBit / 32, lenBitPadded / 32]);\r\n}\r\n\r\nfunction calcNumWorkgroups(device, messages) {\r\n    const numWorkgroups = Math.ceil(messages.length / device.limits.maxComputeWorkgroupSizeX);\r\n    if (numWorkgroups > device.limits.maxComputeWorkgroupsPerDimension) {\r\n        throw `Input array too large. Max size is ${device.limits.maxComputeWorkgroupsPerDimension * device.limits.maxComputeWorkgroupSizeX}.`;\r\n    }\r\n    return numWorkgroups;\r\n}\r\n\r\nfunction check(messages) {\r\n    for (const message of messages) {\r\n        if (message.length !== messages[0].length) throw \"Messages must have the same size\";\r\n        if (message.length % 4 !== 0) throw \"Message must be 32-bit aligned\";\r\n    }\r\n}\r\n\r\nclass GPU {\r\n\r\n    #device;\r\n    #computePipeline;\r\n\r\n    async init() {\r\n        this.#device = await getGPUDevice();\r\n        this.#computePipeline = this.#device.createComputePipeline({\r\n            compute: {\r\n                module: this.#device.createShaderModule({ code: shader(this.#device) }),\r\n                entryPoint: \"sha256\"\r\n            },\r\n            layout: 'auto'\r\n        });\r\n        return this;\r\n    }\r\n\r\n    get device() {\r\n        return this.#device;\r\n    }\r\n\r\n    get computePipeline() {\r\n        return this.#computePipeline;\r\n    }\r\n}\r\n\r\nconst gpu = await new GPU().init();\r\n\r\n/**\r\n * \r\n * @param {Uint8Array[]} messages messages to hash. Each message must be 32-bit aligned with the same size\r\n * @returns {Uint8Array} the set of resulting hashes\r\n */\r\nasync function sha256_gpu(messages) {\r\n\r\n    check(messages);\r\n\r\n    const numWorkgroups = calcNumWorkgroups(gpu.device, messages);\r\n\r\n    const messageSizes = getMessageSizes(messages[0]);\r\n    const messageArray = new Uint32Array(messageSizes[1] * messages.length);\r\n    let offset = 0;\r\n    for (const message of messages) {\r\n        const messagePad = padMessage(message, messageSizes[1]);\r\n        // messagePad is the padded version of the input message as dscribed by SHA-256 specification\r\n        messageArray.set(messagePad, offset);\r\n        offset += messagePad.length;\r\n    }\r\n\r\n    // messages\r\n    const messageArrayBuffer = gpu.device.createBuffer({\r\n        mappedAtCreation: true,\r\n        size: messageArray.byteLength,\r\n        usage: GPUBufferUsage.STORAGE\r\n    });\r\n    new Uint32Array(messageArrayBuffer.getMappedRange()).set(messageArray);\r\n    messageArrayBuffer.unmap();\r\n\r\n    // num_messages\r\n    const numMessagesBuffer = gpu.device.createBuffer({\r\n        mappedAtCreation: true,\r\n        size: Uint32Array.BYTES_PER_ELEMENT,\r\n        usage: GPUBufferUsage.STORAGE\r\n    });\r\n    new Uint32Array(numMessagesBuffer.getMappedRange()).set([messages.length]);\r\n    numMessagesBuffer.unmap();\r\n\r\n    // message_sizes\r\n    const messageSizesBuffer = gpu.device.createBuffer({\r\n        mappedAtCreation: true,\r\n        size: messageSizes.byteLength,\r\n        usage: GPUBufferUsage.STORAGE\r\n    });\r\n    new Uint32Array(messageSizesBuffer.getMappedRange()).set(messageSizes);\r\n    messageSizesBuffer.unmap();\r\n\r\n    // Result\r\n    const resultBufferSize = (256 / 8) * messages.length;\r\n    const resultBuffer = gpu.device.createBuffer({\r\n        size: resultBufferSize,\r\n        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC\r\n    });\r\n\r\n    const bindGroup = gpu.device.createBindGroup({\r\n        layout: gpu.computePipeline.getBindGroupLayout(0),\r\n        entries: [\r\n            {\r\n                binding: 0,\r\n                resource: {\r\n                    buffer: messageArrayBuffer\r\n                }\r\n            },\r\n            {\r\n                binding: 1,\r\n                resource: {\r\n                    buffer: numMessagesBuffer\r\n                }\r\n            },\r\n            {\r\n                binding: 2,\r\n                resource: {\r\n                    buffer: messageSizesBuffer\r\n                }\r\n            },\r\n            {\r\n                binding: 3,\r\n                resource: {\r\n                    buffer: resultBuffer\r\n                }\r\n            }\r\n        ]\r\n    });\r\n\r\n    const commandEncoder = gpu.device.createCommandEncoder();\r\n\r\n    const passEncoder = commandEncoder.beginComputePass();\r\n    passEncoder.setPipeline(gpu.computePipeline);\r\n    passEncoder.setBindGroup(0, bindGroup);\r\n    passEncoder.dispatchWorkgroups(numWorkgroups);\r\n    passEncoder.end();\r\n\r\n    const gpuReadBuffer = gpu.device.createBuffer({\r\n        size: resultBufferSize,\r\n        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ\r\n    });\r\n    commandEncoder.copyBufferToBuffer(\r\n        resultBuffer,\r\n        0,\r\n        gpuReadBuffer,\r\n        0,\r\n        resultBufferSize\r\n    );\r\n\r\n    const gpuCommands = commandEncoder.finish();\r\n    gpu.device.queue.submit([gpuCommands]);\r\n\r\n    await gpuReadBuffer.mapAsync(GPUMapMode.READ);\r\n\r\n    return new Uint8Array(gpuReadBuffer.getMappedRange());\r\n}\r\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } }, 1);\n\n//# sourceURL=webpack://@marco_ciaramella/sha256-gpu/./index.js?");

/***/ }),

/***/ "./test/index.js":
/*!***********************!*\
  !*** ./test/index.js ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index */ \"./index.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_index__WEBPACK_IMPORTED_MODULE_0__]);\n_index__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\r\n\r\nasync function test1() {\r\n    const messages = [\r\n        new Uint8Array([0x01, 0x00, 0x00, 0x00]), // int 1\r\n        new Uint8Array([0x02, 0x00, 0x00, 0x00]), // int 2\r\n        new Uint8Array([0x03, 0x00, 0x00, 0x00]), // int 3\r\n        new Uint8Array([0x04, 0x00, 0x00, 0x00]), // int 4\r\n        new Uint8Array([0x05, 0x00, 0x00, 0x00]), // int 5\r\n        new Uint8Array([0x06, 0x00, 0x00, 0x00]), // int 6\r\n        new Uint8Array([0x07, 0x00, 0x00, 0x00]), // int 7\r\n        new Uint8Array([0x08, 0x00, 0x00, 0x00]), // int 8\r\n        new Uint8Array([0x09, 0x00, 0x00, 0x00])  // int 9\r\n    ];\r\n    // each message in messages must have the same size\r\n    const hashes = await (0,_index__WEBPACK_IMPORTED_MODULE_0__.sha256_gpu)(messages);\r\n    for (let i = 0; i < hashes.length; i += 32) {\r\n        console.log(hashes.subarray(i, i+32).reduce((a, b) => a + b.toString(16).padStart(2, '0'), ''));\r\n    }\r\n}\r\n\r\nasync function test2() {\r\n    const messages = [];\r\n    for (let i = 0; i < 131000; i++) {\r\n        const message = new Uint8Array(576);\r\n        message.fill(1);\r\n        messages.push(message);\r\n    }\r\n    // each message in messages must have the same size\r\n    const start = new Date().getTime();\r\n    await (0,_index__WEBPACK_IMPORTED_MODULE_0__.sha256_gpu)(messages);\r\n    const end = new Date().getTime();\r\n    console.log(\"time \" + (end - start) + \"ms\");\r\n}\r\n\r\nasync function test3() {\r\n\r\n    const messages = [\r\n        new Uint8Array([0x01, 0x00, 0x00, 0x00]), // int 1\r\n        new Uint8Array([0x02, 0x00, 0x00, 0x00]), // int 2\r\n        new Uint8Array([0x03, 0x00, 0x00, 0x00]), // int 3\r\n        new Uint8Array([0x04, 0x00, 0x00, 0x00]), // int 4\r\n        new Uint8Array([0x05, 0x00, 0x00, 0x00]), // int 5\r\n        new Uint8Array([0x06, 0x00, 0x00, 0x00]), // int 6\r\n        new Uint8Array([0x07, 0x00, 0x00, 0x00]), // int 7\r\n        new Uint8Array([0x08, 0x00, 0x00, 0x00]), // int 8\r\n        new Uint8Array([0x09, 0x00, 0x00, 0x00])  // int 9\r\n    ];\r\n\r\n    async function hash(message) {\r\n        const hashBuffer = await crypto.subtle.digest('SHA-256', message);\r\n        const hashArray = Array.from(new Uint8Array(hashBuffer));\r\n        const hashHex = hashArray\r\n          .map((bytes) => bytes.toString(16).padStart(2, '0'))\r\n          .join('');\r\n        return hashHex;\r\n      }\r\n\r\n      // each message in messages must have the same size\r\n    const hashes = await (0,_index__WEBPACK_IMPORTED_MODULE_0__.sha256_gpu)(messages);\r\n    let hashes1 = [];\r\n    for (let i = 0; i < hashes.length; i += 32) {\r\n        hashes1.push(hashes.subarray(i, i+32).reduce((a, b) => a + b.toString(16).padStart(2, '0'), ''));\r\n    }\r\n    let hashes2 = [];\r\n    for (const message of messages) {\r\n        hashes2.push(await hash(message));\r\n    }\r\n    console.log(JSON.stringify(hashes1) === JSON.stringify(hashes2));\r\n}\r\n\r\nasync function test4() {\r\n    const messages = [];\r\n    for (let i = 0; i < 131000; i++) {\r\n        const message = new Uint8Array(576);\r\n        message.fill(1);\r\n        messages.push(message);\r\n    }\r\n    // each message in messages must have the same size\r\n    let start = new Date().getTime();\r\n    await (0,_index__WEBPACK_IMPORTED_MODULE_0__.sha256_gpu)(messages);\r\n    let end = new Date().getTime();\r\n    console.log(\"GPU time \" + (end - start) + \"ms\");\r\n\r\n    start = new Date().getTime();\r\n    for (const message of messages) {\r\n        await crypto.subtle.digest('SHA-256', message);\r\n    }\r\n    end = new Date().getTime();\r\n    console.log(\"CPU time \" + (end - start) + \"ms\");\r\n}\r\n\r\nawait test1();\r\nawait test1();\r\nawait test1();\r\n\r\nawait test2();\r\nawait test2();\r\nawait test2();\r\n\r\nawait test3();\r\nawait test3();\r\nawait test3();\r\n\r\nawait test4();\r\nawait test4();\r\nawait test4();\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } }, 1);\n\n//# sourceURL=webpack://@marco_ciaramella/sha256-gpu/./test/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && !queue.d) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = 1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./test/index.js");
/******/ 	
/******/ })()
;