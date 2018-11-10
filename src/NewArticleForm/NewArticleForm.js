import React, { Component } from "react";
import { Modal, Form, Input } from "antd";
import SingleUploadButton from "../SingleUploadButton/SingleUploadButton";
import MultipleUploadButton from "../MultipleUploadButton/MultipleUploadButton";

const FormItem = Form.Item;

const NewArticleForm = Form.create()(
  class extends Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          centered
          visible={visible}
          title="发布新文章"
          okText="发布"
          cancelText="取消"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <FormItem label="标题" id="title">
              {getFieldDecorator("title", {
                rules: [
                  {
                    required: true,
                    message: "请填写文章标题"
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="副标题" id="short-title">
              {getFieldDecorator("short-title", {
                rules: [
                  {
                    required: true,
                    message: "请填写文章副标题"
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="Markdown 文本">
              {getFieldDecorator("markdown", {
                rules: [
                  {
                    required: true,
                    message: "请上传 .md 文件"
                  }
                ]
              })(
                <SingleUploadButton
                  accept=".md"
                  beforeUpload={this.beforeUpload}
                />
              )}
            </FormItem>
            <FormItem label="Markdown 图片">
              {getFieldDecorator("pictures", {
                rules: [
                  {
                    required: true,
                    message: "请上传 .md 所需图片"
                  }
                ]
              })(
                <MultipleUploadButton
                  accept="image/*"
                  beforeUpload={this.beforeUpload}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

export default NewArticleForm;
