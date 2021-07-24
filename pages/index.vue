<template>
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <p class="title">Chat-gun</p>
        <p class="subtitle">サービスの説明とか</p>
      </div>
    </section>
    <div class="columns is-centered">
      <div class="column is-10">
        <div class="container is-max-desktop mt-5 mx-5">
          <div class="columns is-multiline">
            <div class="column is-12">
              <p class="title is-4">1. 相手に表示したい名前を入力してね！</p>
            </div>
            <div class="column is-12">
              <div class="field">
                <div class="control is-expanded">
                  <input v-model="userInputs.name" placeholder="名前を入力してください" class="input is-fullwidth" />
                </div>
              </div>
            </div>
            <div class="column is-12">
              <p class="title is-4">2. 通話の条件を入力してね！</p>
            </div>
            <!-- TODO: 条件ガワだけなので、登録とマッチ -->
            <div class="column is-12">
              <p class="title is-6">Q. 通話したい時間は？</p>
            </div>
            <div class="column is-11 ml-5">
              <div class="field">
                <label><input type="radio" v-model="userInputs.travelingTime" value="-1" />何分でも</label>
                <label><input type="radio" v-model="userInputs.travelingTime" value="15" checked />15分</label>
                <label><input type="radio" v-model="userInputs.travelingTime" value="30" />30分</label>
                <label><input type="radio" v-model="userInputs.travelingTime" value="60" />60分</label>
                <label><input type="radio" v-model="userInputs.travelingTime" value="1000" />それ以上</label>
              </div>
            </div>
            <div class="column is-12">
              <p class="title is-6">Q. 移動手段は？</p>
            </div>
            <div class="column is-12 ml-5">
              <div class="field">
                <label><input type="radio" v-model="userInputs.mobility" value="all" />なんでも</label>
                <label><input type="radio" v-model="userInputs.mobility" value="car" />車</label>
                <label><input type="radio" v-model="userInputs.mobility" value="bike" />バイク</label>
                <label><input type="radio" v-model="userInputs.mobility" value="bicycle" />自転車</label>
              </div>
            </div>
            <div class="column is-12">
              <p class="title is-6">Q. 目的地は？</p>
            </div>
            <div class="column is-12 ml-5">
              <div class="field">
                <label><input type="radio" v-model="isDest" :value="false" />どこでも</label>
                <label><input type="radio" v-model="isDest" :value="true" />一緒の人</label>
              </div>
            </div>
            <div v-show="isDest" class="column is-12">
              <div class="field">
                <div class="control is-expanded">
                  <!-- 
                  <input
                    v-model="userInputs.destination"
                    placeholder="自分の目的地を入れてね"
                    class="input is-fullwidth"
                  />
                   -->

                  <input
                    class="input"
                    v-model="userInputs.destination"
                    placeholder="目的地"
                    name="yourarea"
                    autocomplete="on"
                    list="suggestList"
                  />
                  <datalist id="suggestList">
                    <option v-for="(n, index) in suggestList" :key="n + index">
                      {{ n }}
                    </option>
                  </datalist>
                </div>
              </div>
            </div>
            <div class="column is-12">
              <p class="title is-4">3. ボタンを押して通話相手を見つけよう！</p>
            </div>

            <div class="column is-12">
              <NuxtLink :to="{ name: 'calling', params: { userInputs: this.userInputs } }" class="button is-primary"
                >通話相手を見つける</NuxtLink
              >
            </div>
          </div>
        </div>
        <div>
          <figure class="image flog">
            <img src="~/assets/calling_flog.png" />
          </figure>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDest: false,
      userInputs: {
        name: 'かえる',
        travelingTime: -1,
        mobility: 'all',
        destination: ''
      }
    }
  },
  async asyncData({ $getAllDestinations }) {
    const allDestinations = await $getAllDestinations()
    console.log(`Destination = ${allDestinations}`)
    const suggestList = []
    allDestinations.forEach((destination) => {
      if (!suggestList.includes(destination.name)) {
        suggestList.push(destination.name)
      }
    })
    return {
      suggestList: suggestList
    }
  },
  methods: {}
}
</script>

<style>
.flog {
  max-width: 120px;
  max-height: 120px;
  position: absolute;
  bottom: 200px;
  right: 10%;
}
</style>
