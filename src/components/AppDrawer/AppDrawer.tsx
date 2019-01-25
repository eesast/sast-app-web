import { Drawer, Menu } from "antd";
import { DrawerProps } from "antd/lib/drawer";
import React from "react";
import { Link } from "react-router-dom";
import "./AppDrawer.css";

export interface IAppDrawerProps {
  visible: boolean;
  onClose?: DrawerProps["onClose"];
}

export default class AppDrawer extends React.Component<IAppDrawerProps> {
  render() {
    const { visible, onClose } = this.props;

    return (
      <Drawer title="导航" placement="left" visible={visible} onClose={onClose}>
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
