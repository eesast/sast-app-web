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
import PreviewPage from "./PreviewPage/PreviewPage";
import ArticlePage from "./ArticlePage/ArticlePage";
import EditPage from "./EditPage/EditPage";
import LoginPage from "./LoginPage/LoginPage";
import RegisterPage from "./RegisterPage/RegisterPage";
import ResourceRoomPage from "./ResourceRoomPage/ResourceRoomPage";
import ProfilePage from "./ProfilePage/ProfilePage";
import ManagePage from "./ManagePage/ManagePage";
import ResourceItemPage from "./ResourceItemPage/ResourceItemPage";
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
                  <Route exact path="/" component={PreviewPage} />
                  <AuthRoute
                    exact
                    path="/manage"
                    component={ManagePage}
                    authenticate={["root"]}
                  />
                  <AuthRoute
                    exact
                    path="/edit"
                    component={EditPage}
                    authenticate={["writer", "root"]}
                  />
                  <AuthRoute
                    exact
                    path="/resources/room"
                    component={ResourceRoomPage}
                  />
                  <AuthRoute
                    exact
                    path="/resources/items"
                    component={ResourceItemPage}
                  />
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
