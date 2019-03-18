import { BackTop, List, message } from "antd";
import axios from "axios";
import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Link } from "react-router-dom";
import IArticleModel from "../../models/Article";
import PreviewCard from "../PreviewCard/PreviewCard";
import "./PreviewPage.css";

interface IPreviewPageState {
  page: number;
  data: IArticleModel[];
  loading: boolean;
  hasMore: boolean;
}

export default class PreviewPage extends Component<{}, IPreviewPageState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      page: 1,
      data: [],
      loading: false,
      hasMore: true
    };
  }

  render() {
    const { loading, hasMore, data } = this.state;

    return (
      <div className="PreviewPage">
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.handleInfiniteLoadMore}
          hasMore={!loading && hasMore}
        >
          <List
            itemLayout="vertical"
            split={false}
            loading={loading}
            dataSource={data}
            // tslint:disable-next-line: jsx-no-lambda
            renderItem={(item: IArticleModel) => (
              <List.Item className="ListItem" key={item.id}>
                <Link style={{ width: "100%" }} to={`/articles/${item.alias}`}>
                  <PreviewCard
                    loading={loading}
                    image={item.image}
                    title={item.title}
                    abstract={item.abstract}
                    views={item.views}
                    likes={item.likers.length}
                    tags={item.tags}
                    createdAt={item.createdAt}
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
    try {
      const response = await axios.get(
        "/v1/articles?begin=0&end=4&noContent=true"
      );
      this.setState({ data: response.data });
    } catch {
      message.error("文章加载失败");
    }
  };

  handleInfiniteLoadMore = async () => {
    const page = this.state.page;
    let data = this.state.data;
    this.setState({
      loading: true
    });

    try {
      const response = await axios.get(
        `/v1/articles?begin=${page * 5}&end=${page * 5 + 4}&noContent=true`
      );
      data = data.concat(response.data);

      if (response.data.length < 5) {
        this.setState({
          hasMore: false,
          loading: false,
          data
        });
        return;
      }

      this.setState({
        page: page + 1,
        loading: false,
        data
      });
    } catch {
      message.error("文章加载失败");
    }
  };
}
