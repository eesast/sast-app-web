import React, { Component } from "react";
import { Card } from "antd";
import "./PreviewCard.css";

const { Meta } = Card;

class PreviewCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Card
        className="Card"
        hoverable
        cover={
          <img
            className="Card-img"
            alt={this.props.title}
            src={this.props.image}
          />
        }
        loading={this.props.loading}
      >
        <Meta title={this.props.title} description={this.props.abstract} />
      </Card>
    );
  }
}

export default PreviewCard;
