import React from "react";
import PropTypes from "prop-types";
import { useState, useEffect } from 'react';

import css from "./style.css";

function PlaintextEditor({ file, write }) {

  const [text,setText] = useState('');
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



  console.log(file, write);
  return (
    <div className={css.editor}>

       <textarea
       value={text}

       onChange={
         (e)=>{

          setText(e.target.value)
          console.log(e)

          const name = file.name;
          file = new File([e], name, { type: file.type });

          write(file);

      }}
      className={css.box}>

      </textarea>
    </div>
  );
}

PlaintextEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default PlaintextEditor;
