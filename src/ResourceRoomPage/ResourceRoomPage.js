import React, { Component } from "react";
import {
  BackTop,
  Calendar,
  Modal,
  Steps,
  Button,
  Input,
  TimePicker
} from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
import "./ResourceRoomPage.css";

moment.locale("zh-cn");

const Step = Steps.Step;
const TextArea = Input.TextArea;

const steps = [
  {
    title: "选择时间",
    description: "..."
  },
  {
    title: "预约说明",
    description: "..."
  },
  {
    title: "完成预约",
    description: "..."
  }
];

class ResourceRoomPage extends Component {
  state = {
    value: moment(),
    formVisible: false,
    current: 0
  };

  handleFormOpen = () => {
    this.setState({
      formVisible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      formVisible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      formVisible: false
    });
  };

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  render() {
    const { current } = this.state;
    return (
      <div className="ResourceRoomPage">
        <Calendar
          value={this.state.value}
          onSelect={this.handleFormOpen}
          onPanelChange={this.onPanelChange}
        />
        <Modal
          title="预约活动室"
          visible={this.state.formVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <Steps current={current}>
              {steps.map(item => (
                <Step
                  key={item.title}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </Steps>
            <div className="steps-content">
              {current === 0 && <TimePicker format="HH:mm" minuteStep={15} />}
              {current === 1 && (
                <TextArea style={{ height: "100%", resize: "none" }} />
              )}
              {current === 2 && <h3>点击确定按钮完成预约</h3>}
            </div>
            <div className="steps-action">
              {current < steps.length - 1 && (
                <Button type="primary" onClick={() => this.next()}>
                  下一步
                </Button>
              )}
              {current > 0 && (
                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                  上一步
                </Button>
              )}
            </div>
          </div>
        </Modal>
        <BackTop />
      </div>
    );
  }
}

export default ResourceRoomPage;
