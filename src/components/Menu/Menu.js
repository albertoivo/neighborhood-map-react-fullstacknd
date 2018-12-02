import React from 'react'
import sortBy from 'sort-by'
import { onlyUnique } from '../../util/helper.js'
import './menu.css'

class Menu extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      locations: this.props.locations,
      continents: this.visitedContinents()
    }
  }

  search = query => {
    const { locations, markers, hide, show } = this.props
    if (query.trim().length === 0) {
      this.setState({ locations })
      show()
    } else {
      this.setState({
        locations: locations.filter(str =>
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

  chooseContinents = continente => {
    const { locations, markers, hide, show } = this.props
    this.setState({
      locations: locations.filter(str => str.continente === continente)
    })
    const filteredLocals = locations.filter(
      local => local.continente === continente
    )
    const filteredMarkers = []
    markers.map(mk =>
      filteredLocals.map(
        local => mk.title === local.title && filteredMarkers.push(mk)
      )
    )
    hide()
    show(filteredMarkers)
  }

  visitedContinents = () => {
    let continents = []
    this.props.locations.forEach(local => {
      continents.push(local.continente)
    })
    return continents.filter(onlyUnique)
  }

  render() {
    const { choose, hide, show } = this.props
    const { locations, continents } = this.state
    return (
      <div className="collapsible-menu">
        <input type="checkbox" id="menu" tabIndex={0} />
        <label htmlFor="menu">Menu</label>
        <div className="menu-content">
          <input
            tabIndex={0}
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

          <p>
            Visited Continents ({continents.length}):
          </p>
          <ul>
            {continents.map(continent => (
              <li key={continent}>
                <button onClick={() => this.chooseContinents(continent)}>
                  {continent}
                </button>
              </li>
            ))}
          </ul>
          <br clear="all" />
          <p>
            Visited Countries ({locations.length}):
          </p>
          <ul>
            {locations.sort(sortBy('title')).map(local => (
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
