import React, { useState, useEffect } from 'react';
import './App.css';
import LinkHandler from './LinkHandler';

function App() {

  const appId = process.env.REACT_APP_API_ID;
  const appKey = process.env.REACT_APP_API_KEY;

  const [pageNumber, setPageNumber] = useState(400); // alustetaan sivunumero 100
  const [teletextData, setTeletextData] = useState(null); // alustetaan Teletext-data aluksi null-arvoksi, säilyttää siis haetun datan

  // useEffect-hookia käytetään API-kutsuihin
  // suoritetaan aina, kun pageNumber muuttuu
  useEffect(() => {
    fetch(`https://external.api.yle.fi/v1/teletext/pages/${pageNumber}.json?app_id=${appId}&app_key=${appKey}`)
      .then(response => response.json())
      .then(data => setTeletextData(data))// tallenetaan data
      .catch(error => console.error('Error fetching data:', error));
  }, [pageNumber]); // suoritetaan joke kerta kun pageNumber muuttuu

  // käsitellään linkkien kautta navigointi
  const handleNavigation = (linkPageNumber) => {
    const parsedPageNumber = parseInt(linkPageNumber, 10); // muutetaan linkin numero numeroksi
    if (!isNaN(parsedPageNumber)) { //validin varmistus
      setPageNumber(parsedPageNumber); // päivitetään sivunmeron tilaan
    }
  };


  return (
    <div id="teletext-content">
      <h1>YleTextNext</h1>

      {/*tarkistetaan onko data ladattu */}
      {teletextData ? (
        <div>
          {/*kädäydään läpi alasivut */}
          {teletextData.teletext.page.subpage.map((subpage, index) => (
            <div key={index}>
              {/*suodatetaan structured-tyyppinen sisältö ja näytetään se */}
              {subpage.content
                .filter(item => item.type === 'structured') //näytetään vain structured-tyyppinen sisältö
                .map((structuredContent, i) => (
                  structuredContent.line.map((line, j) => (
                    <LinkHandler key={j} line={line} onNavigate={handleNavigation} /> // LinkHandler käsitellee yksittäise rivit ja navigoinnin
                  ))
                ))}
            </div>
          ))}
        </div>
      ) : (
        //näytettää kunnes data on ladattu
        <p className="teletext-line">Loading...</p>
      )}

      <button onClick={() => setPageNumber(pageNumber + 1)}>Next Page</button>
    </div>
  );
}



export default App;