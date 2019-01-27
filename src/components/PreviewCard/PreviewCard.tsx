import { Card, Icon } from "antd";
import moment from "moment";
import React, { Component } from "react";
import baseUrl from "../../config/baseUrl";
import "./PreviewCard.css";

const { Meta } = Card;

export interface IPreviewCardProps {
  title: string;
  abstract?: string;
  image?: string;
  loading: boolean;
  views?: number;
  tags?: string[];
  likes?: number;
  createdAt?: string;
}

interface IPreviewCardState {
  imgLoading: boolean;
  imgFailLoading: boolean;
}

export default class PreviewCard extends Component<
  IPreviewCardProps,
  IPreviewCardState
> {
  constructor(props: IPreviewCardProps) {
    super(props);
    this.state = {
      imgLoading: true,
      imgFailLoading: false
    };
  }

  render() {
    const {
      title,
      abstract,
      image,
      loading,
      views,
      tags,
      likes,
      createdAt
    } = this.props;
    const { imgLoading, imgFailLoading } = this.state;

    return (
      <Card
        className="Card"
        hoverable={true}
        cover={
          <img
            className="Card-img"
            hidden={imgFailLoading}
            alt={title}
            src={baseUrl + image}
            onLoad={this.handleImageLoad}
            onError={this.handleImageLoadFail}
          />
        }
        loading={loading || imgLoading}
      >
        <Meta title={title} description={abstract} />
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
              marginTop: "36px",
              overflowX: "hidden"
            }}
          >
            <div>
              {moment().diff(moment(createdAt), "weeks") < 2
                ? moment(createdAt).fromNow()
                : moment(createdAt).format("L")}
            </div>
            <div style={{ marginLeft: "12px" }}>{tags && tags.join(" / ")}</div>
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
            <Icon style={{ marginRight: "6px" }} type="eye" />
            <div style={{ marginRight: "12px" }}>{views || 0}</div>
            <Icon style={{ marginRight: "6px" }} type="like" />
            <div>{likes || 0}</div>
          </div>
        </div>
      </Card>
    );
  }

  handleImageLoad = () => {
    this.setState({ imgLoading: false });
  };

  handleImageLoadFail = () => {
    this.setState({ imgLoading: false, imgFailLoading: true });
  };
}
