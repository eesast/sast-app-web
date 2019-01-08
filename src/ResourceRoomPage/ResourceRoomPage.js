import React, { Component } from "react";
import {
  BackTop,
  Calendar,
  Modal,
  Steps,
  Button,
  Input,
  TimePicker,
  Badge,
  Popover,
  message
} from "antd";
import moment from "moment";
import "moment/locale/zh-cn";
import "./ResourceRoomPage.css";
import axios from "axios";
import { AuthContext } from "../AuthContext/AuthContext";

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
    current: 0,
    reserveTimeFrom: moment(),
    reserveTimeTo: moment(),
    reserveDate: moment(),
    reserveReason: "",
    reservations: []
  };

  static contextType = AuthContext;

  handleFormOpen = date => {
    this.setState({
      formVisible: true,
      reserveDate: date
    });
  };

  handleOk = e => {
    if (!this.state.reserveReason) {
      message.error("请输入预约说明");
      return;
    }

    const decoded = this.context.decodeToken();
    const itemId = -1;

    const newReservation = {
      itemId,
      userId: decoded.id,
      from: this.state.reserveTimeFrom.toISOString(),
      to: this.state.reserveTimeTo.toISOString(),
      reason: this.state.reserveReason
    };
    axios
      .post(`/v1/reservations`, newReservation)
      .then(response => {
        newReservation.id = parseInt(
          response.headers.location.replace("/v1/reservations/", "")
        );
        this.setState({
          reserveReason: "",
          formVisible: false,
          current: 0,
          reservations: [newReservation, ...this.state.reservations]
        });
        message.success("预约活动室成功");
      })
      .catch(error => {
        message.error("预约活动室失败");
      });
  };

  handleCancel = e => {
    this.setState({
      formVisible: false
    });
  };

  handleReserveTimeChange = (type, time) => {
    if (type === "from")
      this.setState({
        reserveTimeFrom: time
      });
    else
      this.setState({
        reserveTimeTo: time
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

  handleInputChange = e => {
    const name = e.target.name;
    this.setState({
      [name]: e.target.value
    });
  };

  dateCellRender = date => {
    const reservationsOnDate = this.state.reservations.filter(reservation =>
      moment(reservation.from).isSame(date, "day")
    );
    reservationsOnDate.sort((a, b) => {
      const aDate = moment(a.from);
      const bDate = moment(b.from);
      return aDate.isBefore(bDate) ? -1 : aDate.isSame(bDate) ? 0 : 1;
    });
    const content = (
      <ul className="events">
        {reservationsOnDate.map(item => (
          <li key={item.id}>
            <Badge
              status={item.approved ? "success" : "processing"}
              text={
                (item.approved ? "审核通过" : "审核中") +
                " " +
                moment(item.from).format("HH:mm") +
                " - " +
                moment(item.to).format("HH:mm")
              }
            />
          </li>
        ))}
      </ul>
    );
    return (
      <Popover placement="bottom" title={date.format("ll")} content={content}>
        <ul className="events">
          {reservationsOnDate.map(item => (
            <li key={item.id}>
              <Badge
                status={item.approved ? "success" : "processing"}
                text={item.reason}
              />
            </li>
          ))}
        </ul>
      </Popover>
    );
  };

  componentDidMount = () => {
    axios
      .get(`/v1/reservations?roomOnly=true`)
      .then(response => {
        this.setState({
          reservations: response.data
        });
      })
      .catch(error => {
        message.error("加载预约失败");
      });
  };

  render() {
    const { current } = this.state;
    return (
      <div className="ResourceRoomPage">
        <Calendar
          value={this.state.value}
          onSelect={this.handleFormOpen}
          dateCellRender={this.dateCellRender}
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
              {current === 0 && (
                <div>
                  <TimePicker
                    format="HH:mm"
                    minuteStep={15}
                    name="from"
                    placeholder="选择开始时间"
                    onChange={time =>
                      this.handleReserveTimeChange("from", time)
                    }
                  />
                  <TimePicker
                    format="HH:mm"
                    minuteStep={15}
                    name="to"
                    placeholder="选择结束时间"
                    onChange={time => this.handleReserveTimeChange("to", time)}
                  />
                </div>
              )}
              {current === 1 && (
                <TextArea
                  style={{ height: "100%", resize: "none" }}
                  name="reserveReason"
                  onChange={this.handleInputChange}
                />
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
