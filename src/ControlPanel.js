import React from 'react';
import TimezoneSelector from './TimezoneSelector';

const ControlPanel = ({ timezone, onTimezoneChange, markerSize, onMarkerSizeChange, onDownload, isDownloadEnabled }) => {
  return (
    <div className="bg-white shadow rounded-lg pt-2 px-3 mb-2">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="timezone" className="block text-xs font-medium text-gray-700 mb-1">
            Timezone
          </label>
          <TimezoneSelector value={timezone} onChange={onTimezoneChange} />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="markerSize" className="block text-xs font-medium text-gray-700 mb-1">
            Marker Size
          </label>
          <input
            type="number"
            id="markerSize"
            min="1"
            max="5"
            step="0.5"
            value={markerSize}
            onChange={(e) => onMarkerSizeChange(Number(e.target.value))}
            className="mt-1 block w-full py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

      </div>
    </div>
  );
};

export default ControlPanel;
