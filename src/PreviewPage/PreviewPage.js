import React, { Component } from "react";
import { Link } from "react-router-dom";
import { List, BackTop, message } from "antd";
import InfiniteScroll from "react-infinite-scroller";
import axios from "axios";
import "./PreviewPage.css";
import PreviewCard from "../PreviewCard/PreviewCard";

class PreviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      data: [],
      loading: false,
      hasMore: true
    };
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

  componentDidMount = () => {
    axios
      .get("/v1/articles?begin=0&end=4&noContent=true")
      .then(response => {
        this.setState({ data: response.data });
      })
      .catch(error => message.error("文章加载失败"));
  };

  handleInfiniteLoadMore = () => {
    const page = this.state.page;
    let data = this.state.data;
    this.setState({
      loading: true
    });

    axios
      .get(`/v1/articles?begin=${page * 5}&end=${page * 5 + 4}&noContent=true`)
      .then(response => {
        data = data.concat(response.data);

        if (response.data.length < 5) {
          this.setState({
            hasMore: false,
            loading: false
          });
          return;
        }

        this.setState({
          page: page + 1,
          loading: false,
          data
        });
      })
      .catch(error => message.error("文章加载失败"));
  };

  render() {
    return (
      <div className="PreviewPage">
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.handleInfiniteLoadMore}
          hasMore={!this.state.loading && this.state.hasMore}
        >
          <List
            itemLayout="vertical"
            split={false}
            loading={this.state.loading}
            dataSource={this.state.data}
            renderItem={item => (
              <List.Item className="ListItem" key={item.id}>
                <Link to={`/articles/${item.alias}`}>
                  <PreviewCard
                    loading={this.state.loading}
                    image={item.image}
                    title={item.title}
                    abstract={item.abstract}
                    views={item.views}
                    likes={item.likers.length}
                    tags={item.tags}
                  />
                </Link>
              </List.Item>
            )}
          />
        </InfiniteScroll>
        <BackTop />
      </div>
    );
  }
}

export default PreviewPage;
