<template>
  <div>
    <h1>通話中...</h1>
    <button @click="finishCalling">通話終了</button>
  </div>
</template>

<script>
export default {
  async asyncData({ params }) {
    console.log(`Passed docId: ${params.docId}`);
    return {
      docId: params.docId,
    };
  },
  methods: {
    finishCalling: async function () {
      await this.$deleteUser(this.docId);
      // トップページに戻す処理
      this.$router.push("/");
    }
  }
}
</script>

<style></style>
