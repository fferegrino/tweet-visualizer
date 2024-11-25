import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';

function TheEconomist({ tweetTimes, markerSize, plotWidth, plotHeight }) {
  const plotRef = useRef(null);

  useEffect(() => {
    if (tweetTimes && plotRef.current) {
      const minutesOfDay = tweetTimes.map(date => date.hours() * 60 + date.minutes());
      const dateOnly = tweetTimes.map(date => date.format('YYYY-MM-DD'));

      const thing = {
        x: dateOnly,
        y: minutesOfDay,
        mode: 'markers',
        type: 'scatter',
        marker: {
          size: markerSize,
          color: '#ff0000'
        },
        hoverinfo: 'text+x+y'
      };

      const minutesToHighlight = [0, 6 * 60, 12 * 60, 18 * 60, 24 * 60 - 1];
      const textToHighlight = ['00:00', '06:00', '12:00', '18:00', '23:59'];
      const layout = {
        width: plotWidth,
        height: plotHeight,
        margin: {
          l: 70,
          r: 70,
          b: 50,
          t: 50,
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
        plot_bgcolor: 'hsl(51, 22%, 95%)',
        annotations: [
          {
            xref: 'paper',
            yref: 'paper',
            x: 0,
            xanchor: 'left',
            y: 0,
            yanchor: 'bottom',
            text: 'https://tweet-visualizer.netlify.app/',
            font: {
              size: 10,
              color: '#adadad'
            },
            showarrow: false
          },
        ]
      };

      Plotly.newPlot(plotRef.current, [thing], layout, {
        responsive: true,
        staticPlot: true,
      });
    }
  }, [tweetTimes, markerSize, plotWidth, plotHeight]);

  return (
    <div className={`flex justify-center bg-white w-[${plotWidth}px] shadow-lg rounded-lg p-6`}>
      <div ref={plotRef} className={`flex justify-center w-full h-[${plotHeight}px]`}></div>
    </div>
  );
}

export default TheEconomist; 
