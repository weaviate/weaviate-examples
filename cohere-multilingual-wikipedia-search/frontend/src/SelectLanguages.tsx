import React, { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Checkbox, Col, Row, Button, Space } from "antd";
import type { CheckboxValueType } from "antd/es/checkbox/Group";

type Props = {
  defaultLanguageIds: number[];
  languageLabels: string[];
  setLanguageIds: Dispatch<SetStateAction<number[]>>;
};

const SelectLanguages = ({
  defaultLanguageIds,
  languageLabels,
  setLanguageIds,
}: Props) => {
  const onChange = (checkedValues: CheckboxValueType[]) => {
    setCheckedList(checkedValues);
    setLanguageIds(checkedValues.map((el) => el as number));
  };

  const [checkedList, setCheckedList] =
    useState<CheckboxValueType[]>(defaultLanguageIds);

  const selectAll = () => {
    setCheckedList(defaultLanguageIds);
    setLanguageIds(defaultLanguageIds.map((_, i) => i));
  };
  const selectNone = () => {
    setCheckedList([]);
    setLanguageIds([]);
  };

  return (
    <>
      <Checkbox.Group
        style={{ width: "100%" }}
        onChange={onChange}
        value={checkedList}
      >
        <Row>
          {languageLabels.map((lang, i) => {
            return (
              <Col span={8}>
                <Checkbox value={i}>{lang}</Checkbox>
              </Col>
            );
          })}
        </Row>
      </Checkbox.Group>
      <Space style={{ marginTop: "24px" }}>
        <Button onClick={selectAll}>Select All</Button>
        <Button onClick={selectNone}>Select None</Button>
      </Space>
    </>
  );
};

export default SelectLanguages;
