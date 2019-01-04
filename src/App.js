import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Layout, LocaleProvider } from "antd";
import DocumentTitle from "react-document-title";
import axios from "axios";
import "./App.css";
import zhCN from "antd/lib/locale-provider/zh_CN";
import AuthRoute from "./AuthRoute/AuthRoute";
import { AuthProvider } from "./AuthContext/AuthContext";
import AppHeader from "./AppHeader/AppHeader";
import MainPage from "./MainPage/MainPage";
import ArticlePage from "./ArticlePage/ArticlePage";
import EditPage from "./EditPage/EditPage";
import LoginPage from "./LoginPage/LoginPage";
import RegisterPage from "./RegisterPage/RegisterPage";
import ResourcePage from "./ResourcePage/ResourcePage";
import ProfilePage from "./ProfilePage/ProfilePage";
import ManagePage from "./ManagePage/ManagePage";
import baseURL from "./config/baseUrl";

axios.defaults.baseURL = baseURL;
axios.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem("token");

const { Content, Footer } = Layout;

class App extends Component {
  render() {
    return (
      <LocaleProvider locale={zhCN}>
        <DocumentTitle title="SAST Weekly">
          <Router>
            <AuthProvider>
              <Layout>
                <AppHeader />
                <Content className="App-content">
                  <Route exact path="/" component={MainPage} />
                  <Route exact path="/manage" component={ManagePage} />
                  <AuthRoute
                    exact
                    path="/edit"
                    component={EditPage}
                    authenticate={["writer", "root"]}
                  />
                  <AuthRoute exact path="/resources" component={ResourcePage} />
                  <Route exact path="/login" component={LoginPage} />
                  <Route exact path="/register" component={RegisterPage} />
                  <AuthRoute exact path="/profile" component={ProfilePage} />
                  <Route path="/articles/:alias" component={ArticlePage} />
                </Content>
                <Footer style={{ height: "64px" }} className="App-footer">
                  © 2018 EESAST
                </Footer>
              </Layout>
            </AuthProvider>
          </Router>
        </DocumentTitle>
      </LocaleProvider>
    );
  }
}

export default App;
