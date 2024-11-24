import React from 'react';
import TimezoneSelector from './TimezoneSelector';

const ControlPanel = ({ timezone, onTimezoneChange, markerSize, onMarkerSizeChange }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">Control Panel</h2>
      <div className="space-y-4">
        <TimezoneSelector value={timezone} onChange={onTimezoneChange} />
        
        <div>
          <label htmlFor="markerSize" className="block text-sm font-medium text-gray-700 mb-1">
            Marker Size: {markerSize}
          </label>
          <input
            type="range"
            id="markerSize"
            min="1"
            max="10"
            value={markerSize}
            onChange={(e) => onMarkerSizeChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
