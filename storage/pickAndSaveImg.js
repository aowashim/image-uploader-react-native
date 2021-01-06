import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import * as FileSystem from 'expo-file-system'

const saveImg = async (imgUrl, imgId) => {
  const exTn = imgUrl.split('.').pop()
  const fileName = imgId + '.' + exTn
  const newPath = FileSystem.documentDirectory + fileName

  try {
    await FileSystem.moveAsync({
      from: imgUrl,
      to: newPath,
    })
    return newPath
    //console.log(newPath)
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const pickFromGallery = async imgId => {
  const { granted } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
  if (granted) {
    let data = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      //base64: true,
      quality: 0.5,
    })
    if (!data.cancelled) {
      let newfile = {
        uri: data.uri,
        type: `test/${data.uri.split('.')[1]}`,
        name: `test.${data.uri.split('.')[1]}`,
      }
      let curUri = await saveImg(data.uri, imgId)
      return curUri
      //setImg(data.uri)
      //handleUpload(newfile)
      //console.log(curUri)
    }
  } else {
    Alert.alert('you need to give up permission to work')
  }
}

export const pickFromCamera = async imgId => {
  const { granted } = await Permissions.askAsync(Permissions.CAMERA)
  if (granted) {
    let data = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    })
    if (!data.cancelled) {
      let newfile = {
        uri: data.uri,
        type: `test/${data.uri.split('.')[1]}`,
        name: `test.${data.uri.split('.')[1]}`,
      }
      let curUri = await saveImg(data.uri, imgId)
      return curUri
      //setImg(data.uri)
      //handleUpload(newfile)
      //console.log(curUri)
    }
  } else {
    Alert.alert('you need to give up permission to work')
  }
}
