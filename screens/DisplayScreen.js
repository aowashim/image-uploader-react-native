import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
  Image,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import { getAllKeys, removeValue, getData } from '../storage/asyncStore'
import axios from 'axios'
import { CLOUDINAR_API, UPLOAD_PRESET, CLOUD_NAME, SERVER_POST } from '@env'

export default function DisplayScreen() {
  const [keyArr, setKeyArr] = useState([])
  const [imgInfo, setImgInfo] = useState([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const allKeys = async () => {
      const arr = await getAllKeys()
      setKeyArr(arr)
    }
    allKeys()
  }, [])

  const uploadToCloud = async file => {
    const formData = new FormData()

    formData.append('file', file)
    formData.append('upload_preset', `${UPLOAD_PRESET}`)
    formData.append('cloud_name', `${CLOUD_NAME}`)

    let response = await fetch(`${CLOUDINAR_API}`, {
      method: 'POST',
      body: formData,
    })
    let data = await response.json()
    //console.log(data.secure_url)
    return data.secure_url
  }

  const sendToDB = async (item, arr) => {
    //console.log(item, arr)
    try {
      let response = await axios.post(`${SERVER_POST}`, {
        uploadId: item.uploadId,
        img1Uri: arr[0],
        des1: item.des1,
        img2Uri: arr[1],
        des2: item.des2,
      })
      //console.log(response.data)
      Alert.alert('Uploaded', 'Your data has been uploaded successfully...')
    } catch (err) {
      //console.log(err.message)
      Alert.alert('Failed', 'Someting went wrong while uploading...')
    }
  }

  const removeImg = async key => {
    await removeValue(key)
    setKeyArr(keyArr => keyArr.filter(id => id !== key))
    setImgInfo(imgInfo => imgInfo.filter(id => id.uploadId !== key))
  }

  const allInfo = async () => {
    const tmp = []
    let x
    for (x of keyArr) {
      let data = await getData(x)
      tmp.push(data)
      //data.then(d => tmp.push(d))
    }
    setImgInfo(tmp)
  }

  if (keyArr.length) {
    if (imgInfo.length === 0) {
      allInfo()
    }
  }

  if (imgInfo.length) {
    const uploadItem = async item => {
      const urls = []
      const exTn1 = item.img1Uri.split('.').pop()
      const exTn2 = item.img2Uri.split('.').pop()
      let cur = ''
      //let flag = true
      const files = [
        { uri: item.img1Uri, type: `image/${exTn1}`, name: `image.${exTn1}` },
        { uri: item.img2Uri, type: `image/${exTn2}`, name: `image.${exTn2}` },
      ]

      setUploading(true)

      cur = await uploadToCloud(files[0])
      urls.push(cur)

      if (cur.length) {
        cur = ''
        cur = await uploadToCloud(files[1])
        urls.push(cur)

        if (cur.length) {
          //console.log(urls, item)
          await sendToDB(item, urls)
          await removeImg(item.uploadId)
          setUploading(false)
        }
      }
      //console.log(item)
    }

    const renderItem = itemData => {
      return (
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor='#014a04'
          style={styles.itemContainer}
          onPress={() => uploadItem(itemData.item)}
        >
          <View
            style={
              Dimensions.get('window').width > 360
                ? styles.imgCont
                : styles.imgContSmallScr
            }
          >
            <View style={{ padding: 10 }}>
              <Image
                style={{ height: 150, width: 150 }}
                source={{ uri: itemData.item.img1Uri }}
              />
            </View>
            <View style={{ padding: 10 }}>
              <Image
                style={{ height: 150, width: 150 }}
                source={{ uri: itemData.item.img2Uri }}
              />
            </View>
          </View>
        </TouchableHighlight>
      )
    }

    return uploading ? (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size='large' color='#00ff00' />
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Text>Uploading...</Text>
        </View>
      </View>
    ) : (
      <View style={styles.container}>
        <FlatList
          data={imgInfo}
          renderItem={renderItem}
          keyExtractor={item => item.uploadId}
        />
      </View>
    )
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>No Images yet...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  itemContainer: {
    borderStyle: 'solid',
    borderColor: '#1b1c1c',
    borderWidth: 1,
    marginBottom: 10,
  },
  imgCont: { flexDirection: 'row', justifyContent: 'space-evenly' },
  imgContSmallScr: { justifyContent: 'space-around', alignItems: 'center' },
})
