import React, { Component } from "react";
import {
  BackTop,
  Card,
  message,
  Icon,
  List,
  Popover,
  Divider,
  Button
} from "antd";
import axios from "axios";
import hljs from "highlight.js";
import DOMPurify from "dompurify";
import Marked from "marked";
import DocumentTitle from "react-document-title";
import { AuthContext } from "../AuthContext/AuthContext";
import "./ArticlePage.css";
import "../github-markdown.css";
import "highlight.js/styles/github.css";
import CommentCard from "../CommentCard/CommentCard";
import CommentEditCard from "../CommentEditCard/CommentEditCard";

Marked.setOptions({
  highlight: code => {
    return hljs.highlightAuto(code).value;
  },
  sanitize: true,
  sanitizer: DOMPurify.sanitize
});

class ArticlePage extends Component {
  constructor(props) {
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
      replyFormVisible: false
    };
    this.editFormRef = React.createRef();
  }

  static contextType = AuthContext;

  componentWillMount = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (/micromessenger/.test(ua)) {
      // TODO: clear when leaving the page
      const reloadTime = sessionStorage.getItem("reload-time") || "0";
      if (reloadTime !== "1") {
        sessionStorage.setItem("reload-time", "1");
        window.location.reload();
      }
    }
  };

  componentDidMount = () => {
    const alias = this.props.match.params.alias;
    axios
      .get(`/v1/articles?alias=${alias}&imvisible=true`)
      .then(response => {
        const data = response.data[0];

        axios
          .get(`/v1/users/${data.authorId}`)
          .then(response => {
            const author = response.data;
            const decoded = this.context.decodeToken();

            this.setState({
              id: data.id,
              title: data.title,
              author: author.name,
              md: {
                __html: Marked(data.content)
              },
              loading: false,
              views: data.views,
              liked:
                decoded && decoded.id
                  ? data.likers.includes(decoded.id)
                  : false,
              tags: data.tags
            });

            if (!data.visible) message.info("您正在预览未发布的文章");

            axios
              .get(`/v1/comments?replyTo=-1&articleId=${data.id}`)
              .then(response => {
                const comments = response.data;
                this.setState({ comments });

                Promise.all(
                  comments.map(comment => {
                    return axios
                      .get(`/v1/users/${comment.authorId}`)
                      .then(response => response.data.name);
                  })
                ).then(names => {
                  let newComments = [...this.state.comments];
                  for (let index = 0; index < names.length; index++) {
                    newComments[index].author = names[index];
                  }
                  this.setState({ comments: newComments });
                });
              })
              .catch(error => message.error("评论加载失败"));

            Promise.all(
              data.likers
                .map(liker => axios.get(`/v1/users/${liker}`))
                .map(p =>
                  p.then(response => response.data).catch(error => null)
                )
            ).then(res => {
              const names = res.map(res => (res ? res.name : ""));
              this.setState({
                likersNames: names
              });
            });
          })
          .catch(error => message.error("作者加载失败"));
      })
      .catch(error => message.error("文章加载失败"));
  };

  handleLikeButtonClick = e => {
    const decoded = this.context.decodeToken();
    let likersNames = [...this.state.likersNames];

    if (this.state.liked) {
      axios.get(`/v1/articles/${this.state.id}/unlike`).then(response => {
        this.setState({
          liked: false,
          likersNames:
            likersNames.splice(likersNames.indexOf(decoded.name), 1) &&
            likersNames
        });
      });
    } else {
      axios.get(`/v1/articles/${this.state.id}/like`).then(response => {
        this.setState({
          liked: true,
          likersNames: likersNames.unshift(decoded.name) && likersNames
        });
      });
    }
  };

  handleReply = () => {
    this.setState({ replyFormVisible: !this.state.replyFormVisible }, () => {
      if (this.state.replyFormVisible)
        this.editFormRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
    });
  };

  handleCommentSubmitted = newComment => {
    this.setState({ replyFormVisible: false });
    this.setState({ comments: [...this.state.comments, newComment] });
  };

  render() {
    return (
      <DocumentTitle
        title={
          this.state.title === ""
            ? "SAST Weekly"
            : "SAST Weekly | " + this.state.title
        }
      >
        <div className="ArticlePage">
          <Card loading={this.state.loading} title={this.state.author}>
            <article className="markdown-body">
              <div dangerouslySetInnerHTML={this.state.md} />
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
                  alignItems: "center"
                }}
              >
                <Icon type="eye" />
                <div style={{ marginLeft: "6px" }}>{this.state.views || 0}</div>
                <div style={{ marginLeft: "12px" }}>
                  {this.state.tags && this.state.tags.join(" / ")}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Icon
                  className={
                    this.state.liked ? "like-button-clicked" : "like-button"
                  }
                  type="like"
                  theme={this.state.liked ? "filled" : "outlined"}
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
                      {this.state.likersNames.map(item => (
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
                    {this.state.likersNames.length || 0}
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
            className={
              this.state.replyFormVisible ? "edit-card-show" : "edit-card"
            }
            ref={this.editFormRef}
            articleId={this.state.id}
            replyTo={-1}
            handleCommentSubmitted={this.handleCommentSubmitted}
          />
          {this.state.comments.map(comment => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
          <BackTop />
        </div>
      </DocumentTitle>
    );
  }
}

export default ArticlePage;
