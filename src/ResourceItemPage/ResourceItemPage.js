import React, { Component } from "react";
import {
  BackTop,
  Modal,
  Steps,
  Button,
  Input,
  Badge,
  Row,
  Col,
  message,
  Collapse,
  DatePicker,
  Divider
} from "antd";
import "./ResourceItemPage.css";
import axios from "axios";
import { AuthContext } from "../AuthContext/AuthContext";
import moment from "moment";

const Panel = Collapse.Panel;
const TextArea = Input.TextArea;
const confirm = Modal.confirm;
const Step = Steps.Step;
const RangePicker = DatePicker.RangePicker;

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

const isNumeric = n => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

class ResourceItemPage extends Component {
  state = {
    newItemFormVisible: false,
    newItemButtonVisible: false,
    items: [],
    itemName: "",
    itemDescription: "",
    itemTotal: "",
    reserveFormVisible: false,
    current: 0,
    reserveTimeFrom: moment(),
    reserveTimeTo: moment(),
    reserveReason: "",
    reservations: [],
    selectedReserveItemId: -1
  };

  static contextType = AuthContext;

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

  handleReserveFormOk = () => {
    if (!this.state.reserveReason) {
      message.error("请输入预约说明");
      return;
    }

    const decoded = this.context.decodeToken();
    const itemId = this.state.selectedReserveItemId;

    const newReservation = {
      itemId,
      userId: decoded.id,
      from: this.state.reserveTimeFrom.format("YYYY-MM-DD"),
      to: this.state.reserveTimeTo.format("YYYY-MM-DD"),
      reason: this.state.reserveReason
    };
    axios
      .post(`/v1/reservations`, newReservation)
      .then(response => {
        newReservation.id = parseInt(
          response.headers.location.replace("/v1/reservations/", "")
        );
        newReservation.itemName = this.state.items.find(
          value => value.id === itemId
        ).name;
        this.setState({
          reserveReason: "",
          reserveFormVisible: false,
          reservations: [newReservation, ...this.state.reservations]
        });
        message.success("预约物品成功");
      })
      .catch(error => {
        message.error("预约物品失败");
      });
  };

  handleOk = e => {
    if (!this.state.itemName) {
      message.error("请输入物品名");
      return;
    }
    if (!isNumeric(this.state.itemTotal)) {
      message.error("请输入正确的物品总数");
      return;
    }

    let newItem = {
      name: this.state.itemName,
      description: this.state.itemDescription,
      total: this.state.itemTotal,
      left: this.state.itemTotal
    };
    axios
      .post(`/v1/items`, newItem)
      .then(response => {
        newItem.id = parseInt(
          response.headers.location.replace("/v1/items/", "")
        );
        this.setState({
          itemName: "",
          itemDescription: "",
          itemTotal: "",
          newItemFormVisible: false,
          items: [newItem, ...this.state.items]
        });
      })
      .catch(error => {
        message.error("添加新物品失败");
      });
  };

  handleCancel = e => {
    this.setState({
      newItemFormVisible: false
    });
  };

  handleInputChange = e => {
    const name = e.target.name;
    this.setState({
      [name]: e.target.value
    });
  };

  handleItemReserve = (e, itemId) => {
    e.stopPropagation();
    this.setState({ reserveFormVisible: true, selectedReserveItemId: itemId });
  };

  handleItemDelete = (e, itemId) => {
    e.stopPropagation();

    confirm({
      title: "确认删除此物品？",
      content: "此操作不可恢复！",
      onOk: () => {
        axios
          .delete(`/v1/items/${itemId}`)
          .then(response => {
            let newItems = [...this.state.items];
            newItems = newItems.filter(value => value.id !== itemId);
            this.setState({ items: newItems });
            message.success("删除物品成功");
          })
          .catch(error => {
            console.log(error);
            message.error("删除物品失败");
          });
      }
    });
  };

  handleReserveDateChange = date => {
    this.setState({
      reserveTimeFrom: date[0],
      reserveTimeTo: date[1]
    });
  };

  componentDidMount = () => {
    const decoded = this.context.decodeToken();
    if (decoded && (decoded.role === "root" || decoded.role === "keeper"))
      this.setState({ newItemButtonVisible: true });

    axios
      .get(`/v1/items`)
      .then(response => {
        this.setState({
          items: response.data
        });
      })
      .catch(error => {
        message.error("加载物品失败");
      });
    axios
      .get(`/v1/reservations?userId=${decoded.id}`)
      .then(response => {
        let reservations = response.data || [];
        for (let index = 0; index < reservations.length; index++) {
          const reservation = reservations[index];
          axios.get(`/v1/items/${reservation.itemId}`).then(response => {
            const item = response.data;
            if (item) reservation.itemName = item.name;
            reservations[index] = reservation;
            this.setState({ reservations });
          });
        }
        this.setState({ reservations });
      })
      .catch(error => {
        message.error("加载预约失败");
      });
  };

  render() {
    const { current } = this.state;

    return (
      <div className="ResourceItemPage">
        <Collapse bordered={false} style={{ marginBottom: "24px" }}>
          {this.state.reservations.map(item => (
            <Panel
              key={item.id}
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
          hidden={!this.state.newItemButtonVisible}
          onClick={() => this.setState({ newItemFormVisible: true })}
        >
          添加新物品
        </Button>
        <Collapse bordered={false} style={{ marginTop: "24px" }}>
          {this.state.items.map(item => (
            <Panel
              key={item.id}
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
                        onClick={e => this.handleItemReserve(e, item.id)}
                      />
                      <Button
                        type="danger"
                        icon="delete"
                        style={{ marginLeft: "6px" }}
                        onClick={e => this.handleItemDelete(e, item.id)}
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
          visible={this.state.newItemFormVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Input
            className="input"
            name="itemName"
            placeholder="物品名"
            value={this.state.itemName}
            onChange={this.handleInputChange}
          />
          <TextArea
            style={{ resize: "none" }}
            className="input"
            name="itemDescription"
            autosize={{ minRows: 3 }}
            placeholder="描述"
            value={this.state.itemDescription}
            onChange={this.handleInputChange}
          />
          <Input
            className="input"
            name="itemTotal"
            placeholder="总数"
            value={this.state.itemTotal}
            onChange={this.handleInputChange}
          />
        </Modal>
        <Modal
          title="预约物品"
          visible={this.state.reserveFormVisible}
          onOk={this.handleReserveFormOk}
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
                  value={[this.state.reserveTimeFrom, this.state.reserveTimeTo]}
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

export default ResourceItemPage;
