import React, { Component } from "react";
import { message } from "antd";
import axios from "axios";
import jwtDecode from "jwt-decode";

const AuthContext = React.createContext();

class AuthProvider extends Component {
  state = {
    isTokenValid: () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        if (decoded.exp < Date.now() / 1000) {
          return false;
        } else {
          return true;
        }
      } catch (err) {
        return false;
      }
    },
    login: (username, password) => {
      return new Promise((resolve, reject) => {
        axios
          .post("/v1/users/login", {
            username,
            password
          })
          .then(response => {
            const token = response.data.token;
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + localStorage.getItem("token");
            resolve(true);
          })
          .catch(error => {
            if (error.response) {
              if (error.response.status === 401) message.error("密码错误");
              else if (error.response.status === 404)
                message.error("用户不存在");
              else message.error("登录失败");
            } else message.error("与服务器断开连接");
            resolve(false);
          });
      });
    },
    logout: () => {
      localStorage.removeItem("token");
      window.location.reload();
    }
  };

  render() {
    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

const AuthConsumer = AuthContext.Consumer;

export { AuthContext, AuthProvider, AuthConsumer };
