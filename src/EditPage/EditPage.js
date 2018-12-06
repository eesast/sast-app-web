import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  BackTop,
  Card,
  Menu,
  Icon,
  Input,
  Button,
  Modal,
  message,
  Tag,
  Tooltip
} from "antd";
import hljs from "highlight.js";
import DOMPurify from "dompurify";
import Marked from "marked";
import DocumentTitle from "react-document-title";
import axios from "axios";
import { AuthContext } from "../AuthContext/AuthContext";
import MultipleUpload from "../MultipleUpload/MultipleUpload";
import baseUrl from "../config/baseUrl";
import "./EditPage.css";
import "../github-markdown.css";
import "highlight.js/styles/github.css";

const { TextArea } = Input;
const confirm = Modal.confirm;

Marked.setOptions({
  highlight: code => {
    return hljs.highlightAuto(code).value;
  },
  sanitize: true,
  sanitizer: DOMPurify.sanitize
});

class EditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      alias: "",
      content: "",
      author: "",
      titleImageFilelist: [],
      imageFilelist: [],
      loading: true,
      md: {
        __html: ""
      },
      currentPage: "edit",
      tags: [],
      tagInputVisible: false,
      tagInputValue: ""
    };
    this.textareaRef = React.createRef();
    this.tagInputRef = React.createRef();
  }

  handleTagRemove = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  };

  handleTagInputShow = () => {
    this.setState({ tagInputVisible: true }, () =>
      this.tagInputRef.current.focus()
    );
  };

  handleTagInputConfirm = () => {
    const state = this.state;
    const inputValue = state.tagInputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }

    this.setState({
      tags,
      tagInputVisible: false,
      tagInputValue: ""
    });
  };

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

  handleTitleImageChange = filelist => {
    this.setState({ titleImageFilelist: filelist });
  };

  handleInsertPicture = filelist => {
    let removed = false;
    if (filelist.length < this.state.imageFilelist.length) removed = true;

    this.setState({
      imageFilelist: filelist
    });

    const picture = filelist[filelist.length - 1];

    if (picture && picture.response && !removed) {
      const ref = this.textareaRef.current.textAreaRef;
      const selectionStart = ref.selectionStart;
      const selectionEnd = ref.selectionEnd;
      const content = this.state.content;

      this.setState({
        content:
          content.substring(0, selectionStart) +
          (selectionEnd === selectionStart ? "\n" : `\n\n`) +
          `![${picture.name}](${baseUrl + picture.response})\n\n` +
          content.substring(selectionEnd, content.length)
      });
    }
  };

  handleFilelistRemove = file => {
    return new Promise((resolve, reject) => {
      axios
        .delete(file.response)
        .then(response => {
          message.success("删除图片成功");
          resolve(true);
        })
        .catch(error => {
          message.error("删除图片失败");
          resolve(false);
        });
    });
  };

  handleRefresh = () => {
    sessionStorage.setItem("tmp-title", this.state.title);
    sessionStorage.setItem("tmp-alias", this.state.alias);
    sessionStorage.setItem("tmp-content", this.state.content);
    sessionStorage.setItem("tmp-abstract", this.state.abstract);
    sessionStorage.setItem(
      "tmp-titleImage",
      JSON.stringify(this.state.titleImageFilelist)
    );
    sessionStorage.setItem(
      "tmp-images",
      JSON.stringify(this.state.imageFilelist)
    );
    sessionStorage.setItem("tmp-tags", JSON.stringify(this.state.tags));
  };

  handleSubmit = () => {
    const title = this.state.title;
    const alias = this.state.alias;
    const abstract = this.state.abstract;
    const tags = this.state.tags;
    const content = this.state.content;
    if (
      title === "" ||
      alias === "" ||
      abstract === "" ||
      tags.length === 0 ||
      content === ""
    ) {
      message.error("请完整填写所有内容");
      return;
    }

    const image = this.state.titleImageFilelist[0];
    if (!image) {
      message.error("请上传题图");
      return;
    }
    const authorId = this.context.decodeToken().id;
    if (!authorId) {
      message.error("请重新登录");
      return;
    }

    confirm({
      title: "发布文章",
      content:
        "请在发布前预览 Markdown，确保文章完整可读。\n确定发布该文章吗？",
      onOk: () => {
        return new Promise((resolve, reject) => {
          axios
            .post("/v1/articles", {
              title,
              alias,
              authorId,
              abstract,
              image: image.response,
              content,
              tags
            })
            .then(response => {
              message.success("文章发布成功");
              sessionStorage.clear();
              this.props.history.replace(`/articles/${alias}`);
              resolve(true);
            })
            .catch(error => {
              reject(error);
            });
        }).catch(error => message.error("文章发布失败，请重试"));
      }
    });
  };

  componentDidMount = () => {
    this.setState({
      title: sessionStorage.getItem("tmp-title") || "",
      alias: sessionStorage.getItem("tmp-alias") || "",
      content: sessionStorage.getItem("tmp-content") || "",
      abstract: sessionStorage.getItem("tmp-abstract") || "",
      titleImageFilelist:
        JSON.parse(sessionStorage.getItem("tmp-titleImage")) || [],
      imageFilelist: JSON.parse(sessionStorage.getItem("tmp-images")) || [],
      tags: JSON.parse(sessionStorage.getItem("tmp-tags")) || []
    });
    window.addEventListener("beforeunload", this.handleRefresh);
  };

  componentWillUnmount = () => {
    window.removeEventListener("beforeunload", this.handleRefresh);
  };

  SubmitButton = () => {
    return (
      <Button
        className="submit-button"
        icon="upload"
        onClick={this.handleSubmit}
      >
        发布文章
      </Button>
    );
  };

  Tags = () => {
    return (
      <div style={{ marginTop: "12px" }}>
        {this.state.tags.map(tag => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag
              key={tag}
              closable
              afterClose={() => this.handleTagRemove(tag)}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {this.state.tagInputVisible && (
          <Input
            name="tagInputValue"
            ref={this.tagInputRef}
            type="text"
            style={{ width: 78 }}
            value={this.state.tagInputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleTagInputConfirm}
            onPressEnter={this.handleTagInputConfirm}
          />
        )}
        {!this.state.tagInputVisible && (
          <Tag
            onClick={this.handleTagInputShow}
            style={{ background: "#fff", borderStyle: "dashed" }}
          >
            <Icon type="plus" /> 新标签
          </Tag>
        )}
      </div>
    );
  };

  render() {
    return (
      <DocumentTitle
        title={
          "SAST Weekly | 编辑" +
          (this.state.title ? " - " + this.state.title : "")
        }
      >
        <div className="EditPage">
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
              <Input
                className="input"
                name="title"
                placeholder="标题，例：TensorFlow 初探"
                value={this.state.title}
                onChange={this.handleInputChange}
              />
              <Input
                className="input"
                name="alias"
                placeholder="英文标题，例：tensorflow-first-look"
                value={this.state.alias}
                onChange={this.handleInputChange}
              />
              <TextArea
                style={{ resize: "none" }}
                name="abstract"
                placeholder="文章摘要"
                autosize={{ minRows: 3 }}
                value={this.state.abstract}
                onChange={this.handleInputChange}
              />
              <this.Tags />
              <div style={{ display: "inline-block" }}>
                <MultipleUpload
                  uploadPrompt="上传题图"
                  maxUpload={1}
                  filelist={this.state.titleImageFilelist}
                  handleFilelistChange={this.handleTitleImageChange}
                  handleRemove={this.handleFilelistRemove}
                />
              </div>
              <p>
                点击“插入图片”，会在当前光标处自动插入 Markdown
                语句以添加相应图片。
              </p>
              <p>
                在最终上传 Markdown
                文本前，请点击“删除图片图标”将未用到的图片删除，并提前预览确保展示效果。
              </p>
              <div>
                <MultipleUpload
                  filelist={this.state.imageFilelist}
                  handleFilelistChange={this.handleInsertPicture}
                  handleRemove={this.handleFilelistRemove}
                />
              </div>
              <TextArea
                style={{ resize: "none" }}
                name="content"
                rows={15}
                value={this.state.content}
                ref={this.textareaRef}
                onChange={this.handleInputChange}
              />
              <this.SubmitButton />
            </Card>
          )}
          {this.state.currentPage === "preview" && (
            <Card loading={this.state.loading} title={this.state.author}>
              <article className="markdown-body">
                <div dangerouslySetInnerHTML={this.state.md} />
              </article>
              <this.SubmitButton />
            </Card>
          )}
          <BackTop />
        </div>
      </DocumentTitle>
    );
  }
}

const WrappedEditPage = withRouter(EditPage);
EditPage.contextType = AuthContext;
export default WrappedEditPage;
