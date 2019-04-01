import {
  AutoComplete,
  Button,
  Card,
  Form,
  Icon,
  Input,
  message,
  Select,
  Tooltip
} from "antd";
import { AutoCompleteProps } from "antd/lib/auto-complete";
import { FormComponentProps, FormProps, ValidationRule } from "antd/lib/form";
import { InputProps } from "antd/lib/input";
import { SelectProps } from "antd/lib/select";
import axios from "axios";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { AuthContext } from "../AuthContext/AuthContext";
import "./RegisterPage.css";

const FormItem = Form.Item;
const AutoCompleteOption = AutoComplete.Option;
const SelectOption = Select.Option;

const departmentOptionsList = ["电子系"];

const isNumeric = (n: any) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

interface IRegistrationFormState {
  confirmDirty: boolean;
  autoCompleteResult: string[];
}

class RegistrationForm extends React.Component<
  FormComponentProps & RouteComponentProps,
  IRegistrationFormState
> {
  context!: React.ContextType<typeof AuthContext>;

  constructor(props: FormComponentProps & RouteComponentProps) {
    super(props);
    this.state = {
      confirmDirty: false,
      autoCompleteResult: []
    };
  }

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

    const departmentOptions = departmentOptionsList.map(department => (
      <SelectOption key={department}>{department}</SelectOption>
    ));

    const classSelector = getFieldDecorator("class-prefix", {
      initialValue: "无"
    })(
      <Select style={{ width: 50 }}>
        <SelectOption value="无">无</SelectOption>
      </Select>
    );

    return (
      <Form layout="vertical" onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="学号">
          {getFieldDecorator("id", {
            rules: [
              {
                required: true,
                message: "请输入学号"
              },
              {
                validator: this.validateId
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            <span>
              用户名&nbsp;
              <Tooltip title="可以与学号不同">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator("username", {
            rules: [
              {
                required: true,
                message: "请输入用户名"
              }
            ]
          })(<Input />)}
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
            ]
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
            ]
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
          {getFieldDecorator("name", {
            rules: [{ required: true, message: "请输入姓名" }]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="院系">
          {getFieldDecorator("department", {
            rules: [{ required: true, message: "请输入院系" }]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="班级">
          {getFieldDecorator("class", {
            rules: [{ required: true, message: "请输入班级" }]
          })(<Input />)}
        </FormItem>
        <FormItem style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit">
            注册
          </Button>
        </FormItem>
      </Form>
    );
  }

  handleSelectFilter: SelectProps["filterOption"] = (input, option) =>
    (option.props.children as string)
      .toLowerCase()
      .indexOf(input.toLowerCase()) >= 0;

  handleConfirmBlur: InputProps["onBlur"] = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  validateId: ValidationRule["validator"] = (rule, value, callback) => {
    if (value && (!isNumeric(value) || value.length !== 10)) {
      callback("请输入正确的学号");
    } else {
      callback();
    }
  };

  validatePhone: ValidationRule["validator"] = (rule, value, callback) => {
    if (value && (!isNumeric(value) || value.length !== 11)) {
      callback("请输入正确的手机号");
    } else {
      callback();
    }
  };

  compareToFirstPassword: ValidationRule["validator"] = (
    rule,
    value,
    callback
  ) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("两次输入的密码不一致");
    } else {
      callback();
    }
  };

  validateToNextPassword: ValidationRule["validator"] = (
    rule,
    value,
    callback
  ) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  validateClass: ValidationRule["validator"] = (rule, value, callback) => {
    if (value && (!isNumeric(value) || value.length !== 2)) {
      callback("请输入正确的班级");
    } else {
      callback();
    }
  };

  handleEmailChange: AutoCompleteProps["onChange"] = value => {
    let autoCompleteResult: string[];
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

  handleSubmit: FormProps["onSubmit"] = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        try {
          await axios.post("/v1/users", {
            id: parseFloat(values.id),
            username: values.username,
            password: values.password,
            email: values.email,
            name: values.name,
            phone: parseFloat(values.phone),
            department: values.department,
            class: values["class-prefix"] + values.class
          });
          this.props.history.replace("/login");
        } catch {
          message.error("注册失败");
        }
      } else {
        message.error("请填写完整所有信息");
      }
    });
  };
}

/**
 * `hoist-non-react-statics` in `react-router` is old
 * @see https://stackoverflow.com/questions/53240058/use-hoist-non-react-statics-with-withrouter
 */
const WrappedRegistrationForm = withRouter(Form.create()(RegistrationForm));
RegistrationForm.contextType = AuthContext;

// tslint:disable-next-line: max-classes-per-file
export default class RegisterPage extends React.Component {
  render() {
    return (
      <div className="RegisterPage">
        <Card className="register-card">
          <h1 style={{ marginBottom: "24px" }}>注册</h1>
          <WrappedRegistrationForm />
        </Card>
      </div>
    );
  }
}
