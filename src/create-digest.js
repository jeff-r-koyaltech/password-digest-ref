import nonceFactory from 'nonce'
import crypto from 'crypto-browserify' // node-equivalent cyrpto lib

let nonceGen = nonceFactory()

// classic PasswordDigest-style protection
// sha256(number used once + secret + timestamp)
const genDigest = (sharedKey, nonce, timestamp) => {
  return crypto.createHash('sha256')
    .update(nonce).update(sharedKey).update(timestamp)
    .digest('hex')
}

const createDigest = (sharedKey, nonce = nonceGen().toString(), timestamp = new Date().toISOString()) => {
  return {
    sharedKey: sharedKey,

    nonce: nonce,

    timestamp: timestamp,

    digest: genDigest(sharedKey, nonce, timestamp),

    validateDigest: (candidate) => {
      let digestActual = genDigest(candidate.sharedKey, candidate.nonce, candidate.timestamp)
      return this.digest === digestActual
    }
  }
}

export default { createDigest }
