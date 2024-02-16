/** @type {Object<string, Params>} */
export const params: {
    [x: string]: Params;
}
export function computeVerifier(params: Params, salt: Buffer, identity: string, password: string): Buffer;
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
    N: bigint;
    /**
     * - Generator.
     */
    g: bigint;
    /**
     * - Hash function.
     */
    hash: string;
    /**
     * - identity max length
     */
    identityMaxLength: number | null;
    /**
     * - password max length
     */
    passwordMaxLength: number | null;
};
