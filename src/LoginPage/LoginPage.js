import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Form, Icon, Input, Button, Card } from "antd";
import "./LoginPage.css";
import { AuthContext } from "../AuthContext/AuthContext";
import logo from "../assets/logo.png";

const FormItem = Form.Item;

class LoginForm extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.context.login(values.userName, values.password).then(res => {
          if (res) this.props.history.goBack();
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator("userName", {
            rules: [{ required: true, message: "请输入用户名" }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="用户名"
              autoComplete="on"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "请输入密码" }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="密码"
              autoComplete="on"
            />
          )}
        </FormItem>
        <FormItem>
          <a className="login-form-register" href="/register">
            注册
          </a>
          <a className="login-form-forgot" href="1">
            忘记密码
          </a>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            onClick={this.handleSubmit}
          >
            登录
          </Button>
        </FormItem>
      </Form>
    );
  }
}

/**
 * `hoist-non-react-statics` in `react-router` is old
 * see "https://stackoverflow.com/questions/53240058/use-hoist-non-react-statics-with-withrouter"
 */
const WrappedLoginForm = withRouter(Form.create()(LoginForm));
LoginForm.contextType = AuthContext;

class LoginPage extends Component {
  render() {
    return (
      <div className="LoginPage">
        <Card className="card">
          <img className="logo" alt="logo" src={logo} />
          <WrappedLoginForm />
        </Card>
      </div>
    );
  }
}

export default LoginPage;
