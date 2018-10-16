import React, { Component } from 'react'
import './App.css'
import Menu from './Menu'
import { locations } from '../locations.js'

/* global google */

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      markers: []
    }
  }

  componentDidMount() {
    window.initMap = this.initMap.bind(this)

    loadJS(
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyCfoloq_rkZTlV9bMcNOCptegicVqCqZ4A&callback=initMap',
      this.mapFail
    )

    //this.toggleBounce = toggleBounce.bind(this)
    //this.stopToggleBounce = stopToggleBounce.bind(this)

  }

  initMap() {
    let markers = []

    let map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -15.8012908, lng: -47.8675807 },
      zoom: 13
    })

    const largeInfowindow = new google.maps.InfoWindow()

    const defaultIcon = makeMarkerIcon('0091ff')
    const highlightedIcon = makeMarkerIcon('FFFF24')

    let bounds = new google.maps.LatLngBounds()

    for (let i = 0; i < locations.length; i++) {
      let position = locations[i].location
      let title = locations[i].title

      let marker = new google.maps.Marker({
        map,
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

      marker.addListener('click', function() {
        populateInfoWindow(map, this, largeInfowindow)
        toggleBounce(this)
      })

      markers.push(marker)

      bounds.extend(markers[i].position)
    }

    this.setState({ markers })

    map.fitBounds(bounds)

  }

  mapFail() {
    alert('Sorry. Google Maps has failed. Please refresh this page.')
  }

  render() {
    return (
      <div>
        <Menu locations={locations} />
        <div id="map" />
      </div>
    )
  }
}

export default App

const loadJS = (src, mapFail) => {
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

const populateInfoWindow = (map, marker, infowindow) => {
  if (infowindow.marker !== marker) {
    infowindow.setContent('')
    infowindow.marker = marker

    infowindow.addListener('closeclick', () => {
      infowindow.marker = null
      this.stopToggleBounce()
    })
    let streetViewService = new google.maps.StreetViewService()
    const radius = 500

    infowindow.addListener('closeclick', function() {
      infowindow.marker = null
    })

    let infoWindowContent = '<div>' + marker.title + '</div><div id="pano"></div>'

    const getStreetView = (data, status) => {
      if (status === google.maps.StreetViewStatus.OK) {
        const nearStreetViewLocation = data.location.latLng
        const heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation,
          marker.position
        )
        infowindow.setContent(infoWindowContent)

        const panoramaOptions = {
          position: nearStreetViewLocation,
          pov: {
            heading,
            pitch: 30
          }
        }
        new google.maps.StreetViewPanorama(
          document.getElementById('pano'),
          panoramaOptions
        )
      } else {
        infowindow.setContent(
          '<div>' +
            marker.title +
            '</div>' +
            '<div>No Street View Found</div>'
        )
      }
    }

    streetViewService.getPanoramaByLocation(
      marker.position,
      radius,
      getStreetView
    )

    infowindow.setContent(infoWindowContent)

    infowindow.open(map, marker)
  }
}

const toggleBounce = (selectedMarker) => {
  stopToggleBounce(this.state.markers)
  if (selectedMarker.getAnimation() !== null) {
    selectedMarker.setAnimation(null)
  } else {
    selectedMarker.setAnimation(google.maps.Animation.BOUNCE)
  }
}

const stopToggleBounce = () => {
  this.state.markers.map((marker) => {
    return (marker.getAnimation !== null) &&
      marker.setAnimation(null)
  })
}