import { observable, action } from "mobx"
import RootStore from "./RootStore"
import { AsyncStorage } from "react-native"
import firebase from 'firebase';
import db from '../config/firebase';
import uuid from 'uuid';
import ImageUpload from "../utils/ImageUpload"

class UserStore extends RootStore {

  @observable signInForm = {
    email:"",
    password:"",
    isLoading:false,
    isLoadingSavedUser:true
  }

  @observable signUpForm = {
    email:"",
    password:"",
    username:"",
    bio:"",
    photo:"",
    isLoading:false
  }

  @observable selectedUser = {
    uid: "",
    email: "",
    username: "",
    bio: "",
    photo: '',
    token: null,
    followers: [],
    following: []
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
      return res
    }catch(e){
      console.log(e);
      return e
    }
  }

  @action
  async getCurrentUser(){
    try{
      this.signInForm.isLoadingSavedUser = true
      const auth = await firebase.auth()
      this.signInForm.isLoadingSavedUser = false

      const user = await this.getUser(auth.currentUser.uid)
      this.user = user
      return await user;
    }catch(e){
      console.log(e);
      return;
    }

  }

  @action
  async logout(){
    try{
      const res = firebase.auth().signOut()
      console.log(res);
      return res
    }catch(e){
      console.log(e);
      return e
    }
  }

  @action
  async uploadPhoto(image){
    try {

      const imageUrl = await ImageUpload(image.uri,{ format: 'jpeg', compress: 0.4 })
      this.signUpForm.photo = imageUrl
      return imageUrl
    } catch(e) {
      let message = e
      if(e.message){
        message = e.message
      }
      console.log(message)
      alert(message)
    }
  }

  @action
  async login(){
    try {
      this.signInForm.isLoading = true
      const { email, password } = this.signInForm
      const response = await firebase.auth().signInWithEmailAndPassword(email, password)
      const currentUser = await this.getCurrentUser()
      this.signInForm.isLoading = false
      return response
    } catch (e) {
      alert(e)
      this.signInForm.isLoading = false
    }
  }

  @action
  async getUser(uid, type){
    try {
      const userQuery = await db.collection('users').doc(uid).get()
      let user = userQuery.data()

      let posts = []
      const postsQuery = await db.collection('posts').where('uid', '==', uid).get()
      postsQuery.forEach(function(response) {
        posts.push(response.data())
      })
      return user
    } catch (e) {
      alert(e)
    }
  }

  @action
  async register() {
    try {
      if(this.signUpForm.isLoading){
        return;
      }
      const { email, password, username, bio } = this.signUpForm
      this.signUpForm.isLoading = true
      const response = await firebase.auth().createUserWithEmailAndPassword(email, password)
      if(response.user.uid) {
        let photoUrl = ""
        if(this.signUpForm.photo){
          photoUrl = await this.uploadPhoto(this.signUpForm.photo)
        }
        const user = {
          uid: response.user.uid,
          email: response.user.email,
          username: this.signUpForm.username,
          bio: this.signUpForm.bio,
          photoUrl: photoUrl,
          token: null,
          followers: [],
          following: []
        }
        db.collection('users').doc(response.user.uid).set(user)
        this.user = user
        this.signInForm.email = this.signUpForm.email
        this.signInForm.password = this.signUpForm.password
        const resLogin = await this.login()
        this.signUpForm.isLoading = false

        return resLogin
      }
    } catch (e) {
      this.signUpForm.isLoading = false
      alert(e)
      console.log(e);

    }
  }


}
export default UserStore
