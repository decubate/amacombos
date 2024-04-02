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
        setGlazes(amacoGlazes.sort());
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
            {suggestions.length > 0 ?
              <ul className="suggestions-list">
                {suggestions.map(glaze => (
                  <li key={glaze} onClick={() => handleSuggestionClick(glaze)}>{glaze}</li>
                ))}
              </ul> : null
            }
          </div>
          <div className="selected-glazes">
            {
              selectedGlazes.size > 0 ? <p><b>Selected glazes:</b></p> : <p><b>No glazes selected</b></p>
            }
            {Array.from(selectedGlazes).map(glaze => (
              <p key={glaze}>
                <button onClick={() => handleGlazeRemoveClick(glaze)}>x</button> {glaze}
              </p>
            ))}
          </div>
          <div className="image-grid">
            {
              filteredCombinations.length > 0 ? filteredCombinations.map(([key, value]) => (
                <div key={key} className="image-item">
                  <h3>{key.split('/').map(formatGlazeId).join(' and ')}</h3>
                  {value.map((combo, index) => (
                    <a key={index} href={combo.url} target="_blank" rel="noopener noreferrer">
                      <img src={combo.imageUrl} alt={key} />
                    </a>
                  ))}
                </div>
              )) : selectedGlazes.size > 0 ? <p><b>No combinations found</b></p> : null
            }
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

const amacoGlazes = [
  'O-2 Black Tulip',
  'PCF-54 Flux Blossom',
  'PC-24 Sapphire Float',
  'PCF-18 Honeydew',
  'V-366 Teddy Bear Brown',
  'PC-53 Ancient Jasper',
  'PC-47 Emerald Falls',
  'PC-32 Albany Slip Brown',
  'C-32 Ochre',
  'PC-46 Lustrous Jade',
  'C-23 Ice',
  'V-360 White Underglaze',
  'C-3 Smoke',
  'V-314 Chocolate Brown Underglaze',
  'C-19 Glacier',
  'PCF-19 Cirrus Flow',
  'O-54 Dusty Rose',
  'PCF-74 River Birch',
  'C-49 Rainforest',
  'PC-40 True Celadon',
  'PC-49 Frosted Melon',
  'PC-65 Black Aventurine',
  'PC-61 Textured Amber',
  'PC-04 Palladium',
  'PCF-3 Midnight Run',
  'LUG-1 Black',
  'O-23 Sapphire Blue',
  'C-54 Snapdragon',
  'LUG-25 Turquoise',
  'PC-25 Textured Turquoise',
  'PC-63 Cosmic Tea Dust',
  'PC-21 Arctic Blue',
  'PCF-75 Moss Mist',
  'SH-41 Oolong Gloss',
  'V-326 Medium Blue Underglaze',
  'O-42 Moss Green',
  'PC-42 Seaweed',
  'SH-46 Matcha Matte',
  'V-384 Real Orange Underglaze',
  'LT-13 Dalmatian',
  'PC-10 June Bug',
  'V-345 Light Green Underglaze',
  'PC-29 Deep Olive Speckle',
  'O-11 White Clover',
  'PC-52 Deep Sienna Speckle',
  'C-41 Pear',
  'C-29 Deep Sea',
  'V-308 Yellow Underglaze',
  'HF-125 Turquoise',
  'V-325 Baby Blue Underglaze',
  'PC-33 Iron Lustre',
  'C-53 Weeping Plum',
  'PC-56 Ancient Copper',
  'PC-58 Tuscany',
  'V-309 Deep Yellow Underglaze',
  'V-386 Electric Blue Underglaze',
  'PC-66 Cosmic Oil Spot',
  'V-321 Lilac Underglaze',
  'HF-129 Baby Blue',
  'O-30 Autumn Leaf',
  'PC-55 Chun Plum',
  'C-55 Poppy',
  'V-322 Purple Underglaze',
  'SM-29 Blue Green',
  'V-385 Cinnamon Underglaze',
  'O-20 Bluebell',
  'PC-45 Dark Green',
  'C-43 Wasabi',
  'PC-38 Iron Yellow',
  'PC-17 Honey Flux',
  'TL-1 Low Fire Texturizer',
  'PC-28 Frosted Turquoise',
  'PC-62 Textured Amber Brown',
  'V-361 Jet Black Underglaze',
  'V-381 Amethyst Underglaze',
  'PC-57 Smokey Merlot',
  'V-376 Hunter Green Underglaze',
  'C-36 Iron',
  'O-10 Transparent Pearl',
  'V-387 Bright Red Underglaze',
  'PC-48 Art Deco Green',
  'PC-11 Blue Spark',
  'PC-34 Light Sepia',
  'C-40 Aqua',
  'C-25 Downpour',
  'PC-41 Vert Lustre',
  'V-391 Intense Yellow Underglaze',
  'PC-31 Oatmeal',
  'SM-51 Red',
  'V-375 Maroon Underglaze',
  'C-60 Marigold',
  'O-52 Fuchsia',
  'SH-42 Oolong Matte',
  'V-390 Bright Orange Underglaze',
  'PC-16 Purple Crystal',
  'PC-67 River Rock',
  'V-336 Royal Blue Underglaze',
  'HF-171 Amethyst',
  'SH-22 Acai Matte',
  'V-370 Velour Black Underglaze',
  'SH-21 Acai Gloss',
  'V-320 Lavender Underglaze',
  'PC-12 Blue Midnight',
  'PC-27 Tourmaline',
  'C-22 Fog',
  'C-47 Jade',
  'SH-32 Cacao Matte',
  'O-12 Tawny',
  'CTL-37 Desert Tortoise',
  'PC-02 Saturation Gold',
  'SH-51 Hibiscus Gloss',
  'PC-22 Blue Stone',
  'PC-23 Indigo Float',
  'PC-26 Blue Lagoon',
  'V-389 Flame Orange Underglaze',
  'SH-52 Hibiscus Matte',
  'PC-01 Saturation Metallic',
  'SH-45 Matcha Gloss',
  'V-353 Dark Green Underglaze',
  'SM-1 Black',
  'TH-1 High Fire Texturizer',
  'C-20 Cobalt',
  'SM-11 White',
  'PC-15 Satin Oribe',
  'PC-44 Sage',
  'PC-71 Flambé',
  'SH-11 Chai Gloss',
  'DC-10 Low-Fire Dipping Clear (Liquid)',
  'LUG-50 Pink',
  'O-57 Mottled Burgundy',
  'PC-30 Temmoku',
  'V-382 Red Underglaze',
  'C-21 Sky',
  'SM-10 Clear Satin',
  'C-57 Mulberry',
  'C-10 Snow',
  'PC-70 Copper Red',
  'C-5 Charcoal',
  'PC-64 Aventurine',
  'HF-10 Clear',
  'C-1 Obsidian',
  'PC-36 Ironstone',
  'V-313 Red Brown Underglaze',
  'V-343 Chartreuse Underglaze',
  'PC-09 Vintage Gold',
  'O-21 Aquamarine',
  'C-27 Storm',
  'SH-12 Chai Matte',
  'C-11 Mixing Clear',
  'SH-31 Cacao Gloss',
  'PC-20 Blue Rutile',
  'SM-63 Yellow',
  'O-26 Turquoise',
  'HF-167 Clementine',
  'C-65 Tangelo',
  'C-56 Lavender',
  'PC-59 Deep Firebrick',
  'PC-43 Toasted Sage',
  'HF-26 Turquoise',
  'C-50 Cherry Blossom',
  'HF-11 White']

export default App;
