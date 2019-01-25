import { Button, Dropdown, Layout, Menu } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import AppDrawer from "../AppDrawer/AppDrawer";
import { AuthContext } from "../AuthContext/AuthContext";
import "./AppHeader.css";

const { Header } = Layout;
const SubMenu = Menu.SubMenu;

interface IAppHeaderState {
  headerStyle: "App-header-hidden" | "App-header";
  scrollPos: number;
  drawerVisible: boolean;
  manageIconVisible: boolean;
  editIconVisible: boolean;
}

export default class AppHeader extends React.Component<{}, IAppHeaderState> {
  static contextType = AuthContext;
  context!: React.ContextType<typeof AuthContext>;

  constructor(props: {}) {
    super(props);
    this.state = {
      headerStyle: "App-header",
      scrollPos: 0,
      drawerVisible: false,
      manageIconVisible: false,
      editIconVisible: false
    };
  }

  render() {
    const { logout } = this.context;
    const {
      headerStyle,
      manageIconVisible,
      editIconVisible,
      drawerVisible
    } = this.state;

    const dropdownMenu = (
      <Menu>
        <Menu.Item key="0">
          <Link to="/profile">个人信息</Link>
        </Menu.Item>
        <Menu.Item key="1" onClick={logout}>
          退出登录
        </Menu.Item>
      </Menu>
    );

    return (
      <Header className={headerStyle}>
        <Button
          className="App-drawer-icon"
          icon="bars"
          ghost={true}
          onClick={this.handleDrawerOpen}
        />
        <img className="App-logo" alt="logo" src={logo} />
        <h1 className="App-name">SAST Weekly</h1>
        <Menu
          className="App-menu"
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
              <Link to="/resources/items">物品</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
        <div className="App-actions">
          <Link to="/manage" hidden={!manageIconVisible}>
            <Button ghost={true} icon="safety" />
          </Link>
          <Link to="/edit" hidden={!editIconVisible}>
            <Button ghost={true} icon="form" />
          </Link>
          <Dropdown overlay={dropdownMenu}>
            <Button ghost={true} icon="user" />
          </Dropdown>
        </div>
        <AppDrawer visible={drawerVisible} onClose={this.handleDrawerClose} />
      </Header>
    );
  }

  handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const delay = 12;
    const topOffset = 12;
    const scrollPos = this.state.scrollPos;

    if (currentScrollPos + delay < scrollPos || currentScrollPos < topOffset) {
      this.setState({ headerStyle: "App-header" });
    } else if (
      currentScrollPos > topOffset &&
      currentScrollPos - delay > scrollPos
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

    const userInfo = this.context.checkToken();
    if (userInfo && userInfo.role === "writer") {
      this.setState({ editIconVisible: true });
    }
    if (userInfo && userInfo.role === "root") {
      this.setState({ editIconVisible: true, manageIconVisible: true });
    }
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };
}
