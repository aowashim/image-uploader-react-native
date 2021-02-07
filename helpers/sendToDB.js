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
      age: item.age,
      race: item.race,
      varna: item.varna,
      date: item.date,
      qualification: item.qualification,
      profession: item.profession,
      contact: item.contact,
      g_name: item.g_name,
      g_sname: item.g_sname,
      relation: item.relation,
      p_address: item.p_address,
      p_pin: item.p_pin,
      p_zone: item.p_zone,
      p_dist: item.p_dist,
      p_state: item.p_state,
      address: item.p_address,
      pin: item.pin,
      zone: item.zone,
      dist: item.dist,
      state: item.state,
      m_name: item.m_name,
      m_sname: item.m_sname,
      gender: item.gender,
      r_name: item.r_name,
      r_code: item.r_code,
    })

    success = true
    return [success, 'Information uploaded successfully']
  } catch (err) {
    return [success, err.message]
  }
}
