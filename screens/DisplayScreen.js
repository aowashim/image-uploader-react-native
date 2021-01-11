import React, { useState, useEffect, useRef } from 'react'
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
import { Entypo } from '@expo/vector-icons'
import { deleteImg } from '../storage/saveDeleteImg'
import { upload } from '../helpers/upload'
import * as Network from 'expo-network'

export default function DisplayScreen() {
  //const [keyArr, setKeyArr] = useState([])
  const [loadList, setLoadList] = useState(false)
  const keyArr = useRef([])
  const noData = useRef([{ msg: 'No stored data.', id: '1' }])
  const [imgInfo, setImgInfo] = useState([])
  const [uploading, setUploading] = useState(false)
  const [pull, setPull] = useState(false)

  useEffect(() => {
    const allKeys = async () => {
      keyArr.current = await getAllKeys()
      setLoadList(true)
    }
    allKeys()
  }, [])

  const removeImg = async key => {
    await removeValue(key)
    keyArr.current = keyArr.current.filter(id => id !== key)
    setImgInfo(imgInfo => imgInfo.filter(id => id.uploadId !== key))
  }

  const allInfo = async () => {
    const tmp = []
    let x
    for (x of keyArr.current) {
      let data = await getData(x)
      tmp.push(data)
    }
    setImgInfo(tmp)
  }

  const handleRefresh = async () => {
    setPull(true)
    keyArr.current = await getAllKeys()
    await allInfo()
    setPull(false)
  }

  if (keyArr.current.length) {
    if (imgInfo.length === 0) {
      allInfo()
    }
  }

  if (imgInfo.length) {
    const uploadItem = async item => {
      try {
        const nt = await Network.getNetworkStateAsync()
        if (nt.isConnected && nt.isInternetReachable) {
          setUploading(true)

          const success = await upload(item)

          if (success) {
            await deleteImg(item.img1Uri, item.img2Uri)
            await removeImg(item.uploadId)
            Alert.alert('Uploaded.', 'Your data is uploaded successfully.')
          } else {
            Alert.alert('Failed.', 'Upload unsuccessful due a server error.')
          }

          setUploading(false)
        } else {
          Alert.alert('No internet.', 'Please try again later.')
        }
      } catch {
        Alert.alert('No internet.', 'Please try again later.')
      }
    }

    const renderItem = itemData => {
      return (
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor='#a7aba8'
          style={styles.itemContainer}
          onLongPress={() => uploadItem(itemData.item)}
          //onPress={() => console.log(itemData.item)}
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
          onRefresh={() => handleRefresh()}
          refreshing={pull}
        />
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={noData.current}
        renderItem={data => (
          <View style={{ alignItems: 'center', margin: 10 }}>
            <Entypo name='emoji-sad' size={24} color='black' />
            <Text style={{ marginTop: 10 }}>
              {data.item.msg} Pull down to refresh.
            </Text>
          </View>
        )}
        keyExtractor={item => item.id}
        onRefresh={() => handleRefresh()}
        refreshing={pull}
      />
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
