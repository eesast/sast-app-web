import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Layout } from "antd";
import DocumentTitle from "react-document-title";
import "./App.css";
import AuthRoute from "./AuthRoute/AuthRoute";
import { AuthProvider } from "./AuthContext/AuthContext";
import AppHeader from "./AppHeader/AppHeader";
import MainPage from "./MainPage/MainPage";
import ArticlePage from "./ArticlePage/ArticlePage";
import EditPage from "./EditPage/EditPage";
import LoginPage from "./LoginPage/LoginPage";

const { Content, Footer } = Layout;

class App extends Component {
  render() {
    return (
      <DocumentTitle title="SAST Weekly">
        <Router>
          <Layout>
            <AppHeader />
            <Content className="App-content">
              <AuthProvider>
                <Route exact path="/" component={MainPage} />
                <AuthRoute exact path="/edit" component={EditPage} />
                <Route exact path="/login" component={LoginPage} />
                <Route path="/articles/:shortTitle" component={ArticlePage} />
              </AuthProvider>
            </Content>
            <Footer style={{ height: "64px" }} className="App-footer">
              © 2018 EESAST
            </Footer>
          </Layout>
        </Router>
      </DocumentTitle>
    );
  }
}

export default App;
