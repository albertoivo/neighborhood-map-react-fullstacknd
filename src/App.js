import React, { Component } from 'react'
import './App.css'
import { locations } from './locations.js'

/* global google */

class App extends Component {
  componentDidMount() {
    // Connect the initMap() function within this class to the global window context,
    // so Google Maps can invoke it
    window.initMap = this.initMap
    // Asynchronously load the Google Maps script, passing in the callback reference
    loadJS(
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyCfoloq_rkZTlV9bMcNOCptegicVqCqZ4A&callback=initMap',
      this.mapFail
    )
  }

  initMap() {
    let self = this
    let markers = []

    self.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -15.8012908, lng: -47.8675807 },
      zoom: 13
    })

    const defaultIcon = makeMarkerIcon('0091ff')
    const highlightedIcon = makeMarkerIcon('FFFF24')

    let bounds = new google.maps.LatLngBounds()

    for (let i = 0; i < locations.length; i++) {
      let position = locations[i].location
      let title = locations[i].title
      let foursquare_id = locations[i].foursquare
      var foursquare_html = ''

      let marker = new google.maps.Marker({
        map: self.map,
        position,
        title,
        animation: google.maps.Animation.DROP,
        id: i,
        icon: defaultIcon
      })

      marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon)
      })

      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon)
      })

      markers.push(marker)

      bounds.extend(markers[i].position)
    }

    self.map.fitBounds(bounds)
  }

  mapFail() {
    alert('Sorry. Google Maps has failed. Please refresh this page.')
  }

  render() {
    return <div id="map" />
  }
}

export default App

function loadJS(src, mapFail) {
  var ref = window.document.getElementsByTagName('script')[0]
  var script = window.document.createElement('script')
  script.src = src
  script.onerror = mapFail
  script.async = true
  ref.parentNode.insertBefore(script, ref)
}

const makeMarkerIcon = markerColor => {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' +
      markerColor +
      '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21, 34)
  )
  return markerImage
}
