import React, { Component } from 'react'
import './menu.css'

class Menu extends Component {
  render() {
    const { locations, choose, hide, show } = this.props
    return (
      <div className="collapsible-menu">
        <input type="checkbox" id="menu" />
        <label htmlFor="menu">Filter</label>
        <div className="menu-content">
          <input type="text" placeholder="Type your filter" />
          <button onClick={() => hide()}>Hide All Markers</button>
          <button onClick={() => show()}>Show All Markers</button>
          <ul>
            {locations.map(local => (
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
