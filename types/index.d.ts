/**
 * Parameters for cryptographic operations.
 */
export type Params = {
    /**
     * - Length of N in bits.
     */
    N_length_bits: number;
    /**
     * - Large safe prime.
     */
    N: BigInt;
    /**
     * - Generator.
     */
    g: BigInt;
    /**
     * - Hash function.
     */
    hash: string;
};
/**
 * Computes the verifier.
 * @param {Params} params - Group parameters.
 * @param {Buffer} salt - Salt.
 * @param {string} identity - User identity.
 * @param {string} password - User password.
 * @returns {Buffer} - Computed verifier.
 */
export function computeVerifier(params: Params, salt: Buffer, identity: string, password: string): Buffer;
/**
 * Parameters for cryptographic operations.
 * @typedef {Object} Params
 * @property {number} N_length_bits - Length of N in bits.
 * @property {BigInt} N - Large safe prime.
 * @property {BigInt} g - Generator.
 * @property {string} hash - Hash function.
 */
/** @type {Object<string, Params>} */
export const params: {
    [x: string]: Params;
};
