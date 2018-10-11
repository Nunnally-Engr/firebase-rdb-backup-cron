const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// [GCP]ストレージ設定
const storage = admin.storage()

// 日付関連
const moment = require('moment-timezone')
// Timezoneを日本に設定
moment.tz.setDefault("Asia/Tokyo")

// [Firebase]database関連
const database = admin.database()


exports.backup = () => {

  // [Firebase]DB参照
  const ref = database.ref()

  // ファイル名生成用
  const filename = moment().format('YYYY_MM_DD_HH:mm:ss') + '.json'

  // [GCP]バケット設定
  const bucket = storage.bucket()
  const file = bucket.file('backup/' + filename)
  const stream = file.createWriteStream({
    gzip: true
  })

  ref.once('value')
  .then((snapshot) => {

    stream
    .on('error', (err) => {
      if (err) {
        console.error('stream: error')
        console.error(err)
      }
    })

    stream
    .on('finish', (err) => {

      console.log('stream: successfully finished.')

      if (err) {
        console.log('stream: err')
      }
      
    })

    //JSON.stringifyでjson stringに変換してからstreamに渡す
    stream.end(JSON.stringify(snapshot.val()))

    return 0

  })
  .catch((err) => {
    console.error(err)
  })

}
