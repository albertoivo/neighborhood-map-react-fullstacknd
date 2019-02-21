import { date } from '../util/helper.js'
import axios from 'axios'

const CLIENT_ID = '1YBQ5MRZ2OAFCBWN4D5VA0BO4JFIK5HHWOO0U1O5XKR2RBNB'
const CLIENT_SECRET = 'EMETHNPTZRNMB4HRJF4YNK3SSRE431RXOQKZT3HDLJ1AODOZ'

export const foursquareInfoWindow = foursquare_id => {
  return fetch(
    `https://api.foursquare.com/v2/venues/${foursquare_id}?&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${date()}`
  )
    .then(response => response.json())
    .catch(err => 'erro de fsq: ' + err)
}

export const getVenues = () => {
  const endpoint = "https://api.foursquare.com/v2/search/recommendations?"
  const params = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    v: date(),
    near: 'Brasilia, DF',
    limit: 5
  }
  const urlSearch = new URLSearchParams(params)

  return axios.get(endpoint + urlSearch)
    .then(result => result.data.response.group.results)
}