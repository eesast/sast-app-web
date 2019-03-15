import { Layout, LocaleProvider } from "antd";
import zhCN from "antd/lib/locale-provider/zh_CN";
import axios from "axios";
import React, { Component } from "react";
import DocumentTitle from "react-document-title";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import AppHeader from "./components/AppHeader/AppHeader";
import ArticlePage from "./components/ArticlePage/ArticlePage";
import { AuthProvider } from "./components/AuthContext/AuthContext";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import EditPage from "./components/EditPage/EditPage";
import LoginPage from "./components/LoginPage/LoginPage";
import ManagePage from "./components/ManagePage/ManagePage";
import PreviewPage from "./components/PreviewPage/PreviewPage";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import ResourceItemPage from "./components/ResourceItemPage/ResourceItemPage";
import ResourceRoomPage from "./components/ResourceRoomPage/ResourceRoomPage";
import baseURL from "./config/baseUrl";

axios.defaults.baseURL = baseURL;

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
                  <Route exact={true} path="/" component={PreviewPage} />
                  <Route
                    exact={true}
                    path="/register"
                    component={RegisterPage}
                  />
                  <Route
                    exact={true}
                    path="/articles/:alias"
                    component={ArticlePage}
                  />
                  <Route exact={true} path="/login" component={LoginPage} />
                  <AuthRoute
                    exact={true}
                    path="/articles/:alias/edit"
                    component={EditPage}
                  />
                  <AuthRoute
                    exact={true}
                    path="/manage"
                    component={ManagePage}
                    authenticate={["root", "keeper"]}
                  />
                  <AuthRoute
                    exact={true}
                    path="/edit"
                    component={EditPage}
                    authenticate={["writer", "root"]}
                  />
                  <AuthRoute
                    exact={true}
                    path="/resources/room"
                    component={ResourceRoomPage}
                  />
                  <AuthRoute
                    exact={true}
                    path="/resources/items"
                    component={ResourceItemPage}
                  />
                  <AuthRoute
                    exact={true}
                    path="/profile"
                    component={ProfilePage}
                  />
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
