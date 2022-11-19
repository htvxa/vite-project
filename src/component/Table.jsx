import React, { useEffect, useState } from "react";
import { Button, Input, Table, Tabs } from "antd";
import { tabList } from "./constants";

function capitalize(s) {
  return s.toLowerCase().replace(/(?:^|\s|["'([{])+\S/g, function (a) {
    return a.toUpperCase();
  });
}

const DataTable = () => {
  const defaultPageSize = 50;
  const [listData, setListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState("translate_extra");
  const [totalItems, setTotalItems] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState([]);
  const [loading, setLoading] = useState(false);

  const updateTranslateData = (data, keyData) => {
    for (const record of selectedRecord) {
      if (data[record.title]) {
        fetch(`http://localhost:3000/api/${currentTab}/${record.id}`, {
          method: "PATCH",
          body: JSON.stringify({ [keyData]: data[record.title] }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
      }
    }
  };

  const onTranslateData = (type = "vi") => {
    const record = [...listData]
      .filter((i) => {
        return selectedRowKeys.includes(i.title);
      })
      .map((item) => [item.title, item.rawText]);
    let formData = new FormData();
    formData.append("t", JSON.stringify(record));
    formData.append("tt", type);
    fetch("https://dichtienghoa.com/transtext", {
      body: formData,
      method: "post",
    })
      .then((response) => response.json())
      .then((res) => {
        const list = {};
        JSON.parse(
          res.data.replaceAll(/\\\s"/g, '\\"').replaceAll(/ +(?= )/g, "")
        ).forEach(([title, value]) => {
          if (value.trim().split(" ").length < 7) {
            list[title.trim()] = capitalize(value.trim());
          } else {
            list[title.trim()] = value.trim();
          }
        });
        if (type === "vi") {
          updateTranslateData(list, "viText");
        }
        if (type === "hv") {
          updateTranslateData(list, "hvText");
        }
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
      });
  }, [currentPage, currentTab, loading]);

  const columns = [
    {
      title: "id",
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
      title: "Vi",
      key: "viText",
      dataIndex: "viText",
    },
    {
      title: "Hv",
      key: "hvText",
      dataIndex: "hvText",
    },
    {
      title: "input",
      key: "translate",
      dataIndex: "translate",
      render: (_, record) => {
        return (
          <Input.TextArea
            defaultValue={record.viText}
            autoSize={true}
            style={{ width: 200 }}
          ></Input.TextArea>
        );
      },
    },
  ];

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys, record) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRecord(record);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const tabItems = tabList.map((item) => {
    return {
      label: item,
      key: item,
      children: listData ? (
        <Table
          rowKey={"title"}
          rowSelection={rowSelection}
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
        <Button
          type="primary"
          onClick={start}
          disabled={!hasSelected}
          loading={loading}
        >
          Reload
        </Button>
        <Button type="button" onClick={() => onTranslateData("vi")}>
          Translate Vi
        </Button>
        <Button type="button" onClick={() => onTranslateData("hv")}>
          Translate Hv
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

export default DataTable;
