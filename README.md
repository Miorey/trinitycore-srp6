# TrinityCore / AzerothCore SRP6
This library is used to generate the SRP6 verifier for 
TrinityCore (3.3.5) / AzerothCore.

## Usage
To install \
`npm install trinitycore-srp6 --save` \

Generate verifier with default values:
```js
const { computeVerifier, params } = require(`trinitycore-srp6`)
const myTrinityVerifier = computeVerifier(
    params.trinitycore, 
    Buffer.from(salt), 
    username.toUpperCase(), 
    password.toUpperCase()
)
const myAzerothVerifier = computeVerifier(
    params.azerothcore,
    Buffer.from(salt),
    username.toUpperCase(),
    password.toUpperCase()
)
```

Generate verifier with custom values
```js

const BigInteger = require(`big-integer`)   
const myParam = {
        N_length_bits: 256,
        N: BigInt(`0x894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7`),
        g: BigInt(`0x7`),
        hash: `sha1`
    }
const myVerifier = computeVerifier(
    myParam, 
    Buffer.from(salt), 
    username.toUpperCase(), 
    password.toUpperCase()
)
```

