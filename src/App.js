import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Layout } from "antd";
import DocumentTitle from "react-document-title";
import "./App.css";
import AppHeader from "./AppHeader/AppHeader";
import MainPage from "./MainPage/MainPage";
import ArticlePage from "./ArticlePage/ArticlePage";

const { Content, Footer } = Layout;

class App extends Component {
  render() {
    return (
      <DocumentTitle title="SAST Weekly">
        <Router>
          <Layout>
            <AppHeader />
            <Content className="App-content">
              <Route exact path="/" component={MainPage} />
              <Route path="/articles/:shortTitle" component={ArticlePage} />
            </Content>
            <Footer className="App-footer">© 2018 EESAST</Footer>
          </Layout>
        </Router>
      </DocumentTitle>
    );
  }
}

export default App;
