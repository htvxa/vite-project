import { Button } from "antd";
import React, { useEffect } from "react";
import { card_cn, card_vn, listId_cn, listId_vn } from "../constantsHandle";
import { tabList, translate } from "../constants";
import JsonPreview from "../JsonPreview";
import { capitalize } from "../GetAll";

const MergeObject = () => {
  const data1 = listId_cn;
  const data2 = listId_vn;

  const merge = (keyObj, valueObj) => {
    const list = {};
    Object.entries(keyObj).forEach(([key, value]) => {
      list[value] = capitalize(valueObj[key]);
    });
    return list;
  };

  const onMerge = () => {
    console.log(merge(data1, data2));
  };

  const onTranslate = () => {
    console.log(merge(data1, data2));
    console.log(merge(card_cn, card_vn));
  };

  useEffect(() => {
    let trans = {};
    tabList.forEach((item) => (trans = { ...trans, ...translate[item] }));
    Object.keys(trans).forEach((item) => {
      if (item.indexOf("_info") > 0 || trans[item].length > 11) {
        delete trans[item];
      }
    });
    console.log(trans);
  }, []);

  return (
    <>
      <Button className="" onClick={onMerge}>
        Merge
      </Button>
      <Button className="" onClick={onTranslate}>
        Preview Merge
      </Button>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "0 20px",
          textAlign: "left",
        }}
      >
        <div style={{ width: "100%", height: "50vh", overflow: "scroll" }}>
          <JsonPreview src={data1} />
        </div>
        <div style={{ width: "100%", height: "50vh", overflow: "scroll" }}>
          <JsonPreview src={data2} />
        </div>
      </div>
    </>
  );
};

export default MergeObject;
