import { Card, Comment, Icon, List, message, Popover, Tooltip } from "antd";
import axios from "axios";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import Marked from "marked";
import moment from "moment";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import ICommentModel from "../../models/Comment";
import IUserModel from "../../models/User";
import "../../primer-markdown.css";
import { AuthContext } from "../AuthContext/AuthContext";
import CommentEditCard from "../CommentEditCard/CommentEditCard";
import "./CommentCard.css";

Marked.setOptions({
  highlight: code => {
    return hljs.highlightAuto(code).value;
  },
  sanitize: true,
  sanitizer: DOMPurify.sanitize
});

export interface ICommentCardProps {
  comment: ICommentModel;
  history?: RouteComponentProps["history"];
}

interface ICommentCardState {
  likersNames: string[];
  liked: boolean;
  comments: ICommentModel[];
  replyFormVisible: boolean;
  loading: boolean;
  md: {
    __html: string;
  };
}

export default class CommentCard extends React.Component<
  ICommentCardProps,
  ICommentCardState
> {
  static contextType = AuthContext;
  context!: React.ContextType<typeof AuthContext>;

  editFormRef: React.RefObject<HTMLDivElement>;

  constructor(props: ICommentCardProps) {
    super(props);
    this.state = {
      likersNames: [],
      liked: false,
      comments: [],
      replyFormVisible: false,
      loading: true,
      md: {
        __html: ""
      }
    };
    this.editFormRef = React.createRef();
  }

  render() {
    const {
      liked,
      likersNames,
      loading,
      md,
      comments,
      replyFormVisible
    } = this.state;
    const { comment, history } = this.props;

    const actions = [
      <div
        style={{
          display: "flex",
          alignItems: "center"
        }}
        key={0}
      >
        <Icon
          className={liked ? "like-button-clicked" : "like-button"}
          type="like"
          theme={liked ? "filled" : "outlined"}
          onClick={this.handleLikeButtonClick}
        />
        <Popover
          placement="bottom"
          title="他们也喜欢了这篇评论"
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
          <div style={{ marginLeft: "6px" }}>{likersNames.length || 0}</div>
        </Popover>
        <div
          className="reply-button"
          style={{ marginLeft: "12px" }}
          onClick={this.handleReply}
        >
          回复
        </div>
      </div>
    ];

    return (
      <Card loading={loading} bodyStyle={{ padding: "18px", marginBottom: 0 }}>
        <Comment
          actions={actions}
          author={comment.author}
          content={
            <article
              className="markdown-body"
              style={{ padding: 0, margin: "6px" }}
            >
              <div dangerouslySetInnerHTML={md} />
            </article>
          }
          datetime={
            <Tooltip
              title={moment(comment.createdAt).format("YYYY-MM-DD HH:mm:ss")}
            >
              <span>{moment(comment.createdAt).fromNow()}</span>
            </Tooltip>
          }
        >
          {comments.map(item => (
            <CommentCard key={item.id} comment={item} history={history} />
          ))}
          <CommentEditCard
            className={replyFormVisible ? "edit-card-show" : "edit-card"}
            ref={this.editFormRef}
            articleId={comment.articleId}
            replyTo={comment.id}
            handleCommentSubmitted={this.handleCommentSubmitted}
          />
        </Comment>
      </Card>
    );
  }

  componentDidMount = async () => {
    const comment = this.props.comment;

    this.setState({
      md: {
        __html: Marked(comment.content)
      }
    });

    try {
      const response = await axios.get(`/v1/comments?replyTo=${comment.id}`);
      const comments = response.data as ICommentModel[];
      this.setState({ comments });

      const commentsAuthorNames = await Promise.all(
        comments.map(async item => {
          const res = await axios.get(`/v1/users/${item.authorId}`);
          const data = res.data as IUserModel;
          return data.name;
        })
      );

      const newComments = [...comments];
      for (let index = 0; index < commentsAuthorNames.length; index++) {
        newComments[index].author = commentsAuthorNames[index];
      }
      this.setState({ comments: newComments, loading: false });

      const likersNames = await Promise.all(
        comment.likers.map(async liker => {
          const res = await axios.get(`/v1/users/${liker}`);
          const data = res.data as IUserModel;
          return data.name;
        })
      );
      const userInfo = this.context.checkToken();
      this.setState({
        likersNames,
        liked: comment.likers.includes(userInfo!.id)
      });
    } catch {
      message.error("评论加载失败");
    }
  };

  handleReply = () => {
    const userInfo = this.context.checkToken();
    if (!userInfo) {
      if (this.props.history) {
        this.props.history.push("/login");
      }
      message.info("请先登录");
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

  handleLikeButtonClick = async () => {
    const userInfo = this.context.checkToken();
    if (!userInfo) {
      if (this.props.history) {
        this.props.history.push("/login");
      }
      message.info("请先登录");
    }

    const likersNames = [...this.state.likersNames];
    const comment = this.props.comment;

    if (this.state.liked) {
      try {
        await axios.get(`/v1/comments/${comment.id}/unlike`);
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
        await axios.get(`/v1/comments/${comment.id}/like`);
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
}
