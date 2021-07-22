import Vue from "vue";
import firebase from "@/plugins/firebase.js";
const db = firebase.firestore();

Vue.prototype.$getRandomUser = async function getRandomUser() {
  // randomは80~90の値
  let random = Math.floor(Math.random() * 90)
  if (random < 80) {
    random = 80
  }
  // firestoreのデータ，usersのdocument達のrandomは0~100の値が入っている．
  let randomUser = "";
  await db
      .collection("users")
      .where("random", ">" , random)
      .limit(1)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((data) => {
          randomUser = data.data();
        });
      })
      .catch(() => {
        alert("firestoreからのデータの取得でエラーが発生しました");
      });
  return randomUser;
}

export default (context) => {
  context.$getRandomUser = Vue.prototype.$getRandomUser;
}
