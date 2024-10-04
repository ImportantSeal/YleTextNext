import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const appId = process.env.REACT_APP_API_ID;
  const appKey = process.env.REACT_APP_API_KEY;

  const [pageNumber, setPageNumber] = useState(101); // Alustetaan sivunumero 100
  const [teletextData, setTeletextData] = useState(null); // Tallennetaan API data
  const [inputPageNumber, setInputPageNumber] = useState(''); // käyttäjän syöttämä sivunumero

  // haetaan Teletext-dataa Yle API:sta aina kun pageNumber muuttuu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://external.api.yle.fi/v1/teletext/pages/${pageNumber}.json?app_id=${appId}&app_key=${appKey}`
        );
        if (!response.ok) {
          throw new Error('Verkkovirhe: ' + response.statusText);
        }
        const data = await response.json();
        console.log(data); // Logita data, jotta näet, mitä tietoja saat takaisin
        setTeletextData(data);
      } catch (error) {
        console.error('Virhe haettaessa dataa:', error);
      }
    };

    fetchData();
  }, [pageNumber]); // haetaan tiedot aina kun pageNumber muuttuu

  // käsitellään käyttäjän syöttämä sivunumero
  const handlePageNumberSubmit = (e) => {
    e.preventDefault();
    const parsedPageNumber = parseInt(inputPageNumber, 10);
    if (!isNaN(parsedPageNumber)) {
      setPageNumber(parsedPageNumber); // päivitetään sivunumero, jos se on kelvollinen
      setInputPageNumber(''); // tyhjennetään syöttölaatikko
    }
  };

  // tunnistaa kolminumeroiset luvut ja tekee niistä klikattavia linkkejä
  const renderLineWithLinks = (text) => {
    const regex = /(\d{3,})/g; // Etsitään kolminumeroiset tai pidemmät luvut
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (!part) return null; // Varmistetaan, että part ei ole undefined tai null

      // Jos osa on kolminumeroinen luku mutta ei pidempi kuin kolme, tehdään siitä linkki, estetään täten puhelin nro:t jne
      if (/^\d{3}$/.test(part)) {
        return (
          <span
            key={index}
            className="page-link"
            onClick={() => setPageNumber(parseInt(part, 10))}
            style={{ color: 'white', cursor: 'pointer', fontWeight: 'bold'}}
          >
            {part}
          </span>
        );
      }

      // Jos osa on pidempi kuin kolme numeroa, jätetään se tavalliseksi tekstiksi
      if (/^\d{4,}$/.test(part)) {
        return <span key={index}>{part}</span>;
      }

      return <span key={index}>{part}</span>; // Muut osat jäävät normaaliksi tekstiksi
    });
  };

  // Näytetään kaikkien alasivujen sisältö
  const renderTeletextContent = () => {
    if (teletextData && teletextData.teletext && teletextData.teletext.page.subpage) {
      return teletextData.teletext.page.subpage.map((subpage, subpageIndex) => (
        <div key={subpageIndex} className="teletext-subpage">
          <h2>{subpage.number}.</h2> {/*Alasivun numero*/}
          <h2 className='pageNumber'>{pageNumber}</h2>
          {subpage.content.map((item, itemIndex) => {
            if (item.type === 'text') {
              return item.line.map((line, lineIndex) => (
                <div key={`${itemIndex}-${lineIndex}`} className="teletext-line">
                  {renderLineWithLinks(line.Text || '')} {/* Muokkaa tekstin sisältö */}
                </div>
              ));
            }
            return null;
          })}
        </div>
      ));
    }
    return <div>Ei sisältöä saatavilla.</div>;
  };

  return (
    <div className="App">
      <h1>YleTextNext</h1>

      <div className= "navigation-box">
        <form onSubmit={handlePageNumberSubmit}>
          <label htmlFor='page-number-input'>Siirry Sivulle</label>
          <input
          type="text"
          id="page-number-input"
          value={inputPageNumber}
          onChange={(e) => setInputPageNumber(e.target.value)}
          placeholder= "Syötä sivunumero"
          />
          <button type="submit">Siirry</button>
        </form>
        <p>Nykyinen sivu: {pageNumber}</p> {/* Näytetään nykyinen sivunumero */}
      </div>

      <div id="teletext-content">
        {renderTeletextContent()}
      </div>
    </div>
  );
}

export default App;
