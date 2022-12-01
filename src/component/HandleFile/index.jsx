import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { translate1, translate2 } from "../constantsSave";

const HandleFile = () => {
  const [list, setList] = useState([]);
  const [character, setCharacter] = useState({});
  const [translate, setTranslate] = useState({});
  const [fileContent, setFileContent] = useState("");
  const extractData = (charData, translate) => {
    const listExtract = [];
    Object.entries(charData).forEach((character) => {
      const [keyName, info] = character;
      console.log(character, translate);
      listExtract.push({
        name: translate[keyName],
        sex: info[0],
        health: info[2],
        skill: info[3]?.map((item) => ({
          skillName: translate[item],
          info: translate[`${item}_info`],
        })),
        unit: info[1],
      });
    });
    setList(listExtract);
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
  const bracket = ["{", "}"];
  var jsonStr = (objText) =>
    // objText
    //   .split("\r\n")
    //   .slice(1, -1)
    //   .filter((item) => item.trim().indexOf("//") && item.includes(": "))
    //   .forEach((item) => {
    //     // console.log(item.trim().split(/(\w+: )/g));
    //     const [_, key, value] = item.split(/(\w+: )/g);
    //     list[key] = value;
    //   });
    objText.replace(/(\w+: )/g, function (matchedStr) {
      return `"${matchedStr.substring(0, matchedStr.length - 1)}":`;
    });

  const handle = (file, key) => {
    const index = file.indexOf(`${key}: `);
    const content = file.slice(index);
    let flag = 0;
    let temp = "";
    for (const char of content) {
      if (char === bracket[0]) {
        temp += char;
        flag += 1;
      } else if (flag & (char !== bracket[1])) {
        temp += char;
      } else if (char === bracket[1]) {
        if (flag === 1) {
          temp += char;
          return jsonStr(temp);
        }
        flag -= 1;
      }
    }
    return {};
  };

  useEffect(() => {
    const characterData = handle(fileContent, "character");
    const translateData = handle(fileContent, "translate");
    console.log(characterData);
    // setCharacter(characterData);
    // setTranslate(translateData);
  }, [fileContent]);
  useEffect(() => {
    let count = [];
    let list = {};
    Object.entries(translate1).forEach((item) => {
      for (const [key, value] of Object.entries(item[1])) {
        if (list[key] === undefined) {
          list[key] = value;
        } else {
          count.push(key);
        }
      }
    });
    // console.log(translate2);
    console.log({ count, list });
  }, []);
  return (
    <div>
      <input type="file" onChange={showFile} />
      <Button className="" onClick={() => extractData(translate, character)}>
        <span>Replace</span>
      </Button>
    </div>
  );
};

export default HandleFile;
