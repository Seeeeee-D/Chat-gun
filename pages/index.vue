<template>
  <div>
    <h1>Chat-gun</h1>
    <button type="button" @click="buttonClicked">通話相手を見つける</button>
  </div>
</template>

<script>
export default {
  methods: {
    buttonClicked:function () {
      console.log("Calling...")
    }
  }
}
</script>

<style></style>
