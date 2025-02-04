import React, { useState, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker
} from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import { interpolateGreens } from 'd3-scale-chromatic';
import indiaTopoJson from './india.topo.json';
import { feature } from 'topojson-client';

const sampleData = [
  { city: 'Mumbai', state: 'Maharashtra', value: 120, latitude: 19.0760, longitude: 72.8777 },
  { city: 'Pune', state: 'Maharashtra', value: 90, latitude: 18.5204, longitude: 73.8567 },
  { city: 'Lucknow', state: 'Uttar Pradesh', value: 85, latitude: 26.8467, longitude: 80.9462 },
  { city: 'Kanpur', state: 'Uttar Pradesh', value: 65, latitude: 26.4499, longitude: 80.3319 },
  { city: 'Bangalore', state: 'Karnataka', value: 105, latitude: 12.9716, longitude: 77.5946 },
  { city: 'Mysore', state: 'Karnataka', value: 70, latitude: 12.2958, longitude: 76.6394 },
  { city: 'Ahmedabad', state: 'Gujarat', value: 55, latitude: 23.0225, longitude: 72.5714 },
  { city: 'Surat', state: 'Gujarat', value: 40, latitude: 21.1702, longitude: 72.8311 },
  { city: 'Chennai', state: 'Tamil Nadu', value: 35, latitude: 13.0827, longitude: 80.2707 },
  { city: 'Madurai', state: 'Tamil Nadu', value: 20, latitude: 9.9252, longitude: 78.1198 },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh', value: 18, latitude: 17.6868, longitude: 83.2185 },
  { city: 'Vijayawada', state: 'Andhra Pradesh', value: 10, latitude: 16.5062, longitude: 80.6483 },
  { city: 'Kolkata', state: 'West Bengal', value: 12, latitude: 22.5726, longitude: 88.3639 },
  { city: 'Durgapur', state: 'West Bengal', value: 7, latitude: 23.5500, longitude: 87.3200 },
  { city: 'Jaipur', state: 'Rajasthan', value: 8, latitude: 26.9148, longitude: 75.7884 },
  { city: 'Jodhpur', state: 'Rajasthan', value: 3, latitude: 26.2389, longitude: 73.0243 },
  { city: 'Patna', state: 'Bihar', value: 9, latitude: 25.5941, longitude: 85.1376 },
  { city: 'Gaya', state: 'Bihar', value: 4, latitude: 24.7489, longitude: 85.0010 },
  { city: 'Bhopal', state: 'Madhya Pradesh', value: 2, latitude: 23.2599, longitude: 77.4126 },
  { city: 'Indore', state: 'Madhya Pradesh', value: 1, latitude: 22.7196, longitude: 75.8577 },
  { city: 'Chandigarh', state: 'Haryana', value: 5, latitude: 30.7333, longitude: 76.7794 },
  { city: 'Faridabad', state: 'Haryana', value: 0, latitude: 28.4089, longitude: 77.3178 },
  { city: 'Hyderabad', state: 'Telangana', value: 6, latitude: 17.3850, longitude: 78.4867 },
  { city: 'Warangal', state: 'Telangana', value: 2, latitude: 17.9689, longitude: 79.5941 },
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

  const handleMouseEnter = (event, data, type = 'city') => {
    let content = '';
    if (type === 'city') {
      content = `${data.city}, ${data.state}: ${data.value}`;
    } else if (type === 'state') {
      const stateData = sampleData.filter(city => city.state === data.properties.name);
      const totalValue = stateData.reduce((sum, city) => sum + city.value, 0);
      content = `${data.properties.name}: Total Value = ${totalValue}`;
    }

    setTooltipContent(content);
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
                const citiesInState = sampleData.filter(
                 city => city.state === geo.properties.name
               );

               let stateValue = null;
               if(citiesInState.length > 0){
                   stateValue = citiesInState.reduce((sum, city) => sum + city.value, 0) / citiesInState.length;
               }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={stateValue ? colorScale(stateValue) : '#EEE'}
                    stroke="#FFF"
                    strokeWidth={0.5}
                    onMouseEnter={(event) => handleMouseEnter(event, geo, 'state')}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: 'rgba(8, 126, 216, 0.3)' },  // Optional: Slight state fill on hover
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Render City Markers */}
          {sampleData.map(city => (
            <Marker
              key={`${city.city}-${city.state}`}
              coordinates={[city.longitude, city.latitude]}
            >
              <circle
                r={5} // Adjust the radius as needed
                fill="#F00" // Red color for the city markers
                stroke="#fff"
                strokeWidth={1}
                onMouseEnter={(event) => handleMouseEnter(event, city, 'city')}
                onMouseLeave={handleMouseLeave}
                style={{
                  cursor: 'pointer',
                  outline: 'none',
                  hover: {
                    fill: 'rgb(8, 126, 216)',
                    outline: 'none',
                  }
                }}
              />
            </Marker>
          ))}
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