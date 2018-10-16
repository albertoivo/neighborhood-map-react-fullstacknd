import React, { Component } from 'react'
import './menu.css'

class Menu extends Component {
  render() {
    const { locations } = this.props
    return (
      <div className="collapsible-menu">
        <input type="checkbox" id="menu" />
        <label htmlFor="menu">Filter</label>
        <div className="menu-content">
          <input type="text" placeholder="Type your filter" />
          <button>Hide All Markers</button>
          <button>Show All Markers</button>
          <ul>
            {locations.map(local => (
              <li key={local.foursquare}>
                <a>{local.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default Menu
