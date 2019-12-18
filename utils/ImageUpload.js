import firebase from 'firebase';
import * as ImageManipulator from 'expo-image-manipulator'
import uuid from 'uuid';

module.exports = async (image, ImageManipulatorOptions) => {

  const resize = await ImageManipulator.manipulateAsync(image, [], ImageManipulatorOptions)

  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = () => resolve(xhr.response)
    xhr.responseType = 'blob'
    xhr.open('GET', resize.uri, true)
    xhr.send(null)
  });

  const uploadTask = await firebase.storage().ref().child(uuid.v4()).put(blob)
  const downloadURL = await uploadTask.ref.getDownloadURL()

  return downloadURL
}