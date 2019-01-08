import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Form, Input, Button, Card, AutoComplete, message } from "antd";
import axios from "axios";
import "./ProfilePage.css";
import { AuthContext } from "../AuthContext/AuthContext";

const FormItem = Form.Item;
const AutoCompleteOption = AutoComplete.Option;

const isNumeric = n => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

class ProfileForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    userInfo: {
      id: 0,
      username: "",
      email: "",
      name: "",
      phone: 0,
      department: "",
      class: ""
    }
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  validatePhone = (rule, value, callback) => {
    if (value && (!isNumeric(value) || value.toString().length !== 11)) {
      callback("请输入正确的手机号");
    } else {
      callback();
    }
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("两次输入的密码不一致");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  handleEmailChange = value => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = [
        "@mails.tsinghua.edu.cn",
        "@qq.com",
        "@gmail.com",
        "@163.com",
        "@126.com",
        "@outlook.com",
        "@hotmail.com",
        "@sina.com"
      ].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const userInfo = this.context.decodeToken();
        if (userInfo.id) {
          axios
            .put(`/v1/users/${userInfo.id}`, {
              password: values.password,
              email: values.email,
              phone: parseFloat(values.phone)
            })
            .then(response => {
              message.success("更新成功");
            })
            .catch(error => message.error("更新失败"));
        } else {
          message.error("会话已失效，请重新登录");
          setTimeout(() => this.props.history.push("/login"), 1500);
        }
      } else {
        message.error("请填写完整所有信息");
      }
    });
  };

  componentDidMount = () => {
    const userInfo = this.context.decodeToken();
    if (userInfo.id) {
      axios
        .get(`/v1/users/${userInfo.id}?detailInfo=true`)
        .then(response => {
          this.setState({
            userInfo: { ...this.state.userInfo, ...response.data }
          });
        })
        .catch(error => message.error("加载个人信息失败"));
    } else {
      this.props.history.replace("/login");
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };

    const emailOptions = autoCompleteResult.map(email => (
      <AutoCompleteOption key={email}>{email}</AutoCompleteOption>
    ));

    const { userInfo } = this.state;

    return (
      <Form layout="vertical" onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="学号">
          <Input disabled value={userInfo.id} />
        </FormItem>
        <FormItem {...formItemLayout} label="用户名">
          <Input disabled value={userInfo.username} />
        </FormItem>
        <FormItem {...formItemLayout} label="Email">
          {getFieldDecorator("email", {
            rules: [
              {
                type: "email",
                message: "请输入有效的清华电子邮箱"
              },
              {
                required: true,
                message: "请输入电子邮箱"
              }
            ],
            initialValue: userInfo.email
          })(
            <AutoComplete
              dataSource={emailOptions}
              onChange={this.handleEmailChange}
            >
              <Input />
            </AutoComplete>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="手机号码">
          {getFieldDecorator("phone", {
            rules: [
              { required: true, message: "请输入手机号码" },
              {
                validator: this.validatePhone
              }
            ],
            initialValue: userInfo.phone
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="密码">
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: "请输入密码"
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(<Input type="password" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="确认密码">
          {getFieldDecorator("confirm", {
            rules: [
              {
                required: true,
                message: "请再次输入密码"
              },
              {
                validator: this.compareToFirstPassword
              }
            ]
          })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="姓名">
          <Input disabled value={userInfo.name} />
        </FormItem>
        <FormItem {...formItemLayout} label="院系">
          <Input disabled value={userInfo.department} />
        </FormItem>
        <FormItem {...formItemLayout} label="班级">
          <Input disabled value={userInfo.class} />
        </FormItem>
        <FormItem style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit">
            更新
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
const WrappedProfileForm = withRouter(Form.create()(ProfileForm));
ProfileForm.contextType = AuthContext;

class ProfilePage extends Component {
  render() {
    return (
      <div className="ProfilePage">
        <Card className="profile-card">
          <h1 style={{ marginBottom: "24px" }}>个人信息</h1>
          <WrappedProfileForm />
        </Card>
      </div>
    );
  }
}

export default ProfilePage;
