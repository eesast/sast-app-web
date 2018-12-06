import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import "./AppHeader.css";
import logo from "../assets/logo.png";
import AppDrawer from "../AppDrawer/AppDrawer";

const { Header } = Layout;
const SubMenu = Menu.SubMenu;

class AppHeader extends Component {
  state = {
    headerStyle: "App-header",
    scrollPos: 0,
    newFormVisible: false,
    drawerVisible: false
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

  handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const delay = 24;
    const topOffset = 12;

    if (
      currentScrollPos + delay < this.state.scrollPos ||
      currentScrollPos < topOffset
    ) {
      this.setState({ headerStyle: "App-header" });
    } else if (
      currentScrollPos > topOffset &&
      currentScrollPos - delay > this.state.scrollPos
    ) {
      this.setState({ headerStyle: "App-header-hidden" });
    }

    this.setState({ scrollPos: currentScrollPos });
  };

  handleDrawerOpen = () => {
    this.setState({ drawerVisible: true });
  };

  handleDrawerClose = () => {
    this.setState({ drawerVisible: false });
  };

  componentDidMount = () => {
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  render() {
    return (
      <Header className={this.state.headerStyle} id="App-header">
        <Button
          className="App-drawer-icon"
          icon="bars"
          ghost
          onClick={this.handleDrawerOpen}
        />
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
          <SubMenu title="资源">
            <Menu.Item key="1">
              <Link to="/resources">活动室</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/resources">设备</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
        <div className="App-actions">
          <Link to="/edit">
            <Button ghost icon="form" />
          </Link>
          <Link to="/login">
            <Button ghost icon="user" />
          </Link>
        </div>
        <AppDrawer
          visible={this.state.drawerVisible}
          onClose={this.handleDrawerClose}
        />
      </Header>
    );
  }
}

export default AppHeader;
