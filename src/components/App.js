import React, { Component } from "react"
import "./App.css"
import Menu from "./Menu"
import { locations } from "../locations.js"

/* global google */

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      markers: [],
      infowindow: {},
      bounds: {},
      map: {},
      locations
    }

    this.chooseALocation = this.chooseALocation.bind(this)
    this.hideMarkers = this.hideMarkers.bind(this)
    this.showMarkers = this.showMarkers.bind(this)
    this.makeMarkerIcon = this.makeMarkerIcon.bind(this)
  }

  componentDidMount() {
    window.initMap = this.initMap.bind(this)

    loadJS(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCfoloq_rkZTlV9bMcNOCptegicVqCqZ4A&callback=initMap",
      this.mapFail
    )
  }

  initMap() {
    const self = this
    let markers = []
    let infowindow = new window.google.maps.InfoWindow()
    let bounds = new google.maps.LatLngBounds()

    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -15.8012908, lng: -47.8675807 },
      zoom: 13
    })

    const defaultIcon = this.makeMarkerIcon("0091ff")
    const highlightedIcon = this.makeMarkerIcon("FFFF24")

    this.state.locations.forEach((local, idx) => {
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

      marker.addListener("mouseover", function() {
        this.setIcon(highlightedIcon)
      })

      marker.addListener("mouseout", function() {
        this.setIcon(defaultIcon)
      })

      marker.addListener("click", function() {
        self.foursquareInfoWindow(local.foursquare)
          .then((json) => {
            const fsq = json.response.venue
            if (fsq) {
              let fsq_html = "Foursquare Likes: " + fsq.likes.summary
              self.populateInfoWindow(this, fsq_html)
            } else {
              self.populateInfoWindow(this, json.meta.errorDetail)
            }
          })
          .catch(err => alert(err))
        self.toggleBounce(this)
      })

      markers.push(marker)

      bounds.extend(markers[idx].position)
    })

    map.fitBounds(bounds)

    this.setState({ markers, infowindow, bounds, map })
  }

  mapFail() {
    alert("Sorry. Google Maps has failed. Please refresh this page.")
  }

  render() {
    return (
      <div>
        <Menu
          locations={this.state.locations}
          choose={this.chooseALocation}
          hide={this.hideMarkers}
          show={this.showMarkers}
        />
        <div id="map" />
      </div>
    )
  }

  makeMarkerIcon = markerColor => {
    var markerImage = new google.maps.MarkerImage(
      "http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|" +
        markerColor +
        "|40|_|%E2%80%A2",
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21, 34)
    )
    return markerImage
  }

  populateInfoWindow = (marker, foursquare_html) => {
    const infowindow = this.state.infowindow

    infowindow.marker = marker

    infowindow.addListener("closeclick", () => {
      infowindow.marker = null
      this.stopToggleBounce(marker)
    })

    const streetViewService = new google.maps.StreetViewService()
    const radius = 500

    let infoWindowContent =
      "<div>" +
      marker.title +
      '</div><div id="pano"></div><br />' +
      foursquare_html

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
          document.getElementById("pano"),
          panoramaOptions
        )
      } else {
        infowindow.setContent(
          "<div>" + marker.title + "</div><div>No Street View Found</div>" + foursquare_html
        )
      }
    }

    streetViewService.getPanoramaByLocation(
      marker.position,
      radius,
      getStreetView
    )

    infowindow.setContent(infoWindowContent)

    infowindow.open(this.map, marker)
  }

  getDate = () => {
    let today = new Date()
    let dd = today.getDate()
    let mm = today.getMonth() + 1
    let yyyy = today.getFullYear()

    if (dd < 10) {
      dd = "0" + dd
    }
    if (mm < 10) {
      mm = "0" + mm
    }

    return yyyy + "" + mm + "" + dd
  }

  foursquareInfoWindow = foursquare_id => {
    const CLIENT_ID = "1YBQ5MRZ2OAFCBWN4D5VA0BO4JFIK5HHWOO0U1O5XKR2RBNB"
    const CLIENT_SECRET = "EMETHNPTZRNMB4HRJF4YNK3SSRE431RXOQKZT3HDLJ1AODOZ"

    return fetch(
      `https://api.foursquare.com/v2/venues/${foursquare_id}?&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${this.getDate()}`
    )
      .then(response => response.json())
      .catch((err) => "erro de fsq: " + err)

  }

  toggleBounce = selectedMarker => {
    this.stopToggleBounce(this.state.markers)
    if (selectedMarker.getAnimation() !== null) {
      selectedMarker.setAnimation(null)
    } else {
      selectedMarker.setAnimation(google.maps.Animation.BOUNCE)
    }
  }

  stopToggleBounce = mk => {
    Array.isArray(mk)
      ? mk.map(marker => this.markerAnimationToNull(marker))
      : this.markerAnimationToNull(mk)
  }

  markerAnimationToNull = mk =>
    mk.getAnimation !== null && mk.setAnimation(null)

  chooseALocation(selectedLocation) {
    const { markers } = this.state
    this.stopToggleBounce(markers)
    let marker = markers.find(mk => selectedLocation.title === mk.title)
    this.toggleBounce(marker)
    this.populateInfoWindow(marker)
  }

  showMarkers = () => {
    const { markers, bounds, map } = this.state
    markers.forEach(m => {
      m.setMap(map)
      bounds.extend(m.position)
    })
    map.fitBounds(bounds)
  }

  hideMarkers = () => {
    this.state.markers.map(m => m.setMap(null))
  }
}

export default App

const loadJS = (src, mapFail) => {
  var ref = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = src
  script.onerror = mapFail
  script.async = true
  ref.parentNode.insertBefore(script, ref)
}
