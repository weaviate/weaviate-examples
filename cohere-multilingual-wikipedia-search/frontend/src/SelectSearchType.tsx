import React from "react";
import { Select } from "antd";
import type { Dispatch, SetStateAction } from "react";

const { Option } = Select;

type Props = {
  all: string[];
  set: Dispatch<SetStateAction<string>>;
  selected: string;
};

const SelectSearchType = ({ all, set, selected }: Props) => {
  const onChange = (value: string) => {
    set(value);
  };

  return (
    <Select value={selected} onChange={onChange}>
      {all.map((v) => (
        <Option value={v}>{v}</Option>
      ))}
    </Select>
  );
};

export default SelectSearchType;
