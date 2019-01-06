import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Button, Dropdown } from "antd";
import "./AppHeader.css";
import logo from "../assets/logo.png";
import AppDrawer from "../AppDrawer/AppDrawer";
import { AuthContext } from "../AuthContext/AuthContext";

const { Header } = Layout;
const SubMenu = Menu.SubMenu;

class AppHeader extends Component {
  state = {
    headerStyle: "App-header",
    scrollPos: 0,
    drawerVisible: false,
    manageIconVisible: false,
    editIconVisible: false
  };

  static contextType = AuthContext;

  handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const delay = 12;
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

    const decoded = this.context.decodeToken();
    if (decoded && decoded.role === "writer")
      this.setState({ editIconVisible: true });
    if (decoded && decoded.role === "root") {
      this.setState({ editIconVisible: true, manageIconVisible: true });
    }
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  render() {
    const dropdownMenu = (
      <Menu onClick={this.handleDropdownMenuClick}>
        <Menu.Item key="0">
          <Link to="/profile">个人信息</Link>
        </Menu.Item>
        <Menu.Item key="1" onClick={this.context.logout}>
          退出登录
        </Menu.Item>
      </Menu>
    );

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
              <Link to="/resources/room">活动室</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/resources/devices">设备</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
        <div className="App-actions">
          <Link to="/manage" hidden={!this.state.manageIconVisible}>
            <Button ghost icon="safety" />
          </Link>
          <Link to="/edit" hidden={!this.state.editIconVisible}>
            <Button ghost icon="form" />
          </Link>
          <Dropdown overlay={dropdownMenu}>
            <Button ghost icon="user" />
          </Dropdown>
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
