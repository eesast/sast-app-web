import React, { Component } from "react";
import { Link } from "react-router-dom";
import { List, BackTop, Spin } from "antd";
import InfiniteScroll from "react-infinite-scroller";
import axios from "axios";
import "./MainPage.css";
import PreviewCard from "../PreviewCard/PreviewCard";

const fakeDataUrl =
  "https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo";

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      hasMore: true
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
        data: data.results
      });
    });
  };

  handleInfiniteLoadMore = () => {
    let data = this.state.data;
    this.setState({
      loading: true
    });
    if (data.length > 14) {
      this.setState({
        hasMore: false,
        loading: false
      });
      return;
    }
    this.getData().then(newData => {
      data = data.concat(newData.results);
      console.log(data);
      this.setState({
        data,
        loading: false
      });
    });
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
                <Link to={`/articles/${item.email}`}>
                  <PreviewCard loading={this.state.loading} />
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
