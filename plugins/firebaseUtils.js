import firebase from "@/plugins/firebase.js";
import Vue from "vue";
const db = firebase.firestore();


Vue.prototype.$createUser = async function createUser(id, name) {
  const random = Math.floor(Math.random() * 100)
  console.log(`random number is ${random}`);
  return await db.collection("users").doc(id).set({
    id: id,
    name: name,
    random: random,
    isMatched: false
  }).then(() => {
    console.log(`Document written with ID: ${id}`);
    return id;
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

Vue.prototype.$getMatchedUsers = async function getMatchedUsers(travelingTime) {
  const matchedUsers = [];
  await db
    .collection("users")
    .where("isMatched", "==", false)
    .limit(1)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((data) => {
        console.log("data", data)
        matchedUsers.push(data.data())
      });
      console.log(matchedUsers);
    })
    .catch(() => {
      alert("firestoreからのデータの取得でエラーが発生しました");
    });
  return matchedUsers;
}


Vue.prototype.$userListen = async function userListen(id) {
  var listenUser = "";
  await db
      .collection("users")
      .doc(id)
      .onSnapshot((doc) => {
        //一番最初の取得が表示される．
        //データに変更があるとここが走る
        console.log("Current data: ", doc.data());
      })
  return listenUser;
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

Vue.prototype.$updateUserIsMatch = async function updateUserIsMatch(docId) {
  await db
    .collection("users")
    .doc(docId)
    .update({
      isMatched: true
    })
    .then(() => {
      console.log("isMatched Update!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
  });
}

export default (context) => {
  context.$createUser = Vue.prototype.$createUser;
  context.$getRandomUser = Vue.prototype.$getRandomUser;
  context.$deleteUser = Vue.prototype.$deleteUser;
  context.$userListen = Vue.prototype.$userListen;
  context.$getMatchedUsers = Vue.prototype.$getMatchedUsers;
  context.$updateUserIsMatch = Vue.prototype.$updateUserIsMatch;
}
