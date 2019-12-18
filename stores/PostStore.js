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
        comments: [],
        createdAt:moment().valueOf()
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
  async getPosts() {
    try {
      this.isLoadingPostList = true;

      const posts = await db.collection("posts").get();
      let array = [];
      posts.forEach(post => {
        array.push(post.data());
      });
      array = _.orderBy(array, "createdAt", "desc");
      this.postList = array;
      this.isLoadingPostList = false;
      return array;
    } catch (e) {
      this.isLoadingPostList = false;
      console.log(e);
      alert(e);
    }
  }
}
export default PostStore;
