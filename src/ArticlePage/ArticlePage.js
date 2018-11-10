import React, { Component } from "react";
import { BackTop, Card } from "antd";
import axios from "axios";
import hljs from "highlight.js";
import DOMPurify from "dompurify";
import Marked from "marked";
import DocumentTitle from "react-document-title";
import "./ArticlePage.css";
import "./github-markdown.css";
import "highlight.js/styles/github.css";
import ExampleMD from "./example.md";

Marked.setOptions({
  highlight: code => {
    return hljs.highlightAuto(code).value;
  },
  sanitize: true,
  sanitizer: DOMPurify.sanitize
});

const fakeDataUrl =
  "https://randomuser.me/api/?results=1&inc=name,gender,email,nat&noinfo";

class ArticlePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: true,
      md: {
        __html: ""
      }
    };
  }

  getData = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(fakeDataUrl)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => reject(error));
    });
  };

  componentDidMount = () => {
    this.getData().then(data => {
      this.setState({
        data: data.results[0]
      });
    });
    axios
      .get(ExampleMD)
      .then(response => {
        this.setState({
          md: {
            __html: Marked(response.data)
          },
          loading: false
        });
      })
      .catch(error => console.log(error));
  };

  render() {
    return (
      <DocumentTitle title={this.props.match.params.shortTitle}>
        <div className="ArticlePage">
          <Card
            loading={this.state.loading}
            title={this.state.data.email}
            extra="Huang huang"
          >
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
