<template>
  <div>
    <h1>マッチングしました</h1>
    <h2>name: {{ matchedUser }}</h2>
    <NuxtLink to="/calling" class="button">通話する</NuxtLink>
    <NuxtLink to="/" class="button">トップへ戻る</NuxtLink>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [
        "サイトウさん",
        "Aさん",
        "Bさん"
      ],
      matchedUser: "",
    }
  },
  created() {
    this.matchedUser = this.selectRandomUser();
  },
  methods: {
    selectRandomUser: function(){
      let index = Math.floor(Math.random() * this.users.length)
      return this.users[index]
    }
  },
}
</script>

<style></style>
