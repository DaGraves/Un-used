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
import { CHARGE_API_ENDPOINT,PRIZES_API_ENDPOINT } from 'react-native-dotenv'

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
  @observable prizesList = [];
  @observable isLoadingPrizesList = false;
  @observable postDateFilter = new Date();

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
        likesCount: 0,
        likesDayCount: 0,
        comments: [],
        createdAtDate: moment()
          .startOf("day")
          .toDate(),
        timestamp: moment().valueOf(),
        paid: false
      };

      const res = await db
        .collection("posts")
        .doc(id)
        .set(upload);

      await this.getPosts();

      return upload;
    } catch (e) {
      console.log(e);
      alert(e);
      this.createPostForm.isLoading = false;
    }
  }

  @action
  async getPosts(opts) {
    try {
      opts = opts || {};
      const { orderBy, isCompetition, uid } = opts;
      let { date } = opts;
      this.isLoadingPostList = true;
      this.postList = [];
      date = typeof date === "undefined" ? new Date() : date;
      if (date) {
        date = moment(date)
          .startOf("day")
          .toDate();
      }

      let posts = await db.collection("posts").where("paid", "==", true);

      if (date) {
        posts = posts.where("createdAtDate", "==", date);
      }

      if (uid) {
        posts = posts.where("uid", "==", uid);
      }

      if (orderBy) {
        for (let k in orderBy) {
          const row = orderBy[k];
          posts = posts.orderBy(row.field, row.order);
        }
      } else {
        posts = posts.orderBy("timestamp", "desc");
      }

      posts = await posts.get();

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

  @action
  async likePost(post) {
    try {
      const user = User.user;
      let action = "";
      let likesQuery = [];
      let likes = [];
      let likesDayQuery = [];
      let likesDay = post.likesDay ? post.likesDay : [];
      const isCompetition = moment()
        .startOf("day")
        .isSame(moment(post.date).startOf("day"));

      if (isCompetition) {
        if (post.likesDay && post.likesDay.includes(user.uid)) {
          likesDayQuery = firebase.firestore.FieldValue.arrayRemove(user.uid);
          likesDay = _.filter(likes, el => el.uid !== likes);
        } else {
          likesDay.push(user.uid);
          likesDayQuery = firebase.firestore.FieldValue.arrayUnion(user.uid);
        }
      }

      if (post.likes.includes(user.uid)) {
        // User is unliking
        action = "UNLIKE";
        likesQuery = firebase.firestore.FieldValue.arrayRemove(user.uid);
        likes = _.filter(likes, el => el.uid !== likes);
      } else {
        // User is liking
        action = "LIKE";
        likes.push(user.uid);
        likesQuery = firebase.firestore.FieldValue.arrayUnion(user.uid);
      }

      const likesCount = (likes ? likes : []).length;
      const likesDayCount = (likesDay ? likesDay : []).length;

      post.likes = likes;
      post.likesCount = likesCount;

      if (isCompetition) {
        post.likesDay = likesDay;
        post.likesDayCount = likesDayCount;
      }

      let newPostList = _.filter(this.postList, el => el.id !== post.id);
      newPostList.push(post);

      if (isCompetition) {
        newPostList = _.orderBy(
          newPostList,
          ["likesDayCount", "timestamp"],
          ["desc", "desc"]
        );
      } else {
        newPostList = _.orderBy(newPostList, ["timestamp"], ["desc"]);
      }

      this.postList = newPostList;

      await db
        .collection("posts")
        .doc(post.id)
        .update({
          likes: likesQuery,
          likesDay: likesDayQuery,
          likesCount: likesCount,
          likesDayCount: likesDayCount
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
          date: new Date(),
          createdAtDate: moment()
            .startOf("day")
            .toDate(),
          timestamp: moment().valueOf(),
          type: action
        });
    } catch (e) {
      console.error(e);
    }
  }

  @action
  async payPost(post, token, charge) {
    try {
      // const url = "https://us-central1-taux-payments.cloudfunctions.net/charge"
      const url = CHARGE_API_ENDPOINT
      let success = false;

      const params = {
        token,
        charge
      };
      const res = await this.fetchRequest(url, params, { method: "POST" });
      const data = res.data;
      const body = JSON.parse(data.body);
      if (body) {
        await db
          .collection("posts")
          .doc(post.id)
          .update({
            paid: true
          });
        success = true;
      }
      return success;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  @action
  async calculatePrizes(date){
    this.isLoadingPrizesList = true
    try {
      // const url = PRIZES_API_ENDPOINT
      const url = "http://localhost:5000/taux-44e28/us-central1/prizes"
      let success = false;

      const res = await this.fetchRequest(url, {}, { method: "GET" });
      const data = res.data;
      console.log("res",res)
      const body = JSON.parse(data.body);
      if (body) {
        this.prizesList = body.prizes
        console.log(body)
        success = true;
      }
      this.isLoadingPrizesList = false
      return success;
    } catch (e) {
      console.log(e);
      alert(e)
      this.isLoadingPrizesList = false
      return false;
    }
  }
}
export default PostStore;
