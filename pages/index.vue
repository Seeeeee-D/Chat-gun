<template>
  <div>
    <h1>Chat-gun</h1>
    <h3>1.ユーザー名を入力してください</h3>

    <input v-model="name" placeholder="名前を入力してください" class="input" />

    <label><input type="radio" v-model="travelingTime" value="15" checked />15分</label>
    <label><input type="radio" v-model="travelingTime" value="30" />30分</label>
    <label><input type="radio" v-model="travelingTime" value="60" />60分</label>
    <label><input type="radio" v-model="travelingTime" value="1000" />それ以上</label><br />

    <button @click="createUser">登録</button>

    <h3>2.その後，通話相手を見つけるボタンを押してください</h3>
    <NuxtLink :to="{name: 'matching', params: { docId: this.docId } }" class="button">通話相手を見つける</NuxtLink>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: "",
      docId: "",
      travelingTime: 15
    }
  },
  methods: {
    async createUser(){
      let docId = await this.$createUser(this.name);
      this.docId = docId;
    },
  }
}
</script>

<style></style>
