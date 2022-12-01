import React, { useEffect, useState } from "react";
import { Button, Table, Tabs } from "antd";
import { tabList, translate } from "../constants";
import { capitalize } from "../GetAll";
import { delay } from "../Upload";

const portion = (obj) => {
  if (Object.keys(obj).length === 0) {
    return;
  }
  var values = Object.values(obj);
  var final = [];
  var counter = 0;
  var portion = {};
  for (var key in obj) {
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

const chunk = (arr, size) =>
  arr.reduce(
    (acc, e, i) => (
      i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc
    ),
    []
  );

const LocalTable = () => {
  const defaultPageSize = 50;
  const [listData, setListData] = useState([]);
  const [listTranslate, setListTranslate] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState("translate_extra");
  const [totalItems, setTotalItems] = useState(50);
  const onTranslateData = () => {
    const record = [...listData].map((item) => [item.id, item.rawText]);
    let formData = new FormData();
    formData.append("t", JSON.stringify(record));
    formData.append("tt", "vi");
    fetch("https://dichtienghoa.com/transtext", {
      body: formData,
      method: "post",
    })
      .then((response) => response.json())
      .then((res) => {
        const list = {};
        JSON.parse(
          res.data.replaceAll(/\\\s"/g, '\\"').replaceAll(/ +(?= )/g, "")
        ).forEach(([id, value]) => {
          const title = listData.find((item) => item.id === id).title;
          if (value.trim().split(" ").length < 7) {
            list[title.trim()] = capitalize(value.trim());
          } else {
            list[title.trim()] = value.trim();
          }
        });
        setListTranslate(list);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onClick = async () => {
    const record = [...listData].map((item) => [item.id, item.rawText]);
    const final = chunk(record, 50);
    const listPromise = [];
    let i = 1;
    for (const item of final) {
      let formData = new FormData();
      formData.append("t", JSON.stringify(item));
      formData.append("tt", "vi");
      listPromise.push(
        fetch("https://dichtienghoa.com/transtext", {
          body: formData,
          method: "post",
        })
          .then((response) => response.json())
          .then((res) => {
            const list = {};
            JSON.parse(
              res.data.replaceAll(/\\\s"/g, '\\"').replaceAll(/ +(?= )/g, "")
            ).forEach(([id, value]) => {
              const title = listData.find((item) => item.id === id).title;
              if (value.trim().split(" ").length < 7) {
                list[title.trim()] = capitalize(value.trim());
              } else {
                list[title.trim()] = value.trim();
              }
            });
            console.log("part", i++, "/", final.length);
            return list;
          })
      );
      listPromise.push(await delay(5000));
    }
    const list = await Promise.all(listPromise);
    let listTrans = {};
    list
      .filter(Boolean)
      .forEach((item) => (listTrans = { ...listTrans, ...item }));
    console.log({ listTrans });
  };

  useEffect(() => {
    const list = Object.entries(translate[currentTab])
      .filter((item) => item[0].includes("_info"))
      .map((item, index) => {
        return {
          id: index + 1,
          title: item[0],
          originalText: item[1],
          rawText: item[1],
        };
      });
    setListData(list);
    setTotalItems(list.length);
  }, [currentPage, currentTab]);

  useEffect(() => {
    console.log(listTranslate);
  }, [listTranslate]);

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "title",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Value",
      dataIndex: "originalText",
      key: "originalText",
    },
    {
      title: "Translate",
      key: "rawText",
      dataIndex: "rawText",
    },
  ];

  const tabItems = tabList.map((item) => {
    return {
      label: item,
      key: item,
      children: listData ? (
        <Table
          columns={columns}
          dataSource={listData}
          pagination={{
            position: ["topRight", "bottomRight"],
            defaultPageSize,
            showSizeChanger: false,
            total: totalItems,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
        />
      ) : null,
    };
  });

  return (
    <>
      <div>
        <Button type="button" onClick={onClick}>
          Translate
        </Button>
      </div>
      <Tabs
        defaultActiveKey="translate_extra"
        tabPosition="left"
        items={tabItems}
        onChange={(key) => {
          console.log("onChange", key);
        }}
        onTabClick={(key) => {
          setCurrentTab(key);
          console.log("onTabClick", key);
        }}
      ></Tabs>
    </>
  );
};

export default LocalTable;
