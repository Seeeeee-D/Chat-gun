<template>
  <div>
    <h1>Chat-gun</h1>
    <h3>1.ユーザー名を入力してください</h3>

    <input v-model="name" placeholder="名前を入力してください" class="input" />
    <button @click="createUser">登録</button>

    <h3>2.その後，通話相手を見つけるボタンを押してください</h3>
    <NuxtLink to="/matching" class="button">通話相手を見つける</NuxtLink>
  </div>
</template>

<script>
import firebase from "@/plugins/firebase.js";
const db = firebase.firestore();

export default {
  data () {
    return {
      name: ""
    }
  },
  methods: {
    async createUser(){
        //ユーザーデータを登録
      let random = Math.floor(Math.random() * 100)
      console.log("random is" + random)
      const write = await db.collection("users").add({
        name: this.name,
        random: random
      }).then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        this.name = ""
        alert("success!")
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  },
  }
}
</script>

<style></style>
