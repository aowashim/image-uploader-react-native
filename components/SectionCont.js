import React, { useContext } from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-paper'
import AppContext from '../store/AppContext'

const SectionCont = props => {
  const [scheme] = useContext(AppContext)

  return (
    <View
      style={{
        backgroundColor:
          scheme === 'dark' ? 'rgba(32, 33, 33, 1)' : 'rgba(32, 33, 33, 0.1)',
        borderRadius: 20,
        paddingHorizontal: 5,
        paddingBottom: 20,
        marginBottom: 15,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          marginTop: 15,
          marginBottom: 20,
          borderRadius: 20,
          marginHorizontal: 30,
          backgroundColor:
            scheme === 'dark'
              ? 'rgba(110, 49, 109, 0.3)'
              : 'rgba(110, 49, 109, 1)',
          borderRadius: 5,
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            color:
              scheme === 'dark'
                ? 'rgba(255, 255, 255, 0.9)'
                : 'rgba(255, 255, 255, 1)',
            padding: 5,
          }}
        >
          {props.title}
        </Text>
      </View>
      {props.children}
    </View>
  )
}

export default SectionCont
