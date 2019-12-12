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

  @observable teste = 0
  @observable signInForm = {
    email:"",
    password:""
  }

  @observable signUpForm = {
    email:"",
    password:""
  }

  @action
  async testeFunc(){
    try{
      const res = await this.fetchRequest("http://example.com",{yes:true},{method:"GET"})
      console.log(res);
      return res
    }catch(e){
      console.log(e);
      return e
    }
  }

  @action
  async login(){
    return async (dispatch, getState) => {
      try {
        const { email, password } = this.signInForm
        const response = await firebase.auth().signInWithEmailAndPassword(email, password)
        console.log(response);

        return response
      } catch (e) {
        alert(e)
      }
    }
  }

}
export default UserStore
