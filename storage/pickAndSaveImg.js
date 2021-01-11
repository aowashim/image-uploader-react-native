import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

export const pickFromGallery = async () => {
  const { granted } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
  if (granted) {
    let data = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      //aspect: [4, 3],
      quality: 0.5,
    })
    if (!data.cancelled) {
      return data.uri
    }
  }
}

export const pickFromCamera = async () => {
  const { granted } = await Permissions.askAsync(Permissions.CAMERA)
  if (granted) {
    let data = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      //aspect: [4, 3],
      quality: 0.5,
    })
    if (!data.cancelled) {
      return data.uri
    }
  }
}
