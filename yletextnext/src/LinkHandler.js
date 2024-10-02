import React from 'react';
import './LinkHandler.css';

function LinkHandler({ line, onNavigate }) {
  // Tarkistetaan, että 'run' on olemassa ja se on taulukko
  if (Array.isArray(line.run)) {
    return (
      <p className="teletext-line">
        {line.run.map((segment, index) => {
          // Jos segmentissä on linkki, renderöidään se linkkinä
          if (segment.link) {
            return (
              <span
                key={index}
                className="teletext-link"
                onClick={() => onNavigate(segment.link)} // Navigoi linkin osoittamaan sivuun
              >
                {segment.Text || segment.link}
              </span>
            );
          }
          // Muuten renderöidään normaalisti
          return <span key={index}>{segment.Text || ''}</span>;
        })}
      </p>
    );
  } else if (line.run) {
    // Käsitellään yksittäiset objektit jos 'run' ei ole taulukko
    return (
      <p className="teletext-line">
        {line.run.link ? (
          <span
            className="teletext-link"
            onClick={() => onNavigate(line.run.link)}
          >
            {line.run.Text || line.run.link}
          </span>
        ) : (
          <span>{line.run.Text || ''}</span>
        )}
      </p>
    );
  }

  // Jos 'run' ei ole olemassa tai se ei ole taulukko
  return <p className="teletext-line">{line.Text || ''}</p>;
}

export default LinkHandler;
