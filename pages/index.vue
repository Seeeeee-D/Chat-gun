<template>
  <div>
    <h1>Chat-gun</h1>
    <h3>1.ユーザー名を入力してください</h3>

    <input v-model="user.name" placeholder="名前を入力してください" class="input" /><br />

    <label><input type="radio" v-model="user.travelingTime" value="15" checked />15分</label>
    <label><input type="radio" v-model="user.travelingTime" value="30" />30分</label>
    <label><input type="radio" v-model="user.travelingTime" value="60" />60分</label>
    <label><input type="radio" v-model="user.travelingTime" value="1000" />それ以上</label><br />

    <h3>2.その後，通話相手を見つけるボタンを押してください</h3>
    <NuxtLink :to="{ name: 'calling', params: user }" class="button">通話相手を見つける</NuxtLink>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: '',
        travelingTime: 15,
        docId: 'hoge',
        matchedUser: 'fuga'
      }
    }
  }
}
</script>

<style></style>
