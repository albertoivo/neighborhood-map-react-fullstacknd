import React, { Component } from "react"
import "./menu.css"

class Menu extends Component {
  state = {
    places: this.props.locations
  }

  search = query => {
    const { locations } = this.props
    query.trim().length === 0
      ? this.setState({ places: locations })
      : this.setState({ places: locations.filter(str => str.title.toUpperCase().includes(query.toUpperCase())) })
  }

  render() {
    const { choose, hide, show } = this.props
    return (
      <div className="collapsible-menu">
        <input type="checkbox" id="menu" />
        <label htmlFor="menu">Filter</label>
        <div className="menu-content">
          <input
            type="text"
            placeholder="Type your filter"
            onChange={event => this.search(event.target.value)}
          />
          <button onClick={() => hide()}>Hide All Markers</button>
          <button onClick={() => show()}>Show All Markers</button>
          <ul>
            {this.state.places.map(local => (
              <li key={local.foursquare}>
                <button onClick={() => choose(local)}>{local.title}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default Menu
