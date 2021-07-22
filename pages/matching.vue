<template>
  <div>
    <h1>マッチングしました</h1>
    <h2>name: {{ matchedUser.name }}</h2>
    <NuxtLink to="/calling" class="button">通話する</NuxtLink>
    <NuxtLink to="/" class="button">トップへ戻る</NuxtLink>
  </div>
</template>

<script>
export default {
  async asyncData({ params, $getRandomUser }) {
    const randomUser = await $getRandomUser();
    return {
      matchedUser: randomUser
    };
  },
  data() {
  },
  async created() {
  },
  methods: {
  },
}
</script>

<style></style>
