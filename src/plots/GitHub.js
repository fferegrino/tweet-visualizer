import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';

function GitHub({ tweetTimes, markerSize, plotWidth, plotHeight, timeZone }) {
  const plotRef = useRef(null);

  useEffect(() => {
    if (tweetTimes && plotRef.current) {
      const now = new Date();
      // Get the last day of the week
      const lastDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - now.getDay()));
      const oneYearAgo = new Date(lastDay.getFullYear() - 1, lastDay.getMonth(), lastDay.getDate());
      const weeksBetween = Math.floor((lastDay - oneYearAgo) / (7 * 24 * 60 * 60 * 1000));
      const daysOfYear = Array.from({ length: 7 }, () => Array.from({ length: weeksBetween + 1 }, () => 0));
      console.log(
        'Last day:', lastDay,
        'One year ago:', oneYearAgo,
        'Weeks between:', weeksBetween,
        'Days of year:', daysOfYear
      ) 

      const periodInMinutes = 60;
      const minutesInDay = 24 * 60;
      const periodCount = minutesInDay / periodInMinutes;


      let maxCount = 0;

      for (const date of tweetTimes) {
        const dt = new Date(date);
        const dayOfWeek= dt.getDay();
        const weekOfYear = Math.floor((dt - oneYearAgo) / (7 * 24 * 60 * 60 * 1000));
        daysOfYear[dayOfWeek][weekOfYear]++;

      }


      const xMargin = 0.5;
      const yMargin = 0.5;

      // const daysAsStrings = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const daysAsStrings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const periods = Array.from({ length: periodCount }, (_, i) => i);
      const periodsAsStrings = periods.map((_, i) => {
        if ( i % 6 !== 0) {
          return '';
        }
        const startMinute = i * periodInMinutes;
        const endMinute = (i + 1) * periodInMinutes;
        let startHour = Math.floor(startMinute / 60);
        const startMinuteInHour = startMinute % 60;
        const endHour = Math.floor(endMinute / 60);
        const endMinuteInHour = endMinute % 60;

        let suffix = 'AM';
        if (startHour >= 12) {
          suffix = 'PM';
          if (startHour > 12) {
            startHour -= 12;
          }
        }
        
        return `${startHour}:${startMinuteInHour.toString().padStart(2, '0')} ${suffix}`;
      })

      const layout = {
        xaxis: {
          // range: [0 - xMargin, 6 + xMargin],
          showgrid: false,
          zeroline: false,
          showline: false,
          tickvals: Array.from({ length: weeksBetween }, (_, i) => i),
          // tickvals: [0, 1, 2, 3, 4, 5, 6],
          // ticktext: daysAsStrings,
          ticks: '',
          // side: 'top',
          scaleanchor: 'y',
        },
        yaxis: {
          // range: [0 - yMargin, (periodCount - 1) + yMargin],
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
            [0, 'rgba(145, 47, 192, 0)'],
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
