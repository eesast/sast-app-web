import React, { Component } from "react";
import { Card, Icon } from "antd";
import "./PreviewCard.css";
import baseUrl from "../config/baseUrl";

const { Meta } = Card;

class PreviewCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgLoading: true,
      imgFailLoading: false
    };
  }

  render() {
    return (
      <Card
        className="Card"
        hoverable
        cover={
          <img
            className="Card-img"
            hidden={this.state.imgFailLoading}
            alt={this.props.title}
            src={baseUrl + this.props.image}
            onLoad={() => {
              this.setState({ imgLoading: false });
            }}
            onError={() => {
              this.setState({ imgLoading: false, imgFailLoading: true });
            }}
          />
        }
        loading={this.props.loading || this.state.imgLoading}
      >
        <Meta title={this.props.title} description={this.props.abstract} />
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
              marginLeft: "-24px",
              marginBottom: "-36px",
              marginTop: "36px"
            }}
          >
            <Icon type="eye" />
            <div style={{ marginLeft: "6px" }}>{this.props.views || 0}</div>
            <div style={{ marginLeft: "12px" }}>
              {this.props.tags && this.props.tags.join(" / ")}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "-24px",
              marginBottom: "-36px",
              marginTop: "36px"
            }}
          >
            <Icon type="like" />
            <div style={{ marginLeft: "6px" }}>{this.props.likes || 0}</div>
          </div>
        </div>
      </Card>
    );
  }
}

export default PreviewCard;
