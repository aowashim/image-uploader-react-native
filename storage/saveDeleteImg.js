import * as FileSystem from 'expo-file-system'

export const saveImg = async (imgUrl, imgId) => {
  const exTn = imgUrl.split('.').pop()
  const fileName = imgId + '.' + exTn
  const newPath = FileSystem.documentDirectory + fileName

  try {
    await FileSystem.moveAsync({
      from: imgUrl,
      to: newPath,
    })
    return newPath
  } catch (err) {
    //console.log(err)
  }
}

export const deleteImg = async (img1Url, img2Url) => {
  try {
    await FileSystem.deleteAsync(img1Url)
    await FileSystem.deleteAsync(img2Url)
    //console.log('deleted...')
  } catch (err) {
    //console.log(err.messsage)
  }
}
