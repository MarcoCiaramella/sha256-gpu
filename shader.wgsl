// SHA-256 for 32-bit aligned messages

fn swap_endianess32(val: u32) -> u32 {
    return ((val>>24u) & 0xffu) | ((val>>8u) & 0xff00u) | ((val<<8u) & 0xff0000u) | ((val<<24u) & 0xff000000u);
}

fn shw(x: u32, n: u32) -> u32 {
    return (x << (n & 31u)) & 0xffffffffu;
}

fn r(x: u32, n: u32) -> u32 {
    return (x >> n) | shw(x, 32u - n);
}

fn g0(x: u32) -> u32 {
    return r(x, 7u) ^ r(x, 18u) ^ (x >> 3u);
}

fn g1(x: u32) -> u32 {
    return r(x, 17u) ^ r(x, 19u) ^ (x >> 10u);
}

fn s0(x: u32) -> u32 {
    return r(x, 2u) ^ r(x, 13u) ^ r(x, 22u);
}

fn s1(x: u32) -> u32 {
    return r(x, 6u) ^ r(x, 11u) ^ r(x, 25u);
}

fn maj(a: u32, b: u32, c: u32) -> u32 {
    return (a & b) ^ (a & c) ^ (b & c);
}

fn ch(e: u32, f: u32, g: u32) -> u32 {
    return (e & f) ^ ((~e) & g);
}


@group(0) @binding(0) var<storage, read_write> messages: array<u32>;
@group(0) @binding(1) var<storage, read> sizes: array<u32>;
@group(0) @binding(2) var<storage, read_write> hash: array<u32>;

@compute @workgroup_size(3, 3)
fn sha256(@builtin(global_invocation_id) global_id: vec3<u32>) {

    let index = (3 * global_id.y) + global_id.x;
    let message_base_index = index * sizes[1];
    let hash_base_index = index * (256u / 32u);

    // == padding == //

    messages[message_base_index + sizes[0]] = 0x00000080u;
    for (var i = sizes[0] + 1; i < sizes[1] - 2; i++){
        messages[message_base_index + i] = 0x00000000u;
    }
    messages[message_base_index + sizes[1] - 2] = 0;
    messages[message_base_index + sizes[1] - 1] = swap_endianess32(sizes[0] * 32u);

    // == processing == //

    hash[hash_base_index] = 0x6a09e667u;
    hash[hash_base_index + 1] = 0xbb67ae85u;
    hash[hash_base_index + 2] = 0x3c6ef372u;
    hash[hash_base_index + 3] = 0xa54ff53au;
    hash[hash_base_index + 4] = 0x510e527fu;
    hash[hash_base_index + 5] = 0x9b05688cu;
    hash[hash_base_index + 6] = 0x1f83d9abu;
    hash[hash_base_index + 7] = 0x5be0cd19u;

    let k = array<u32,64>(
        0x428a2f98u, 0x71374491u, 0xb5c0fbcfu, 0xe9b5dba5u, 0x3956c25bu, 0x59f111f1u, 0x923f82a4u, 0xab1c5ed5u,
        0xd807aa98u, 0x12835b01u, 0x243185beu, 0x550c7dc3u, 0x72be5d74u, 0x80deb1feu, 0x9bdc06a7u, 0xc19bf174u,
        0xe49b69c1u, 0xefbe4786u, 0x0fc19dc6u, 0x240ca1ccu, 0x2de92c6fu, 0x4a7484aau, 0x5cb0a9dcu, 0x76f988dau,
        0x983e5152u, 0xa831c66du, 0xb00327c8u, 0xbf597fc7u, 0xc6e00bf3u, 0xd5a79147u, 0x06ca6351u, 0x14292967u,
        0x27b70a85u, 0x2e1b2138u, 0x4d2c6dfcu, 0x53380d13u, 0x650a7354u, 0x766a0abbu, 0x81c2c92eu, 0x92722c85u,
        0xa2bfe8a1u, 0xa81a664bu, 0xc24b8b70u, 0xc76c51a3u, 0xd192e819u, 0xd6990624u, 0xf40e3585u, 0x106aa070u,
        0x19a4c116u, 0x1e376c08u, 0x2748774cu, 0x34b0bcb5u, 0x391c0cb3u, 0x4ed8aa4au, 0x5b9cca4fu, 0x682e6ff3u,
        0x748f82eeu, 0x78a5636fu, 0x84c87814u, 0x8cc70208u, 0x90befffau, 0xa4506cebu, 0xbef9a3f7u, 0xc67178f2u
    );

    let num_chunks = (sizes[1] * 32u) / 512u;
    for (var i = 0u; i < num_chunks; i++){
        let chunk_index = i * (512u/32u);
        var w = array<u32,64>();
        for (var j = 0u; j < 16u; j++){
            w[j] = swap_endianess32(messages[message_base_index + chunk_index + j]);
        }
        for (var j = 16u; j < 64u; j++){
            w[j] = w[j - 16u] + g0(w[j - 15u]) + w[j - 7u] + g1(w[j - 2u]);
        }
        var a = hash[hash_base_index];
        var b = hash[hash_base_index + 1];
        var c = hash[hash_base_index + 2];
        var d = hash[hash_base_index + 3];
        var e = hash[hash_base_index + 4];
        var f = hash[hash_base_index + 5];
        var g = hash[hash_base_index + 6];
        var h = hash[hash_base_index + 7];
        for (var j = 0u; j < 64u; j++){
            let t2 = s0(a) + maj(a, b, c);
            let t1 = h + s1(e) + ch(e, f, g) + k[j] + w[j];
            h = g;
            g = f;
            f = e;
            e = d + t1;
            d = c;
            c = b;
            b = a;
            a = t1 + t2;
        }
        hash[hash_base_index] += a;
        hash[hash_base_index + 1] += b;
        hash[hash_base_index + 2] += c;
        hash[hash_base_index + 3] += d;
        hash[hash_base_index + 4] += e;
        hash[hash_base_index + 5] += f;
        hash[hash_base_index + 6] += g;
        hash[hash_base_index + 7] += h;
    }
    hash[hash_base_index] = swap_endianess32(hash[hash_base_index]);
    hash[hash_base_index + 1] = swap_endianess32(hash[hash_base_index + 1]);
    hash[hash_base_index + 2] = swap_endianess32(hash[hash_base_index + 2]);
    hash[hash_base_index + 3] = swap_endianess32(hash[hash_base_index + 3]);
    hash[hash_base_index + 4] = swap_endianess32(hash[hash_base_index + 4]);
    hash[hash_base_index + 5] = swap_endianess32(hash[hash_base_index + 5]);
    hash[hash_base_index + 6] = swap_endianess32(hash[hash_base_index + 6]);
    hash[hash_base_index + 7] = swap_endianess32(hash[hash_base_index + 7]);
}
