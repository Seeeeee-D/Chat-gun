<template>
  <div>
    <h1>マッチングしました</h1>
    <h2>name: {{ matchedUser.name }}</h2>
    <NuxtLink :to="{ name: 'calling', params: { docId: this.docId } }" class="button">通話する</NuxtLink>
    <h2>id: {{ matchedUser.id }}</h2>
    <NuxtLink to="/" class="button">トップへ戻る</NuxtLink>
  </div>
</template>

<script>
export default {
  async asyncData({ params, $getRandomUser }) {
    const randomNum = Math.floor(Math.random() * 100)
    const randomUser = await $getRandomUser(randomNum)
    console.log(`randomNum: ${randomNum}`)
    console.log(`randomUser: ${JSON.stringify(randomUser)}`)
    console.log(`params.docId: ${params.docId}`)
    return {
      docId: params.docId,
      matchedUser: randomUser
    }
  }
}
</script>

<style></style>
