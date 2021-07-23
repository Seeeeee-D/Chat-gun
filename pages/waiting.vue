<template>
  <div>
    <h1>待機中</h1>
    <NuxtLink to="/" class="button">トップへ戻る</NuxtLink>
  </div>
</template>

<script>
export default {
  // 渡されたパラメータをDBに登録する
  async asyncData({ params }) {
    return {};
  }
}
</script>

<style>
</style>