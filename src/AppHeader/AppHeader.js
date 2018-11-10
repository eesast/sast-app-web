import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import "./AppHeader.css";
import NewArticleForm from "../NewArticleForm/NewArticleForm";
import logo from "../assets/logo.png";

const { Header } = Layout;

class AppHeader extends Component {
  state = {
    newFormVisible: false
  };

  handleNewFormClick = () => {
    this.setState({ newFormVisible: true });
  };

  handleNewFormCancel = () => {
    this.setState({ newFormVisible: false });
  };

  handleFormCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log("Received values of form: ", values);
      form.resetFields();
      this.setState({ newFormVisible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    return (
      <Header className="App-header" id="App-header">
        <img className="App-logo" alt="logo" src={logo} />
        <h1 className="App-name" id="App-name">
          SAST Weekly
        </h1>
        <Menu
          className="App-menu"
          id="App-menu"
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["0"]}
        >
          <Menu.Item key="0">
            <Link to="/">文章</Link>
          </Menu.Item>
        </Menu>
        <div className="App-actions">
          <Button ghost icon="form" onClick={this.handleNewFormClick} />
          <NewArticleForm
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.newFormVisible}
            onCancel={this.handleNewFormCancel}
            onCreate={this.handleFormCreate}
          />
        </div>
      </Header>
    );
  }
}

export default AppHeader;
