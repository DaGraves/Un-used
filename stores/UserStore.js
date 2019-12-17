import { observable, action } from "mobx"
import RootStore from "./RootStore"
import { AsyncStorage } from "react-native"
import firebase from 'firebase';
import db from '../config/firebase';
import * as ImageManipulator from 'expo-image-manipulator'
import uuid from 'uuid';
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
  async getCurrentUser(){
    try{
      this.signInForm.isLoadingSavedUser = true
      const auth = await firebase.auth()
      this.signInForm.isLoadingSavedUser = false
      this.user = auth.currentUser
      return await auth.currentUser;
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
      const resize = await ImageManipulator.manipulateAsync(image.uri, [], { format: 'jpeg', compress: 0.1 })

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)
        xhr.responseType = 'blob'
        xhr.open('GET', resize.uri, true)
        xhr.send(null)
      });
      const uploadTask = await firebase.storage().ref().child(uuid.v4()).put(blob)
      const downloadURL = await uploadTask.ref.getDownloadURL()
      this.signUpForm.photo = downloadURL
      return downloadURL
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
      this.signInForm.isLoading = false
      const currentUser = await this.getCurrentUser()
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
          photo: photoUrl,
          token: null,
          followers: [],
          following: []
        }
        db.collection('users').doc(response.user.uid).set(user)
        this.user = user
        this.signInForm.email = this.signUpForm.email
        this.signInForm.password = this.signUpForm.password
        console.log("here");
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
