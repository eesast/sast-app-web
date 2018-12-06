import React, { Component } from "react";
import {
  BackTop,
  Calendar,
  Modal,
  Steps,
  Button,
  message,
  TimePicker
} from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
import "./ResourcePage.css";

moment.locale("zh-cn");

const Step = Steps.Step;

const steps = [
  {
    title: "First",
    content: "First-content"
  },
  {
    title: "Second",
    content: "Second-content"
  },
  {
    title: "Last",
    content: "Last-content"
  }
];

class ResourcePage extends Component {
  state = {
    value: moment("2017-01-25"),
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
      <div className="ResourcePage">
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
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
            <div className="steps-content">
              <TimePicker minuteStep={15} secondStep={10} />
            </div>
            <div className="steps-action">
              {current < steps.length - 1 && (
                <Button type="primary" onClick={() => this.next()}>
                  Next
                </Button>
              )}
              {current === steps.length - 1 && (
                <Button
                  type="primary"
                  onClick={() => message.success("Processing complete!")}
                >
                  Done
                </Button>
              )}
              {current > 0 && (
                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                  Previous
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

export default ResourcePage;
