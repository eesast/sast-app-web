import {
  BackTop,
  Button,
  Card,
  Divider,
  Icon,
  List,
  message,
  Popover
} from "antd";
import axios from "axios";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import Marked from "marked";
import moment from "moment";
import React from "react";
import DocumentTitle from "react-document-title";
import { RouteComponentProps } from "react-router-dom";
import IArticleModel from "../../models/Article";
import ICommentModel from "../../models/Comment";
import IUserModel from "../../models/User";
import "../../primer-markdown.css";
import { AuthContext } from "../AuthContext/AuthContext";
import CommentCard from "../CommentCard/CommentCard";
import CommentEditCard from "../CommentEditCard/CommentEditCard";
import "./ArticlePage.css";

Marked.setOptions({
  highlight: code => {
    return hljs.highlightAuto(code).value;
  },
  sanitize: true,
  sanitizer: DOMPurify.sanitize
});

export type IArticlePageProps = RouteComponentProps<{ alias: string }>;

interface IArticlePageState {
  author: string;
  title: string;
  loading: boolean;
  md: {
    __html: string;
  };
  liked: boolean;
  likersNames: string[];
  id: number;
  comments: ICommentModel[];
  replyFormVisible: boolean;
  views: number;
  tags: string[];
  updatedAt?: string;
}

export default class ArticlePage extends React.Component<
  IArticlePageProps,
  IArticlePageState
> {
  static contextType = AuthContext;
  context!: React.ContextType<typeof AuthContext>;

  editFormRef: React.RefObject<HTMLDivElement>;

  constructor(props: IArticlePageProps) {
    super(props);
    this.state = {
      author: "",
      title: "",
      loading: true,
      md: {
        __html: ""
      },
      liked: false,
      likersNames: [],
      id: 0,
      comments: [],
      replyFormVisible: false,
      views: 0,
      tags: [],
      updatedAt: ""
    };
    this.editFormRef = React.createRef();
  }

  render() {
    const {
      title,
      loading,
      author,
      md,
      views,
      tags,
      liked,
      likersNames,
      replyFormVisible,
      id,
      updatedAt
    } = this.state;

    return (
      <DocumentTitle
        title={title === "" ? "SAST Weekly" : "SAST Weekly | " + title}
      >
        <div className="ArticlePage">
          <Card loading={loading} title={author}>
            <article className="markdown-body">
              <div dangerouslySetInnerHTML={md} />
            </article>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  overflowX: "hidden"
                }}
              >
                <div>
                  {"编辑于 " +
                    (moment().diff(moment(updatedAt), "weeks") < 1
                      ? moment(updatedAt).fromNow()
                      : moment(updatedAt).calendar())}
                </div>
                <div style={{ marginLeft: "12px" }}>
                  {tags && tags.join(" / ")}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Icon style={{ marginRight: "6px" }} type="eye" />
                <div style={{ marginRight: "12px" }}>{views || 0}</div>
                <Icon
                  className={liked ? "like-button-clicked" : "like-button"}
                  type="like"
                  theme={liked ? "filled" : "outlined"}
                  onClick={this.handleLikeButtonClick}
                />
                <Popover
                  placement="bottom"
                  title="他们也喜欢了这篇文章"
                  content={
                    <div
                      style={{
                        width: "100px",
                        maxHeight: "160px",
                        display: "flex",
                        flexWrap: "wrap"
                      }}
                    >
                      {likersNames.map(item => (
                        <List.Item
                          key={item}
                          style={{
                            color: "#8440bd",
                            marginLeft: "6px",
                            marginTop: "-12px",
                            marginBottom: "-12px"
                          }}
                        >
                          {item}
                        </List.Item>
                      ))}
                    </div>
                  }
                >
                  <div style={{ marginLeft: "6px" }}>
                    {likersNames.length || 0}
                  </div>
                </Popover>
              </div>
            </div>
          </Card>
          <Divider />
          <Button style={{ marginBottom: "12px" }} onClick={this.handleReply}>
            评论文章
          </Button>
          <CommentEditCard
            className={replyFormVisible ? "edit-card-show" : "edit-card"}
            ref={this.editFormRef}
            articleId={id}
            replyTo={-1}
            handleCommentSubmitted={this.handleCommentSubmitted}
          />
          {this.state.comments.map(comment => (
            <CommentCard
              key={comment.id}
              comment={comment}
              history={this.props.history}
            />
          ))}
          <BackTop />
        </div>
      </DocumentTitle>
    );
  }

  componentWillMount = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (
      /micromessenger/.test(ua) &&
      sessionStorage.getItem("refresh") !== "1"
    ) {
      window.location.search = `?wx=${Date.now()}`;
      sessionStorage.setItem("refresh", "1");
    }
  };

  componentWillUnmount = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (/micromessenger/.test(ua)) {
      sessionStorage.removeItem("refresh");
    }
  };

  componentDidMount = async () => {
    const alias = this.props.match.params.alias;
    let article: IArticleModel | null = null;

    try {
      const articleResponse = await axios.get(
        `/v1/articles?alias=${alias}&imvisible=true`
      );
      article = articleResponse.data[0] as IArticleModel;

      const authorResponse = await axios.get(`/v1/users/${article.authorId}`);
      const author = authorResponse.data;
      const userInfo = this.context.userInfo;

      this.setState({
        id: article.id,
        title: article.title,
        author: author.name,
        md: {
          __html: Marked(article.content)
        },
        loading: false,
        views: article.views,
        liked:
          userInfo && userInfo.id
            ? article.likers.includes(userInfo.id)
            : false,
        tags: article.tags,
        updatedAt: article.updatedAt
      });

      if (!article.visible) {
        message.info("正在预览未发布的文章");
      }
    } catch {
      message.error("文章加载失败");
    }

    try {
      if (!article) {
        return;
      }

      const commentsResponse = await axios.get(
        `/v1/comments?replyTo=-1&articleId=${article.id}`
      );
      const comments = commentsResponse.data as ICommentModel[];
      this.setState({ comments });

      const commentsNames = await Promise.all(
        comments.map(async comment => {
          const res = await axios.get(`/v1/users/${comment.authorId}`);
          return (res.data as IUserModel).name;
        })
      );
      const newComments = [...this.state.comments];
      for (let index = 0; index < newComments.length; index++) {
        newComments[index].author = commentsNames[index];
      }
      this.setState({ comments: newComments });

      const likersNames = await Promise.all(
        article.likers.map(async liker => {
          const res = await axios.get(`/v1/users/${liker}`);
          return (res.data as IUserModel).name;
        })
      );
      this.setState({
        likersNames
      });
    } catch {
      message.error("评论加载失败");
    }
  };

  handleLikeButtonClick = async () => {
    this.context.checkTokenStatus();
    if (!this.context.auth) {
      message.info("请先登录");
      return;
    }
    const userInfo = this.context.userInfo;

    const likersNames = [...this.state.likersNames];

    if (this.state.liked) {
      try {
        await axios.get(`/v1/articles/${this.state.id}/unlike`);
        this.setState({
          liked: false,
          likersNames:
            likersNames.splice(likersNames.indexOf(userInfo!.name), 1) &&
            likersNames
        });
      } catch {
        message.error("取消点赞失败");
      }
    } else {
      try {
        await axios.get(`/v1/articles/${this.state.id}/like`);
        likersNames.unshift(userInfo!.name);
        this.setState({
          liked: true,
          likersNames
        });
      } catch {
        message.error("点赞失败");
      }
    }
  };

  handleReply = () => {
    this.context.checkTokenStatus();
    if (!this.context.auth) {
      message.info("请先登录");
      return;
    }

    this.setState({ replyFormVisible: !this.state.replyFormVisible }, () => {
      if (this.state.replyFormVisible) {
        this.editFormRef.current!.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  };

  handleCommentSubmitted = (newComment: ICommentModel) => {
    this.setState({ replyFormVisible: false });
    this.setState({ comments: [...this.state.comments, newComment] });
  };
}
