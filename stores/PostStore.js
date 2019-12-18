import { observable, action } from "mobx";
import RootStore from "./RootStore";
import firebase from "firebase";
import db from "../config/firebase";
import * as ImageManipulator from "expo-image-manipulator";
import { User } from "./";
import uuid from 'uuid';
import ImageUpload from "../utils/ImageUpload"
class PostStore extends RootStore {
  @observable createPostForm = {
    uploadPicture: null,
    description: "",
    location:"",
    isLoading:false
  };

  @action
  async createPost() {
    try {
      this.createPostForm.isLoading = true
      const user = await User.getCurrentUser();
      console.log("user: ",user);

      const imageUrl = await ImageUpload(this.createPostForm.uploadPicture.uri)
      const id = uuid.v4();
      const upload = {
        id: id,
        postPhoto: imageUrl,
        postDescription: this.createPostForm.description || " ",
        postLocation: this.createPostForm.location || " ",
        uid: user.uid,
        photo: user.photo || " ",
        username: user.username,
        likes: [],
        comments: []
      };
      const res = await db.collection("posts")
        .doc(id)
        .set(upload);
      this.createPostForm.isLoading = false
      return res
    } catch (e) {
      console.log(e);
      alert(e)
      this.createPostForm.isLoading = false
    }
  }
}
export default PostStore;
