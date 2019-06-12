import { Button, Card, Form, Icon, Input } from "antd";
import { FormComponentProps } from "antd/lib/form";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import logo from "../../assets/logo.png";
import { AuthContext } from "../AuthContext/AuthContext";
import "./LoginPage.css";

const FormItem = Form.Item;

class LoginForm extends React.Component<
  FormComponentProps & RouteComponentProps
> {
  context!: React.ContextType<typeof AuthContext>;

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
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="on"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "请输入密码" }]
          })(
            <Input.Password
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

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        if (await this.context.login(values.userName, values.password)) {
          this.props.history.goBack();
        }
      }
    });
  };
}

/**
 * `hoist-non-react-statics` in `react-router` is old
 * @see https://stackoverflow.com/questions/53240058/use-hoist-non-react-statics-with-withrouter
 */
const WrappedLoginForm = withRouter(Form.create()(LoginForm) as any);
LoginForm.contextType = AuthContext;

// tslint:disable-next-line: max-classes-per-file
export default class LoginPage extends React.Component {
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
