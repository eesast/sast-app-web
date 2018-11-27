import React, { Component } from "react";
import { Upload, Button, Modal } from "antd";
import "./MultipleUpload.css";

const fileList = [
  {
    uid: "-1",
    name: "xxx.png",
    status: "done",
    url:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    thumbUrl:
      "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
  }
];

class MultipleUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewPicture: {
        name: "",
        url: ""
      }
    };
  }

  handlePreview = file => {
    this.setState({ previewPicture: file }, () => {
      this.setState({ previewVisible: true });
    });
  };

  handlePreviewClose = () => {
    this.setState({ previewVisible: false });
    this.props.afterUpload(this.state.previewPicture);
  };

  render() {
    return (
      <div>
        <Upload
          action="//jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          fileList={fileList}
          multiple
          onPreview={this.handlePreview}
        >
          {this.props.maxUpload &&
          fileList.length >= this.props.maxUpload ? null : (
            <Button icon="picture">
              {this.props.uploadPrompt || "插入图片"}
            </Button>
          )}
        </Upload>
        <Modal
          centered
          footer={null}
          title={this.state.previewPicture.name}
          visible={this.state.previewVisible}
          onCancel={this.handlePreviewClose}
        >
          <img
            style={{ width: "100%" }}
            alt="preview"
            src={this.state.previewPicture.url}
          />
        </Modal>
      </div>
    );
  }
}

export default MultipleUpload;
