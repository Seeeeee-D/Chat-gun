import firebase from "@/plugins/firebase.js";
import Vue from "vue";
const db = firebase.firestore();


Vue.prototype.$createUser = async function createUser(name) {
  let refId = await db.collection("users").doc().id;
  const random = Math.floor(Math.random() * 100)
  console.log(`random number is ${random}`);
  return await db.collection("users").doc(refId).set({
    id: refId,
    name: this.name,
    random: random,
  }).then(() => {
    console.log(`Document written with ID: ${refId}`);
    this.name = "";
    alert("success!")
  })
  .catch((error) => {
    console.error(`Error adding document: ${error}`);
  });
}

Vue.prototype.$getRandomUser = async function getRandomUser(random) {
  let randomUser = "";
  await db
      .collection("users")
      .where("random", ">", random)
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
  context.$createUser = Vue.prototype.$createUser;
  context.$getRandomUser = Vue.prototype.$getRandomUser;
}
