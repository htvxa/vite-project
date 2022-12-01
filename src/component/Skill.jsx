import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { listSkill } from "./constantsHandle";
import { removeDuplicate } from "./HandleShortText";
import { delay } from "./Upload";
const flat = (arr) =>
  arr.reduce((a, b) => (Array.isArray(b) ? [...a, ...flat(b)] : [...a, b]), []);

const Skill = () => {
  const [skillMap, setSkillMap] = useState({});
  useEffect(() => {
    const list = {};
    const map = Object.entries(listSkill).map(([_, value]) => {
      return value;
    });
    removeDuplicate(map)
      .sort((a, b) => b.length - a.length)
      .forEach((item, index) => {
        list[index] = item;
      });
    setSkillMap(list);
  }, []);

  const portion = () => {
    if (Object.keys(skillMap).length === 0) {
      return;
    }
    var values = Object.values(skillMap);
    var final = [];
    var counter = 0;
    var portion = {};
    for (var key in skillMap) {
      if (counter !== 0 && counter % 100 === 0) {
        final.push(portion);
        portion = {};
      }
      portion[key] = values[counter];
      counter++;
    }
    final.push(portion);
    return final;
  };

  const onClick = async () => {
    const final = portion();
    const listPromise = [];
    let i = 1;
    for (const item of final) {
      let formData = new FormData();
      formData.append("t", JSON.stringify(item));
      formData.append("tt", "hv");
      listPromise.push(
        fetch("https://dichtienghoa.com/transtext", {
          body: formData,
          method: "post",
        })
          .then((response) => response.json())
          .then((res) => {
            const data = JSON.parse(
              res.data.replaceAll(/\\\s"/g, '\\"').replaceAll(/ +(?= )/g, "")
            );
            console.log("part", i++, "/", final.length);
            return data;
          })
      );
      listPromise.push(await delay(10000));
    }
    const list = await Promise.all(listPromise);
    let listTrans = {};
    list
      .filter(Boolean)
      .forEach((item) => (listTrans = { ...listTrans, ...item }));
    console.log({ listId_cn: listTrans });
  };

  useEffect(() => {
    if (Object.keys(skillMap).length > 0) {
      console.log({ listId_vn: skillMap });
    }
  }, [skillMap]);

  return <Button onClick={onClick}>Skill Translate by Portion</Button>;
};

export default Skill;
