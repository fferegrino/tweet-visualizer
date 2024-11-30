import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import moment from 'moment-timezone';
import ControlPanel from './ControlPanel';
import FAQ from './FAQ';
import Plotly from 'plotly.js-dist-min';
import TheEconomist from './plots/TheEconomist';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasPlot, setHasPlot] = useState(false);
  const [tweetTimes, setTweetTimes] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [timezone, setTimezone] = useState('UTC');
  const [markerSize, setMarkerSize] = useState(1);
  const [plotHeight, setPlotHeight] = useState(500);
  const [plotWidth, setPlotWidth] = useState(500);

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
        setTweetTimes(processedData);
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
    return dates;
  }

  const handleTimezoneChange = (newTimezone) => {
    setTimezone(newTimezone);
    if (rawData) {
      const processedData = processData(rawData, newTimezone);
      setTweetTimes(processedData);
    }
  };

  const handleMarkerSizeChange = (newSize) => {
    setMarkerSize(newSize);
    if (rawData) {
      const processedData = processData(rawData, timezone);
      setTweetTimes(processedData);
    }
  };

  const handleDownload = async () => {
    const plotElement = document.querySelector('[data-js="plot"]');
    if (plotElement) {
      const image = await Plotly.toImage(plotElement, {
        format: 'png',
        width: plotWidth,
        height: plotHeight,
        scale: 3
      });
      const a = document.createElement('a');
      a.href = image;
      a.download = 'tweet_timeline.png';
      a.click();
    }
  };

  const titleClasses = ['font-bold', 'text-center', 'text-blue-600', 'mb-4'];
  if (hasPlot) {
    titleClasses.push('text-2xl');
  } else {
    titleClasses.push('text-4xl');
  }

  return (
    <div className="App bg-gray-100 min-h-screen p-8">
      <h1 className={titleClasses.join(' ')}>Tweet Timeline Visualization</h1>

      {!hasPlot && (
        <div {...getRootProps()} className="bg-white h-[300px] shadow-lg rounded-lg p-6 mb-8 cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 transition duration-300">
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p className="text-center text-lg text-blue-500">Drop the file here ...</p> :
              <p className="text-center text-lg">Drag 'n' drop your <span className='font-bold'>tweets.js</span> file here, or click to select file</p>
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
        <>
          <ControlPanel
            timezone={timezone}
            onTimezoneChange={handleTimezoneChange}
            markerSize={markerSize}
            onMarkerSizeChange={handleMarkerSizeChange}
            isDownloadEnabled={hasPlot}
            onDownload={handleDownload}
          />

          <TheEconomist
            tweetTimes={tweetTimes}
            markerSize={markerSize}
            plotWidth={plotWidth}
            plotHeight={plotHeight}
            timeZone={timezone}
          />

          <div className="flex-1 min-w-[200px] flex items-end mt-4">
            <button
              onClick={handleDownload}
              disabled={!hasPlot}
              className="w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Download
            </button>
          </div>
        </>
      )}

      <div className="bg-blue-50 text-blue-700 px-4 py-2 text-xs rounded relative text-center mt-4" role="alert">
        follow me <a target="_blank" href="https://bsky.app/profile/feregri.no" className="text-blue-700 underline">Bluesky @feregri.no</a>
      </div>
      <FAQ />
    </div>
  );
}

export default App;
