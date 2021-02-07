import React, { useState, useRef } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  ToastAndroid,
  Platform,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Button, TextInput, Text } from 'react-native-paper'
import { storeData } from '../storage/asyncStore'
import { pickFromCamera, pickFromGallery } from '../storage/pickAndSaveImg'
import { saveImg } from '../storage/saveDeleteImg'
import { upload } from '../helpers/upload'
import * as Network from 'expo-network'
import MyModal from '../components/MyModal'
import MyPicker from '../components/MyPicker'
import {
  GENDER,
  RELATION,
  ZONE,
  RACE,
  VARNA,
  QUALIFICATION,
  PROFESSION,
} from '../constants/dropDownData'
import SectionCont from '../components/SectionCont'
import MyCheckBox from '../components/MyCheckBox'

export default function HomeScreen() {
  const [btnSelected, setBtnSelected] = useState()
  const [uploading, setUploading] = useState(false)
  const [checked, setChecked] = useState(false)
  const boxClicked = useRef(false)
  const uploadId = useRef('')
  const [imgDes, setImgDes] = useState({ des1: '', des2: '' })
  const [ritwick, setRitwick] = useState({ name: '', code: '' })
  const img1Uri = useRef('')
  const img2Uri = useRef('')
  const [img1Upld, setImg1Upld] = useState(false)
  const [img2Upld, setImg2Upld] = useState(false)
  const [modalSubmit, setModalSubmit] = useState(false)
  const [modalPicImage, setModalPicImage] = useState(false)
  const [member, setMember] = useState({ name: '', sname: '', gender: 'Male' })
  const [permanentAddr, setPermanentAddr] = useState({
    address: '',
    pin: '',
    zone: 'zabc',
    dist: '',
    state: '',
  })
  const [presentAddr, setPresentAddr] = useState({
    address: '',
    pin: '',
    zone: 'zabc',
    dist: '',
    state: '',
  })
  const [guardian, setGuardian] = useState({
    name: '',
    sname: '',
    relation: 'Father',
  })
  const [otherDetails, setOtherDetails] = useState({
    age: '',
    race: 'rabc',
    varna: 'vaWWbc',
    date: '',
    qualification: 'qaSSbc',
    profession: 'pabcWT',
    contact: '',
  })
  const userInfo = useRef({}).current

  const generateId = () => {
    const date = new Date()
    return `${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`
  }

  const saveOffline = async () => {
    let imgId
    imgId = 'img1_' + uploadId.current
    userInfo.img1Uri = await saveImg(img1Uri.current, imgId)

    imgId = 'img2_' + uploadId.current
    userInfo.img2Uri = await saveImg(img2Uri.current, imgId)

    await storeData(userInfo, uploadId.current)
  }

  const handleCamera = async () => {
    setModalPicImage(false)
    const imgUri = await pickFromCamera()

    if (btnSelected === 'btn1' && imgUri) {
      img1Uri.current = imgUri
      setImg1Upld(true)
    } else if (btnSelected === 'btn2' && imgUri) {
      img2Uri.current = imgUri
      setImg2Upld(true)
    }
  }

  const handleGallery = async () => {
    setModalPicImage(false)
    const imgUri = await pickFromGallery()

    if (btnSelected === 'btn1' && imgUri) {
      img1Uri.current = imgUri
      setImg1Upld(true)
    } else if (btnSelected === 'btn2' && imgUri) {
      img2Uri.current = imgUri
      setImg2Upld(true)
    }
  }

  const handleSaveLater = async () => {
    setModalSubmit(false)
    await saveOffline()
    if (Platform.OS === 'android') {
      ToastAndroid.show('Your data is saved successfully.', ToastAndroid.SHORT)
    } else Alert.alert('Saved.', 'Your data is saved successfully.')

    handleCancel()
  }

  const handleSubmitNow = async () => {
    setModalSubmit(false)
    try {
      const nt = await Network.getNetworkStateAsync()
      if (nt.isConnected && nt.isInternetReachable) {
        setUploading(true)
        const success = await upload(userInfo)
        if (success) {
          if (Platform.OS === 'android') {
            ToastAndroid.show(
              'Your data is uploaded successfully.',
              ToastAndroid.LONG
            )
          } else Alert.alert('Uploaded.', 'Your data is uploaded successfully.')
        } else {
          await saveOffline()
          if (Platform.OS === 'android') {
            ToastAndroid.show(
              'Upload failed. But your data is saved successfully.',
              ToastAndroid.LONG
            )
          } else Alert.alert('Failed.', 'But your data is saved successfully.')
        }
        handleCancel()
        setUploading(false)
      } else {
        if (Platform.OS === 'android') {
          ToastAndroid.show(
            'No internet. Please try again later.',
            ToastAndroid.SHORT
          )
        } else Alert.alert('No internet.', 'Please try again later.')
      }
    } catch {
      if (Platform.OS === 'android') {
        ToastAndroid.show(
          'No internet. Please try again later.',
          ToastAndroid.SHORT
        )
      } else Alert.alert('No internet.', 'Please try again later.')
    }
  }

  const handleSubmit = key => {
    if (
      img1Uri.current === '' ||
      imgDes.des1 === '' ||
      img2Uri.current === '' ||
      imgDes.des2 === '' ||
      ritwick.name === '' ||
      ritwick.code === '' ||
      member.name === '' ||
      member.sname === '' ||
      member.gender === '' ||
      guardian.name === '' ||
      guardian.sname === '' ||
      guardian.relation === '' ||
      permanentAddr.address === '' ||
      permanentAddr.zone === '' ||
      permanentAddr.pin === '' ||
      permanentAddr.dist === '' ||
      permanentAddr.state === '' ||
      presentAddr.address === '' ||
      presentAddr.zone === '' ||
      presentAddr.pin === '' ||
      presentAddr.dist === '' ||
      presentAddr.state === '' ||
      otherDetails.age === '' ||
      otherDetails.race === '' ||
      otherDetails.varna === '' ||
      otherDetails.date === '' ||
      otherDetails.profession === '' ||
      otherDetails.qualification === '' ||
      otherDetails.contact === ''
    ) {
      if (Platform.OS === 'android') {
        ToastAndroid.show(
          "Can't submit. All fields are required.",
          ToastAndroid.SHORT
        )
      } else Alert.alert("Can't submit.", 'All fields are required.')
    } else {
      userInfo.uploadId = uploadId.current
      userInfo.img1Uri = img1Uri.current
      userInfo.img2Uri = img2Uri.current
      userInfo.des1 = imgDes.des1
      userInfo.des2 = imgDes.des2
      userInfo.age = otherDetails.age
      userInfo.race = otherDetails.race
      userInfo.varna = otherDetails.varna
      userInfo.date = otherDetails.date
      userInfo.qualification = otherDetails.qualification
      userInfo.profession = otherDetails.profession
      userInfo.contact = otherDetails.contact
      userInfo.g_name = guardian.name
      userInfo.g_sname = guardian.sname
      userInfo.relation = guardian.relation
      userInfo.p_address = permanentAddr.address
      userInfo.p_pin = permanentAddr.pin
      userInfo.p_zone = permanentAddr.zone
      userInfo.p_dist = permanentAddr.dist
      userInfo.p_state = permanentAddr.state
      userInfo.address = presentAddr.address
      userInfo.pin = presentAddr.pin
      userInfo.zone = presentAddr.zone
      userInfo.dist = presentAddr.dist
      userInfo.state = presentAddr.state
      userInfo.m_name = member.name
      userInfo.m_sname = member.sname
      userInfo.gender = member.gender
      userInfo.r_name = ritwick.name
      userInfo.r_code = ritwick.code

      //console.log(userInfo)
      setModalSubmit(true)
    }
  }

  const handleCancel = () => {
    uploadId.current = ''
    setImgDes({ des1: '', des2: '' })
    img1Uri.current = ''
    img2Uri.current = ''
    setImg1Upld(false)
    setImg2Upld(false)
    setMember({ name: '', sname: '', gender: 'Male' })
    setPermanentAddr({
      address: '',
      pin: '',
      zone: 'zabc',
      dist: '',
      state: '',
    })
    setPresentAddr({
      address: '',
      pin: '',
      zone: 'zabc',
      dist: '',
      state: '',
    })
    setGuardian({
      name: '',
      sname: '',
      relation: 'Father',
    })
    setOtherDetails({
      age: '',
      race: 'rabc',
      varna: 'vaWWbc',
      date: '',
      qualification: 'qaSSbc',
      profession: 'pabcWT',
      contact: '',
    })
    setRitwick({
      name: '',
      code: '',
    })
    boxClicked.current = false
    setChecked(false)
  }

  const handleImg1 = () => {
    //setBtnDeactivated(false)
    setBtnSelected('btn1')
    setModalPicImage(true)

    if (uploadId.current === '') {
      uploadId.current = generateId()
    }
  }

  const handleImg2 = () => {
    //setBtnDeactivated(false)
    setBtnSelected('btn2')
    setModalPicImage(true)

    if (uploadId.current === '') {
      uploadId.current = generateId()
    }
  }

  const handleCheckBox = () => {
    boxClicked.current = !checked
    setChecked(!checked)
    if (boxClicked.current) {
      setPresentAddr(permanentAddr)
    } else {
      setPresentAddr({
        address: '',
        pin: '',
        zone: 'zabc',
        dist: '',
        state: '',
      })
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
        <SectionCont title='IMAGE DETAILS'>
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
            value={imgDes.des1}
            placeholder='Enter image 1 description'
            onChangeText={text => setImgDes({ ...imgDes, des1: text })}
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
            //style={{ marginBottom: 40 }}
            value={imgDes.des2}
            placeholder='Enter image 2 description'
            onChangeText={text => setImgDes({ ...imgDes, des2: text })}
          />
        </SectionCont>

        <SectionCont title='RITWICK DETAILS'>
          <TextInput
            label='RITWICK NAME'
            mode='outlined'
            style={{ marginBottom: 10 }}
            value={ritwick.name}
            placeholder='Enter ritwick name'
            onChangeText={text => setRitwick({ ...ritwick, name: text })}
          />
          <TextInput
            label='RITWICK CODE'
            mode='outlined'
            //style={{ marginBottom: 40 }}
            value={ritwick.code}
            placeholder='Enter ritwick code'
            onChangeText={text => setRitwick({ ...ritwick, code: text })}
          />
        </SectionCont>

        <SectionCont title='MEMBER DETAILS'>
          <TextInput
            label='MEMBER NAME'
            mode='outlined'
            style={{ marginBottom: 10 }}
            value={member.name}
            placeholder='Enter name'
            onChangeText={text => setMember({ ...member, name: text })}
          />
          <TextInput
            label='MEMBER SURNAME'
            mode='outlined'
            //style={{ marginBottom: 40 }}
            value={member.sname}
            placeholder='Enter surname'
            onChangeText={text => setMember({ ...member, sname: text })}
          />
          <MyPicker
            selectedValue={member.gender}
            title='GENDER'
            onValueChange={itemValue => {
              setMember({
                ...member,
                gender: itemValue,
              })
            }}
          >
            {GENDER.map((item, idx) => (
              <Picker.Item label={item} value={item} key={idx} />
            ))}
          </MyPicker>
        </SectionCont>

        <SectionCont title='GUARDIAN DETAILS'>
          <TextInput
            label='GUARDIAN NAME'
            mode='outlined'
            style={{ marginBottom: 10 }}
            value={guardian.name}
            placeholder='Enter name'
            onChangeText={text => setGuardian({ ...guardian, name: text })}
          />
          <TextInput
            label='GUARDIAN SURNAME'
            mode='outlined'
            //style={{ marginBottom: 40 }}
            value={guardian.sname}
            placeholder='Enter surname'
            onChangeText={text => setGuardian({ ...guardian, sname: text })}
          />
          <MyPicker
            selectedValue={guardian.relation}
            title='RELATION'
            onValueChange={itemValue => {
              setGuardian({
                ...guardian,
                relation: itemValue,
              })
            }}
          >
            {RELATION.map((item, idx) => (
              <Picker.Item label={item} value={item} key={idx} />
            ))}
          </MyPicker>
        </SectionCont>

        <SectionCont title='PERMANENT ADDRESS'>
          <TextInput
            label='ADDRESS'
            multiline={true}
            mode='outlined'
            style={{ marginBottom: 10 }}
            value={permanentAddr.address}
            placeholder='Enter address'
            onChangeText={text =>
              setPermanentAddr({ ...permanentAddr, address: text })
            }
          />
          <TextInput
            label='PIN'
            mode='outlined'
            keyboardType='number-pad'
            //style={{ marginBottom: 40 }}
            value={permanentAddr.pin}
            placeholder='Enter PIN'
            onChangeText={text =>
              setPermanentAddr({ ...permanentAddr, pin: text })
            }
          />
          <MyPicker
            selectedValue={permanentAddr.zone}
            title='ZONE'
            onValueChange={itemValue => {
              setPermanentAddr({
                ...permanentAddr,
                zone: itemValue,
              })
            }}
          >
            {ZONE.map((item, idx) => (
              <Picker.Item label={item} value={item} key={idx} />
            ))}
          </MyPicker>
          <TextInput
            label='DISTRICT'
            mode='outlined'
            style={{ marginVertical: 10 }}
            value={permanentAddr.dist}
            placeholder='Enter district'
            onChangeText={text =>
              setPermanentAddr({ ...permanentAddr, dist: text })
            }
          />
          <TextInput
            label='STATE'
            mode='outlined'
            //style={{ marginBottom: 40 }}
            value={permanentAddr.state}
            placeholder='Enter state'
            onChangeText={text =>
              setPermanentAddr({ ...permanentAddr, state: text })
            }
          />
        </SectionCont>

        <MyCheckBox
          title='Same as permanent address'
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => handleCheckBox()}
        />

        <SectionCont title='PRESENT ADDRESS'>
          <TextInput
            label='ADDRESS'
            multiline={true}
            mode='outlined'
            style={{ marginBottom: 10 }}
            value={presentAddr.address}
            placeholder='Enter address'
            onChangeText={text =>
              setPresentAddr({ ...presentAddr, address: text })
            }
          />
          <TextInput
            label='PIN'
            mode='outlined'
            keyboardType='number-pad'
            //style={{ marginBottom: 40 }}
            value={presentAddr.pin}
            placeholder='Enter PIN'
            onChangeText={text => setPresentAddr({ ...presentAddr, pin: text })}
          />
          <MyPicker
            selectedValue={presentAddr.zone}
            title='ZONE'
            onValueChange={itemValue => {
              setPresentAddr({
                ...presentAddr,
                zone: itemValue,
              })
            }}
          >
            {ZONE.map((item, idx) => (
              <Picker.Item label={item} value={item} key={idx} />
            ))}
          </MyPicker>
          <TextInput
            label='DISTRICT'
            mode='outlined'
            style={{ marginVertical: 10 }}
            value={presentAddr.dist}
            placeholder='Enter district'
            onChangeText={text =>
              setPresentAddr({ ...presentAddr, dist: text })
            }
          />
          <TextInput
            label='STATE'
            mode='outlined'
            //style={{ marginBottom: 40 }}
            value={presentAddr.state}
            placeholder='Enter state'
            onChangeText={text =>
              setPresentAddr({ ...presentAddr, state: text })
            }
          />
        </SectionCont>

        <SectionCont title='OTHER DETAILS'>
          <TextInput
            label='AGE'
            mode='outlined'
            keyboardType='number-pad'
            style={{ marginBottom: 10 }}
            value={otherDetails.age}
            placeholder='Enter age'
            onChangeText={text =>
              setOtherDetails({ ...otherDetails, age: text })
            }
          />
          <MyPicker
            selectedValue={otherDetails.race}
            title='RACE'
            onValueChange={itemValue => {
              setOtherDetails({
                ...otherDetails,
                race: itemValue,
              })
            }}
          >
            {RACE.map((item, idx) => (
              <Picker.Item label={item} value={item} key={idx} />
            ))}
          </MyPicker>
          <MyPicker
            selectedValue={otherDetails.varna}
            title='VARNA'
            onValueChange={itemValue => {
              setOtherDetails({
                ...otherDetails,
                varna: itemValue,
              })
            }}
          >
            {VARNA.map((item, idx) => (
              <Picker.Item label={item} value={item} key={idx} />
            ))}
          </MyPicker>
          <TextInput
            label='DATE'
            mode='outlined'
            keyboardType='number-pad'
            style={{ marginTop: 10 }}
            value={otherDetails.date}
            placeholder='Enter date'
            onChangeText={text =>
              setOtherDetails({ ...otherDetails, date: text })
            }
          />
          <MyPicker
            selectedValue={otherDetails.qualification}
            title='QUALIFICATION'
            onValueChange={itemValue => {
              setOtherDetails({
                ...otherDetails,
                qualification: itemValue,
              })
            }}
          >
            {QUALIFICATION.map((item, idx) => (
              <Picker.Item label={item} value={item} key={idx} />
            ))}
          </MyPicker>
          <MyPicker
            selectedValue={otherDetails.profession}
            title='PROFESSION'
            onValueChange={itemValue => {
              setOtherDetails({
                ...otherDetails,
                profession: itemValue,
              })
            }}
          >
            {PROFESSION.map((item, idx) => (
              <Picker.Item label={item} value={item} key={idx} />
            ))}
          </MyPicker>
          <TextInput
            label='CONTACT NO'
            mode='outlined'
            keyboardType='number-pad'
            style={{ marginTop: 10 }}
            value={otherDetails.contact}
            placeholder='Enter contact number'
            onChangeText={text =>
              setOtherDetails({ ...otherDetails, contact: text })
            }
          />
        </SectionCont>

        <SectionCont title='SUBMIT / CLEAR'>
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
        </SectionCont>

        <MyModal
          visible={modalPicImage}
          onPress={() => setModalPicImage(false)}
          onRequestClose={() => setModalPicImage(false)}
        >
          <Button style={{ marginTop: 5 }} onPress={() => handleCamera()}>
            camera
          </Button>
          <Button onPress={() => handleGallery()}>gallery</Button>
          <Button
            style={{ marginBottom: 10 }}
            onPress={() => setModalPicImage(false)}
          >
            Cancel
          </Button>
        </MyModal>

        <MyModal
          visible={modalSubmit}
          onPress={() => setModalSubmit(false)}
          onRequestClose={() => setModalSubmit(false)}
        >
          <Button style={{ marginTop: 5 }} onPress={() => handleSubmitNow()}>
            Submit now
          </Button>
          <Button onPress={() => handleSaveLater()}>Save for later</Button>
          <Button
            style={{ marginBottom: 10 }}
            onPress={() => setModalSubmit(false)}
          >
            Cancel
          </Button>
        </MyModal>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10,
    marginTop: 20,
  },
  btnCamGal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
  },
})
