import React from "react";
import type { Dispatch, SetStateAction } from "react";
import { Slider, Button, Space } from "antd";

type Props = {
  minMax: [number, number];
  popularity: [number, number];
  setPopularity: Dispatch<SetStateAction<[number, number]>>;
};

const LimitPopularity = ({ minMax, popularity, setPopularity }: Props) => {
  const onChange = (newValue: [number, number]) => {
    setPopularity(newValue);
  };

  const onReset = () => {
    setPopularity(minMax);
  };

  return (
    <>
      <p style={{ marginBottom: "54px" }}>
        Limit the popularity by setting a range of page views
      </p>
      <Slider
        range
        step={100}
        min={minMax[0]}
        max={minMax[1]}
        value={popularity}
        tooltip={{ open: true }}
        onChange={onChange}
      />
      <Space style={{ marginTop: "24px" }}>
        <Button onClick={onReset}>Reset</Button>
      </Space>
    </>
  );
};

export default LimitPopularity;
