import React from 'react';

const controlsPanelStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 10,
  };

const ControlsPanel = ({ onImport, onExport, onDispose }) => (
  <div style={controlsPanelStyle}>
    <button onClick={onImport}>Import fragments</button>
    <button onClick={onExport}>Export fragments</button>
    <button onClick={onDispose}>Dispose fragments</button>
  </div>
);

export default ControlsPanel;
