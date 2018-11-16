/* global google */

const loadJS = (src) => {
  var ref = window.document.getElementsByTagName('script')[0]
  var script = window.document.createElement('script')
  script.src = src
  script.defer = true
  script.async = true
  ref.parentNode.insertBefore(script, ref)
}

export const loadGoogleMapsAPI = () => {
  const KEY = 'AIzaSyCfoloq_rkZTlV9bMcNOCptegicVqCqZ4A'
  loadJS(
    `https://maps.googleapis.com/maps/api/js?key=${KEY}&callback=initMap`
  )
}

export const makeMarkerIcon = markerColor =>
  new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' +
      markerColor +
      '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21, 34)
  )
