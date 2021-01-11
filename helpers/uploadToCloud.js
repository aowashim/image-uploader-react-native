import { CLOUDINAR_API, UPLOAD_PRESET, CLOUD_NAME } from '@env'

export const uploadToCloud = async file => {
  const formData = new FormData()
  let data
  let success = false

  formData.append('file', file)
  formData.append('upload_preset', `${UPLOAD_PRESET}`)
  formData.append('cloud_name', `${CLOUD_NAME}`)

  try {
    let response = await fetch(`${CLOUDINAR_API}`, {
      method: 'POST',
      body: formData,
    })
    data = await response.json()
    success = true
    return [success, data.secure_url]
  } catch (err) {
    return [success, err.message]
  }
}
