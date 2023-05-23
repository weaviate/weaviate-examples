import React from "react";
import type { Dispatch, SetStateAction } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse, theme, Row, Col } from "antd";
import SelectLanguages from "./SelectLanguages";
import LimitPopularity from "./LimitPopularity";
import AvailableLanguages from "./AvailableLanguages";

const { Panel } = Collapse;

type Props = {
  defaultLanguageIds: number[];
  languageIds: number[];
  languageLabels: string[];
  setLanguageIds: Dispatch<SetStateAction<number[]>>;
  popularity: [number, number];
  setPopularity: Dispatch<SetStateAction<[number, number]>>;
  popularityMinMax: [number, number];
  availableLanguages: [number, number][];
  availableLanguagesLabels: string[];
  setAvailableLanguages: Dispatch<SetStateAction<[number, number]>>;
};

const FilterGroup = ({
  defaultLanguageIds,
  languageLabels,
  setLanguageIds,
  languageIds,
  popularity,
  setPopularity,
  popularityMinMax,
  availableLanguages,
  availableLanguagesLabels,
  setAvailableLanguages,
}: Props) => {
  const { token } = theme.useToken();

  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  const filterGroupLabel = () => {
    if (
      popularity[0] === popularityMinMax[0] &&
      popularity[1] === popularityMinMax[1]
    ) {
      return "no restrictions";
    }
    if (
      popularity[0] !== popularityMinMax[0] &&
      popularity[1] !== popularityMinMax[1]
    ) {
      return "min+max set";
    }

    if (popularity[0] !== popularityMinMax[0]) {
      return "minimum set";
    }

    return "maximum set";
  };

  return (
    <Row>
      <Col span={8} style={{ padding: "0px 10px 0px 0px" }}>
        <Collapse
          bordered={false}
          defaultActiveKey={["10000"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          style={{ background: token.colorBgContainer }}
        >
          <Panel
            header={`Languages (${languageIds.length} selected)`}
            key="1"
            style={panelStyle}
          >
            <SelectLanguages
              defaultLanguageIds={defaultLanguageIds}
              languageLabels={languageLabels}
              setLanguageIds={setLanguageIds}
            />
          </Panel>
        </Collapse>
      </Col>
      <Col span={8} style={{ padding: "0px 10px" }}>
        <Collapse
          bordered={false}
          defaultActiveKey={["1000"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          style={{ background: token.colorBgContainer }}
        >
          <Panel
            header={`Popularity (${filterGroupLabel()})`}
            key="1"
            style={panelStyle}
          >
            <LimitPopularity
              minMax={popularityMinMax}
              setPopularity={setPopularity}
              popularity={popularity}
            />
          </Panel>
        </Collapse>
      </Col>
      <Col span={8} style={{ padding: "0px 0px 0px 10px" }}>
        <Collapse
          bordered={false}
          defaultActiveKey={["1000"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          style={{ background: token.colorBgContainer }}
        >
          <Panel header="Available languages" key="1" style={panelStyle}>
            <AvailableLanguages
              labels={availableLanguagesLabels}
              options={availableLanguages}
              setAvailableLanguages={setAvailableLanguages}
            />
          </Panel>
        </Collapse>
      </Col>
    </Row>
  );
};

export default FilterGroup;
