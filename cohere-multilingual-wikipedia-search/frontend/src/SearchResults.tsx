import React from "react";
import { List } from "antd";
import type { Result } from "./weaviate_search";

type Props = {
  data: Result[];
};

const SearchResults = ({ data }: Props) => (
  <List
    itemLayout="horizontal"
    dataSource={data}
    locale={{ emptyText: "Enter a query and hit Search!" }}
    renderItem={(item, index) => (
      <List.Item>
        <List.Item.Meta title={item.text} description={item.title} />
      </List.Item>
    )}
  />
);

export default SearchResults;
