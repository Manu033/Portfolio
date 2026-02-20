import { useState } from 'react';
import TabButton from "./TabButton.jsx";
import { EXAMPLES } from "../data"



export default function Examples(){

    function handleSelect(selectButton){
        setSelectTopic(selectButton);
    }
    
    const [ selectTopic, setSelectTopic] = useState();

    let tabContent = <p>Por favor selecciona una pestaña</p>;

    if(selectTopic){
        tabContent = (
            <div id="tab-content">
            <h3>{EXAMPLES[selectTopic].title}</h3>
            <p>{EXAMPLES[selectTopic].description}</p>
            <pre>
              <code>
                {EXAMPLES[selectTopic].code}
              </code>
            </pre>
          </div>
        )
    }


    return(
        <section id="examples">
          <menu>
            <TabButton isSelected={selectTopic === 'components'} onSelect={() => handleSelect('components')}>Components</TabButton>
            <TabButton isSelected={selectTopic === 'jsx'} onSelect={() => handleSelect('jsx')}>JSX</TabButton>
            <TabButton isSelected={selectTopic === 'props'} onSelect={() => handleSelect('props')}>Props</TabButton>
            <TabButton isSelected={selectTopic === 'state'} onSelect={() => handleSelect('state')}>State</TabButton>
          </menu>
        {tabContent}
    
        </section>
        
    )
}