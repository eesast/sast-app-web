import {
  BackTop,
  Badge,
  Button,
  Calendar,
  Input,
  message,
  Modal,
  Popover,
  Steps,
  TimePicker
} from "antd";
import axios from "axios";
import moment, { Moment } from "moment";
import "moment/locale/zh-cn";
import React, { ChangeEvent, Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import IReservationModel from "../../models/Reservation";
import { AuthContext } from "../AuthContext/AuthContext";
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

interface IResourceRoomPageState {
  value: Moment;
  formVisible: boolean;
  current: number;
  reserveTimeFrom: Moment;
  reserveTimeTo: Moment;
  reserveDate: Moment;
  reserveReason: string;
  reservations: IReservationModel[];
}

class ResourceRoomPage extends Component<
  RouteComponentProps,
  IResourceRoomPageState
> {
  context!: React.ContextType<typeof AuthContext>;

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      value: moment(),
      formVisible: false,
      current: 0,
      reserveTimeFrom: moment(),
      reserveTimeTo: moment(),
      reserveDate: moment(),
      reserveReason: "",
      reservations: []
    };
  }

  render() {
    const { current, value, formVisible } = this.state;
    return (
      <div className="ResourceRoomPage">
        <Calendar
          value={value}
          onSelect={this.handleFormOpen}
          dateCellRender={this.dateCellRender}
        />
        <Modal
          title="预约活动室"
          visible={formVisible}
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
                    placeholder="选择开始时间"
                    // tslint:disable-next-line: jsx-no-lambda
                    onChange={time =>
                      this.handleReserveTimeChange("from", time)
                    }
                  />
                  <TimePicker
                    format="HH:mm"
                    minuteStep={15}
                    placeholder="选择结束时间"
                    // tslint:disable-next-line: jsx-no-lambda
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
                // tslint:disable-next-line: jsx-no-lambda
                <Button type="primary" onClick={() => this.next()}>
                  下一步
                </Button>
              )}
              {current > 0 && (
                // tslint:disable-next-line: jsx-no-lambda
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

  handleFormOpen = (date: Moment = moment()) => {
    this.setState({
      formVisible: true,
      reserveDate: date
    });
  };

  handleOk = async () => {
    if (!this.state.reserveReason) {
      message.error("请输入预约说明");
      return;
    }

    const userInfo = this.context.checkToken();
    if (!userInfo) {
      this.props.history.push("/login");
      message.info("请先登录");
    }

    const itemId = -1;

    const newReservation: any = {
      itemId,
      userId: userInfo!.id,
      from: this.state.reserveTimeFrom.toISOString(),
      to: this.state.reserveTimeTo.toISOString(),
      reason: this.state.reserveReason
    };

    try {
      const response = await axios.post(`/v1/reservations`, newReservation);

      newReservation.id = parseInt(
        response.headers.location.replace("/v1/reservations/", ""),
        10
      );
      this.setState({
        reserveReason: "",
        formVisible: false,
        current: 0,
        reservations: [newReservation, ...this.state.reservations]
      });
      message.success("预约活动室成功");
    } catch {
      message.error("预约活动室失败");
    }
  };

  handleCancel = () => {
    this.setState({
      formVisible: false
    });
  };

  handleReserveTimeChange = (type: "from" | "to", time: Moment) => {
    if (type === "from") {
      this.setState({
        reserveTimeFrom: time
      });
    } else {
      this.setState({
        reserveTimeTo: time
      });
    }
  };

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  handleInputChange: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void = e => {
    this.setState({
      [e.target.name]: e.target.value
    } as any);
  };

  dateCellRender = (date: Moment) => {
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

  componentDidMount = async () => {
    try {
      const response = await axios.get(`/v1/reservations?roomOnly=true`);
      this.setState({
        reservations: response.data
      });
    } catch {
      message.error("加载预约失败");
    }
  };
}

/**
 * `hoist-non-react-statics` in `react-router` is old
 * @see https://stackoverflow.com/questions/53240058/use-hoist-non-react-statics-with-withrouter
 */
export default withRouter(ResourceRoomPage);
ResourceRoomPage.contextType = AuthContext;
