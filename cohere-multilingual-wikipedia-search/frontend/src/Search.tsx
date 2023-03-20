import React, { useState } from "react";
import type { FC } from "react";
import FilterGroup from "./FilterGroup";
import SelectSearchType from "./SelectSearchType";
import SearchResults from "./SearchResults";
import { Input } from "antd";
import weaviate from "weaviate-ts-client";
import searchWeaviate from "./weaviate_search";
import type { FilterInput } from "./weaviate_search";
import type { Result } from "./weaviate_search";

const { Search } = Input;

const client = weaviate.client({
  scheme: "https",
  host: "cohere-wiki-demo.weaviate.network",
});

const searchTypes: string[] = ["Semantic", "Lexical", "Hybrid"];
const languageLabels = ["English", "German", "French", "Dutch"];
const defaultLanguageIds = languageLabels.map((_, i) => i);
const defaultPopularity: [number, number] = [10, 100000];
const availableLanguagesLabel = (input: [number, number]): string => {
  if (input[0] === -1 && input[1] === -1) {
    return "No Restrictions";
  }

  if (input[1] === -1) {
    return `>${input[0]}`;
  }

  if (input[0] === -1) {
    return `${input[1]}`;
  }

  return `${input[0]}-${input[1]}`;
};
const availableLanguages: [number, number][] = [
  [-1, -1],
  [-1, 1],
  [2, 10],
  [11, 50],
  [51, 100],
  [100, -1],
];
const availableLanguagesLabels: string[] = [
  "No Restrictions",
  "Single",
  `Few (${availableLanguagesLabel(availableLanguages[2])})`,
  `Some (${availableLanguagesLabel(availableLanguages[3])})`,
  `Many (${availableLanguagesLabel(availableLanguages[4])})`,
  `A lot (${availableLanguagesLabel(availableLanguages[5])})`,
];

const SearchArea: FC = () => {
  const [languageIds, setLanguageIds] = useState<number[]>(defaultLanguageIds);
  const [popularity, setPopularity] =
    useState<[number, number]>(defaultPopularity);
  const [availableLanguagesSelected, setAvailableLanguages] = useState<
    [number, number]
  >(availableLanguages[0]);
  const [searchType, setSearchType] = useState<string>(searchTypes[0]);
  const [results, setResults] = useState<Result[]>([]);

  const onSearch = (textQuery: string) => {
    if (textQuery === "") {
      setResults([]);
      return;
    }

    const filter: FilterInput = {
      languageIdsSelected: languageIds,
      allLanguageIds: defaultLanguageIds,
      searchType: searchType,
      popularitySelected: popularity,
      popularityMinMax: defaultPopularity,
      availableLanguagesSelected: availableLanguagesSelected,
    };

    searchWeaviate(client, textQuery, filter)
      .then(setResults)
      .catch(console.error);
  };

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
        availableLanguages={availableLanguages}
        availableLanguagesLabels={availableLanguagesLabels}
        setAvailableLanguages={setAvailableLanguages}
      />
      <Search
        addonBefore={
          <SelectSearchType
            all={searchTypes}
            set={setSearchType}
            selected={searchType}
          />
        }
        placeholder="Enter your Search query!"
        allowClear
        enterButton="Search"
        size="large"
        onSearch={onSearch}
      />
      <SearchResults data={results} />
    </div>
  );
};

export default SearchArea;
