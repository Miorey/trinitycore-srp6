/*jshint esversion: 6 */
/* eslint-env node */
"use strict"

const crypto = require(`crypto`)
const { computeVerifier, params }  = require(`../index`)

/**
 * Created by clem on 4/4/17.
 */
'use strict'

describe("test verifier", function() {

    it("Test verifier generate from salt", function() {
        crypto.randomBytes(32, (err, buf) => {
            if (err) throw err
            computeVerifier(params.trinitycore, buf, `tic`, `tac`);
        })
    })

})