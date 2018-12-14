import React, { Component } from "react";
import { Upload, Button, Modal } from "antd";
import "./MultipleUpload.css";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://api.eesast.com"
    : "http://localhost:28888";

class MultipleUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      previewVisible: false,
      previewPictureName: "",
      previewPictureUrl: ""
    };
  }

  handlePreview = file => {
    let filename = file.name;
    filename = filename.length > 50 ? `${filename.slice(0, 50)}...` : filename;

    this.setState(
      {
        previewPictureName: filename,
        previewPictureUrl: baseUrl + file.response
      },
      () => {
        this.setState({ previewVisible: true });
      }
    );
  };

  handleRemove = file => {
    return this.props.handleRemove(file);
  };

  handlePreviewClose = () => {
    this.setState({ previewVisible: false });
  };

  hanldeFilelistChange = change => {
    const filelist = change.fileList;
    this.props.handleFilelistChange(filelist);
  };

  render() {
    return (
      <div className="MultipleUpload">
        <Upload
          action={baseUrl + "/static/images"}
          headers={{
            Authorization: "Bearer " + localStorage.getItem("token")
          }}
          listType="picture-card"
          fileList={this.props.filelist}
          onChange={this.hanldeFilelistChange}
          onPreview={this.handlePreview}
          onRemove={this.handleRemove}
        >
          {this.props.maxUpload &&
          this.props.filelist.length >= this.props.maxUpload ? null : (
            <Button icon="picture">
              {this.props.uploadPrompt || "插入图片"}
            </Button>
          )}
        </Upload>
        <Modal
          centered
          footer={null}
          title={this.state.previewPictureName}
          visible={this.state.previewVisible}
          onCancel={this.handlePreviewClose}
        >
          <img
            style={{ width: "100%" }}
            alt="preview"
            src={this.state.previewPictureUrl}
          />
        </Modal>
      </div>
    );
  }
}

export default MultipleUpload;
