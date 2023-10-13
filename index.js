const bigintBuffer = require(`bigint-buffer`)
const crypto = require(`crypto`)

/**
 * Throws an error if the condition is not met.
 * @param {boolean} val - The condition to check.
 * @param {string} [msg='assertion'] - The error message.
 */
function assert_ (val, msg = `assertion`) {
    if (!val) { throw new Error(msg) }
}

/**
 * Parameters for cryptographic operations.
 * @typedef {Object} Params
 * @property {number} N_length_bits - Length of N in bits.
 * @property {BigInt} N - Large safe prime.
 * @property {BigInt} g - Generator.
 * @property {string} hash - Hash function.
 */

/** @type {Object<string, Params>} */
const params = {
    trinitycore: {
        N_length_bits: 256,
        N: BigInt(`0x894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7`),
        g: BigInt(`0x7`),
        hash: `sha1`
    },
    azerothcore: {
        N_length_bits: 256,
        N: BigInt(`0x894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7`),
        g: BigInt(`0x7`),
        hash: `sha1`
    }
}

/**
 * Computes (base ** exponent) % modulus using BigInts, without intermediate overflows.
 * @param {BigInt} base - The base number.
 * @param {BigInt} exponent - The exponent.
 * @param {BigInt} modulus - The modulus.
 * @returns {BigInt} - The result of (base ** exponent) % modulus.
 */
function modPow(base, exponent, modulus) {
    let result = BigInt(1)
    base = base % modulus

    while (exponent > 0) {
        if (exponent % 2n === 1n) {  // If the exponent is odd
            result = (result * base) % modulus
        }
        exponent = exponent >> 1n  // Divide the exponent by 2
        base = (base * base) % modulus
    }
    return result
}


/**
 * Asserts that the argument is a buffer.
 * @param {Buffer} arg - The argument to check.
 * @param {string} [argname='arg'] - Name of the argument.
 */
function assertIsBuffer (arg, argname = `arg`) {
    assert_(Buffer.isBuffer(arg), `Type error: ${argname} must be a buffer`)
}

/**
 * Computes the intermediate value x.
 * @param {Params} params - Group parameters.
 * @param {Buffer} salt - Salt.
 * @param {string} identity - User identity.
 * @param {string} password - User password.
 * @returns {BigInt} - Computed user secret.
 */
function getX (params, salt, identity, password) {
    assertIsBuffer(salt, `salt`)
    const hashIP = crypto.createHash(params.hash)
        .update(`${identity}:${password}`)
        .digest()
    const hashX = crypto.createHash(params.hash)
        .update(salt)
        .update(hashIP)
        .digest()
    return bigintBuffer.toBigIntLE(hashX)
}

/**
 * Computes the verifier.
 * @param {Params} params - Group parameters.
 * @param {Buffer} salt - Salt.
 * @param {string} identity - User identity.
 * @param {string} password - User password.
 * @returns {Buffer} - Computed verifier.
 */
function computeVerifier (params, salt, identity, password) {
    const x = getX(params, salt, identity, password)
    const g = params.g
    const N = params.N
    const verifier = modPow(g, x, N)
    const lEVerifier = verifier.toString(16).match(/.{2}/g).reverse().join(``)
    return Buffer.from(lEVerifier, `hex`)
}

module.exports = {
    computeVerifier,
    params
}
