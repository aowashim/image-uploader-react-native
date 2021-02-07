import React from 'react'
import HomeScreen from './screens/HomeScreen'
import DisplayScreen from './screens/DisplayScreen'
import { Entypo, Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'react-native'
import AppContext from './store/AppContext'

import {
  NavigationContainer,
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavDefaultTheme,
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  Provider as PaperProvider,
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper'
import { AppearanceProvider, useColorScheme } from 'react-native-appearance'

const MyDarkThemeNav = {
  ...NavDarkTheme,
  dark: true,
  colors: {
    ...NavDarkTheme.colors,
    primary: '#ffffff',
    background: '#101c1c',
    card: '#162626',
  },
}

const MyDarkThemePaper = {
  ...PaperDarkTheme,
  dark: true,
  roundness: 20,
  colors: {
    ...PaperDarkTheme.colors,
    primary: '#047575',
    accent: '#26373d',
    background: 'rgba(0, 0, 0, 0.3)',
  },
}

const MyDefaultThemePaper = {
  ...PaperDefaultTheme,
  roundness: 20,
}

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
  const scheme = useColorScheme()

  return (
    <AppContext.Provider value={[scheme]}>
      <AppearanceProvider>
        <PaperProvider
          theme={scheme === 'dark' ? MyDarkThemePaper : MyDefaultThemePaper}
        >
          <NavigationContainer
            theme={scheme === 'dark' ? MyDarkThemeNav : NavDefaultTheme}
          >
            <StatusBar
              backgroundColor={scheme === 'dark' ? '#18241e' : '#ffffff'}
              barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
            />
            <Tab.Navigator
              backBehavior={{ initialRoute: true }}
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName

                  if (route.name === 'Home') {
                    iconName = focused
                      ? 'ios-information-circle'
                      : 'ios-information-circle-outline'
                    return (
                      <Ionicons name={iconName} size={size} color={color} />
                    )
                  } else if (route.name === 'Images') {
                    iconName = focused ? 'images' : 'folder-images'
                    return <Entypo name={iconName} size={size} color={color} />
                  }
                },
              })}
              tabBarOptions={{
                keyboardHidesTabBar: true,
                //activeTintColor: '#dde3eb',
                //inactiveTintColor: 'gray',
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
        </PaperProvider>
      </AppearanceProvider>
    </AppContext.Provider>
  )
}
