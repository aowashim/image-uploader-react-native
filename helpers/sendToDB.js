import axios from 'axios'
import { SERVER_URL } from '@env'

export const sendToDB = async (item, arr) => {
  let success = false

  try {
    await axios.post(`${SERVER_URL}`, {
      uploadId: item.uploadId,
      img1Uri: arr[0],
      des1: item.des1,
      img2Uri: arr[1],
      des2: item.des2,
    })
    success = true
    return [success, 'Information uploaded successfully']
  } catch (err) {
    return [success, err.message]
  }
}
