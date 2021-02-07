import React, { useContext } from 'react'
import { View } from 'react-native'
import { Checkbox, Text } from 'react-native-paper'
import AppContext from '../store/AppContext'

const MyCheckBox = props => {
  const [scheme] = useContext(AppContext)

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        //justifyContent: 'center',
      }}
    >
      <Checkbox
        color={scheme === 'dark' ? 'white' : 'rgba(0, 0, 0, 0.7)'}
        status={props.status}
        onPress={props.onPress}
      />
      <Text
        style={{
          backgroundColor:
            scheme === 'dark'
              ? 'rgba(71, 69, 71, 0.5)'
              : 'rgba(143, 186, 175, 0.2)',
          paddingVertical: 2,
          paddingHorizontal: 4,
          borderRadius: 5,
          color:
            scheme === 'dark'
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(0, 0, 0, 0.9)',
        }}
      >
        {props.title}
      </Text>
    </View>
  )
}

export default MyCheckBox
