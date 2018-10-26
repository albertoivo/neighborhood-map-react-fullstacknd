import React, { Component } from 'react'
import './menu.css'

class Menu extends Component {
  state = {
    locals: this.props.locations
  }

  search = query => {
    const { locations, markers, hide, show } = this.props
    if (query.trim().length === 0) {
      this.setState({
        locals: locations
      })
      show()
    } else {
      hide()
      this.setState({
        locals: locations.filter(str =>
          str.title.toUpperCase().includes(query.toUpperCase())
        )
      })
      const mks = markers.filter(mk =>
        mk.title.toUpperCase().includes(query.toUpperCase())
      )
      show(mks)
    }
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
            {this.state.locals.map(local => (
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
