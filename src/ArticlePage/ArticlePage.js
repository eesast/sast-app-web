import React, { Component } from "react";
import { BackTop, Card, message } from "antd";
import axios from "axios";
import hljs from "highlight.js";
import DOMPurify from "dompurify";
import Marked from "marked";
import DocumentTitle from "react-document-title";
import "./ArticlePage.css";
import "../github-markdown.css";
import "highlight.js/styles/github.css";

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
      }
    };
  }

  componentWillMount = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (/micromessenger/.test(ua)) {
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
      .get(`/v1/articles?alias=${alias}`)
      .then(response => {
        const data = response.data[0];

        axios
          .get(`/v1/users/${data.authorId}`)
          .then(response => {
            const author = response.data;

            this.setState({
              title: data.title,
              author: author.name,
              md: {
                __html: Marked(data.content)
              },
              loading: false
            });
          })
          .catch(error => message.error("作者加载失败"));
      })
      .catch(error => message.error("文章加载失败"));
  };

  render() {
    return (
      <DocumentTitle title={"SAST Weekly | " + this.state.title}>
        <div className="ArticlePage">
          <Card loading={this.state.loading} title={this.state.author}>
            <article className="markdown-body">
              <div dangerouslySetInnerHTML={this.state.md} />
            </article>
          </Card>
          <BackTop />
        </div>
      </DocumentTitle>
    );
  }
}

export default ArticlePage;
