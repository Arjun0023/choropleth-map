import React from 'react';
import IndiaChoropleth from './IndiaChoroplethMap';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import IndiaMap from './IndiaChoroplethMap';

function App() {
  return (
    <div className="App">
      <h1 style={{ textAlign: 'center', color: '#333' }}>heatmao component</h1>
      <IndiaMap />
      <Tooltip id="map-tooltip" />
    </div>
  );
}

export default App;