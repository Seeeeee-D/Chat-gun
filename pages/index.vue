<template>
  <div>
    <h1>Chat-gun</h1>
    <h3>1.ユーザー名を入力してください</h3>

    <input v-model="userInputs.name" placeholder="名前を入力してください" class="input" /><br />

    <label><input type="radio" v-model="userInputs.travelingTime" value="15" checked />15分</label>
    <label><input type="radio" v-model="userInputs.travelingTime" value="30" />30分</label>
    <label><input type="radio" v-model="userInputs.travelingTime" value="60" />60分</label>
    <label><input type="radio" v-model="userInputs.travelingTime" value="1000" />それ以上</label><br />

    <h3>2.その後，通話相手を見つけるボタンを押してください</h3>
    <NuxtLink :to="{ name: 'calling', params: { userInputs: this.userInputs } }" class="button"
      >通話相手を見つける</NuxtLink
    >

    <button @click="listen">listen</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInputs: {
        name: '',
        travelingTime: 15
      }
    }
  },
  methods: {
    async listen() {
      await this.$userListen()
    }
  }
}
</script>

<style></style>
