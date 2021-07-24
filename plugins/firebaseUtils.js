import firebase from '@/plugins/firebase.js'
import Vue from 'vue'
const db = firebase.firestore()

Vue.prototype.$createUser = async function createUser(id, name, destination, travelingTime) {
  const random = Math.floor(Math.random() * 100)
  console.log(`random number is ${random}`)
  return await db
    .collection('users')
    .doc(id)
    .set({
      id: id,
      name: name,
      random: random,
      isMatched: false,
      destination: destination,
      travelingTime: travelingTime
    })
    .then(() => {
      console.log(`Document written with ID: ${id}`)
      return id
    })
    .catch((error) => {
      console.error(`Error adding document: ${error}`)
    })
}

Vue.prototype.$getRandomUser = async function getRandomUser(random) {
  let randomUser = ''
  await db
    .collection('users')
    .where('random', '>', random)
    .limit(1)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((data) => {
        randomUser = data.data()
      })
    })
    .catch(() => {
      alert('firestoreからのデータの取得でエラーが発生しました')
    })
  return randomUser
}

Vue.prototype.$getMatchedUsers = async function getMatchedUsers(travelingTime, destination) {
  const matchedUsers = []
  await db
    .collection('users')
    .where('isMatched', '==', false)
    .where('destination', '==', destination)
    .where('travelingTime', '==', travelingTime)
    .limit(1)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((data) => {
        console.log('data', data)
        matchedUsers.push(data.data())
      })
      console.log(matchedUsers)
    })
    .catch(() => {
      alert('firestoreからのデータの取得でエラーが発生しました')
    })
  return matchedUsers
}

Vue.prototype.$userListen = async function userListen(id) {
  var listenUser = ''
  await db
    .collection('users')
    .doc(id)
    .onSnapshot((doc) => {
      //一番最初の取得が表示される．
      //データに変更があるとここが走る
      console.log('Current data: ', doc.data())
    })
  return listenUser
}

Vue.prototype.$deleteUser = async function deleteUser(docId) {
  await db
    .collection('users')
    .doc(docId)
    .delete()
    .then(() => {
      console.log('Document successfully deleted!')
    })
    .catch((error) => {
      console.error('Error removing document: ', error)
    })
}

Vue.prototype.$updateUserIsMatch = async function updateUserIsMatch(docId) {
  await db
    .collection('users')
    .doc(docId)
    .update({
      isMatched: true
    })
    .then(() => {
      console.log('isMatched Update!')
    })
    .catch((error) => {
      console.error('Error removing document: ', error)
    })
}

Vue.prototype.$createDestination = async function createDestination(name, userId) {
  await db
    .collection('destinations')
    .doc(userId)
    .set({
      name: name,
      id: userId
    })
    .then(() => {
      console.log(`Destination created: ${name}`)
    })
    .catch((error) => {
      console.error('Error create destination: ', error)
    })
}

Vue.prototype.$getAllDestinations = async function getAllDestinations() {
  const allDestinations = []
  await db
    .collection('destinations')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((data) => {
        console.log('data', data)
        allDestinations.push(data.data())
      })
      console.log(allDestinations)
    })
    .catch(() => {
      alert('firestoreからのデータの取得でエラーが発生しました')
    })
  return allDestinations
}

export default (context) => {
  context.$createUser = Vue.prototype.$createUser
  context.$getRandomUser = Vue.prototype.$getRandomUser
  context.$deleteUser = Vue.prototype.$deleteUser
  context.$userListen = Vue.prototype.$userListen
  context.$getMatchedUsers = Vue.prototype.$getMatchedUsers
  context.$updateUserIsMatch = Vue.prototype.$updateUserIsMatch
  context.$createDestination = Vue.prototype.$createDestination
  context.$getAllDestinations = Vue.prototype.$getAllDestinations
}
