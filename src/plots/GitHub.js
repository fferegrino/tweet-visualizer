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
      const lastDayOneYearAgo = new Date(oneYearAgo.getFullYear(), oneYearAgo.getMonth(), oneYearAgo.getDate() + (6 - oneYearAgo.getDay()));
      const firstDayOneYearAgo = new Date(oneYearAgo.getFullYear(), oneYearAgo.getMonth(), oneYearAgo.getDate() - oneYearAgo.getDay() - 1);
      const weeksBetween = Math.floor((lastDay - lastDayOneYearAgo) / (7 * 24 * 60 * 60 * 1000));
      const daysOfYear = Array.from({ length: 7 }, () => Array.from({ length: weeksBetween }, () => 0));
      const daysOfYearLabels = Array.from({ length: 7 }, () => Array.from({ length: weeksBetween }, () => ''));

      const day = 24 * 60 * 60 * 1000;
      const week = 7 * day;

      for (const date of tweetTimes) {
        const dt = new Date(date);
        const dayOfWeek = dt.getDay();
        const weekOfYear = Math.floor((dt - lastDayOneYearAgo - day) / week);
        daysOfYear[dayOfWeek][weekOfYear]++;
      }

      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < weeksBetween; j++) {
          const date = new Date(firstDayOneYearAgo.getTime() + (i+ 1) * day + (j + 1) * week);
          const contributions = daysOfYear[i][j];
          const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
          const stOrnd = contributions === 1 ? 'contribution' : 'contributions';  
          daysOfYearLabels[i][j] = `${contributions} ${stOrnd} on ${formattedDate}`;
        }
      }

      const alreadyExistingMonths = new Set();
      const labels = [];
      for (let i = 1; i < weeksBetween + 1; i++) {
        const dt = new Date(lastDayOneYearAgo);
        dt.setDate(dt.getDate() + i * 7);
        if (!alreadyExistingMonths.has(`${dt.getMonth()}-${dt.getFullYear()}`)) {
          alreadyExistingMonths.add(`${dt.getMonth()}-${dt.getFullYear()}`);
          labels.push(dt.toLocaleDateString('en-US', { month: 'short' }));
        }
        else {
          labels.push('');
        }
      }

      const daysAsStrings = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

      const sizeRatio = 1 / (weeksBetween / 7);
      

      const layout = {
        xaxis: {
          range: [0, weeksBetween + 1],
          showgrid: false,
          zeroline: false,
          showline: false,
          ticks: '',
          tickvals: Array.from({ length: weeksBetween }, (_, i) => i),
          ticktext: labels,
          scaleanchor: 'y',
          side: 'top'
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
        height: plotWidth * sizeRatio + 150,
      };

      var data = [
        {
          z: daysOfYear,
          text: daysOfYearLabels,
          type: 'heatmap',
          hoverinfo: 'text',
          xgap: 5,
          ygap: 5,
          colorscale: [
            [0, '#ebedf0'],
            [0.20, '#9be9a8'],
            [0.40, '#40c463'],
            [0.60, '#30a14e'],
            [0.80, '#216e39'],
            [1.0, '#216e39'],
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
