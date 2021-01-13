import React, { useState, useRef } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { Button, TextInput, Text } from 'react-native-paper'
import { storeData } from '../storage/asyncStore'
import { pickFromCamera, pickFromGallery } from '../storage/pickAndSaveImg'
import { saveImg } from '../storage/saveDeleteImg'
import { upload } from '../helpers/upload'
import * as Network from 'expo-network'

export default function HomeScreen({ navigation }) {
  const [btnSelected, setBtnSelected] = useState()
  const [uploading, setUploading] = useState(false)
  //const [uploadId, setUploadId] = useState('')
  const uploadId = useRef('')
  const [des1, setDes1] = useState('')
  const [des2, setDes2] = useState('')
  //const [img1Uri, setImg1Uri] = useState('')
  //const [img2Uri, setImg2Uri] = useState('')
  const img1Uri = useRef('')
  const img2Uri = useRef('')
  const [btnDeactivated, setBtnDeactivated] = useState(true)
  const [img1Upld, setImg1Upld] = useState(false)
  const [img2Upld, setImg2Upld] = useState(false)

  const generateId = () => {
    const date = new Date()
    return `${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`
  }

  const saveOffline = async userInfo => {
    let imgId
    imgId = 'img1_' + uploadId.current
    userInfo.img1Uri = await saveImg(img1Uri.current, imgId)

    imgId = 'img2_' + uploadId.current
    userInfo.img2Uri = await saveImg(img2Uri.current, imgId)

    await storeData(userInfo, uploadId.current)
  }

  const handleCamera = async () => {
    const imgUri = await pickFromCamera()

    if (btnSelected === 'btn1' && imgUri) {
      //setImg1Uri(imgUri)
      img1Uri.current = imgUri
      setImg1Upld(true)
      //console.log(imgUri)
    } else if (btnSelected === 'btn2' && imgUri) {
      //setImg2Uri(imgUri)
      img2Uri.current = imgUri
      setImg2Upld(true)
      //console.log(imgUri)
    }
    setBtnDeactivated(true)
  }

  //console.log('hm')
  const handleGallery = async () => {
    const imgUri = await pickFromGallery()

    if (btnSelected === 'btn1' && imgUri) {
      //setImg1Uri(imgUri)
      img1Uri.current = imgUri
      setImg1Upld(true)
      //console.log(imgUri)
    } else if (btnSelected === 'btn2' && imgUri) {
      //setImg2Uri(imgUri)
      img2Uri.current = imgUri
      setImg2Upld(true)
      //console.log(imgUri)
    }
    setBtnDeactivated(true)
  }

  const handleSaveLater = async userInfo => {
    await saveOffline(userInfo)
    Alert.alert('Saved.', 'Your data is saved successfully.')
    handleCancel()
  }

  const handleSubmitNow = async userInfo => {
    try {
      const nt = await Network.getNetworkStateAsync()
      if (nt.isConnected && nt.isInternetReachable) {
        setUploading(true)
        const success = await upload(userInfo)
        if (success) {
          Alert.alert('Uploaded.', 'Your data is uploaded successfully.')
        } else {
          await saveOffline(userInfo)
          Alert.alert('Failed.', 'But your data is saved successfully.')
        }
        handleCancel()
        setUploading(false)
      } else {
        Alert.alert('No internet.', 'Please try again later.')
      }
    } catch {
      Alert.alert('No internet.', 'Please try again later.')
    }
  }

  const handleSubmit = key => {
    if (
      img1Uri.current === '' ||
      des1 === '' ||
      img2Uri.current === '' ||
      des2 === ''
    ) {
      return Alert.alert("Can't submit.", 'All fields are required.')
    } else {
      const userInfo = {
        uploadId: uploadId.current,
        img1Uri: img1Uri.current,
        img2Uri: img2Uri.current,
        des1,
        des2,
      }

      Alert.alert('Save your data.', 'Please choose an option.', [
        {
          text: 'Save for later',
          onPress: () => handleSaveLater(userInfo),
        },
        {
          text: 'Cancel',
        },
        { text: 'Upload now', onPress: () => handleSubmitNow(userInfo) },
      ])
    }
  }

  const handleCancel = () => {
    //setUploadId('')
    uploadId.current = ''
    setDes1('')
    setDes2('')
    //setImg1Uri('')
    //setImg2Uri('')
    img1Uri.current = ''
    img2Uri.current = ''
    setImg1Upld(false)
    setImg2Upld(false)
    setBtnDeactivated(true)
  }

  const handleImg1 = () => {
    setBtnDeactivated(false)
    setBtnSelected('btn1')

    if (uploadId.current === '') {
      //setUploadId(generateId())
      uploadId.current = generateId()
    }
  }

  const handleImg2 = () => {
    setBtnDeactivated(false)
    setBtnSelected('btn2')

    if (uploadId.current === '') {
      //setUploadId(generateId())
      uploadId.current = generateId()
    }
  }

  return uploading ? (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size='large' color='#00ff00' />
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <Text>Uploading...</Text>
      </View>
    </View>
  ) : (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.btnCamGal}>
          <Button
            icon='camera'
            mode='contained'
            disabled={btnDeactivated}
            onPress={() => handleCamera()}
          >
            camera
          </Button>
          <Button
            icon='image-area'
            mode='contained'
            disabled={btnDeactivated}
            onPress={() => handleGallery()}
          >
            gallery
          </Button>
        </View>
        <Button
          icon={img1Upld ? 'check-outline' : 'file-upload'}
          mode='contained'
          style={{ marginBottom: 10 }}
          onPress={() => handleImg1()}
        >
          Select Image 1
        </Button>
        <TextInput
          label='DESCRIPTION'
          mode='outlined'
          style={{ marginBottom: 30 }}
          value={des1}
          onFocus={() => {
            if (!btnDeactivated) setBtnDeactivated(true)
          }}
          placeholder='Enter image 1 description'
          onChangeText={text => setDes1(text)}
        />
        <Button
          icon={img2Upld ? 'check-outline' : 'file-upload'}
          mode='contained'
          style={{ marginBottom: 10 }}
          onPress={() => handleImg2()}
        >
          Select Image 2
        </Button>
        <TextInput
          label='DESCRIPTION'
          mode='outlined'
          style={{ marginBottom: 40 }}
          value={des2}
          onFocus={() => {
            if (!btnDeactivated) setBtnDeactivated(true)
          }}
          placeholder='Enter image 2 description'
          onChangeText={text => setDes2(text)}
        />
        <Button
          icon='content-save-all'
          mode='contained'
          style={{ marginBottom: 15 }}
          onPress={() => handleSubmit(uploadId.current)}
        >
          Submit
        </Button>
        <Button icon='close' mode='contained' onPress={() => handleCancel()}>
          Clear
        </Button>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  btnCamGal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
  },
})
