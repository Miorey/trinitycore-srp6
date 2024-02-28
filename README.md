# TrinityCore / AzerothCore SRP6
This library is used to generate the SRP6 verifier for 
TrinityCore (3.3.5) / AzerothCore.

## Usage
To install
```bash
npm install trinitycore-srp6 --save
````

### Import
JS module import
```js
import { computeVerifier, params } from "trinitycore-srp6"
```

Common JS import
```js
const { computeVerifier, params } = await import(`trinitycore-srp6`)
```

To use Commons JS with `required` please use version `1.0.4`:
```js
const { computeVerifier, params } = require(`trinitycore-srp6`)
```

### Usage
Generate verifier with default values:
```js
import { computeVerifier, params } from "trinitycore-srp6"
const myTrinityVerifier = computeVerifier(
    params.trinitycore, 
    Buffer.from(salt), 
    username, 
    password
)
const myAzerothVerifier = computeVerifier(
    params.azerothcore,
    Buffer.from(salt),
    username,
    password
)
```

Generate verifier with custom params
```js
const janeDoeAccount =   {
    username: `janedoe`,
    password: `j@n3d0e`,
    salt: `25F5729D0D03D18F1528AF29F7CC83257081D8C4CA1772817C5CD36605BFB12F`,
}

const salt = Buffer.from(janeDoeAccount.salt, `hex`)
const myParam = {
    N_length_bits: 256,
    N: BigInt(`0x8A4B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7`),
    g: BigInt(`0x7`),
    hash: `sha1`
}

const myVerifier = computeVerifier(
    myParam,
    salt,
    janeDoeAccount.username,
    janeDoeAccount.password
)
const strVerifier = myVerifier.toString(`hex`).toUpperCase()
```
