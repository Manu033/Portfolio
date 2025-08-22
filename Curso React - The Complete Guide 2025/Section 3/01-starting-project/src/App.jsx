
import Header from "./components/Header.jsx";
import CoreConcept from "./components/CoreConcept.jsx"
import TabButton from "./components/TabButton.jsx"
import { CORE_CONCEPTS } from "./data.js"; 
import { EXAMPLES } from "./data.js"; 

import { useState } from 'react';


function App() {
  function handleSelect(selectButton){
    setSelectTopic(selectButton);
  }

  const [ selectTopic, setSelectTopic] = useState();


  return (
    <div>
      <Header />
      <main>
        <section id="core-concepts">
          <h2>Core Concepts</h2>
          <ul>
            {CORE_CONCEPTS.map((conceptItem) => (
              <CoreConcept key={conceptItem.title} {...conceptItem} />
            ))} 
          </ul>
        </section>
        <section id="examples">
          <menu>
            <TabButton isSelected={selectTopic === 'components'} onSelect={() => handleSelect('components')}>Components</TabButton>
            <TabButton isSelected={selectTopic === 'jsx'} onSelect={() => handleSelect('jsx')}>JSX</TabButton>
            <TabButton isSelected={selectTopic === 'props'} onSelect={() => handleSelect('props')}>Props</TabButton>
            <TabButton isSelected={selectTopic === 'state'} onSelect={() => handleSelect('state')}>State</TabButton>
          </menu>
          {!selectTopic && <p>Por favor selecciona una pestaña</p>}
          {selectTopic && (
            <div id="tab-content">
            <h3>{EXAMPLES[selectTopic].title}</h3>
            <p>{EXAMPLES[selectTopic].description}</p>
            <pre>
              <code>
                {EXAMPLES[selectTopic].code}
              </code>
            </pre>
          </div>
          )}
        </section>
      </main>
  
    </div>
  );
}

export default App;
