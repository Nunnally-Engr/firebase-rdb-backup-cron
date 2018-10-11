const functions = require('firebase-functions')

const backup = require('./src/cron/backup')

// データバック・アップ
exports.dataBackupAll = functions.pubsub
  .topic('data-backup-all')
  .onPublish((message) => {

    console.log("This job is run !")

    // バック・アップ
    backup.backup()

    if (message.data) {
      const dataString = Buffer.from(message.data, 'base64').toString()
      console.log(`Message Data: ${dataString}`)
    }

    return true
  })
