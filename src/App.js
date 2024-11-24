import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Plotly from 'plotly.js-dist-min';
import moment from 'moment-timezone';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasPlot, setHasPlot] = useState(false);
  const [plotData, setPlotData] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [timezone, setTimezone] = useState('UTC');
  const plotRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onabort = () => console.log('File reading was aborted');
    reader.onerror = () => console.log('File reading has failed');
    reader.onload = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const line = reader.result.indexOf('[');
        const parsedData = JSON.parse(reader.result.slice(line));
        setRawData(parsedData);
        const processedData = processData(parsedData, timezone);
        setPlotData(processedData);
        setHasPlot(true);
      } catch (error) {
        console.error('Error:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsText(file);
  }, [timezone]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  function processData(rawData, selectedTimezone) {
    const tweetData = rawData.map(item => item.tweet);
    const dates = tweetData.map(tweet => moment.tz(tweet.created_at, selectedTimezone));
    
    const minutesOfDay = dates.map(date => date.hours() * 60 + date.minutes());
    const dateOnly = dates.map(date => date.format('YYYY-MM-DD'));

    return {
      x: dateOnly,
      y: minutesOfDay,
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: 2,
        color: '#ff0000'
      },
      hoverinfo: 'text+x+y'
    };
  }

  useEffect(() => {
    if (hasPlot && plotData && plotRef.current) {
      const minutesToHighlight = [0, 6 * 60, 12 * 60, 18 * 60, 24 * 60 - 1];
      const textToHighlight = ['00:00', '06:00', '12:00', '18:00', '23:59'];
      const layout = {
        title: {
          text: `Tweet Timeline (${timezone})`,
          font: {
            size: 20,
          },
          y: 0.85
        },
        xaxis: { 
          tickfont: {
            size: 15
          },
        },
        yaxis: { 
          tickvals: minutesToHighlight,
          ticktext: textToHighlight,
          tickfont: {
            size: 15
          },
          side: 'right'
        },
        paper_bgcolor: 'hsl(51, 22%, 95%)',
        plot_bgcolor: 'hsl(51, 22%, 95%)'
      };

      Plotly.newPlot(plotRef.current, [plotData], layout, {responsive: true, staticPlot: true});
    }
  }, [hasPlot, plotData, timezone]);

  const handleTimezoneChange = (event) => {
    const newTimezone = event.target.value;
    setTimezone(newTimezone);
    if (rawData) {
      const processedData = processData(rawData, newTimezone);
      setPlotData(processedData);
    }
  };

  return (
    <div className="App bg-gray-100 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Tweet Timeline Visualization</h1>
      
      <div className="mb-4">
        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Timezone</label>
        <select
          id="timezone"
          value={timezone}
          onChange={handleTimezoneChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="UTC">UTC</option>
          <option value="America/New_York">America/New_York</option>
          <option value="Europe/London">Europe/London</option>
          <option value="Asia/Tokyo">Asia/Tokyo</option>
        </select>
      </div>

      {!hasPlot && (
        <div {...getRootProps()} className="bg-white shadow-lg rounded-lg p-6 mb-8 cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 transition duration-300">
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p className="text-center text-lg text-blue-500">Drop the file here ...</p> :
              <p className="text-center text-lg">Drag 'n' drop your JSON file here, or click to select file</p>
          }
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error.message}</span>
        </div>
      )}

      {hasPlot && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div ref={plotRef} className="w-full h-[600px]"></div>
        </div>
      )} 
    </div>
  );
}

export default App;
