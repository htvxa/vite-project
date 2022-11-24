import { Button } from "antd";
import React, { useState, useEffect } from "react";

export default function Upload() {
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [listText, setListText] = useState([]);
  const [listTrans, setListTrans] = useState([]);

  const handle = () => {
    const REGEX_CHINESE =
      /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
    let flag = false;
    let temp = "";
    const list = [];
    for (const char of fileContent) {
      if (char === `"`) {
        if (!flag) {
          flag = true;
        } else {
          if (REGEX_CHINESE.test(temp)) {
            list.push(temp);
          }
          flag = false;
          temp = "";
        }
      } else if (flag & (char !== `"`)) {
        temp += char;
      }
    }
    console.log(`Handle ${list.length} item`);
    setListText(list, 50);
  };

  const showFile = () => {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      var preview = document.getElementById("show-text");
      var file = document.querySelector("input[type=file]").files[0];
      var reader = new FileReader();

      var textFile = /text.*/;

      if (file.type.match(textFile)) {
        reader.onload = function (event) {
          setFileName(file.name);
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
  const chunk = (arr, size) =>
    arr.reduce(
      (acc, e, i) => (
        i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc
      ),
      []
    );

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const translate = async () => {
    const list = chunk(listText, 50);
    const listPromise = [];
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      let formData = new FormData();
      formData.append("t", JSON.stringify(element));
      formData.append("tt", "vi");
      listPromise.push(
        fetch("https://dichtienghoa.com/transtext", {
          body: formData,
          method: "post",
        })
          .then((res) => res.json())
          .then((res) => {
            setListTrans((prev) => [
              ...prev,
              ...JSON.parse(
                res.data.replaceAll(/\\\s"/g, '\\"').replaceAll(/ +(?= )/g, "")
              ),
            ]);
            console.log(res);
          })
      );
      listPromise.push(delay(7000));
      await Promise.all(listPromise).catch((err) => console.log(err));
    }
    console.log("done");
  };

  const exportData = () => {
    let newFile = fileContent;
    for (let i = 0; i < listText.length; i++) {
      newFile = newFile.replace(listText[i], listTrans[i].trim());
    }
    navigator.clipboard.writeText(newFile).then(
      function () {
        console.log("Async: Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  };

  const saveDB = async () => {
    const listPromise = [];
    for (let i = 0; i < listText.length; i++) {
      const item = {
        type: fileName.split(".")[0],
        rawText: listText[i],
        translateText: listTrans[i].trim(),
      };
      listPromise.push(
        fetch("http://localhost:3000/api/text_map", {
          body: JSON.stringify(item),
          method: "post",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }).then(() => {})
      );
      listPromise.push(delay(300));
      await Promise.all(listPromise).catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    handle();
    setListTrans([]);
  }, [fileContent]);

  useEffect(() => {
    console.log(listTrans);
  }, [listTrans]);
  return (
    <div>
      <input type="file" onChange={showFile} />
      <div id="show-text">
        {listText.length
          ? `Handle ${listText.length} item`
          : "Choose text File"}
      </div>
      <div
        style={{
          display: "flex",
          gap: "0 20px",
          justifyContent: "center",
          margin: "20px",
        }}
      >
        <Button id="show-text1" onClick={translate}>
          translate
        </Button>
        <Button id="show-text2" onClick={exportData}>
          export
        </Button>
        <Button id="show-text2" onClick={saveDB}>
          save DB
        </Button>
      </div>
    </div>
  );
}
