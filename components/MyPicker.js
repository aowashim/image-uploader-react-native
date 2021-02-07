import React, { useContext } from 'react'
import { Picker } from '@react-native-picker/picker'
import { View } from 'react-native'
import { Text } from 'react-native-paper'
import AppContext from '../store/AppContext'

const MyPicker = props => {
  const [scheme] = useContext(AppContext)

  return (
    <View
      style={{
        borderRadius: 10,
        width: '100%',
        backgroundColor:
          scheme === 'dark'
            ? 'rgba(133, 255, 231, 0.25)'
            : 'rgba(44, 79, 70, 0.12)',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 15,
      }}
    >
      <Text
        style={{
          color:
            scheme === 'dark'
              ? 'rgba(255, 255, 255, 0.7)'
              : 'rgba(0, 0, 0, 1)',
          fontSize: 16,
          //fontWeight: 'bold',
          paddingLeft: 10,
        }}
      >
        {props.title}
      </Text>
      <Picker
        selectedValue={props.selectedValue}
        mode='dropdown'
        style={{
          height: 35,
          width: '55%',
        }}
        onValueChange={props.onValueChange}
      >
        {props.children}
      </Picker>
    </View>
  )
}

export default MyPicker
