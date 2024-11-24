import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Plotly from 'plotly.js-dist-min';
import moment from 'moment-timezone';
import TimezoneSelector from './TimezoneSelector';
import ControlPanel from './ControlPanel';
import FAQ from './FAQ';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasPlot, setHasPlot] = useState(false);
  const [plotData, setPlotData] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [timezone, setTimezone] = useState('UTC');
  const [markerSize, setMarkerSize] = useState(2);
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
        size: 1,
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

  margin: {
    l:100,
    r: 100,
    b: 50,
    t: 30,
          pad: 4
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

  const handleTimezoneChange = (newTimezone) => {
    setTimezone(newTimezone);
    if (rawData) {
      const processedData = processData(rawData, newTimezone);
      setPlotData(processedData);
    }
  };

  const handleMarkerSizeChange = (newSize) => {
    setMarkerSize(newSize);
    if (rawData) {
      const processedData = processData(rawData, timezone);
      setPlotData({...processedData, marker: {...processedData.marker, size: newSize}});
    }
  };

  return (
    <div className="App bg-gray-100 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Tweet Timeline Visualization</h1>
      
      <ControlPanel 
        timezone={timezone} 
        onTimezoneChange={handleTimezoneChange}
        markerSize={markerSize}
        onMarkerSizeChange={handleMarkerSizeChange}
      />

      {!hasPlot && (
        <div {...getRootProps()} className="bg-white h-[300px] shadow-lg rounded-lg p-6 mb-8 cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 transition duration-300">
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
          <div ref={plotRef} className="w-full h-[500px]"></div>
        </div>
      )} 

      <FAQ /> 
    </div>
  );
}

export default App;
