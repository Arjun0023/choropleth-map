import React, { useState, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import { interpolateGreens } from 'd3-scale-chromatic';
import indiaTopoJson from './india.topo.json';
import { feature } from 'topojson-client';

const sampleData = [
  { state: 'Maharashtra', value: 100 },
  { state: 'Uttar Pradesh', value: 75 },
  { state: 'Karnataka', value: 60 },
  { state: 'Gujarat', value: 45 },
  { state: 'Tamil Nadu', value: 30 },
  { state: 'Andhra Pradesh', value: 15 },
  { state: 'West Bengal', value: 10 },
  { state: 'Rajasthan', value: 5 },
  { state: 'Bihar', value: 6 },
  { state: 'Madhya Pradesh', value: 0 },
  { state: 'Haryana', value: 1 },
  { state: 'Telangana', value: 2 },
];

const IndiaMap = () => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [geographies, setGeographies] = useState([]);

  useEffect(() => {
    if (indiaTopoJson) {
      const geoData = feature(indiaTopoJson, indiaTopoJson.objects.india).features;
      setGeographies(geoData);
    }
  }, [indiaTopoJson]);

  const colorScale = scaleQuantile()
    .domain(sampleData.map(d => d.value))
    .range([0, 1, 2, 3, 4, 5, 6, 7, 8].map(d => interpolateGreens(d * 0.1)));

  const handleMouseEnter = (geo, currentValue, event) => {
    setTooltipContent(`${geo.properties.name}: ${currentValue?.value || 'N/A'}`);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setTooltipContent('');
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px' }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [82, 23],
          scale: 1000
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup>
          <Geographies geography={geographies}>
            {({ geographies }) =>
              geographies.map(geo => {
                const currentState = sampleData.find(
                  s => s.state === geo.properties.name
                );

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={currentState ? colorScale(currentState.value) : '#EEE'}
                    stroke="#FFF"
                    strokeWidth={0.5}
                    onMouseEnter={(event) => {
                      handleMouseEnter(geo, currentState, event);
                    }}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      default: { outline: 'none' },
                      hover: { fill: 'rgb(8, 126, 216)', outline: 'none' }, // Hover fill is now blue
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {tooltipContent && (
        <div
          style={{
            position: 'fixed',
            top: tooltipPosition.y + 10,
            left: tooltipPosition.x + 10,
            backgroundColor: 'white',
            padding: '5px 10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default IndiaMap;