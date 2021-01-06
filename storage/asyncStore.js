import AsyncStorage from '@react-native-async-storage/async-storage'

export const storeData = async (value, key) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(`${key}`, jsonValue)
    //console.log(jsonValue)
  } catch (e) {
    throw e
  }
}

export const getData = async key => {
  try {
    const jsonValue = await AsyncStorage.getItem(`${key}`)
    return jsonValue != null ? JSON.parse(jsonValue) : null
  } catch (e) {
    throw e
  }
}

export const getAllKeys = async () => {
  let keys = []
  try {
    keys = await AsyncStorage.getAllKeys()
  } catch (e) {
    throw e
  }

  return keys
}

export const removeValue = async key => {
  try {
    await AsyncStorage.removeItem(`${key}`)
  } catch (e) {
    throw e
  }

  //console.log(`${key} removed...`)
  //await getAllKeys()
}
