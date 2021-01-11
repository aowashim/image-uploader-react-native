import { uploadToCloud } from './uploadToCloud'
import { sendToDB } from './sendToDB'

export const upload = async item => {
  let success = false
  const urls = []
  const exTn1 = item.img1Uri.split('.').pop()
  const exTn2 = item.img2Uri.split('.').pop()
  let cur = ''
  const files = [
    { uri: item.img1Uri, type: `image/${exTn1}`, name: `image.${exTn1}` },
    { uri: item.img2Uri, type: `image/${exTn2}`, name: `image.${exTn2}` },
  ]

  cur = await uploadToCloud(files[0])

  if (cur[0]) {
    urls.push(cur[1])
  } else {
    return success
  }

  if (cur[0]) {
    cur = ''
    cur = await uploadToCloud(files[1])

    if (cur[0]) {
      urls.push(cur[1])
    } else {
      return success
    }

    if (cur[0]) {
      cur = await sendToDB(item, urls)
      if (cur[0]) {
        success = true
        return success
      } else {
        return success
      }
    }
  }
}
