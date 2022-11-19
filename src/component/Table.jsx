import React, { useEffect, useState } from "react";
import { Button, Table, Tabs } from "antd";
import { translate, translate_extra } from "./constants";
import { translate2 } from "./constantsSave";

const list = {};
console.log(translate2);
Object.entries(translate).forEach(
  ([transKey, transValue]) =>
    (list[transKey] = Object.entries(transValue).map(([key, value], index) => {
      return {
        id: index,
        title: key,
        translateText: value,
        originalText: translate2[transKey][key],
      };
    }))
);
console.log(list);

const DataTable = () => {
  const defaultPageSize = 50;
  const [listData, setListData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState("translate_extra");

  useEffect(() => {
    // console.log(translate[currentTab]);
    const records = Object.entries(translate[currentTab])
      .map(([key, value], index) => {
        return {
          id: index,
          title: key,
          value: value,
        };
      })
      .filter((item) => {
        return (
          item.id < currentPage * defaultPageSize &&
          item.id >= (currentPage - 1) * defaultPageSize
        );
      });
    const record = records.map((item) => [item.title, item.value]);
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
        JSON.parse(res.data.replaceAll(/\\\s"/g, '\\"')).forEach(
          ([title, value]) => (list[title.trim()] = value)
        );
        setListData({ ...listData, ...list });
      });
  }, [currentPage, currentTab]);
  console.log(listData);
  const columns = [
    {
      title: "title",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Translate",
      key: "translate",
      render: (record) => {
        return listData[record.title] || "";
      },
    },
  ];

  const tabItems = Object.entries(translate).map(([key, data]) => {
    return {
      label: key,
      key: key,
      children: (
        <Table
          columns={columns}
          dataSource={Object.entries(data).map(([key, value], index) => {
            return {
              id: index,
              title: key,
              value: value,
            };
          })}
          pagination={{
            defaultPageSize,
            onChange: (page) => {
              setCurrentPage(page);
            },
          }}
        />
      ),
    };
  });

  return (
    <>
      {/* <Button
        onClick={() => {
          const log = Object.keys(translate).filter(
            (item) => newTrans[item] === undefined
          );
          console.log(log);
        }}
      >
        Check log
      </Button> */}
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

export default DataTable;
