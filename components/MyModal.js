import React, { useContext } from 'react'
import { Modal, Pressable, View } from 'react-native'
import AppContext from '../store/AppContext'

const MyModal = props => {
  const [scheme] = useContext(AppContext)

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={props.visible}
      onRequestClose={props.onRequestClose}
    >
      <Pressable
        onPress={props.onPress}
        style={{
          backgroundColor:
            scheme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(31, 31, 31, 0.4)',
          width: '100%',
          height: '100%',
        }}
      ></Pressable>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          backgroundColor: scheme === 'dark' ? '#2b2b2b' : '#dbd7d7',
          width: '100%',
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,
        }}
      >
        {props.children}
      </View>
    </Modal>
  )
}

export default MyModal
