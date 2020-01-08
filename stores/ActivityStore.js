import { observable, action } from "mobx";
import RootStore from "./RootStore";
import firebase from "firebase";
import db from "../config/firebase";
import * as ImageManipulator from "expo-image-manipulator";
import { User } from "./";
import uuid from "uuid";
import ImageUpload from "../utils/ImageUpload";
import _ from "lodash";
import moment from "moment";

class ActivityStore extends RootStore {

  @observable isLoadingActivityList = false;
  @observable activityList = [];

  @action
  async getActivity(){
    try{
      this.isLoadingActivityList = true

      const activity = []
      const user = await User.getCurrentUser();
      const query = await db.collection('activity')
      .where('uid', '==', user.uid)
      .orderBy("timestamp","desc")
      .get()

      query.forEach((response) => {
        activity.push(response.data())
      })
      this.activityList = activity
      this.isLoadingActivityList = false
    }catch (e) {
      console.log(e);
      alert(e);
      this.isLoadingActivityList = false;
    }
  }
}
export default ActivityStore;
