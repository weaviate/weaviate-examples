import React, { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import "./index.css";
import type { RadioChangeEvent } from "antd";
import { Radio, Space } from "antd";

type Props = {
  labels: string[];
  options: [number, number][];
  setAvailableLanguages: Dispatch<SetStateAction<[number, number]>>;
};

const AvailableLanguages = ({
  labels,
  options,
  setAvailableLanguages,
}: Props) => {
  const [value, setValue] = useState<number>(0);

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
    setAvailableLanguages(options[e.target.value]);
  };

  return (
    <Radio.Group onChange={onChange} value={value}>
      <Space direction="vertical">
        {labels.map((label, i) => (
          <Radio value={i}>{label}</Radio>
        ))}
      </Space>
    </Radio.Group>
  );
};

export default AvailableLanguages;
