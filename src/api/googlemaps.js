/* global google */

const loadJS = (src) => {
  let ref = window.document.getElementsByTagName('script')[0]
  let script = window.document.createElement('script')
  script.src = src
  script.defer = true
  script.async = true
  ref.parentNode.insertBefore(script, ref)

  window.gm_authFailure = () => {
    let mapview = document.getElementById('map')
    mapview.innerHTML ='<p>Não foi possível carregar o Google Maps.<br> Por favor, recarregue a página.</p>'
  }
}

export const loadGoogleMapsAPI = () => {
  const URL ='https://maps.googleapis.com/maps/api/js'
  const KEY = 'AIzaSyCfoloq_rkZTlV9bMcNOCptegicVqCqZ4A'
  loadJS(`${URL}?key=${KEY}&callback=initMap`)
}

export const makeMarkerIcon = markerColor =>
  new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' +
      markerColor + '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21, 34)
  )
