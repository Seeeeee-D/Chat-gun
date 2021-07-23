<template>
  <div class="p2p">
    <h2>通話画面</h2>
    <div id="me">
      <h3>あなたの設定</h3>
      <video id="my-video" width="400px" autoplay muted playsinline :srcObject.prop="stream" v-if="stream" />
      <!-- 接続オプション -->
      <div>
        <label>Video</label>
        <select v-model="selectedVideo" @change="resetVideo" v-if="videos.length > 0">
          <option :value="null" selected>なし</option>
          <option :value="video.deviceId" v-for="(video, i) in videos" :key="i">{{ video.label }}</option>
        </select>
      </div>
      <div>
        <label>Audio</label>
        <select v-model="selectedAudio" @change="resetVideo" v-if="audios.length > 0">
          <option :value="null" selected>なし</option>
          <option :value="audio.deviceId" v-for="(audio, i) in audios" :key="i">{{ audio.label }}</option>
        </select>
      </div>
      <!-- ミュート -->
      <div>
        <div>
          <label><input type="checkbox" v-model="mute.local.video" @change="muteMedia" />Video を Off</label>
        </div>
        <div>
          <label><input type="checkbox" v-model="mute.local.audio" @change="muteMedia" />Audio を Off</label>
        </div>
      </div>
      <p>My Peer ID: {{ srcId }}</p>
      <p>My dest ID: {{ matchedUser.id }}</p>
    </div>
    <div id="dest">
      <div>
        <button id="make-call" @click="callAndConnect" v-if="!mediaConnection">発信</button>
        <button id="close" @click="close" v-if="mediaConnection">切断</button>
      </div>
      <h3>電話相手</h3>
      <video id="dest-video" width="400px" autoplay playsinline :srcObject.prop="remoteStream" v-if="remoteStream" />
      <!-- ミュート -->
      <div v-if="remoteStream">
        <div>
          <label><input type="checkbox" v-model="mute.remote.video" @change="muteMedia" />Video を Off</label>
        </div>
        <div>
          <label><input type="checkbox" v-model="mute.remote.audio" @change="muteMedia" />Audio を Off</label>
        </div>
      </div>
    </div>
    <div>
      <h1>通話中...</h1>
      <button @click="finishCalling">通話終了</button>
    </div>
    <div id="messages">
      <div v-if="dataConnection">
        <label>Message</label>
        <input type="text" v-model="message" />
        <button @click="sendMessage">送信</button>
      </div>
      <pre>
      <template v-for="msg in messages">
        {{ msg }}
      </template>
    </pre>
    </div>
  </div>
</template>

<script>
import Peer from 'skyway-js'
const API_KEY = process.env.NUXT_ENV_SKYWAY_KEY || ''
export default {
  name: 'P2P',
  components: {},
  async asyncData({ params }) {
    console.log(`Passed userInputs: ${JSON.stringify(params.userInputs)}`)
    return {
      user: params.userInputs,
      docId: 'hoge',
      matchedUser: 'fuga'
    }
  },
  data() {
    return {
      peer: null,
      videos: [],
      audios: [],
      selectedVideo: null,
      selectedAudio: null,
      stream: null,
      remoteStream: null,
      mute: {
        local: { video: false, audio: false },
        remote: { video: false, audio: false }
      },
      srcId: null,
      destId: null,
      mediaConnection: null,
      dataConnection: null,
      message: '',
      messages: [],
      matchedUser: {}
    }
  },
  async created() {
    const devices = (await navigator?.mediaDevices?.enumerateDevices()) || []
    this.videos = devices.filter((device) => device.kind === 'videoinput')
    this.audios = devices.filter((device) => device.kind === 'audioinput')
  },
  async mounted() {
    this.initVideo()
    await this.initPeer()
    let matchedUsers = await this.$getMatchedUsers()
    if (matchedUsers.length > 0) {
      // 1人でも条件に合うユーザが見つかる
      console.log(`Matched: ${JSON.stringify(matchedUsers)}`)
      // TODO: いっぱいいるmatchedUsersからランダムに一人えらぶ
      this.matchedUser = matchedUsers[0]
      console.log(`MatchedUser: ${JSON.stringify(this.matchedUser)}`)
    } else {
      console.log(`this.srcId: ${this.srcId}`)
    }
  },
  beforeDestroy() {
    this.$deleteUser(this.srcId)
  },
  watch: {
    srcId: function (val) {
      if (val != null) {
        this.$createUser(val, this.user.name)
        console.log(`this.srcId: ${this.srcId}`)
      }
    }
  },
  methods: {
    async initVideo() {
      const constraints = {
        video: this.selectedVideo ? { deviceId: { exact: this.selectedVideo } } : false,
        audio: this.selectedAudio ? { deviceId: { exact: this.selectedAudio } } : false
      }
      try {
        this.stream = await navigator?.mediaDevices?.getUserMedia(constraints)
      } catch (error) {
        console.error('mediaDevice.getUserMedia() error:', error)
        this.stream = null
        return
      }
      if (!this.stream) {
        console.error('mediaDevice.getUserMedia() failed:')
        return
      }
    },
    closeVideo() {
      if (!this.stream) {
        console.log('no opening stream')
        return
      }
      const videoElm = document.getElementById('my-video')
      if (videoElm?.srcObject) {
        videoElm.srcObject.getTracks()?.forEach((track) => track.stop())
        videoElm.srcObject = null
        console.log('video stopped')
      }
      this.stream = null
    },
    async resetVideo() {
      if (this.mediaConnection) {
        await this.initVideo()
        this.replaceStream()
      } else {
        this.closeVideo()
        this.initVideo()
      }
    },
    async initPeer() {
      this.peer = new Peer({
        key: API_KEY,
        debug: 3
      })
      // https://webrtc.ecl.ntt.com/api-reference/javascript.html#event-open
      this.peer.on('open', () => {
        this.srcId = this.peer.id
      })
      // https://webrtc.ecl.ntt.com/api-reference/javascript.html#event-call
      this.peer.on('call', (mediaConnection) => {
        console.log({ msg: '着信', mediaConnection })
        // https://webrtc.ecl.ntt.com/api-reference/javascript.html#answer-stream-options
        this.mediaConnection = mediaConnection
        this.mediaConnection.answer(this.stream)
        this.setEventListenerToMediaConnection()
        this.destId = mediaConnection.remoteId
      })
      // https://webrtc.ecl.ntt.com/api-reference/javascript.html#event-call
      this.peer.on('connection', (dataConnection) => {
        console.log({ msg: '接続', dataConnection })
        // https://webrtc.ecl.ntt.com/api-reference/javascript.html#answer-stream-options
        this.dataConnection = dataConnection
        this.setEventListenerToDataConnection()
        this.destId = dataConnection.remoteId
      })
      // https://webrtc.ecl.ntt.com/api-reference/javascript.html#event-error
      this.peer.on('error', (err) => {
        console.error({ err, msg: 'error' })
        alert(err.message)
      })
      // https://webrtc.ecl.ntt.com/api-reference/javascript.html#event-close
      this.peer.on('close', () => {
        this.mediaConnection = null
        console.log({ msg: '通信が切断しました。' })
        alert('通信が切断しました。')
      })
    },
    callAndConnect() {
      this.destId = this.matchedUser.id
      if (!this.destId || !this.peer?.open) {
        return
      }
      this.$updateUserIsMatch(this.srcId)
      this.$updateUserIsMatch(this.matchedUser.id)
      console.log({ msg: '発信' })
      // MediaConnection(動画/音声) の確立
      // https://webrtc.ecl.ntt.com/api-reference/javascript.html#call-peerid-stream-options
      this.mediaConnection = this.peer.call(this.destId, this.stream)
      this.setEventListenerToMediaConnection()
      // DataConnection(テキストメッセージなど) の確立
      // https://webrtc.ecl.ntt.com/api-reference/javascript.html#connect-peerid-options
      this.dataConnection = this.peer.connect(this.destId)
      this.setEventListenerToDataConnection()
    },
    replaceStream() {
      // https://webrtc.ecl.ntt.com/api-reference/javascript.html#replacestream-stream
      this.mediaConnection?.replaceStream(this.stream)
    },
    // https://webrtc.ecl.ntt.com/api-reference/javascript.html#mediastream%E3%82%92%E3%83%9F%E3%83%A5%E3%83%BC%E3%83%88%E3%81%99%E3%82%8B
    muteMedia() {
      if (this.stream) {
        this.stream?.getVideoTracks()?.forEach((track) => (track.enabled = !this.mute.local.video))
        this.stream?.getAudioTracks()?.forEach((track) => (track.enabled = !this.mute.local.audio))
      }
      if (this.remoteStream) {
        this.remoteStream?.getVideoTracks()?.forEach((track) => (track.enabled = !this.mute.remote.video))
        this.remoteStream?.getAudioTracks()?.forEach((track) => (track.enabled = !this.mute.remote.audio))
      }
    },
    sendMessage() {
      if (!this.dataConnection || !this.message) {
        return
      }
      this.dataConnection.send(this.message)
      this.messages.push(`${new Date()}: ${this.message} from ${this.peer.id}`)
    },
    setEventListenerToMediaConnection() {
      const videoElm = document.getElementById('dest-video')
      // https://webrtc.ecl.ntt.com/api-reference/javascript.html#event-stream
      this.mediaConnection.on('stream', (stream) => {
        // video要素にカメラ映像をセットして再生
        console.log({ on: 'rcv stream', stream })
        this.remoteStream = stream
      })
      // https://webrtc.ecl.ntt.com/api-reference/javascript.html#event-close-2
      this.mediaConnection.once('close', () => {
        if (videoElm?.srcObject) {
          videoElm.srcObject?.getTracks()?.forEach((track) => track.stop())
          videoElm.srcObject = null
        }
        this.mediaConnection = null
        this.remoteStream = null
      })
    },
    setEventListenerToDataConnection() {
      // https://webrtc.ecl.ntt.com/api-reference/javascript.html#event-open-2
      this.dataConnection.on('open', () => {
        console.log({ on: 'data connection opened' })
      })
      // https://webrtc.ecl.ntt.com/api-reference/javascript.html#event-data
      this.dataConnection.on('data', (data) => {
        console.log({ on: 'data received', data })
        this.messages.push(`${new Date()}: ${data} from ${this.destId}`)
      })
      // https://webrtc.ecl.ntt.com/api-reference/javascript.html#event-close-3
      this.dataConnection.on('close', () => {
        console.log({ on: 'data connection closed' })
        this.dataConnection = null
      })
      // https://webrtc.ecl.ntt.com/api-reference/javascript.html#event-error-2
      this.dataConnection.on('error', () => {
        console.log({ on: 'error on data connection' })
      })
    },
    close() {
      // https://webrtc.ecl.ntt.com/api-reference/javascript.html#close-forceclose
      this.mediaConnection?.close(true)
      this.mediaConnection = null
      this.remoteStream = null
      // https://webrtc.ecl.ntt.com/api-reference/javascript.html#close-forceclose-2
      this.dataConnection?.close(true)
      this.dataConnection = null
    },
    finishCalling: async function () {
      await this.$deleteUser(this.srcId)
      // トップページに戻す処理
      this.$router.push('/')
    }
  }
}
</script>
