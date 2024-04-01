import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [combinations, setCombinations] = useState({});
  const [glazes, setGlazes] = useState([]);
  const [selectedGlazes, setSelectedGlazes] = useState(new Set());

  useEffect(() => {
    fetch('/amacombos/glaze_combinations.json')
      .then(response => response.json())
      .then(data => {
        setCombinations(data);
        // Extract glaze names from the keys to create the checkbox list
        const glazeSet = new Set();
        Object.keys(data).forEach(key => {
          const [glaze1, glaze2] = key.split('/');
          glazeSet.add(glaze1);
          glazeSet.add(glaze2);
        });
        setGlazes(Array.from(glazeSet).sort());
      })
      .catch(error => {
        console.error('Error fetching JSON:', error);
      });
  }, []);

  const handleCheckboxChange = (glaze) => {
    const updatedSelection = new Set(selectedGlazes);
    if (updatedSelection.has(glaze)) {
      updatedSelection.delete(glaze);
    } else {
      updatedSelection.add(glaze);
    }
    setSelectedGlazes(updatedSelection);
  };

  const filteredCombinations = Object.entries(combinations).filter(([key]) => {
    const [glaze1, glaze2] = key.split('/');
    return selectedGlazes.has(glaze1) && selectedGlazes.has(glaze2);
  });


  return (
    <div className="App">
      <header className="App-header">
        <div className="checkbox-grid">
          {glazes.map(glaze => (
            <label key={glaze}>
              <input
                type="checkbox"
                checked={selectedGlazes.has(glaze)}
                onChange={() => handleCheckboxChange(glaze)}
              />
              {
              formatGlazeId(glaze)}
            </label>
          ))}
        </div>
        <div>
          {filteredCombinations.map(([key, value]) => (
            <div key={key}>
              <h3>{key.split('/').map((value) => formatGlazeId(value)).join(' and ')}</h3>
              {value.map((combo, index) => (
                <div key={index}>
                  <a href={combo.url} target="_blank" rel="noopener noreferrer">
                    <img src={combo.imageUrl} alt={key} style={{ width: '100px', height: 'auto' }} />
                  </a>
                </div>
              ))}
            </div>
          ))}
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
  }
  )
  .join(' ').replace(' ', '-');
}

export default App;
