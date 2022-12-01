import { Button } from "antd";
import React, { useState } from "react";
import { dictionary, listCard, manualDictionary } from "../constantsHandle";

const Step4 = () => {
  const [fileContent, setFileContent] = useState("");

  const onReplace = () => {
    let newContent = fileContent;
    console.log({ ...manualDictionary, ...dictionary, ...listCard });
    Object.entries({ ...manualDictionary, ...dictionary, ...listCard })
      .sort((a, b) => b[0].length - a[0].length)
      .forEach((item) => {
        newContent = newContent.replaceAll(item[0], item[1]);
      });
    console.log(newContent);
  };
  const showFile = () => {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      var preview = document.getElementById("show-text");
      var file = document.querySelector("input[type=file]").files[0];
      var reader = new FileReader();

      var textFile = /text.*/;

      if (file.type.match(textFile)) {
        reader.onload = function (event) {
          setFileContent(event.target.result);
        };
      } else {
        preview.innerHTML =
          "<span class='error'>It doesn't seem to be a text file!</span>";
      }
      reader.readAsText(file);
    } else {
      alert("Your browser is too old to support HTML5 File API");
    }
  };
  return (
    <div>
      <input type="file" onChange={showFile} />
      <Button className="" onClick={onReplace}>
        <span>Replace</span>
      </Button>
    </div>
  );
};

export default Step4;
