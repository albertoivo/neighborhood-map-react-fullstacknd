import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import MapWrapper from './components/Map/MapWrapper'
import './start-service-worker'
import ErrorBoundary from './components/Error/ErrorBoundary'

ReactDOM.render(<ErrorBoundary><MapWrapper/></ErrorBoundary>, document.getElementById('root'))
