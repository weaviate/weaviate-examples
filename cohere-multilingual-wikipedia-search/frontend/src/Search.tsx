import React from "react";
import type { FC } from "react";
import { Input, Select } from "antd";
import FilterGroup from "./FilterGroup";

const { Option } = Select;
const { Search } = Input;

const selectBefore = (
  <Select defaultValue="Semantic">
    <Option value="semantic">Semantic</Option>
    <Option value="lexical">Lexical</Option>
    <Option value="hybrid">Hybrid</Option>
  </Select>
);

const SearchArea: FC = () => (
  <div style={{ margin: "96px 96px 48px" }}>
    <FilterGroup />
    <Search
      addonBefore={selectBefore}
      placeholder="Enter your Search query!"
      allowClear
      enterButton="Search"
      size="large"
      // onSearch={onSearch}
    />
  </div>
);

export default SearchArea;
