import { observable, action } from "mobx";
import RootStore from "./RootStore";
import firebase from "firebase";
import db from "../config/firebase";
import * as ImageManipulator from "expo-image-manipulator";

class PostStore extends RootStore {
  @observable uploadPicture = null;
}
export default PostStore;
