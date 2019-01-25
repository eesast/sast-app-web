import { Button, Modal, Upload } from "antd";
import { UploadProps } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import React from "react";
import baseUrl from "../../config/baseUrl";
import { AuthContext } from "../AuthContext/AuthContext";
import "./MultipleUpload.css";

export interface IMultipleUploadProps extends UploadProps {
  maxUpload?: number;
  uploadPrompt?: string;
  handleFileListChange: (fileList: UploadFile[]) => void;
  handleRemove: (file: UploadFile) => boolean | Promise<boolean>;
}

interface IMultipleUploadState {
  previewVisible: boolean;
  previewPictureName: string;
  previewPictureUrl: string;
}

export default class MultipleUpload extends React.Component<
  IMultipleUploadProps,
  IMultipleUploadState
> {
  static contextType = AuthContext;
  context!: React.ContextType<typeof AuthContext>;

  constructor(props: IMultipleUploadProps) {
    super(props);

    this.state = {
      previewVisible: false,
      previewPictureName: "",
      previewPictureUrl: ""
    };
  }

  render() {
    const { token } = this.context;
    const { fileList, maxUpload, uploadPrompt } = this.props;
    const {
      previewVisible,
      previewPictureName,
      previewPictureUrl
    } = this.state;

    return (
      <div className="MultipleUpload">
        <Upload
          action={baseUrl + "/static/images"}
          headers={{
            Authorization: "Bearer " + token
          }}
          listType="picture-card"
          fileList={fileList}
          onChange={this.hanldeFileListChange}
          onPreview={this.handlePreview}
          onRemove={this.handleRemove as any}
        >
          {maxUpload && fileList && fileList.length >= maxUpload ? null : (
            <Button icon="picture">{uploadPrompt || "插入图片"}</Button>
          )}
        </Upload>
        <Modal
          centered={true}
          footer={null}
          title={previewPictureName}
          visible={previewVisible}
          onCancel={this.handlePreviewClose}
        >
          <img
            style={{ width: "100%" }}
            alt="preview"
            src={previewPictureUrl}
          />
        </Modal>
      </div>
    );
  }

  handlePreview: UploadProps["onPreview"] = file => {
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

  handleRemove = (file: UploadFile) => {
    return this.props.handleRemove(file);
  };

  handlePreviewClose = () => {
    this.setState({ previewVisible: false });
  };

  hanldeFileListChange: UploadProps["onChange"] = change => {
    this.props.handleFileListChange(change.fileList);
  };
}
