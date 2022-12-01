import React, { memo, Fragment } from "react";
import PropTypes from "prop-types";

function jsonObjToHTML(obj) {
  let lineNumber = 1;
  const typeMap = {
    string: 1,
    number: 2,
    object: 3,
    array: 4,
    boolean: 5,
    null: 6,
  };
  const classMap = {
    expand: "e",
    key: "k",
    string: "s",
    number: "n",
    null: "nl",
    boolean: "bl",
    brac: "b",
    block: "blockInner",
    ellipsis: "ell",
  };
  const character = {
    colon: ":\u00A0",
    comma: ",",
    oQuote: '"',
    cQuote: '"',
    oBrace: "{",
    cBrace: "}",
    oBracket: "[",
    cBracket: "]",
  };
  const Span = ({ children, ...rest }) => <span {...rest}>{children}</span>;
  Span.propTypes = {
    children: PropTypes.node,
  };
  Span.propTypes = {
    children: PropTypes.node,
  };
  const getType = (value) => {
    if (typeof value === "string") return typeMap.string;
    if (typeof value === "number") return typeMap.number;
    if (value === false || value === true) return typeMap.boolean;
    if (value === null || value === undefined) return typeMap.null;
    if (value instanceof Array) return typeMap.array;
    return typeMap.object;
  };

  function getKeyValueDOM(value, keyName, comma = true) {
    const className = [];
    const children = [];
    const props = {};
    const checkNotEmpty = (item) => {
      for (const objKey in item) {
        if (Object.prototype.hasOwnProperty.call(item, objKey)) {
          return true;
        }
      }
      return false;
    };

    const childString = (item) => {
      const escapedString = JSON.stringify(item).substring(
        1,
        JSON.stringify(item).length - 1
      );
      return item[0] === "h" && item.substring(0, 4) === "http" ? (
        <Span key={`${lineNumber}string`}>
          <a href="value" target="_blank">
            {escapedString}
          </a>
        </Span>
      ) : (
        <Span key={`${lineNumber}string`}>{escapedString}</Span>
      );
    };

    const childObj = (item) => {
      const child = [];
      const keyArr = Object.keys(item);
      for (
        let i = 0, { length } = keyArr, lastIndex = length - 1;
        i < length;
        i++
      ) {
        const k = keyArr[i];
        child.push([getKeyValueDOM(item[k], k, i < lastIndex)]);
      }
      return child;
    };

    const childArr = (item) => {
      const child = [];
      for (
        let i = 0, { length } = item, lastIndex = length - 1;
        i < length;
        i++
      ) {
        child.push([getKeyValueDOM(item[i], false, i < lastIndex)]);
      }
      return child;
    };

    const type = getType(value);

    props["line-number"] = lineNumber;
    lineNumber += 1;

    const nonZeroSize =
      type === typeMap.object || type === typeMap.array
        ? checkNotEmpty(value)
        : null;

    if (nonZeroSize)
      children.push(
        <Span key={`${lineNumber}expand`} className={classMap.expand} />
      );

    if (keyName !== false) {
      className.push("objProp");
      children.push(
        <Fragment key={`${lineNumber}oQuote`}>{character.oQuote}</Fragment>
      );
      children.push(
        <Span key={`${lineNumber}key`} className={classMap.key}>
          {JSON.stringify(keyName).slice(1, -1)}
        </Span>
      );
      children.push(
        <Fragment key={`${lineNumber}cQuote`}>{character.cQuote}</Fragment>
      );
      children.push(
        <Fragment key={`${lineNumber}colon`}>{character.colon}</Fragment>
      );
    } else {
      className.push("arrElem");
    }

    switch (type) {
      case typeMap.string:
        children.push(
          <Span key={`${lineNumber}string`} className={classMap.string}>
            {[
              <Fragment key={`${lineNumber}oQuote`}>
                {character.oQuote}
              </Fragment>,
              childString(value),
              <Fragment key={`${lineNumber}cQuote`}>
                {character.cQuote}
              </Fragment>,
            ]}
          </Span>
        );
        break;
      case typeMap.number:
        children.push(
          <Span key={`${lineNumber}number`} className={classMap.number}>
            {value}
          </Span>
        );
        break;
      case typeMap.object:
        children.push(
          <Span key={`${lineNumber}oBrace`} className={classMap.brac}>
            {character.oBrace}
          </Span>
        );
        if (nonZeroSize) {
          children.push(
            <Span key={`${lineNumber}ellipsis`} className={classMap.ellipsis} />
          );
          children.push(
            <Span key={`${lineNumber}block`} className={classMap.block}>
              {childObj(value)}
            </Span>
          );
        }
        children.push(
          <Span
            key={`${lineNumber}cBrace`}
            className={classMap.brac}
            line-number={nonZeroSize ? lineNumber : undefined}
          >
            {character.cBrace}
          </Span>
        );
        lineNumber += 1;
        break;
      case typeMap.array:
        children.push(
          <Span key={`${lineNumber}oBracket`} className={classMap.brac}>
            {character.oBracket}
          </Span>
        );
        if (nonZeroSize) {
          children.push(
            <Span key={`${lineNumber}ellipsis`} className={classMap.ellipsis} />
          );
          children.push(
            <Span key={`${lineNumber}block`} className={classMap.block}>
              {childArr(value)}
            </Span>
          );
        }
        children.push(
          <Span
            key={`${lineNumber}cBracket`}
            className={classMap.brac}
            line-number={nonZeroSize ? lineNumber : undefined}
          >
            {character.cBracket}
          </Span>
        );
        lineNumber += 1;
        break;
      case typeMap.boolean:
        children.push(
          <Span key={`${lineNumber}boolean`} className={classMap.boolean}>
            {value}
          </Span>
        );
        break;
      case typeMap.null:
        children.push(
          <Span key={`${lineNumber}null`} className={classMap.null}>
            {String(value)}
          </Span>
        );
        break;
      default:
        break;
    }
    comma && children.push(character.comma);
    return (
      <span
        key={`${lineNumber}kvov`}
        className={[...className, "kvov"].join(" ")}
        {...props}
      >
        {children}
      </span>
    );
  }

  return getKeyValueDOM(obj, false, false);
}

const JSONPreview = ({ src = {} }) => (
  <div id="formattedJson">{jsonObjToHTML(src)}</div>
);

JSONPreview.propTypes = {
  src: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default memo(JSONPreview);
