import createDigest from './create-digest'

const checkTimeStampFreshness = (timestamp) => {
  const tsDate = new Date(timestamp);
  const dateNow = new Date();
  const nowEpochSeconds = tsDate.getTime() / 1000;
  const tsEpochSeconds = dateNow.getTime() / 1000;
  
  const diff = nowEpochSeconds - tsEpochSeconds;

  const freshness = 604800; //1 week worth of seconds
  return diff < freshness; // todo - check for a freshness interval (24 hours? 1 week? 1 hour?)
}

const useAuth = (app) => {
  /*
  For testing purposes, you can use these values to pass in Postman:
  x-dig: 6150fd24ef47ab6afe28f5b5d4743ea98441edbd02f9c42191a22eee3b29c33e
  x-dig-nonce: 1
  x-dig-timestamp: 2
  */
  let sharedKey = process.env.SHARED_KEY || 'test'
  console.log(sharedKey)
  app.use((req, res, next) => {
    try {
      let method = req.method
      if (method === 'OPTIONS') {
        next()
        return
      }

      let digest = req.headers['x-dig']
      let nonce = req.headers['x-dig-nonce']
      let timestamp = req.headers['x-dig-timestamp']
      if (!digest || !nonce || !timestamp) {
        res.sendStatus(400, 'missing authorization header(s)')
      }
      let digestObj = createDigest.createDigest(sharedKey, nonce, timestamp)

      if (
          (digestObj.digest !== digest) &&
          (!checkTimeStampFreshness(timestamp))
          ) {
        res.sendStatus(401)
      } else {
        next()
        return
      }
    } catch (error) {
      res.sendStatus(401)
    }
  })
}

export default { useAuth }
