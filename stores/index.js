import UserStore from "./UserStore";
import PostStore from "./PostStore";
import ActivityStore from "./ActivityStore";

const User = new UserStore();
const Post = new PostStore();
const Activity = new ActivityStore();

export { User, Post, Activity };
