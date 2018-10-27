export const loadJS = (src, mapFail) => {
  var ref = window.document.getElementsByTagName('script')[0]
  var script = window.document.createElement('script')
  script.src =
    'https://maps.googleapis.com/maps/api/js?key=AIzaSyCfoloq_rkZTlV9bMcNOCptegicVqCqZ4A&callback=initMap'
  script.onerror = mapFail
  script.async = true
  ref.parentNode.insertBefore(script, ref)
}

const mapFail = () =>
  alert('Sorry. Google Maps has failed. Please refresh this page.')
