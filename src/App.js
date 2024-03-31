import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

const App = () => {
  const [glazes, setGlazes] = useState([]);
  const [selectedGlazes, setSelectedGlazes] = useState([]);
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGlazes = async () => {
      const response = await axios.get('https://corsproxy.io/?' + encodeURIComponent("https://amaco.com/resources/layering"));
      const html = response.data;
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const items = doc.body.querySelector("div.search-glazes")
                          .querySelector("label")
                          .nextElementSibling
                          .querySelectorAll("option")
                          .values();

      const glazesArray = [...items].map((glaze) => glaze.text).filter((value) => value !== "Select Top Glaze");
      setGlazes(glazesArray);
    };

    fetchGlazes();
  }, []);

  const handleCheckboxChange = (glaze) => {
    setSelectedGlazes(prevSelectedGlazes => 
      prevSelectedGlazes.includes(glaze)
        ? prevSelectedGlazes.filter(item => item !== glaze)
        : [...prevSelectedGlazes, glaze]
    );
  };

  const handleButtonClick = async () => {
    setIsLoading(true);
    let combinations = [];
  
    for (let i = 0; i < selectedGlazes.length; i++) {
      for (let j = 0; j < selectedGlazes.length; j++) {
        if (i !== j) {
          const topGlaze = selectedGlazes[i];
          const bottomGlaze = selectedGlazes[j];
          const topId = topGlaze.toLowerCase().replace(/ /g, '-');
          const bottomId = bottomGlaze.toLowerCase().replace(/ /g, '-');
          const url = `https://amaco.com/resources/layering/${topId}-over-${bottomId}`;
          combinations.push({ url, text: `${topGlaze} over ${bottomGlaze}` });
        }
      }
    }
  
    const filteredUrls = (
      await Promise.all(combinations.map((combo) => attachValidity(combo)))
    ).filter(({valid}) => valid);
  
    setUrls(filteredUrls);
    setIsLoading(false);
  };
  
  

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleButtonClick} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Fetch Glaze Combinations'}
        </button>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {urls.length > 0 && (
              <div className="image-grid">
                {urls.map((linkObj, index) => (
                  <div key={index} className="image-item">
                    <a href={linkObj.url} target="_blank" rel="noopener noreferrer">
                      {linkObj.imageUrl ? (
                        <img src={linkObj.imageUrl} alt={linkObj.text} />
                      ) : (
                        <span>{linkObj.text}</span>
                      )}
                      <div>{linkObj.text}</div>
                    </a>
                  </div>
                ))}
              </div>
            )}
            <div className="checkbox-grid">
              {glazes.map((glaze, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    id={`checkbox-${index}`}
                    checked={selectedGlazes.includes(glaze)}
                    onChange={() => handleCheckboxChange(glaze)}
                  />
                  <label htmlFor={`checkbox-${index}`}>{glaze}</label>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </div>
  );
  
  
    
}

async function attachValidity({ text, url }) {
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const response = await axios.get(proxyUrl);
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data, 'text/html');
    const imageUrl = doc.querySelector("img.w-100").getAttribute("data-src");
    return { text, url, imageUrl, valid: true };
  } catch (error) {
    return { text, url, valid: false };
  }
  return { text, url, valid: false };
}


export default App;
