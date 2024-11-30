import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';

function GitHub({ tweetTimes, markerSize, plotWidth, plotHeight, timeZone }) {
  const plotRef = useRef(null);

  useEffect(() => {
    if (tweetTimes && plotRef.current) {
      const now = new Date();
      // Get the last day of the week
      const lastDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - now.getDay()));
      const oneYearAgo = new Date(lastDay.getFullYear()-1, lastDay.getMonth(), lastDay.getDate());
      const lastDayOneYearAgo = new Date(oneYearAgo.getFullYear(), oneYearAgo.getMonth(), oneYearAgo.getDate() + (6 - oneYearAgo.getDay()));
      const firstDayOneYearAgo = new Date(oneYearAgo.getFullYear(), oneYearAgo.getMonth(), oneYearAgo.getDate() - oneYearAgo.getDay() - 1);
      const weeksBetween = Math.floor((lastDay - lastDayOneYearAgo) / (7 * 24 * 60 * 60 * 1000));
      const daysOfYear = Array.from({ length: 7 }, () => Array.from({ length: weeksBetween }, () => 0));


      const periodInMinutes = 60;
      const minutesInDay = 24 * 60;
      const periodCount = minutesInDay / periodInMinutes;

      for (const date of tweetTimes) {
        const dt = new Date(date);
        const dayOfWeek= dt.getDay();
        const weekOfYear = Math.floor((dt - firstDayOneYearAgo) / (7 * 24 * 60 * 60 * 1000)) - 1;
        daysOfYear[dayOfWeek][weekOfYear]++;

      }

      const daysAsStrings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const periods = Array.from({ length: periodCount }, (_, i) => i);

      const layout = {
        xaxis: {
          showgrid: false,
          zeroline: false,
          showline: false,
          ticks: '',
          scaleanchor: 'y',
        },
        yaxis: {
          range: [-0.5, 6.5],
          showgrid: false,
          zeroline: false,
          showline: false,
          tickvals: [0, 1, 2, 3, 4, 5, 6],
          ticktext: daysAsStrings,
          ticks: '',
        },
        width: plotWidth,
      };
      
      var data = [
        {
          z: daysOfYear,
          type: 'heatmap',
          xgap: 3,
          ygap: 3,
          colorscale: [
            [0, 'rgba(0, 0, 0, 0.3)'],
            [1.0, 'rgba(145, 47, 192, 1)']
          ],
          showscale: false,
        }
      ];

      Plotly.newPlot(plotRef.current, data, layout);
    }
  }, [tweetTimes, markerSize, plotWidth, plotHeight, timeZone]);

  return (
    <div className={`flex justify-center bg-white w-[${plotWidth}px] shadow-lg rounded-lg p-6`}>
      <div ref={plotRef} className={`flex justify-center w-full h-[${plotHeight}px]`}></div>
    </div>
  );
}

export default GitHub; 
