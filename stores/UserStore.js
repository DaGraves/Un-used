import { observable, action } from "mobx"
import RootStore from "./RootStore"
import { AsyncStorage } from "react-native"
import firebase from 'firebase';
import db from '../config/firebase';
import {
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID
} from 'react-native-dotenv'
class UserStore extends RootStore {

  @observable signInForm = {
    email:"",
    password:"",
    isLoading:false
  }

  @observable signUpForm = {
    email:"",
    password:"",
    username:"",
    bio:"",
    isLoading:false
  }

  @observable user = {
    uid: "",
    email: "",
    username: "",
    bio: "",
    photo: '',
    token: null,
    followers: [],
    following: []
  }

  @action
  async testHttp(){
    try{
      const res = await this.fetchRequest("http://example.com",{id:123},{method:"GET"})
      console.log(res);
      return res
    }catch(e){
      console.log(e);
      return e
    }
  }

  @action
  async login(){
    try {
      this.signInForm.isLoading = true
      const { email, password } = this.signInForm
      const response = await firebase.auth().signInWithEmailAndPassword(email, password)
      console.log(response);
      this.signInForm.isLoading = false
      return response
    } catch (e) {
      alert(e)
      this.signInForm.isLoading = false
    }
  }

  @action
  async getUser(uid, type) => {
    try {
      const userQuery = await db.collection('users').doc(uid).get()
      let user = userQuery.data()

      let posts = []
      const postsQuery = await db.collection('posts').where('uid', '===', uid).get()
      postsQuery.forEach(function(response) {
        posts.push(response.data())
      })
      user.posts = orderBy(posts, 'date','desc')
      return user
    } catch (e) {
      alert(e)
    }
  }

  @action
  async register() {
    try {
      const { email, password, username, bio } = getState().user
      const response = await firebase.auth().createUserWithEmailAndPassword(email, password)
      if(response.user.uid) {
        const user = {
          uid: response.user.uid,
          email: response.user.email,
          username: response.user.username,
          bio: response.user.bio,
          photo: '',
          token: null,
          followers: [],
          following: []
        }
        db.collection('users').doc(response.user.uid).set(user)
      }
    } catch (e) {
      alert(e)
    }
  }


}
export default UserStore
