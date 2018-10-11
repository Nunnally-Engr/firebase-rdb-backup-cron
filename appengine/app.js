const express = require('express')
const PubSub = require('@google-cloud/pubsub')

// GOOGLE_CLOUD_PROJECTを使用して新しいPubSubクライアントを作成する環境変数。
// これは自動的に正しい値に設定されます。
// AppEngineで実行しているときの値。
const pubsubClient = new PubSub({
  projectId: process.env.GOOGLE_CLOUD_PROJECT
})

const app = express()

// ===========================================
// PubSubメッセージ 実行
// （『/public/{some_topic}』へのリクエスト）
// ===========================================
app.get('/publish/:topic', async (req, res) => {

  const topic = req.params['topic']

  try {

    // Buffer設定（空だとエラーとなるため、適当な文字列を設定）
    const dataBuffer = Buffer.from('dataBuffer')
    
    // メッセージングサービス実行
    pubsubClient
    .topic(topic)
    .publisher()
    .publish(dataBuffer)
    .then(() => {
      // API呼出し
      res.status(200).send('Published to ' + topic).end()
    })
    .catch(err => {
      // エラー処理
      console.error('[pubsubClient]ERROR:', err)
    })

  } catch (e) {
      // エラー処理
      console.error('[500]ERROR:', err)
      res.status(500).send('' + e).end()
  }
})

// ===========================================
// インデックスページでは、アプリが動作しているかどうかを簡単に確認できます。
// ===========================================
app.get('/', (req, res) => {
    res.status(200).send('[functions-cron]: Hello, world!').end()
})

// ===========================================
// サーバーを起動する
// ===========================================
const PORT = process.env.PORT || 6060
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
  console.log('Press Ctrl+C to quit.')
})