import React, { useEffect, useState } from "react";
import { Button, Checkbox, Input, message, Table, Tabs } from "antd";
import { tabList } from "./constants";
import { translate2 } from "./constants_copy";
import { translate1 } from "./constantsSave";

function capitalize(s) {
  return s.toLowerCase().replace(/(?:^|\s|["'([{])+\S/g, function (a) {
    return a.toUpperCase();
  });
}

const list = {};
Object.entries(translate1).forEach(
  ([transKey, transValue]) =>
    (list[transKey] = Object.entries(transValue).map(([key, value], index) => {
      return {
        id: index,
        title: key,
        originalText: value,
        rawText: translate2[transKey][key],
      };
    }))
);
console.log(list);

const notify = (type, messageNoti) => {
  switch (type) {
    case "success":
      message.success(messageNoti);
      break;
    case "error":
      message.error(messageNoti);
      break;
    case "warning":
      message.warning(messageNoti);
      break;
    default:
      break;
  }
};

const DataTable = () => {
  const defaultPageSize = 50;
  const [listData, setListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState("translate_extra");
  const [totalItems, setTotalItems] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState([]);
  const [listVi, setListVi] = useState([]);
  const [listHv, setListHv] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCol, setShowCol] = useState([
    "id",
    "title",
    "viText",
    "translate",
    "action",
  ]);

  const updateItem = async (record, text) => {
    setLoading(true);
    await fetch(`http://localhost:3000/api/${currentTab}/${record.id}`, {
      method: "PATCH",
      body: JSON.stringify({ translateText: text }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    setLoading(false);
    notify("success", `Update ${record.title} success`);
  };

  const onExport = () => {
    fetch(`http://localhost:3000/api/${currentTab}`, {
      method: "get",
    })
      .then((response) => response.json())
      .then((res) => {
        const out = {};
        res.forEach((item) => (out[item.title] = item.translateText));
        navigator.clipboard.writeText(JSON.stringify(out)).then(
          function () {
            console.log("Async: Copying to clipboard was successful!");
          },
          function (err) {
            console.error("Async: Could not copy text: ", err);
          }
        );
      });
  };

  const updateAllTranslate = async () => {
    setLoading(true);
    const listPromise = [];
    for (const record of selectedRecord) {
      if (listHv[record.title] && listVi[record.title]) {
        const translate =
          listVi[record.title].split(" ").length < 7
            ? listHv[record.title]
            : listVi[record.title];
        listPromise.push(
          fetch(`http://localhost:3000/api/${currentTab}/${record.id}`, {
            method: "PATCH",
            body: JSON.stringify({
              viText: listVi[record.title],
              hvText: listHv[record.title],
              translateText: translate,
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          }).catch((err) => {
            console.log(err);
            notify("error", `Update ${record.id}: ${record.title} failed`);
          })
        );
      }
      await Promise.all(listPromise).catch((err) => console.log(err));
    }
    console.log(loading);
    setLoading(false);
    notify("success", "Update success");
  };

  const onTranslateData = (type = "vi") => {
    if (selectedRowKeys.length === 0) {
      notify("error", "No selected row");
      return;
    }
    const record = [...listData]
      .filter((i) => {
        return selectedRowKeys.includes(i.title);
      })
      .map((item) => [item.id, item.rawText]);
    let formData = new FormData();
    formData.append("t", JSON.stringify(record));
    formData.append("tt", type);
    fetch("https://dichtienghoa.com/transtext", {
      body: formData,
      method: "post",
    })
      .then((response) => response.json())
      .then((res) => {
        notify("success", "Translate success");
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
        if (type === "vi") {
          setListVi(list);
        }
        if (type === "hv") {
          setListHv(list);
        }
      })
      .catch((error) => notify("error", "Fail Translate"));
  };

  useEffect(() => {
    if (!loading) {
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
    }
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
    },
    {
      title: "rawText",
      dataIndex: "rawText",
      key: "rawText",
    },
    {
      title: "originalText",
      dataIndex: "originalText",
      key: "originalText",
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
      title: "translateText",
      key: "translateText",
      dataIndex: "translateText",
    },
    {
      title: "updatedAt",
      key: "updatedAt",
      dataIndex: "updatedAt",
      render: (text) => (
        <>
          {new Date(text).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </>
      ),
    },
    {
      title: "input",
      key: "translate",
      dataIndex: "translate",
      render: (_, record) => {
        return (
          <Input.TextArea
            id={record.title}
            defaultValue={record.translateText || record.viText}
            autoSize={true}
            style={{ width: 200 }}
          ></Input.TextArea>
        );
      },
    },
    {
      title: "action",
      key: "action",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <>
            <Button
              type="primary"
              onClick={() =>
                updateItem(record, document.getElementById(record.title).value)
              }
              loading={loading}
            >
              Update
            </Button>
          </>
        );
      },
    },
  ].filter((item) => showCol.includes(item.dataIndex));

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setSelectedRecord([]);
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
            position: ["topRight", "bottomRight"],
          }}
        />
      ) : null,
    };
  });

  const onChange = (checkedValues) => {
    setShowCol(checkedValues);
  };

  const plainOptions = [
    "id",
    "title",
    "rawText",
    "originalText",
    "viText",
    "updatedAt",
    "hvText",
    "translateText",
    "translate",
    "action",
  ];

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
        <Button type="button" onClick={() => updateAllTranslate()}>
          Update All
        </Button>
        <Button type="button" onClick={() => onExport()}>
          Export
        </Button>
      </div>
      <div className="">
        <Checkbox.Group
          options={plainOptions}
          defaultValue={["id", "title", "viText", "translate", "action"]}
          onChange={onChange}
        />
      </div>
      <Tabs
        defaultActiveKey="translate_extra"
        tabPosition="left"
        items={tabItems}
        onChange={(key) => {}}
        onTabClick={(key) => {
          setCurrentPage(1);
          setCurrentTab(key);
        }}
      ></Tabs>
    </>
  );
};

export default DataTable;
