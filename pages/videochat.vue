<template>
  <div>
    <video @loadeddata="onLoadedData" :srcObject.prop="myStream" id="my-video" width='400px' autoplay muted playsinline></video>
    <p id="my-id">{{ peerId }}</p>

    <textarea id="their-id" v-model="theirId"></textarea>
    <button id="make-call" @click="makeCall">発信</button>
    <video @loadeddata="onLoadedData" :srcObject.prop="theirStream" id="their-video" width="400px" autoplay muted></video>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      // 自分の通話上のID
      peerId: "",

      // 相手のID
      theirId: "",

      // 自分のカメラ情報
      localStream: null,

      // Peerインスタンス用
      peer: null,

      // 通話をかける際に必要
      mediaConnection: null,

      // 自分のカメラ情報
      myStream: null,

      // 相手のカメラ情報
      theirStream: null,
    }
  },
  mounted() {
    let Peer;
    if (process.client) {
      Peer = require('skyway-js')
    }

    // ユーザーのカメラと音声情報を取得
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        this.myStream = stream
        this.localStream = stream;
      }).catch(error => {
        console.error(error);
        return;
      })

    // インスタンスの初期化
    this.peer = new Peer({
      key: process.env.NUXT_ENV_SKYWAY_KEY, //自身のAPIキー
      debug: 3,
    })

    // サーバーに接続できたときに発火
    this.peer.on('open', () => {
      this.peerId = this.peer.id;
    })
    // 通話がかかってきたときに発火する
    this.peer.on('call', mediaConnection => {
      mediaConnection.answer(this.localStream);
    })
  },
  methods: {
    // 通話の開始
    makeCall() {
      // 相手のIDと自分のカメラ情報を渡して通話開始
      this.mediaConnection = this.peer.call(this.theirId, this.localStream);
      // メディア情報を取得したときに発火
      this.mediaConnection.on('stream', stream => {
        this.theirStream = stream;
      })
    },
    // カメラ情報を取得できたら、描画。
    onLoadedData(event) {
      event.target.play();
    },
  },
}
</script>