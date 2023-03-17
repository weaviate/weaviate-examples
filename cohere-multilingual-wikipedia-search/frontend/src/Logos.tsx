import React from "react";
import type { FC } from "react";
import { Col, Row } from "antd";
import CohereLogo from "./cohere_logo.svg";
import WeaviateLogo from "./weaviate_logo.png";
import { Typography } from "antd";

const { Title } = Typography;

const Logos: FC = () => (
  <>
    <Row justify="space-around" align="middle">
      <Col span={6}>
        <img
          src={CohereLogo}
          alt="Cohere Logo"
          style={{ width: "100%", height: "auto" }}
        />
      </Col>
      <Col span={6}>
        <img
          src={WeaviateLogo}
          alt="Cohere Logo"
          style={{ width: "100%", height: "auto" }}
        />
      </Col>
    </Row>
    <Title style={{ textAlign: "center", marginTop: "48px" }}>
      The Cohere & Weaviate Multilingual Wikipedia Search
    </Title>
    <p style={{ textAlign: "center", maxWidth: "60%", margin: "15px auto" }}>
      Search through 8M Multilingual Wikipedia Paragraphs using Semantic,
      Lexical, or Hybrid Search with arbitrary filters!
    </p>
  </>
);

export default Logos;
