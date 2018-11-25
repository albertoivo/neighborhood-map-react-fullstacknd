import React, { Component } from 'react'
import './Map.css'
import Menu from '../Menu/Menu'
import { locations } from '../../util/locations.js'
import { loadGoogleMapsAPI, makeMarkerIcon } from '../../api/googlemaps.js'
import { ErrorBoundary } from '../Error/ErrorBoundary'

/* global google */

export default class MapWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      markers: [],
      infowindow: {},
      bounds: {},
      map: {},
      error: null,
      info: null
    }
  }

  componentDidMount() {
    window.initMap = this.initMap.bind(this)
    loadGoogleMapsAPI()
  }

  componentDidCatch(error, info) {
    this.setState({
      error,
      info
    })
  }

  initMap() {
    const self = this
    let markers = []
    let infowindow = new window.google.maps.InfoWindow()
    let bounds = new google.maps.LatLngBounds()

    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -15.7217175, lng: -48.0774436 },
      mapTypeControl: false,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      },
      scaleControl: true,
      streetViewControl: false,
      fullscreenControl: true
    })

    const defaultIcon = makeMarkerIcon('0091ff')
    const highlightedIcon = makeMarkerIcon('FFFF24')

    locations.forEach((local, idx) => {
      const position = local.location
      const title = local.title

      let marker = new google.maps.Marker({
        map,
        position,
        title,
        animation: google.maps.Animation.DROP,
        id: idx,
        icon: defaultIcon
      })

      marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon)
      })

      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon)
      })

      marker.addListener('click', function() {
        map.setCenter(marker.getPosition());
        self.populateInfoWindow(this)
        self.toggleBounce(this)
      })

      markers.push(marker)
      bounds.extend(markers[idx].position)
    })

    map.panToBounds(bounds)
    map.fitBounds(bounds)

    this.setState({ markers, infowindow, bounds, map })
  }

  render() {
    const { error, info } = this.state
    return (error || info)
      ? <ErrorBoundary error={error} info={info} />
      : <div>
          <Menu
            locations={locations}
            choose={this.chooseALocation}
            hide={this.hideMarkers}
            show={this.showMarkers}
            markers={this.state.markers}
          />
          <div id="map" />
        </div>
  }


  populateInfoWindow = marker => {
    const infowindow = this.state.infowindow

    infowindow.marker = marker

    infowindow.addListener('closeclick', () => {
      infowindow.marker = null
      this.stopToggleBounce(marker)
    })

    let infoWindowContent = '<div>' + marker.title + '</div>'

    infowindow.setContent(infoWindowContent)
    infowindow.open(this.map, marker)
  }

  toggleBounce = selectedMarker => {
    this.stopToggleBounce(this.state.markers)
    if (selectedMarker.getAnimation() !== null) {
      selectedMarker.setAnimation(null)
    } else {
      selectedMarker.setAnimation(google.maps.Animation.BOUNCE)
    }
  }

  stopToggleBounce = marker => {
    Array.isArray(marker)
      ? marker.map(mk => this.markerAnimationToNull(mk))
      : this.markerAnimationToNull(marker)
  }

  markerAnimationToNull = mk =>
    mk.getAnimation !== null && mk.setAnimation(null)

  chooseALocation = selectedLocation => {
    const { markers } = this.state
    this.stopToggleBounce(markers)
    const marker = markers.find(mk => selectedLocation.title === mk.title)
    this.toggleBounce(marker)
    this.populateInfoWindow(marker)
  }

  showMarkers = markers => {
    const { bounds, map } = this.state
    const mk = markers ? markers : this.state.markers
    mk.forEach(m => {
      m.setMap(map)
      bounds.extend(m.position)
    })
    map.panToBounds(bounds)
    map.fitBounds(bounds)
  }

  hideMarkers = markers => {
    const mk = markers ? markers : this.state.markers
    mk.map(m => m.setMap(null))
  }
}
