import React, { Component } from "react";
import { Card, Menu, Input, Icon, Button, message, Modal } from "antd";
import hljs from "highlight.js";
import DOMPurify from "dompurify";
import Marked from "marked";
import axios from "axios";
import "./CommentEditCard.css";
import "../github-markdown.css";
import "highlight.js/styles/github.css";
import { AuthContext } from "../AuthContext/AuthContext";

Marked.setOptions({
  highlight: code => {
    return hljs.highlightAuto(code).value;
  },
  sanitize: true,
  sanitizer: DOMPurify.sanitize
});

const confirm = Modal.confirm;
const TextArea = Input.TextArea;

class CommentEditCard extends Component {
  state = {
    loading: true,
    md: {
      __html: ""
    },
    currentPage: "edit",
    content: ""
  };

  static contextType = AuthContext;

  handleMenuClick = e => {
    this.setState({
      currentPage: e.key
    });

    if (e.key === "preview") {
      this.setState({
        md: {
          __html: Marked(this.state.content)
        },
        loading: false
      });
    } else {
      this.setState({
        loading: true
      });
    }
  };

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = () => {
    const content = this.state.content;
    if (content === "") {
      message.error("请填写评论");
      return;
    }

    const decoded = this.context.decodeToken();
    const authorId = decoded.id;
    if (!authorId) {
      message.error("请重新登录");
      return;
    }

    confirm({
      title: "发布评论",
      content:
        "请在发布前预览 Markdown，确保评论完整可读。\n确定发布该评论吗？",
      onOk: () => {
        return new Promise((resolve, reject) => {
          axios
            .post("/v1/comments", {
              authorId,
              articleId: this.props.articleId,
              content,
              replyTo: this.props.replyTo || -1
            })
            .then(response => {
              message.success("评论发布成功");
              this.props.handleCommentSubmitted({
                id: parseInt(
                  response.headers.location.replace("/v1/comments/", "")
                ),
                likers: [],
                authorId,
                author: decoded.name,
                articleId: this.props.articleId,
                content,
                replyTo: this.props.replyTo || -1
              });
              resolve(true);
            })
            .catch(error => {
              reject(error);
            });
        }).catch(error => {
          if (error.response.status === 401) {
            message.error("权限不足");
          } else {
            message.error("评论发布失败，请重试");
          }
        });
      }
    });
  };

  render() {
    const SubmitButton = () => {
      return (
        <Button
          className="submit-button"
          icon="upload"
          onClick={this.handleSubmit}
        >
          发布评论
        </Button>
      );
    };

    return (
      <div className={this.props.className} ref={this.props.innerRef}>
        <Menu
          style={{
            display: "flex",
            justifyContent: "space-between"
          }}
          onClick={this.handleMenuClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
        >
          <Menu.Item key="edit">
            <Icon type="edit" />
            编辑
          </Menu.Item>
          <Menu.Item key="preview">
            <Icon type="file-markdown" />
            预览
          </Menu.Item>
        </Menu>
        {this.state.currentPage === "edit" && (
          <Card>
            <TextArea
              style={{ resize: "none" }}
              name="content"
              rows={5}
              value={this.state.content}
              onChange={this.handleInputChange}
            />
            <SubmitButton />
          </Card>
        )}
        {this.state.currentPage === "preview" && (
          <Card loading={this.state.loading}>
            <article className="markdown-body">
              <div dangerouslySetInnerHTML={this.state.md} />
            </article>
            <SubmitButton />
          </Card>
        )}
      </div>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <CommentEditCard innerRef={ref} {...props} />
));
