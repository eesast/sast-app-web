import React, { Component } from "react";
import { Card } from "antd";
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
      </Card>
    );
  }
}

export default PreviewCard;
