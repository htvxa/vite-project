import React, { useEffect, useState } from "react";
import { tabList } from "./constants";

function capitalize(s) {
  return s.toLowerCase().replace(/(?:^|\s|["'([{])+\S/g, function (a) {
    return a.toUpperCase();
  });
}

const GetAll = () => {
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const [total, setTotal] = useState(0);
  const getAllData = async () => {
    for (const tab of [
      "translate_yingbian",
      "translate_yxs",
      "translate_zhuogui",
    ]) {
      let flag = 1;
      do {
        await fetch(
          `http://localhost:3000/api/${tab}?_page=${flag}&_limit=${50}`,
          {
            method: "get",
          }
        )
          .then((response) => response.json())
          .then(async (res) => {
            if (res.data.length > 0) {
              const record = res.data.map((item) => [item.id, item.rawText]);
              let formData = new FormData();
              formData.append("t", JSON.stringify(record));
              formData.append("tt", "hv");
              const list = {};
              await fetch("https://dichtienghoa.com/transtext", {
                body: formData,
                method: "post",
              })
                .then((response) => response.json())
                .then((res) => {
                  JSON.parse(
                    res.data
                      .replaceAll(/\\\s"/g, '\\"')
                      .replaceAll(/ +(?= )/g, "")
                  ).forEach(([id, value]) => {
                    if (list[id] === undefined) {
                      list[id] = {};
                    }
                    if (value.trim().split(" ").length < 7) {
                      list[id].translateText = capitalize(value.trim());
                    }
                    list[id].hvText = value.trim();
                  });
                })
                .catch((error) =>
                  console.log("error", "Fail Translate", error)
                );
              await delay(4000);
              let formData2 = new FormData();
              formData2.append("t", JSON.stringify(record));
              formData2.append("tt", "vi");
              await fetch("https://dichtienghoa.com/transtext", {
                body: formData2,
                method: "post",
              })
                .then((response) => response.json())
                .then((res) => {
                  JSON.parse(
                    res.data
                      .replaceAll(/\\\s"/g, '\\"')
                      .replaceAll(/ +(?= )/g, "")
                  ).forEach(([id, value]) => {
                    list[id].viText = value;
                    if (value.trim().split(" ").length >= 7) {
                      list[id].translateText = value;
                    }
                  });
                })
                .catch((error) =>
                  console.log("error", "Fail Translate", error)
                );
              const listPromise = [];
              await delay(2500);
              Object.entries(list).forEach(([key, value]) => {
                listPromise.push(
                  fetch(`http://localhost:3000/api/${tab}/${key}`, {
                    method: "PATCH",
                    body: JSON.stringify(value),
                    headers: {
                      "Content-type": "application/json; charset=UTF-8",
                    },
                  }).catch(() =>
                    console.log(
                      "error",
                      `Update ${record.id}: ${record.title} failed`
                    )
                  )
                );
              });
              await Promise.all(listPromise).catch((err) => console.log(err));
              setTotal((prev) => prev + listPromise.length);
              flag++;
            } else {
              flag = false;
            }
          });
      } while (flag);
    }
  };
  return <button onClick={getAllData}>Get All({total})</button>;
};

export default GetAll;
