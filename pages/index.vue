<template>
  <div>
    <h1>Chat-gun</h1>
    <h3>1.ユーザー名を入力してください</h3>

    <input v-model="name" placeholder="名前を入力してください" class="input" />
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
