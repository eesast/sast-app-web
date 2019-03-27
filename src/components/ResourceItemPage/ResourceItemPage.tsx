import {
  BackTop,
  Badge,
  Button,
  Col,
  Collapse,
  DatePicker,
  Divider,
  Input,
  message,
  Modal,
  Row,
  Steps
} from "antd";
import { RangePickerValue } from "antd/lib/date-picker/interface";
import axios from "axios";
import moment, { Moment } from "moment";
import React, { ChangeEvent } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import IItemModel from "../../models/Item";
import IReservationModel from "../../models/Reservation";
import { AuthContext } from "../AuthContext/AuthContext";
import "./ResourceItemPage.css";

const Panel = Collapse.Panel;
const TextArea = Input.TextArea;
const confirm = Modal.confirm;
const Step = Steps.Step;
const RangePicker = DatePicker.RangePicker;

const steps = [
  {
    title: "选择时间",
    description: ""
  },
  {
    title: "预约说明",
    description: ""
  },
  {
    title: "完成预约",
    description: ""
  }
];

const isNumeric = (n: any) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

interface IResourceItemPageState {
  newItemFormVisible: boolean;
  newItemButtonVisible: boolean;
  items: IItemModel[];
  itemName: string;
  itemDescription: string;
  itemTotal: number;
  reserveFormVisible: boolean;
  current: number;
  reserveTimeFrom: Moment;
  reserveTimeTo: Moment;
  reserveReason: string;
  reservations: IReservationModel[];
  selectedReserveItemId: number;
}

class ResourceItemPage extends React.Component<
  RouteComponentProps,
  IResourceItemPageState
> {
  context!: React.ContextType<typeof AuthContext>;

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      newItemFormVisible: false,
      newItemButtonVisible: false,
      items: [],
      itemName: "",
      itemDescription: "",
      itemTotal: -1,
      reserveFormVisible: false,
      current: 0,
      reserveTimeFrom: moment(),
      reserveTimeTo: moment(),
      reserveReason: "",
      reservations: [],
      selectedReserveItemId: -1
    };
  }

  render() {
    const {
      current,
      reservations,
      newItemButtonVisible,
      items,
      newItemFormVisible,
      itemName,
      itemDescription,
      itemTotal,
      reserveTimeFrom,
      reserveTimeTo,
      reserveFormVisible
    } = this.state;

    return (
      <div className="ResourceItemPage">
        <Collapse bordered={false} style={{ marginBottom: "24px" }}>
          {reservations.map(item => (
            <Panel
              key={item.id.toString()}
              header={
                <Row
                  gutter={16}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <Col key={0} span={2}>
                    {item.id || "新"}
                  </Col>
                  <Col key={1} span={6}>
                    {item.itemName}
                  </Col>
                  <Col key={2} span={4}>
                    {moment(item.from).format("YYYY-MM-DD") + " 起"}
                  </Col>
                  <Col key={3} span={4}>
                    {moment(item.to).format("YYYY-MM-DD") + " 止"}
                  </Col>
                  <Col key={4} span={8}>
                    <div style={{ float: "right" }}>
                      <Badge
                        status={item.approved ? "success" : "processing"}
                        text={item.approved ? "审核通过" : "审核中"}
                      />
                    </div>
                  </Col>
                </Row>
              }
            >
              {item.reason || "无预约说明"}
            </Panel>
          ))}
        </Collapse>
        <Divider />
        <Button
          hidden={!newItemButtonVisible}
          // tslint:disable-next-line: jsx-no-lambda
          onClick={() => this.setState({ newItemFormVisible: true })}
        >
          添加新物品
        </Button>
        <Collapse bordered={false} style={{ marginTop: "24px" }}>
          {items.map(item => (
            <Panel
              key={item.id.toString()}
              header={
                <Row
                  gutter={16}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <Col key={0} span={2}>
                    {item.id || "新"}
                  </Col>
                  <Col key={1} span={6}>
                    {item.name}
                  </Col>
                  <Col key={2} span={4}>
                    {item.total}
                  </Col>
                  <Col key={3} span={4}>
                    {item.left}
                  </Col>
                  <Col key={4} span={8}>
                    <div style={{ float: "right" }}>
                      <Button
                        icon="plus"
                        style={{ marginLeft: "6px" }}
                        // tslint:disable-next-line: jsx-no-lambda
                        onClick={(e: any) => this.handleItemReserve(e, item.id)}
                      />
                      <Button
                        hidden={!newItemButtonVisible}
                        type="danger"
                        icon="delete"
                        style={{ marginLeft: "6px" }}
                        // tslint:disable-next-line: jsx-no-lambda
                        onClick={(e: any) => this.handleItemDelete(e, item.id)}
                      />
                    </div>
                  </Col>
                </Row>
              }
            >
              {item.description || "无物品描述"}
            </Panel>
          ))}
        </Collapse>
        <Modal
          title="添加新物品"
          okText="提交"
          visible={newItemFormVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Input
            className="input"
            name="itemName"
            placeholder="物品名"
            value={itemName}
            onChange={this.handleInputChange}
          />
          <TextArea
            style={{ resize: "none" }}
            className="input"
            name="itemDescription"
            autosize={{ minRows: 3 }}
            placeholder="描述"
            value={itemDescription}
            onChange={this.handleInputChange}
          />
          <Input
            className="input"
            name="itemTotal"
            placeholder="总数"
            value={itemTotal}
            onChange={this.handleInputChange}
          />
        </Modal>
        <Modal
          title="预约物品"
          visible={reserveFormVisible}
          onOk={this.handleReserveFormOk}
          // tslint:disable-next-line: jsx-no-lambda
          onCancel={() => {
            this.setState({ reserveFormVisible: false });
          }}
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
                <RangePicker
                  value={[reserveTimeFrom, reserveTimeTo]}
                  onChange={this.handleReserveDateChange}
                />
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

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  handleFormOpen = () => {
    this.setState({
      newItemFormVisible: true
    });
  };

  handleReserveFormOk = async () => {
    if (!this.state.reserveReason) {
      message.error("请输入预约说明");
      return;
    }

    this.context.checkTokenStatus();
    if (!this.context.auth) {
      message.info("请先登录");
      return;
    }
    const userInfo = this.context.userInfo;

    const itemId = this.state.selectedReserveItemId;

    const newReservation: any = {
      itemId,
      userId: userInfo!.id,
      from: this.state.reserveTimeFrom.format("YYYY-MM-DD"),
      to: this.state.reserveTimeTo.format("YYYY-MM-DD"),
      reason: this.state.reserveReason
    };

    try {
      const response = await axios.post(`/v1/reservations`, newReservation);
      newReservation.id = parseInt(
        response.headers.location.replace("/v1/reservations/", ""),
        10
      );
      newReservation.itemName = this.state.items.find(
        value => value.id === itemId
      )!.name;
      this.setState({
        reserveReason: "",
        reserveFormVisible: false,
        reservations: [newReservation, ...this.state.reservations]
      });
      message.success("预约物品成功");
    } catch {
      message.error("预约物品失败");
    }
  };

  handleOk = async () => {
    if (!this.state.itemName) {
      message.error("请输入物品名");
      return;
    }
    if (!isNumeric(this.state.itemTotal)) {
      message.error("请输入正确的物品总数");
      return;
    }

    const newItem: any = {
      name: this.state.itemName,
      description: this.state.itemDescription,
      total: this.state.itemTotal,
      left: this.state.itemTotal
    };
    try {
      const response = await axios.post(`/v1/items`, newItem);
      newItem.id = parseInt(
        response.headers.location.replace("/v1/items/", ""),
        10
      );
      this.setState({
        itemName: "",
        itemDescription: "",
        itemTotal: -1,
        newItemFormVisible: false,
        items: [newItem, ...this.state.items]
      });
    } catch {
      message.error("添加新物品失败");
    }
  };

  handleCancel = () => {
    this.setState({
      newItemFormVisible: false
    });
  };

  handleInputChange: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void = e => {
    this.setState({
      [e.target.name]: e.target.value
    } as any);
  };

  handleItemReserve = (e: MouseEvent, itemId: number) => {
    e.stopPropagation();
    this.setState({ reserveFormVisible: true, selectedReserveItemId: itemId });
  };

  handleItemDelete = (e: MouseEvent, itemId: number) => {
    e.stopPropagation();

    confirm({
      title: "确认删除此物品？",
      content: "此操作不可恢复！",
      onOk: async () => {
        try {
          await axios.delete(`/v1/items/${itemId}`);

          let newItems = [...this.state.items];
          newItems = newItems.filter(value => value.id !== itemId);
          this.setState({ items: newItems });
          message.success("删除物品成功");
        } catch {
          message.error("删除物品失败");
        }
      }
    });
  };

  handleReserveDateChange = (dates: RangePickerValue) => {
    this.setState({
      reserveTimeFrom: dates[0]!,
      reserveTimeTo: dates[1]!
    });
  };

  componentDidMount = async () => {
    const userInfo = this.context.userInfo;
    if (userInfo && (userInfo.role === "root" || userInfo.role === "keeper")) {
      this.setState({ newItemButtonVisible: true });
    }

    try {
      const itemsResponse = await axios.get(`/v1/items`);
      this.setState({
        items: itemsResponse.data
      });
    } catch {
      message.error("加载物品失败");
    }

    try {
      const reservationsResponse = await axios.get(
        `/v1/reservations?userId=${userInfo!.id}`
      );
      const reservations = reservationsResponse.data || [];

      for (let index = 0; index < reservations.length; index++) {
        const reservation = reservations[index];
        const itemRes = await axios.get(`/v1/items/${reservation.itemId}`);
        const item = itemRes.data;
        if (item) {
          reservation.itemName = item.name;
        }
        reservations[index] = reservation;
      }
      this.setState({ reservations });
    } catch {
      message.error("加载预约失败");
    }
  };
}

/**
 * `hoist-non-react-statics` in `react-router` is old
 * @see https://stackoverflow.com/questions/53240058/use-hoist-non-react-statics-with-withrouter
 */
export default withRouter(ResourceItemPage);
ResourceItemPage.contextType = AuthContext;
