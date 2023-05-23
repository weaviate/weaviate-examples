import React from "react";
import type { FC } from "react";
import { Layout } from "antd";
import "antd/dist/reset.css";
import "./App.css";
import Logos from "./Logos";
import Search from "./Search";

const { Content, Footer } = Layout;

const App: FC = () => (
  <div className="App">
    <Layout>
      <Layout>
        <Content style={{ padding: "0 50px" }}>
          <div
            className="site-layout-content"
            style={{ background: "#ffffff" }}
          >
            <Logos />
            <Search />
          </div>
        </Content>
      </Layout>
      <Footer style={{ textAlign: "center" }}>
        Built with ❤️ using Cohere Embeddings and Weaviate
      </Footer>
    </Layout>
  </div>
);

export default App;
