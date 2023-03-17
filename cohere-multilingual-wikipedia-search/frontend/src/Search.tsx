import React, { useState } from "react";
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

const languageLabels = ["English", "German", "French", "Dutch"];
const defaultLanguageIds = languageLabels.map((_, i) => i);
const defaultPopularity: [number, number] = [10, 100000];

const SearchArea: FC = () => {
  const [languageIds, setLanguageIds] = useState<number[]>(defaultLanguageIds);
  const [popularity, setPopularity] =
    useState<[number, number]>(defaultPopularity);

  return (
    <div style={{ margin: "96px 96px 48px" }}>
      <FilterGroup
        languageLabels={languageLabels}
        defaultLanguageIds={defaultLanguageIds}
        setLanguageIds={setLanguageIds}
        languageIds={languageIds}
        popularity={popularity}
        setPopularity={setPopularity}
        popularityMinMax={defaultPopularity}
      />
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
};

export default SearchArea;
