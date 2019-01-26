import { message } from "antd";
import axios from "axios";
import jwtDecode from "jwt-decode";
import React from "react";
import IUserModel from "../../models/User";

export interface IAuthProviderState {
  auth: boolean;
  token: string;
  userInfo: IUserModel;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkTokenStatus: () => void;
}

class AuthProvider extends React.Component<{}, IAuthProviderState> {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkTokenStatus: () => void;

  constructor(props: {}) {
    super(props);

    this.login = async (username: string, password: string) => {
      try {
        const response = await axios.post("/v1/users/login", {
          username,
          password
        });

        const { token } = response.data;
        const userInfo = jwtDecode(token) as IUserModel;
        this.setState({
          auth: true,
          token,
          userInfo
        });
        axios.defaults.headers.common.Authorization = "Bearer " + token;

        message.success("登录成功");
        return true;
      } catch (error) {
        this.setState({
          auth: false,
          token: "",
          userInfo: {} as any
        });

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
      this.setState({
        auth: false,
        token: "",
        userInfo: {} as any
      });
    };

    this.checkTokenStatus = () => {
      try {
        const decoded = jwtDecode(this.state.token) as IUserModel;
        if (decoded.exp! < Date.now() / 1000) {
          this.setState({
            auth: false,
            token: "",
            userInfo: {} as any
          });
        }
      } catch {
        this.setState({
          auth: false,
          token: "",
          userInfo: {} as any
        });
      }
    };

    this.state = {
      auth: false,
      token: "",
      userInfo: {} as any,
      login: this.login,
      logout: this.logout,
      checkTokenStatus: this.checkTokenStatus
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

const AuthContext = React.createContext<IAuthProviderState>({} as any);
const AuthConsumer = AuthContext.Consumer;

export { AuthContext, AuthProvider, AuthConsumer };
