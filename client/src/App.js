import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import pin from '../src/map-pin.svg'
import pin1 from '../src/map-pin1.svg'
import { listLogEntries } from './API';
import LogEntryForm from './logEntryForm';

const Map = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({})
  const [addEntryLocation, setAddEntryLocation] = useState(null)
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 6.5244,
    longitude: 3.3792,
    zoom: 10
  });

  const getEntires = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries.data);
  };

  useEffect(() => {
    getEntires()
  }, [])

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude
    })
  }

  return (
    <ReactMapGL
      {...viewport}
      // mapStyle="mapbox://styles/thecjreynolds/ck117fnjy0ff61cnsc1wimyay"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={setViewport}
      onDblClick={showAddMarkerPopup}
    >
      {
      logEntries.map(entry => (
        <div key={entry._id}>
        <Marker 
          latitude={entry.latitude} 
          longitude={entry.longitude}
          >
            <div onClick={() => setShowPopup({
              // ...showPopup,
              [entry._id]: true
            })}>
              <img 
                className="marker"
                style={{
                  height: `${2 * viewport.zoom}px`,
                  width: `${2 * viewport.zoom}px`,
                }} 
                src={pin} alt="marker"
              />
            </div>
          </Marker>
          {
            showPopup[entry._id] ? (
              <Popup
                latitude={entry.latitude}
                longitude={entry.longitude}
                closeButton = { true}
                closeOnClick = { false}
                dynamicPosition={true}
                onClose={() => setShowPopup({
                  ...showPopup,
                  [entry._id]: false })}
                anchor="top"
              >
                <div className="popup">
                  <h3>{entry.title}</h3>
                  <h3>{entry.comment}</h3>
                  {entry.image && <img src={entry.image} alt={entry.title} />}
                <small>visited: {new Date(entry.visitDate).toLocaleDateString()}</small>
                <div>rating: {entry.rating}</div>
                </div>
              </Popup>
            ) : null
          }
        </div>
      ))
      }
      {
        addEntryLocation ? (
          <>
            <Marker
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
            >
              <div>
                <img
                  className="marker"
                  style={{
                    height: `${2 * viewport.zoom}px`,
                    width: `${2 * viewport.zoom}px`,
                  }}
                  src={pin1} alt="marker"
                />
              </div>
            </Marker>
            <Popup
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setAddEntryLocation(null)}
              anchor="left"
            >
              <div className="popup">
                <LogEntryForm 
                onClose={() => {
                  setAddEntryLocation(null);
                  getEntires();
                }} 
                location={addEntryLocation}/>
              </div>
            </Popup>
          </>
        ) : null
      }
    </ReactMapGL>
  );
}

export default Map;