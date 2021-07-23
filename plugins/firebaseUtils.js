import Vue from "vue";
import firebase from "@/plugins/firebase.js";
const db = firebase.firestore();


Vue.prototype.$createUser = async function createUser(name) {
  const random = Math.floor(Math.random() * 100)
  console.log(`random number is ${random}`);
  const docId = await db
    .collection("users")
    .add({
      name: this.name,
      random: random
    }).then((docRef) => {
      console.log(`Document written with ID: ${docRef.id}`);
      return docRef.id;
    })
    .catch((error) => {
      console.error(`Error adding document: ${error}`);
    });
  return docId;
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

Vue.prototype.$deleteUser = async function deleteUser(docId) {
  await db
    .collection("users")
    .doc(docId)
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
  });
}

export default (context) => {
  context.$createUser = Vue.prototype.$createUser;
  context.$getRandomUser = Vue.prototype.$getRandomUser;
  context.$deleteUser = Vue.prototype.$deleteUser;
}
