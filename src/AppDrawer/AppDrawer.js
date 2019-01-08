import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Drawer, Menu } from "antd";
import "./AppDrawer.css";

class AppDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Drawer
        title="导航"
        placement="left"
        visible={this.props.visible}
        onClose={this.props.onClose}
      >
        <Menu mode="inline" defaultSelectedKeys={["0"]}>
          <Menu.Item key="0">
            <Link to="/">文章</Link>
          </Menu.Item>
          <Menu.SubMenu title="资源">
            <Menu.Item key="1">
              <Link to="/resources/room">活动室</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/resources/items">物品</Link>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Drawer>
    );
  }
}

export default AppDrawer;
