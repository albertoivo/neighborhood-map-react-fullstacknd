import React from 'react'
import './menu.css'

class Menu extends React.PureComponent {

  constructor(props){
    super(props)

    this.state = {
      locals: []
    }

    props.locations.then(result => this.setState({locals: result}) )
  }

  search = query => {
    const { locations, markers, hide, show } = this.props
    if (query.trim().length === 0) {
      this.setState({
        locals: locations
      })
      show()
    } else {
      console.log('locations', locations)
      this.setState({
        locals: locations.filter(str =>
          str.venue.name.toUpperCase().includes(query.toUpperCase())
        )
      })
      const filteredMarkers = markers.filter(mk =>
        mk.venue.name.toUpperCase().includes(query.toUpperCase())
      )
      hide()
      show(filteredMarkers)
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
            role="search"
            placeholder="Type your filter"
            aria-label="Filter the locations"
            onChange={event => this.search(event.target.value)}
          />
          <button aria-label="Hide All Markers" onClick={() => hide()}>
            Hide All Markers
          </button>
          <button aria-label="Show All Markers" onClick={() => show()}>
            Show All Markers
          </button>
          <ul>
            {this.state.locals.map(local => (
              <li key={local.id}>
                <button onClick={() => choose(local)}>{local.venue.name}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default Menu
