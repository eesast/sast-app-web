import { message } from "antd";
import axios from "axios";
import jwtDecode from "jwt-decode";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

interface IUserInfo {
  id: number;
  username: string;
  name: string;
  email: string;
  group: string;
  role: string;
  exp: number;
}

export interface IAuthProviderState {
  token: string;
  userInfo: IUserInfo;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkToken: () => IUserInfo | undefined;
}

class AuthProvider extends React.Component<
  RouteComponentProps,
  IAuthProviderState
> {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkToken: () => IUserInfo | undefined;

  constructor(props: RouteComponentProps) {
    super(props);

    this.login = async (username: string, password: string) => {
      try {
        const response = await axios.post("/v1/users/login", {
          username,
          password
        });

        const { token } = response.data;
        const userInfo = this.checkToken();
        if (userInfo) {
          this.setState({ userInfo });
          axios.defaults.headers.common.Authorization = "Bearer " + token;
          return true;
        } else {
          return false;
        }
      } catch (error) {
        if (error.response) {
          const statusCode = error.response.status;
          if (statusCode === 401 || statusCode === 404) {
            message.error("用户名或密码错误");
          } else {
            message.error("登录失败");
          }
        } else {
          message.error("与服务器断开连接");
        }
        return false;
      }
    };

    this.logout = () => {
      this.props.history.push("/");
    };

    this.checkToken = () => {
      try {
        const decoded = (jwtDecode(
          this.state.token
        ) as IAuthProviderState["userInfo"])!;

        if (decoded.exp < Date.now() / 1000) {
          this.props.history.push("/login");
        }

        return decoded;
      } catch {
        this.props.history.push("/login");
      }
    };

    this.state = {
      token: "",
      userInfo: {
        id: 0,
        username: "",
        name: "",
        email: "",
        group: "",
        role: "",
        exp: 0
      },
      login: this.login,
      logout: this.logout,
      checkToken: this.checkToken
    };
  }

  render() {
    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

const AuthContext = React.createContext<IAuthProviderState>({
  token: "",
  userInfo: {
    id: 0,
    username: "",
    name: "",
    email: "",
    group: "",
    role: "",
    exp: 0
  },
  // tslint:disable-next-line: no-empty
  login: async (username, password) => {
    return false;
  },
  // tslint:disable-next-line: no-empty
  logout: () => {},
  checkToken: () => {
    return {
      id: 0,
      username: "",
      name: "",
      email: "",
      group: "",
      role: "",
      exp: 0
    };
  }
});
const AuthConsumer = AuthContext.Consumer;
const withRouterAuthProvider = withRouter(AuthProvider);

export { AuthContext, withRouterAuthProvider as AuthProvider, AuthConsumer };
