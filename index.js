import * as crypto from "crypto"

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
 * @property {bigint} N - Large safe prime.
 * @property {bigint} g - Generator.
 * @property {string} hash - Hash function.
 * @property {number | null} identityMaxLength - identity max length
 * @property {number | null} passwordMaxLength - password max length
 */


/** @type {Params} */
const defaultParams = {
    N_length_bits: 256,
    N: BigInt(`0x894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7`),
    g: BigInt(`0x7`),
    hash: `sha1`,
    identityMaxLength: 16,
    passwordMaxLength: 16
}


/** @type {{[K in 'trinitycore' | 'azerothcore']: Params}} */
export const params = {
    trinitycore: {
        ...defaultParams
    },
    azerothcore: {
        ...defaultParams
    }
}

/**
 * Computes (base ** exponent) % modulus using BigInts, without intermediate overflows.
 * @param {bigint} base - The base number.
 * @param {bigint} exponent - The exponent.
 * @param {bigint} modulus - The modulus.
 * @returns {bigint} - The result of (base ** exponent) % modulus.
 */
const modPow = (base, exponent, modulus) => {
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
const assertIsBuffer = (arg, argname = `arg`) => {
    assert_(Buffer.isBuffer(arg), `Type error: ${argname} must be a buffer`)
}

/**
 * Converts a little-endian buffer to a BigInt.
 * @param {Buffer} buf - Buffer in little-endian format.
 * @returns {bigint} - Resulting BigInt value.
 */
const toBigIntLE = (buf) => {
    assertIsBuffer(buf, `buf`)
    const hex = Buffer.from(buf).reverse().toString(`hex`) || `0`
    return BigInt(`0x${hex}`)
}

/**
 * Converts a BigInt to a little-endian buffer of a fixed length, padded with zero bytes,
 * like BigNumber::ToByteArray<32>() in the C++ core.
 * @param {bigint} value - The value to convert.
 * @param {number} length - The buffer length in bytes.
 * @returns {Buffer} - Little-endian buffer.
 */
const toBufferLE = (value, length) => {
    const hex = value.toString(16).padStart(length * 2, `0`)
    assert_(hex.length === length * 2, `value does not fit in ${length} bytes`)
    return Buffer.from(hex, `hex`).reverse()
}

/**
 * Uppercases only the basic Latin letters a-z, like Utf8ToUpperOnlyLatin() in the C++ core.
 * String.prototype.toUpperCase() would also change accented letters (é -> É, ß -> SS).
 * @param {string} str - The string to convert.
 * @returns {string} - The converted string.
 */
const toUpperOnlyLatin = (str) => str.replace(/[a-z]/g, (c) => c.toUpperCase())

/**
 * Computes the intermediate value x.
 * @param {Params} params - Group parameters.
 * @param {Buffer} salt - Salt.
 * @param {string} identity - User identity.
 * @param {string} password - User password.
 * @returns {BigInt} - Computed user secret.
 */
const getX = (params, salt, identity, password) => {
    assertIsBuffer(salt, `salt`)
    const hashIP = crypto.createHash(params.hash)
        .update(`${identity}:${password}`)
        .digest()
    const hashX = crypto.createHash(params.hash)
        .update(salt)
        .update(hashIP)
        .digest()
    return toBigIntLE(hashX)
}

/**
 * Computes the verifier.
 * @param {Params} params - Group parameters.
 * @param {Buffer} salt - Salt.
 * @param {string} identity - User identity.
 * @param {string} password - User password.
 * @returns {Buffer} - Computed verifier.
 */
export const computeVerifier = (params, salt, identity, password) => {
    if(identity.length > params?.identityMaxLength) {
        throw new RangeError(`The identity should have maximum ${params.identityMaxLength} characters`)
    }
    if(password.length > params?.passwordMaxLength) {
        throw new RangeError(`The password should have maximum ${params.passwordMaxLength} characters`)
    }
    const x = getX(params, salt, toUpperOnlyLatin(identity), toUpperOnlyLatin(password))
    const verifier = modPow(params.g, x, params.N)
    return toBufferLE(verifier, params.N_length_bits / 8)
}
