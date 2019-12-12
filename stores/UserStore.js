import { observable, action } from "mobx"
import RootStore from "./RootStore"
import { AsyncStorage } from "react-native"

class UserStore extends RootStore {
  @observable
  teste = 0;


}
export default UserStore
