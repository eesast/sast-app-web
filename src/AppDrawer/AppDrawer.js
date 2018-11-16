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
            <Link to="/" onClick={this.props.onClose}>
              文章
            </Link>
          </Menu.Item>
        </Menu>
      </Drawer>
    );
  }
}

export default AppDrawer;
