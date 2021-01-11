import React from 'react'
import HomeScreen from './screens/HomeScreen'
import DisplayScreen from './screens/DisplayScreen'
import { Entypo, Ionicons } from '@expo/vector-icons'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const HomeStack = createStackNavigator()
const ImagesStack = createStackNavigator()
const Tab = createBottomTabNavigator()

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name='Home' component={HomeScreen} />
    </HomeStack.Navigator>
  )
}

const ImagesStackScreen = () => {
  return (
    <ImagesStack.Navigator>
      <ImagesStack.Screen
        name='Images'
        options={{ title: 'Saved for later' }}
        component={DisplayScreen}
      />
    </ImagesStack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        backBehavior={{ initialRoute: true }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName

            if (route.name === 'Home') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline'
              return <Ionicons name={iconName} size={size} color={color} />
            } else if (route.name === 'Images') {
              iconName = focused ? 'images' : 'folder-images'
              return <Entypo name={iconName} size={size} color={color} />
            }
          },
        })}
        tabBarOptions={{
          keyboardHidesTabBar: true,
          activeTintColor: '#1e4b87',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name='Home' component={HomeStackScreen} />
        <Tab.Screen
          name='Images'
          //options={{ unmountOnBlur: true }}
          component={ImagesStackScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
