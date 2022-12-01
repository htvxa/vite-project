import React, { useEffect, useState } from "react";

const REGEX_CHINESE =
  /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
export const removeDuplicate = (arr) =>
  arr.filter((i, index) => arr.indexOf(i) === index);
const HandleShortText = () => {
  const [listData, setListData] = useState({});

  // const bracket = ["【", "】"];
  const bracket = ["“", "”"];
  const handle = (file) => {
    let flag = false;
    let temp = "";
    const list = [];
    for (const char of file) {
      if (char === bracket[0]) {
        if (!flag) {
          flag = true;
        }
      } else if (flag & (char !== bracket[1])) {
        temp += char;
      } else if (char === bracket[1]) {
        if (REGEX_CHINESE.test(temp)) {
          list.push(temp);
        }
        flag = false;
        temp = "";
      }
    }
    return list;
  };

  const read = async (files) => {
    let list = {};
    let i = 0;
    const filePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          removeDuplicate(handle(e.target.result)).forEach((item) => {
            list[i++] = item;
          });
          // console.log(removeDuplicate(handle(e.target.result)));
          // handle(e.target.result).map((item) => {
          //   if (list[item] === undefined) {
          //     list[item] = "";
          //   }
          // });
          resolve(handle(e.target.result));
        };
        reader.readAsText(file);
      });
    });
    const fileInfos = await Promise.all(filePromises);
    setListData({ ...listData, ...list });
    return fileInfos;
  };

  useEffect(() => {
    if (Object.keys(listData).length > 0) {
      console.log(listData);
    }
  }, [listData]);

  async function readmultifiles(e) {
    const files = [...e.currentTarget.files];
    const data = await read(files);
  }
  return (
    <div>
      <input type="file" onChange={readmultifiles} multiple="multiple" />
      <div id="show-text">Choose text File</div>
      <div className="">Update this log to (constanstHandle.jsx)</div>
    </div>
  );
};

export default HandleShortText;
