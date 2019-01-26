import {
  BackTop,
  Button,
  Card,
  Icon,
  Input,
  Menu,
  message,
  Modal,
  Tag,
  Tooltip
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { MenuProps } from "antd/lib/menu";
import { UploadFile } from "antd/lib/upload/interface";
import axios from "axios";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import Marked from "marked";
import React, { Component } from "react";
import DocumentTitle from "react-document-title";
import { RouteComponentProps, withRouter } from "react-router-dom";
import baseUrl from "../../config/baseUrl";
import "../../primer-markdown.css";
import { AuthContext } from "../AuthContext/AuthContext";
import MultipleUpload from "../MultipleUpload/MultipleUpload";
import "./EditPage.css";

const confirm = Modal.confirm;

Marked.setOptions({
  highlight: code => {
    return hljs.highlightAuto(code).value;
  },
  sanitize: true,
  sanitizer: DOMPurify.sanitize
});

interface IEditPageState {
  title: string;
  alias: string;
  content: string;
  abstract: string;
  author: string;
  titleImageFileList: UploadFile[];
  imageFileList: UploadFile[];
  loading: boolean;
  md: {
    __html: string;
  };
  currentPage: "edit" | "preview";
  tags: string[];
  tagInputVisible: boolean;
  tagInputValue: string;
}

class EditPage extends Component<RouteComponentProps, IEditPageState> {
  context!: React.ContextType<typeof AuthContext>;

  textareaRef: React.RefObject<TextArea>;
  tagInputRef: React.RefObject<Input>;

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      title: "",
      alias: "",
      abstract: "",
      content: "",
      author: "",
      titleImageFileList: [],
      imageFileList: [],
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

  render() {
    const {
      tags,
      tagInputVisible,
      tagInputValue,
      currentPage,
      title,
      alias,
      abstract,
      titleImageFileList,
      loading,
      author,
      md,
      imageFileList,
      content
    } = this.state;

    const SubmitButton = () => {
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

    const Tags = () => {
      return (
        <div style={{ marginTop: "12px" }}>
          {tags.map(tag => {
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag
                key={tag}
                closable={true}
                // tslint:disable-next-line: jsx-no-lambda
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
          {tagInputVisible && (
            <Input
              name="tagInputValue"
              ref={this.tagInputRef}
              type="text"
              style={{ width: 78 }}
              value={tagInputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleTagInputConfirm}
              onPressEnter={this.handleTagInputConfirm}
            />
          )}
          {!tagInputVisible && (
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
              <Input
                className="input"
                name="title"
                placeholder="标题，例：TensorFlow 初探"
                value={title}
                onChange={this.handleInputChange}
              />
              <Input
                className="input"
                name="alias"
                placeholder="英文标题，例：tensorflow-first-look"
                value={alias}
                onChange={this.handleInputChange}
              />
              <TextArea
                style={{ resize: "none" }}
                name="abstract"
                placeholder="文章摘要"
                autosize={{ minRows: 3 }}
                value={abstract}
                onChange={this.handleInputChange}
              />
              <Tags />
              <div style={{ display: "inline-block" }}>
                <MultipleUpload
                  uploadPrompt="上传题图"
                  maxUpload={1}
                  fileList={titleImageFileList}
                  handleFileListChange={this.handleTitleImageChange}
                  handleRemove={this.handleFileListRemove}
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
                  fileList={imageFileList}
                  handleFileListChange={this.handleInsertPicture}
                  handleRemove={this.handleFileListRemove}
                />
              </div>
              <TextArea
                style={{ resize: "none" }}
                name="content"
                rows={15}
                value={content}
                ref={this.textareaRef}
                onChange={this.handleInputChange}
              />
              <SubmitButton />
            </Card>
          )}
          {currentPage === "preview" && (
            <Card loading={loading} title={author}>
              <article className="markdown-body">
                <div dangerouslySetInnerHTML={md} />
              </article>
              <SubmitButton />
            </Card>
          )}
          <BackTop />
        </div>
      </DocumentTitle>
    );
  }

  handleTagRemove = (removedTag: string) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  };

  handleTagInputShow = () => {
    this.setState({ tagInputVisible: true }, () =>
      this.tagInputRef.current!.focus()
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

  handleInputChange: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void = e => {
    this.setState({
      [e.target.name]: e.target.value
    } as any);
  };

  handleTitleImageChange = (fileList: UploadFile[]) => {
    this.setState({ titleImageFileList: fileList });
  };

  handleInsertPicture = (fileList: UploadFile[]) => {
    let removed = false;
    if (fileList.length < this.state.imageFileList.length) {
      removed = true;
    }

    this.setState({
      imageFileList: fileList
    });

    const picture = fileList[fileList.length - 1];

    if (picture && picture.response && !removed) {
      const ref = (this.textareaRef.current as any).textAreaRef;
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

  handleFileListRemove = async (file: UploadFile) => {
    try {
      await axios.delete(file.response);
      message.success("删除图片成功");
      return true;
    } catch {
      message.error("删除图片失败");
      return false;
    }
  };

  handleRefresh = () => {
    return "刷新将会丢失所有已编辑的内容，是否确定？";
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

    const image = this.state.titleImageFileList[0];
    if (!image) {
      message.error("请上传题图");
      return;
    }
    this.context.checkTokenStatus();
    if (!this.context.auth) {
      message.info("请先登录");
      return;
    }
    const userInfo = this.context.userInfo;
    const authorId = userInfo!.id;

    confirm({
      title: "发布文章",
      content:
        "请在发布前预览 Markdown，确保文章完整可读。\n确定发布该文章吗？",
      onOk: async () => {
        try {
          await axios.post("/v1/articles", {
            title,
            alias,
            authorId,
            abstract,
            image: image.response,
            content,
            tags
          });

          message.success("文章发布成功");
          this.props.history.replace(`/articles/${alias}`);
        } catch (error) {
          if (error.response.status === 401) {
            message.error("权限不足");
          } else {
            message.error("文章发布失败，请重试");
          }
        }
      }
    });
  };

  componentDidMount = () => {
    window.addEventListener("beforeunload", this.handleRefresh);
  };

  componentWillUnmount = () => {
    window.removeEventListener("beforeunload", this.handleRefresh);
  };
}

/**
 * `hoist-non-react-statics` in `react-router` is old
 * @see https://stackoverflow.com/questions/53240058/use-hoist-non-react-statics-with-withrouter
 */
export default withRouter(EditPage);
EditPage.contextType = AuthContext;
