const functions = require('firebase-functions')
const admin = require('firebase-admin')

const utils = require('./src/database/utils')

// データバック・アップ： 1時間に1回
exports.hourly_job = functions.pubsub
  .topic('hourly-tick')
  .onPublish((message) => {

    console.log("This job is run every hour!")

    // バック・アップ
    utils.backup()

    if (message.data) {
      const dataString = Buffer.from(message.data, 'base64').toString()
      console.log(`Message Data: ${dataString}`)
    }

    return true
  })
