import React from 'react'
import './menu.css'

class Menu extends React.PureComponent {
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
      this.setState({
        locals: locations.filter(str =>
          str.title.toUpperCase().includes(query.toUpperCase())
        )
      })
      const filteredMarkers = markers.filter(mk =>
        mk.title.toUpperCase().includes(query.toUpperCase())
      )
      hide()
      show(filteredMarkers)
    }
  }

  onlyUnique = (value, index, self) => self.indexOf(value) === index

  getContinents = locals => {
    let continents = []
    this.state.locals.forEach(local => {
      return continents.push(local.continente)
    })
    return continents
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

          <p>Continentes:</p>
          <ul>
            {this.getContinents(this.state.locals)
              .filter(this.onlyUnique)
              .map(local => (
                <li key={local.title}>
                  <button onClick={() => choose(local)}>{local}</button>
                </li>
              ))}
          </ul>

          <p>Países:</p>
          <ul>
            {this.state.locals.map(local => (
              <li key={local.title}>
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
