import React, { useEffect, useState } from "react";
import { Button, message, Steps } from "antd";
import { tabList } from "../constants";
import { translate1 } from "../constantsSave";
import HandleShortText from "./Step1";
import Skill from "./Step2";
import MergeObject from "./Step3";
import Step4 from "./Step4";

const steps = [
  {
    title: "Get All Text Card",
    content: (
      <>
        <HandleShortText />
        <div className="">
          Let's Translate this text and save to (constantsHandle)
        </div>
      </>
    ),
  },
  {
    title: "Get Skill List",
    content: (
      <>
        <Skill />
        <div className="">If you dont have trans. Lets update trans</div>
      </>
    ),
  },
  {
    title: "Merge List skill",
    content: <MergeObject></MergeObject>,
  },
  {
    title: "Replace List skill",
    content: <Step4></Step4>,
  },
];

const Step = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    console.clear();
    setCurrent(current + 1);
  };

  const prev = () => {
    console.clear();
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  useEffect(() => {
    if (current === 1) {
      let trans = {};
      tabList.forEach((item) => (trans = { ...trans, ...translate1[item] }));
      Object.keys(trans).forEach((item) => {
        if (item.indexOf("_info") > 0 || trans[item].length > 11) {
          delete trans[item];
        }
      });
      console.log({ trans });
    }
  }, [current]);
  return (
    <>
      <Steps current={current} items={items} />
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success("Processing complete!")}
          >
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </>
  );
};

export default Step;
