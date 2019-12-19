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
class PostStore extends RootStore {
  @observable createPostForm = {
    uploadPicture: null,
    description: "",
    location: "",
    isLoading: false,
    isLoadingPicture: false
  };

  @observable isLoadingPostList = false;
  @observable postList = [];

  @action
  async createPost() {
    try {
      this.createPostForm.isLoading = true;
      const user = await User.getCurrentUser();

      const imageUrl = await ImageUpload(this.createPostForm.uploadPicture.uri);
      const id = uuid.v4();
      const upload = {
        id: id,
        postPhoto: imageUrl,
        postDescription: this.createPostForm.description || " ",
        postLocation: this.createPostForm.location || " ",
        uid: user.uid,
        photo: user.photoUrl || " ",
        username: user.username,
        likes: [],
        likesCompetition: [],
        comments: [],
        createdAt: new Date(),
        timestamp: moment().valueOf()
      };
      const res = await db
        .collection("posts")
        .doc(id)
        .set(upload);

      await this.getPosts();
      this.createPostForm.isLoading = false;
      return res;
    } catch (e) {
      console.log(e);
      alert(e);
      this.createPostForm.isLoading = false;
    }
  }

  @action
  async getPosts(date) {
    try {
      this.isLoadingPostList = true;
      date = date || new Date();
      date = moment(date)
        .startOf("day")
        .toDate();
      const tomorrow = moment(date)
        .add("1", "days")
        .startOf("day");
      const posts = await db
        .collection("posts")
        .where("createdAt", ">=", date)
        .orderBy("createdAt", "desc")
        .orderBy("timestamp", "desc")
        .get();

      let array = [];
      posts.forEach(post => {
        array.push(post.data());
      });

      this.postList = array;
      this.isLoadingPostList = false;
      return array;
    } catch (e) {
      this.isLoadingPostList = false;
      console.log(e);
      alert(e);
    }
  }

  async likePost(post) {
    try {
      const user = User.user;
      let action = "";
      let likesQuery = [];
      let likes = [];
      let likesDayQuery = [];
      let likesDay = post.likesDay ? post.likesDay : [];
      const isCompetition = moment().startOf("day").isSame(moment(post.timestamp).startOf("day"))

      if(isCompetition){
        if (post.likesDay.includes(user.uid) ) {
          likesDayQuery = firebase.firestore.FieldValue.arrayRemove(user.uid);
          likesDay = _.filter(likes, el => el.uid !== likes);
        }else{
          likesDay.push(user.uid);
          likesDayQuery = firebase.firestore.FieldValue.arrayUnion(user.uid);
        }
      }

      if (post.likes.includes(user.uid) ) {
        // User is unliking
        action = "UNLIKE";
        console.log("WILL UNLIKE");

        likesQuery = firebase.firestore.FieldValue.arrayRemove(user.uid);
        likes = _.filter(likes, el => el.uid !== likes);
      } else {
        // User is liking
        action = "LIKE";
        likes.push(user.uid);
        likesQuery = firebase.firestore.FieldValue.arrayUnion(user.uid);
      }



      post.likes = likes;
      if(isCompetition){
        post.likesDay = likesDay;
      }
      let newPostList = _.filter(this.postList,(el) => el.id !== post.id)
      newPostList.push(post)
      newPostList = _.orderBy(newPostList,"timestamp","desc")
      this.postList = newPostList

      await db
        .collection("posts")
        .doc(post.id)
        .update({
          likes: likesQuery,
          likesDay:likesDayQuery
        });

      const res = await db
        .collection("activity")
        .doc()
        .set({
          postId: post.id,
          postPhoto: post.postPhoto,
          likerId: user.uid,
          likerPhoto: user.photoUrl,
          likerName: user.username,
          uid: post.uid,
          date: new Date().getTime(),
          type: action
        });

      console.log(res);
    } catch (e) {
      console.error(e);
    }
  }
}
export default PostStore;
