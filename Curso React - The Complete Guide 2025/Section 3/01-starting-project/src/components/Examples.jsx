import { useState } from 'react';
import Section from "./Section.jsx";
import TabButton from "./TabButton.jsx";
import Tabs from "./Tabs.jsx";
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
        <Section 
        title="Examples"
        id="examples">
          <Tabs 
            buttons={
              <>
              <TabButton isSelected={selectTopic === 'components'} onClick={() => handleSelect('components')}>Components</TabButton>
              <TabButton isSelected={selectTopic === 'jsx'} onClick={() => handleSelect('jsx')}>JSX</TabButton>
              <TabButton isSelected={selectTopic === 'props'} onClick={() => handleSelect('props')}>Props</TabButton>
              <TabButton isSelected={selectTopic === 'state'} onClick={() => handleSelect('state')}>State</TabButton>
              </>
            }
            ButtonsContainer="menu"
          >
            {tabContent}
          </Tabs>    
        </Section>
        
    )
}