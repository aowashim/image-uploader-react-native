import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, Alert } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { storeData } from '../storage/asyncStore'
import { pickFromCamera, pickFromGallery } from '../storage/pickAndSaveImg'

export default function HomeScreen({ navigation }) {
  const [btnSelected, setBtnSelected] = useState()
  const [uploadId, setUploadId] = useState('')
  const [des1, setDes1] = useState('')
  const [des2, setDes2] = useState('')
  const [img1Uri, setImg1Uri] = useState('')
  const [img2Uri, setImg2Uri] = useState('')
  const [btnDeactivated, setBtnDeactivated] = useState(true)
  const [img1Upld, setImg1Upld] = useState(false)
  const [img2Upld, setImg2Upld] = useState(false)

  const generateId = () => {
    const date = new Date()
    return `${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`
  }

  const handleCamera = async () => {
    let imgId
    if (btnSelected === 'btn1') {
      imgId = 'img1_' + uploadId
    } else if (btnSelected === 'btn2') {
      imgId = 'img2_' + uploadId
    }

    const imgUri = await pickFromCamera(imgId)

    if (btnSelected === 'btn1' && imgUri) {
      setImg1Uri(imgUri)
      setImg1Upld(true)
      //console.log(imgUri)
    } else if (btnSelected === 'btn2' && imgUri) {
      setImg2Uri(imgUri)
      setImg2Upld(true)
      //console.log(imgUri)
    }
    setBtnDeactivated(true)
  }

  //console.log('hm')
  const handleGallery = async () => {
    let imgId
    if (btnSelected === 'btn1') {
      imgId = 'img1_' + uploadId
    } else if (btnSelected === 'btn2') {
      imgId = 'img2_' + uploadId
    }

    const imgUri = await pickFromGallery(imgId)

    if (btnSelected === 'btn1' && imgUri) {
      setImg1Uri(imgUri)
      setImg1Upld(true)
      //console.log(imgUri)
    } else if (btnSelected === 'btn2' && imgUri) {
      setImg2Uri(imgUri)
      setImg2Upld(true)
      //console.log(imgUri)
    }
    setBtnDeactivated(true)
  }

  // const handleGetData = async key => {
  //   const arr = await getAllKeys()
  //   // const val = await getData(`${key}`)
  //   console.log(arr)
  //   //await removeValue()
  // }

  const handleSubmit = key => {
    if (img1Uri === '' || des1 === '' || img2Uri === '' || des2 === '')
      return Alert.alert('Not Saved', 'All fields are required...')

    storeData({ uploadId, img1Uri, img2Uri, des1, des2 }, `${key}`)
    Alert.alert('Saved', 'Data saved successfully...')
    setUploadId('')
    setDes1('')
    setDes2('')
    setImg1Uri('')
    setImg2Uri('')
    setImg1Upld(false)
    setImg2Upld(false)
  }

  const handleCancel = () => {
    setUploadId('')
    setDes1('')
    setDes2('')
    setImg1Uri('')
    setImg2Uri('')
    setImg1Upld(false)
    setImg2Upld(false)
    setBtnDeactivated(true)
  }

  const handleImg1 = () => {
    setBtnDeactivated(false)
    setBtnSelected('btn1')

    if (uploadId === '') {
      setUploadId(generateId())
    }
  }

  const handleImg2 = () => {
    setBtnDeactivated(false)
    setBtnSelected('btn2')

    if (uploadId === '') {
      setUploadId(generateId())
    }
  }

  return (
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
          onPress={() => handleSubmit(uploadId)}
        >
          Save
        </Button>
        <Button icon='close' mode='contained' onPress={() => handleCancel()}>
          Cancel
        </Button>
        {/* {<Button
        icon='circle-outline'
        mode='contained'
        onPress={() => handleGetData(uploadId)}
      >
        Get Info
      </Button>} */}
        <Button
          mode='contained'
          style={{ marginTop: 30, marginHorizontal: 30 }}
          onPress={() => navigation.navigate('Images')}
        >
          Display Images
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
    marginBottom: 20,
  },
})
