import React, { Component } from "react";
import { Comment, Icon, Tooltip, Popover, List, message, Skeleton } from "antd";
import moment from "moment";
import "./CommentCard.css";
import axios from "axios";
import CommentEditCard from "../CommentEditCard/CommentEditCard";
import { AuthContext } from "../AuthContext/AuthContext";

class CommentCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      likersNames: [],
      liked: false,
      comments: [],
      replyFormVisible: false,
      loading: true
    };
    this.editFormRef = React.createRef();
  }

  static contextType = AuthContext;

  componentDidMount = () => {
    axios
      .get(`/v1/comments?replyTo=${this.props.comment.id}`)
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
          this.setState({ comments: newComments, loading: false });
        });

        Promise.all(
          this.props.comment.likers
            .map(liker => axios.get(`/v1/users/${liker}`))
            .map(p => p.then(response => response.data).catch(error => null))
        ).then(res => {
          const names = res.map(res => (res ? res.name : ""));
          const decoded = this.context.decodeToken();
          this.setState({
            likersNames: names,
            liked: this.props.comment.likers.includes(decoded.id)
          });
        });
      })
      .catch(error => message.error("评论加载失败"));
  };

  handleReply = () => {
    this.setState({ replyFormVisible: !this.state.replyFormVisible }, () => {
      if (this.state.replyFormVisible)
        window.scrollTo({
          top:
            this.editFormRef.current.offsetTop +
            this.editFormRef.current.offsetParent.offsetTop,
          behavior: "smooth"
        });
    });
  };

  handleCommentSubmitted = newComment => {
    this.setState({ replyFormVisible: false });
    this.setState({ comments: [...this.state.comments, newComment] });
  };

  handleLikeButtonClick = e => {
    const decoded = this.context.decodeToken();
    let likersNames = [...this.state.likersNames];

    if (this.state.liked) {
      axios
        .get(`/v1/comments/${this.props.comment.id}/unlike`)
        .then(response => {
          this.setState({
            liked: false,
            likersNames:
              likersNames.splice(likersNames.indexOf(decoded.name), 1) &&
              likersNames
          });
        });
    } else {
      axios.get(`/v1/comments/${this.props.comment.id}/like`).then(response => {
        this.setState({
          liked: true,
          likersNames: likersNames.unshift(decoded.name) && likersNames
        });
      });
    }
  };

  render() {
    const actions = [
      <div
        style={{
          display: "flex",
          alignItems: "center"
        }}
      >
        <Icon
          className={this.state.liked ? "like-button-clicked" : "like-button"}
          type="like"
          theme={this.state.liked ? "filled" : "outlined"}
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
      <Skeleton active loading={this.state.loading}>
        <Comment
          actions={actions}
          author={this.props.comment.author}
          content={this.props.comment.content}
          datetime={
            <Tooltip
              title={moment(this.props.comment.createdAt).format(
                "YYYY-MM-DD HH:mm:ss"
              )}
            >
              <span>{moment(this.props.comment.createdAt).fromNow()}</span>
            </Tooltip>
          }
        >
          {this.state.comments.map(comment => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
          <CommentEditCard
            className={
              this.state.replyFormVisible ? "edit-card-show" : "edit-card"
            }
            ref={this.editFormRef}
            articleId={this.props.comment.articleId}
            replyTo={this.props.comment.id}
            handleCommentSubmitted={this.handleCommentSubmitted}
          />
        </Comment>
      </Skeleton>
    );
  }
}

export default CommentCard;
