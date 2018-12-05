import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Layout, LocaleProvider } from "antd";
import DocumentTitle from "react-document-title";
import "./App.css";
import zhCN from "antd/lib/locale-provider/zh_CN";
import AuthRoute from "./AuthRoute/AuthRoute";
import { AuthProvider } from "./AuthContext/AuthContext";
import AppHeader from "./AppHeader/AppHeader";
import MainPage from "./MainPage/MainPage";
import ArticlePage from "./ArticlePage/ArticlePage";
import EditPage from "./EditPage/EditPage";
import LoginPage from "./LoginPage/LoginPage";
import ResourcePage from "./ResourcePage/ResourcePage";
import axios from "axios";

axios.defaults.baseURL =
  process.env.NODE_ENV === "production"
    ? "https://api.eesast.com"
    : "http://localhost:28888";
axios.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem("token");

const { Content, Footer } = Layout;

class App extends Component {
  render() {
    return (
      <LocaleProvider locale={zhCN}>
        <DocumentTitle title="SAST Weekly">
          <Router>
            <Layout>
              <AppHeader />
              <Content className="App-content">
                <AuthProvider>
                  <Route exact path="/" component={MainPage} />
                  <AuthRoute exact path="/edit" component={EditPage} />
                  <AuthRoute exact path="/resources" component={ResourcePage} />
                  <Route exact path="/login" component={LoginPage} />
                  <Route path="/articles/:alias" component={ArticlePage} />
                </AuthProvider>
              </Content>
              <Footer style={{ height: "64px" }} className="App-footer">
                © 2018 EESAST
              </Footer>
            </Layout>
          </Router>
        </DocumentTitle>
      </LocaleProvider>
    );
  }
}

export default App;
