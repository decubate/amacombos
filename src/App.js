import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [combinations, setCombinations] = useState({});
  const [glazes, setGlazes] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedGlazes, setSelectedGlazes] = useState(new Set());

  useEffect(() => {
    fetch('/amacombos/glaze_combinations.json')
      .then(response => response.json())
      .then(data => {
        setCombinations(data);
        const glazeSet = new Set();
        Object.keys(data).forEach(key => {
          const [glaze1, glaze2] = key.split('/');
          glazeSet.add(formatGlazeId(glaze1));
          glazeSet.add(formatGlazeId(glaze2));
        });
        setGlazes(Array.from(glazeSet).sort());
      })
      .catch(error => {
        console.error('Error fetching JSON:', error);
      });
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (!value) {
      setSuggestions([]);
      return;
    }
    setSuggestions(glazes.filter(glaze => glaze.toLowerCase().includes(value.toLowerCase())));
  };

  const handleSuggestionClick = (glaze) => {
    setSelectedGlazes(new Set([...selectedGlazes, glaze]));
    setInputValue('');
    setSuggestions([]);
  };

  const handleGlazeRemoveClick = (glaze) => {
    const newGlazes = new Set(selectedGlazes);
    newGlazes.delete(glaze);
    setSelectedGlazes(new Set(newGlazes));
  };  

  const filteredCombinations = Object.entries(combinations).filter(([key]) => {
    const [glaze1, glaze2] = key.split('/');
    return selectedGlazes.has(formatGlazeId(glaze1)) && selectedGlazes.has(formatGlazeId(glaze2));
  });

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-container">
          <div className="input-field">
            <input
              type="text"
              placeholder="Start typing a glaze..."
              value={inputValue}
              onChange={handleInputChange}
            />
            { suggestions.length > 0 ?
            <ul className="suggestions-list">
              {suggestions.map(glaze => (
                <li key={glaze} onClick={() => handleSuggestionClick(glaze)}>{glaze}</li>
              ))}
            </ul> : null
            }
          </div>
          <div className="selected-glazes">
            <p><b>Selected glazes:</b></p>
            {Array.from(selectedGlazes).map(glaze => (
              <p key={glaze}>
                <button onClick={() => handleGlazeRemoveClick(glaze)}>x</button> {glaze}
              </p>
            ))}
          </div>
          <div className="image-grid">
            {filteredCombinations.map(([key, value]) => (
              <div key={key} className="image-item">
                <h3>{key.split('/').map(formatGlazeId).join(' and ')}</h3>
                {value.map((combo, index) => (
                  <a key={index} href={combo.url} target="_blank" rel="noopener noreferrer">
                    <img src={combo.imageUrl} alt={key} />
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </header>
    </div>
  );  
};

function formatGlazeId(glazeId) {
  return glazeId.split('-').map((part, index) => {
    if (!isNaN(part)) {
      return part;
    }
    return index === 0 ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  }).join(' ').replace(' ', '-');
}

export default App;
