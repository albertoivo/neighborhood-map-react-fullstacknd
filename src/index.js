import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import MapWrapper from './components/Map/MapWrapper'
import './start-service-worker'

ReactDOM.render(<MapWrapper />, document.getElementById('root'))
