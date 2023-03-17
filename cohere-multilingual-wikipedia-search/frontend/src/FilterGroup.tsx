import React from "react";
import "./index.css";
import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse, theme, Row, Col } from "antd";

const { Panel } = Collapse;

const FilterGroup: React.FC = () => {
  const { token } = theme.useToken();

  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  return (
    <Row>
      <Col span={8}>
        <Collapse
          bordered={false}
          defaultActiveKey={["10000"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          style={{ background: token.colorBgContainer }}
        >
          <Panel header="Languages (8 selected)" key="1" style={panelStyle}>
            <p>Foo</p>
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
            header="Popularity (no restrictions)"
            key="1"
            style={panelStyle}
          >
            <p>Bar</p>
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
          <Panel header="Available languages" key="1" style={panelStyle}>
            <p>Bar</p>
          </Panel>
        </Collapse>
      </Col>
    </Row>
  );
};

export default FilterGroup;
