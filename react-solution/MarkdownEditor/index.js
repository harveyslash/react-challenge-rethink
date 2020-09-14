import React from "react";
import PropTypes from "prop-types";
import { useState, useEffect } from 'react';
import ReactMde from "react-mde";

import css from "./react-mde-all.css"
import * as Showdown from "showdown";


const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
});


function MarkdownEditor({ file, write }) {
  const [text,setText] = useState('');
  const [selectedTab, setSelectedTab] = useState(true);

  let fileReader;

  const handleFileRead = (e) =>{
    setText(fileReader.result)
  }

  useEffect(() => {

    console.log("in useEffect")
    fileReader = new FileReader()
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);

  },[file]);



  return (
    <div >



      <div className="container">
      <ReactMde
        value={text}
        selectedTab={selectedTab?"write":"preview"}
        onTabChange={()=>{setSelectedTab(!selectedTab)}}
        onChange= {  (e)=> {setText(e)
          const name = file.name;
          file = new File([e], name, { type: file.type });

          write(file);


        } }
          generateMarkdownPreview={markdown =>
          Promise.resolve(converter.makeHtml(markdown))
        }
      />
    </div>


      {/* <textarea onChange = {e=> {

        const newText = e.target.value;
        const name = file.name;
        file = new File([newText], name, { type: file.type });


        setText(e.target.value);
        write(file);




      }} ></textarea> */}


    </div>
  );
}

MarkdownEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default MarkdownEditor;
