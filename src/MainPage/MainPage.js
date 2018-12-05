import React, { Component } from "react";
import { Link } from "react-router-dom";
import { List, BackTop, Spin, message } from "antd";
import InfiniteScroll from "react-infinite-scroller";
import axios from "axios";
import "./MainPage.css";
import PreviewCard from "../PreviewCard/PreviewCard";

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      data: [],
      loading: false,
      hasMore: true
    };
  }

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
      <div className="MainPage">
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.handleInfiniteLoadMore}
          hasMore={!this.state.loading && this.state.hasMore}
        >
          <List
            itemLayout="vertical"
            split={false}
            locale={{ emptyText: "-_-" }}
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
                  />
                </Link>
              </List.Item>
            )}
          >
            <div className="Spin-container">
              {this.state.loading && this.state.hasMore && <Spin />}
            </div>
          </List>
        </InfiniteScroll>

        <BackTop />
      </div>
    );
  }
}

export default MainPage;
