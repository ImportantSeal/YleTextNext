import React from 'react';
import './LinkHandler.css';

function LinkHandler({ line, onNavigate }) {
  // Tarkistetaan, onko line.run array
  if (Array.isArray(line.run)) {
    return (
      <p className="teletext-line">
        {/* Käydään läpi line.run array */}
        {line.run.map((segment, index) => {
          // jos segmentissä on linkki, näytetään se erityisellä tyylillä ja navigointitoiminnolla
          if (segment.link) {
            return (
              <span
                key={index}
                className="teletext-link"
                onClick={() => onNavigate(segment.link)} // navigointi kutsutaan linkin numerolla
              >
                {segment.Text}
              </span>
            );
          }
          // jos ei ole linkkiä, näytetään teksti normaalisti
          return <span key={index}>{segment.Text}</span>;
        })}
      </p>
    );
  } else if (line.run) {
    // jos line.run ei ole array vaan objekti, käsitellään se erikseen
    return (
      <p className="teletext-line">
        {line.run.link ? (
          <span
            className="teletext-link"
            onClick={() => onNavigate(line.run.link)} // navigointi kutsutaan linkin numerolla
          >
            {line.run.Text}
          </span>
        ) : (
          <span>{line.run.Text}</span> // näytetään teksti normaalisti jos ei ole linkkiä
        )}
      </p>
    );
  }

  // fallback jos run ei ole olemassa
  return <p className="teletext-line">{line.Text}</p>;
}

export default LinkHandler;
