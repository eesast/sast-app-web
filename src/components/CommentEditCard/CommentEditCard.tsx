import { Button, Card, Icon, Input, Menu, message, Modal } from "antd";
import { TextAreaProps } from "antd/lib/input";
import { MenuProps } from "antd/lib/menu";
import axios from "axios";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import Marked from "marked";
import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import ICommentModel from "../../models/Comment";
import "../../primer-markdown.css";
import { AuthContext } from "../AuthContext/AuthContext";
import "./CommentEditCard.css";

Marked.setOptions({
  highlight: code => {
    return hljs.highlightAuto(code).value;
  },
  sanitize: true,
  sanitizer: DOMPurify.sanitize
});

const confirm = Modal.confirm;
const TextArea = Input.TextArea;

export interface ICommentEditCardProps {
  innerRef?: React.Ref<{}>;
  className?: string;
  history?: RouteComponentProps["history"];
  articleId: number;
  replyTo: number;
  handleCommentSubmitted?: (newComment: ICommentModel) => void;
}

interface ICommentEditCardState {
  loading: boolean;
  md: {
    __html: string;
  };
  currentPage: "edit" | "preview";
  content: string;
}

class CommentEditCard extends Component<
  ICommentEditCardProps,
  ICommentEditCardState
> {
  static contextType = AuthContext;
  context!: React.ContextType<typeof AuthContext>;

  constructor(props: ICommentEditCardProps) {
    super(props);
    this.state = {
      loading: true,
      md: {
        __html: ""
      },
      currentPage: "edit",
      content: ""
    };
  }

  render() {
    const SubmitButton = () => (
      <Button
        className="submit-button"
        icon="upload"
        onClick={this.handleSubmit}
      >
        发布评论
      </Button>
    );

    const { className, innerRef } = this.props;
    const { currentPage, content, loading, md } = this.state;

    return (
      <div className={className} ref={innerRef as any}>
        <Menu
          style={{
            display: "flex",
            justifyContent: "space-between",
            border: "1px solid #e8e8e8"
          }}
          onClick={this.handleMenuClick}
          selectedKeys={[currentPage]}
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
        {currentPage === "edit" && (
          <Card>
            <TextArea
              style={{ resize: "none" }}
              name="content"
              rows={5}
              value={content}
              onChange={this.handleInputChange}
            />
            <SubmitButton />
          </Card>
        )}
        {currentPage === "preview" && (
          <Card loading={loading}>
            <article className="markdown-body">
              <div dangerouslySetInnerHTML={md} />
            </article>
            <SubmitButton />
          </Card>
        )}
      </div>
    );
  }

  handleMenuClick: MenuProps["onClick"] = e => {
    this.setState({
      currentPage: e.key as "edit" | "preview"
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

  handleInputChange: TextAreaProps["onChange"] = e => {
    this.setState({
      content: e.target.value
    });
  };

  handleSubmit = () => {
    const content = this.state.content;
    if (content === "") {
      message.error("请填写评论");
      return;
    }

    this.context.checkTokenStatus();
    if (!this.context.auth) {
      message.info("请先登录");
      return;
    }
    const userInfo = this.context.userInfo;

    const authorId = userInfo.id;
    if (!authorId) {
      if (this.props.history) {
        this.props.history.push("/login");
      }
      message.info("请先登录");
    }

    confirm({
      title: "发布评论",
      content:
        "请在发布前预览 Markdown，确保评论完整可读。\n确定发布该评论吗？",
      onOk: async () => {
        try {
          const response = await axios.post("/v1/comments", {
            authorId,
            articleId: this.props.articleId,
            content,
            replyTo: this.props.replyTo || -1
          });
          message.success("评论发布成功");

          if (this.props.handleCommentSubmitted) {
            this.props.handleCommentSubmitted({
              id: parseInt(
                response.headers.location.replace("/v1/comments/", ""),
                10
              ),
              likers: [],
              authorId,
              author: userInfo.name,
              articleId: this.props.articleId,
              content,
              replyTo: this.props.replyTo || -1
            });
          }
          this.setState({
            content: ""
          });
        } catch (error) {
          if (error.response.status === 401) {
            message.error("权限不足");
          } else {
            message.error("评论发布失败");
          }
        }
      }
    });
  };
}

export default React.forwardRef((props: ICommentEditCardProps, ref) => (
  <CommentEditCard innerRef={ref} {...props} />
));
