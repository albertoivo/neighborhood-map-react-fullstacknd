import { date } from '../util/helper.js'

export const foursquareInfoWindow = foursquare_id => {
  const CLIENT_ID = '1YBQ5MRZ2OAFCBWN4D5VA0BO4JFIK5HHWOO0U1O5XKR2RBNB'
  const CLIENT_SECRET = 'EMETHNPTZRNMB4HRJF4YNK3SSRE431RXOQKZT3HDLJ1AODOZ'

  return fetch(
    `https://api.foursquare.com/v2/venues/${foursquare_id}?&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${date()}`
  )
    .then(response => response.json())
    .catch(err => 'erro de fsq: ' + err)
}
