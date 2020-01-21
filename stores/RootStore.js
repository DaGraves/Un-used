import { observable, action, computed } from 'mobx';
import axios from "axios"
import { AsyncStorage } from "react-native"
export default class RootStore {
  @observable token = ""
  basePath = () => {
    return "/";
  }

  loadJWT = async () => {
    if (this.token) {
      return this.token
    }
    try{
      const token = AsyncStorage.getItem('token')
      this.token = token
      return token
    }catch(e){
      console.log(e);
      return;
    }
  }

  getJWT = () => {
    console.log("Bearer " + RootStore.this)
    if (this.token) {
      return "Bearer " + RootStore.this
    }
    console.log("No auth token found")
    return null
  }

  saveAuthToken = (token) => {
    this.token = token
    AsyncStorage.setItem('token', token)
  }

  destroyAuthToken = () => {
    RootStore.token = null
    AsyncStorage.removeItem('token')
  }

  defaultHeaders = (isFormdata) => {
    return {
      'Accept': 'application/json',
      'Content-Type':  isFormdata ? "multipart/form-data" : 'application/json',
      'Authorization': this.getJWT()
    };
  }

  headers = (path,isFormdata) => {
    return this.defaultHeaders(isFormdata)
  }

  fetchRequest = async (url, params, fetchOpts) => {
    console.log("Fetching to url :", url)
    let body = params
    const method = fetchOpts.method ? fetchOpts.method : "GET"

    const headers = this.headers(url, Boolean(fetchOpts.formData))
    console.log("WILL SEND BODY")
    console.log(body)
    try{
      const res = await axios.request({
        method:method,
        url:url,
        body:body,
        data:body,
        headers:headers,
        responseType: 'json'
      });
      return res
    }catch(err){
      console.log(err);
    }
  }

}
