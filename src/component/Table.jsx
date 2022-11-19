import React, { useEffect, useState } from "react";
import { Button, Table, Tabs } from "antd";
import { tabList, translate, translate_extra } from "./constants";
import { translate2 } from "./constantsSave";

// const list = {};
// console.log(translate2);
// Object.entries(translate).forEach(
//   ([transKey, transValue]) =>
//     (list[transKey] = Object.entries(transValue).map(([key, value], index) => {
//       return {
//         id: index,
//         title: key,
//         translateText: value,
//         originalText: translate2[transKey][key],
//       };
//     }))
// );
// console.log(list);

const DataTable = () => {
  const defaultPageSize = 50;
  const [listData, setListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState("translate_extra");
  const [totalItems, setTotalItems] = useState(0);
  const getData = () => {
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
  };

  useEffect(() => {
    fetch(
      `http://localhost:3000/api/${currentTab}?_page=${currentPage}&_limit=${defaultPageSize}`,
      {
        method: "get",
      }
    )
      .then((response) => response.json())
      .then((res) => {
        setListData(res.data);
        setTotalItems(res.pagination._totalRows);
        console.log(res.data);
      });
  }, [currentPage, currentTab]);

  const columns = [
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
      // render: (record) => {
      //   console.log(record);
      //   return listData[record.title] || "";
      // },
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
        <Button type="button">Translate</Button>
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

export default DataTable;
