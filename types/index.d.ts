/**
 *
 * @param {{}} params (obj) group parameters, with .N, .g, .hash
 * @param {Buffer} salt
 * @param {string} identity
 * @param {string} password
 * @return {Buffer}
 * The verifier is calculated as described in Section 3 of [SRP-RFC].
 * We give the algorithm here for convenience.
 *
 * The verifier (v) is little endian computed based on the salt (s), user name (I),
 * password (P), and group parameters (N, g).
 *
 *         x = LE(H(s | H(user | ":" | pass)))
 *         v = LE(g^x % N)
 *
 * params:
 *         params (obj)     group parameters, with .N, .g, .hash
 *         salt (buffer)        salt
 *         identity (string)    user identity
 *         identity (string)    user password
 *         LE                   little endian
 *
 */
export function computeVerifier(params: {}, salt: Buffer, identity: string, password: string): Buffer;
export namespace params {
    namespace trinitycore {
        const N_length_bits: number;
        const N: bigint;
        const g: bigint;
        const hash: string;
    }
}
