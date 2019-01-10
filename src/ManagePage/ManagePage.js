import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Layout,
  Menu,
  message,
  Cascader,
  Modal,
  Tag,
  Tooltip,
  Switch,
  List,
  Button,
  Skeleton,
  Row,
  Col,
  Divider
} from "antd";
import InfiniteScroll from "react-infinite-scroller";
import "./ManagePage.css";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "../AuthContext/AuthContext";

const { Content, Sider } = Layout;
const confirm = Modal.confirm;

const options = [
  {
    value: "student",
    label: "student",
    children: [
      {
        value: "reader",
        label: "reader"
      },
      {
        value: "writer",
        label: "writer"
      }
    ]
  },
  {
    value: "admin",
    label: "admin",
    children: [
      {
        value: "root",
        label: "root"
      }
    ]
  }
];

class ManagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      articles: [],
      selectedMenu: "0",
      allUsers: [],
      allArticles: [],
      page: 1,
      loading: false,
      hasMore: true,
      reservations: [],
      allReservations: [],
      onlyShowForKeeper: false
    };
  }

  static contextType = AuthContext;

  Tags = props => {
    return (
      <div>
        {props.tags.map(tag => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={tag}>{isLongTag ? `${tag.slice(0, 20)}...` : tag}</Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
      </div>
    );
  };

  componentDidMount = () => {
    const decoded = this.context.decodeToken();
    if (decoded && decoded.role === "keeper")
      this.setState({ onlyShowForKeeper: true });

    if (decoded && decoded.role === "root") {
      axios.get(`/v1/users?begin=0&end=4&detailInfo=true`).then(response => {
        this.setState({ users: response.data || [] });
      });

      axios
        .get(`/v1/articles?begin=0&end=4&imvisible=true&noContent=true`)
        .then(response => {
          let articles = response.data || [];
          for (let index = 0; index < articles.length; index++) {
            const article = articles[index];
            axios.get(`/v1/users/${article.authorId}`).then(response => {
              const user = response.data;
              if (user) article.author = user.name;
              articles[index] = article;
              this.setState({ articles });
            });
          }
          this.setState({ articles });
        });
    }

    axios.get(`/v1/reservations?begin=0&end=4&roomOnly=all`).then(response => {
      let reservations = response.data || [];
      for (let index = 0; index < reservations.length; index++) {
        const reservation = reservations[index];
        if (reservation.itemId !== -1) {
          axios.get(`/v1/items/${reservation.itemId}`).then(response => {
            const item = response.data;
            if (item) reservation.itemName = item.name;
            reservations[index] = reservation;
            this.setState({ reservations });
          });
        }
        axios.get(`/v1/users/${reservation.userId}`).then(response => {
          const user = response.data;
          if (user) reservation.userName = user.name;
          reservations[index] = reservation;
          this.setState({ reservations });
        });
      }
      this.setState({ reservations });
    });
  };

  handleAuthChange = (userId, value) => {
    const newAuth = {
      group: value[0],
      role: value[1]
    };

    axios
      .put(`/v1/users/${userId}`, {
        group: newAuth.group,
        role: newAuth.role
      })
      .then(response => {
        let newUsers = [...this.state.users];
        const index = newUsers.findIndex(value => value.id === userId);
        newUsers[index] = { ...newUsers[index], ...newAuth };
        this.setState({ users: newUsers });
        message.success("用户权限更新成功");
      })
      .catch(error => {
        message.error("用户权限更新失败");
      });
  };

  handleUserDelete = userId => {
    confirm({
      title: "确认删除此用户？",
      content: "此操作不可恢复！",
      onOk: () => {
        axios
          .delete(`/v1/users/${userId}`)
          .then(response => {
            let newUsers = [...this.state.users];
            newUsers = newUsers.filter(value => value.id !== userId);
            this.setState({ users: newUsers });
            message.success("删除用户成功");
          })
          .catch(error => {
            message.error("删除用户失败");
          });
      }
    });
  };

  handleReservationDelete = reservationId => {
    confirm({
      title: "确认删除此预约？",
      content: "此操作不可恢复！",
      onOk: () => {
        axios
          .delete(`/v1/reservations/${reservationId}`)
          .then(response => {
            let newReservations = [...this.state.reservations];
            newReservations = newReservations.filter(
              value => value.id !== reservationId
            );
            this.setState({ reservations: newReservations });
            message.success("删除预约成功");
          })
          .catch(error => {
            message.error("删除预约失败");
          });
      }
    });
  };

  handleVisibleChange = (articleId, checked) => {
    axios
      .put(`/v1/articles/${articleId}`, {
        visible: checked
      })
      .then(response => {
        let newArticles = [...this.state.articles];
        const index = newArticles.findIndex(value => value.id === articleId);
        newArticles[index] = { ...newArticles[index], visible: checked };
        this.setState({ articles: newArticles });
        message.success("文章发布状态更新成功");
      })
      .catch(error => {
        message.error("文章发布状态更新失败");
      });
  };

  handleApprovedChange = (reservationId, checked) => {
    axios
      .put(`/v1/reservations/${reservationId}`, {
        approved: checked
      })
      .then(response => {
        let newReservations = [...this.state.reservations];
        const index = newReservations.findIndex(
          value => value.id === reservationId
        );
        newReservations[index] = {
          ...newReservations[index],
          approved: checked
        };
        this.setState({ reservations: newReservations });
        message.success("预约状态更新成功");
      })
      .catch(error => {
        message.error("预约状态更新失败");
      });
  };

  handleMenuChange = ({ item, key, selectedKeys }) => {
    this.setState({
      selectedMenu: key,
      page: 1,
      loading: false,
      hasMore: true
    });

    if (key === "1") this.setState({ allArticles: this.state.articles });
    if (key === "2")
      this.setState({ allReservations: this.state.reservations });
    if (key === "3") this.setState({ allUsers: this.state.users });
  };

  handleInfiniteLoadMore = () => {
    const page = this.state.page;
    let data =
      this.state.selectedMenu === "1"
        ? this.state.allArticles
        : this.state.selectedMenu === "2"
        ? this.state.allReservations
        : this.state.allUsers;
    this.setState({
      loading: true
    });

    if (this.state.selectedMenu === "1") {
      axios
        .get(
          `/v1/articles?begin=${page * 10 - 5}&end=${page * 10 +
            4}&noContent=true&imvisible=true`
        )
        .then(response => {
          data = data.concat(response.data);

          /*eslint no-loop-func: "off"*/
          for (let index = 0; index < data.length; index++) {
            const article = data[index];
            if (!article.author) {
              axios.get(`/v1/users/${article.authorId}`).then(response => {
                const user = response.data;
                if (user) article.author = user.name;
                data[index] = article;
                this.setState({ allArticles: data });
              });
            }
          }

          if (response.data.length < 10) {
            this.setState({
              hasMore: false
            });
          }

          this.setState({
            page: page + 1,
            loading: false,
            allArticles: data
          });
        })
        .catch(error => message.error("文章加载失败"));
    } else if (this.state.selectedMenu === "2") {
      axios
        .get(
          `/v1/reservations?begin=${page * 10 - 5}&end=${page * 10 +
            4}&roomOnly=all`
        )
        .then(response => {
          data = data.concat(response.data);

          for (let index = 0; index < data.length; index++) {
            const reservation = data[index];
            if (reservation.itemId !== -1) {
              axios.get(`/v1/items/${reservation.itemId}`).then(response => {
                const item = response.data;
                if (item) reservation.itemName = item.name;
                data[index] = reservation;
                this.setState({ allReservations: data });
              });
            }
            axios.get(`/v1/users/${reservation.userId}`).then(response => {
              const user = response.data;
              if (user) reservation.userName = user.name;
              data[index] = reservation;
              this.setState({ allReservations: data });
            });
          }

          if (response.data.length < 10) {
            this.setState({
              hasMore: false
            });
          }

          this.setState({
            page: page + 1,
            loading: false,
            allReservations: data
          });
        })
        .catch(error => message.error("预约加载失败"));
    } else {
      axios
        .get(
          `/v1/users?begin=${page * 10 - 5}&end=${page * 10 +
            4}&detailInfo=true`
        )
        .then(response => {
          data = data.concat(response.data);

          if (response.data.length < 10) {
            this.setState({
              hasMore: false
            });
          }

          this.setState({
            page: page + 1,
            loading: false,
            allUsers: data
          });
        })
        .catch(error => message.error("用户加载失败"));
    }
  };

  render() {
    return (
      <Layout className="ManagePage">
        <Sider width={200} style={{ background: "#fff" }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["0"]}
            selectedKeys={[this.state.selectedMenu]}
            onSelect={this.handleMenuChange}
            style={{ height: "100%", borderRight: 0 }}
          >
            <Menu.Item key="0">总览</Menu.Item>
            <Menu.Item key="1">文章</Menu.Item>
            <Menu.Item key="2">预约</Menu.Item>
            <Menu.Item key="3">用户</Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            style={{
              background: "#fff",
              padding: 24,
              margin: 0,
              minHeight: 280
            }}
            ref={ref => (this.scrollParentRef = ref)}
          >
            {this.state.selectedMenu === "0" ? (
              <div>
                <List
                  style={{ padding: "24px" }}
                  itemLayout="horizontal"
                  dataSource={this.state.reservations}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Switch
                          defaultChecked={false}
                          checkedChildren="已通过"
                          unCheckedChildren="待审核"
                          checked={item.approved || false}
                          onChange={checked =>
                            this.handleApprovedChange(item.id, checked)
                          }
                        />,
                        <Button
                          icon="delete"
                          onClick={() => this.handleReservationDelete(item.id)}
                        />
                      ]}
                    >
                      <Skeleton title={false} loading={item.loading} active>
                        <Row gutter={16} style={{ width: "100%" }}>
                          <Col key={0} span={2}>
                            {item.id}
                          </Col>
                          <Col key={1} span={4}>
                            {item.itemId === -1 ? "活动室" : item.itemName}
                          </Col>
                          <Col key={2} span={4}>
                            {item.userName}
                          </Col>
                          <Col key={3} span={6}>
                            {item.itemId === -1
                              ? moment(item.from).format("MM/DD HH:mm") +
                                " - " +
                                moment(item.to).format("HH:mm")
                              : moment(item.from).format("MM/DD") +
                                " - " +
                                moment(item.to).format("MM/DD")}
                          </Col>
                          <Col key={4} span={8}>
                            {item.reason}
                          </Col>
                        </Row>
                      </Skeleton>
                    </List.Item>
                  )}
                />
                <Divider />
                <List
                  style={{ padding: "24px" }}
                  loading={false}
                  itemLayout="horizontal"
                  loadMore={false}
                  dataSource={this.state.articles}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Switch
                          defaultChecked={false}
                          checkedChildren="已发布"
                          unCheckedChildren="未发布"
                          checked={item.visible || false}
                          onChange={checked =>
                            this.handleVisibleChange(item.id, checked)
                          }
                        />,
                        <Button
                          icon="delete"
                          onClick={() => this.handleArticleDelete(item.id)}
                        />
                      ]}
                    >
                      <Skeleton title={false} loading={item.loading} active>
                        <Row gutter={16} style={{ width: "100%" }}>
                          <Col key={0} span={2}>
                            {item.id}
                          </Col>
                          <Col key={1} span={6}>
                            <Link to={`/articles/${item.alias}`}>
                              {item.title}
                            </Link>
                          </Col>
                          <Col key={2} span={4}>
                            {item.alias}
                          </Col>
                          <Col key={3} span={4}>
                            {item.author}
                          </Col>
                          <Col key={4} span={8}>
                            <this.Tags tags={item.tags} />
                          </Col>
                        </Row>
                      </Skeleton>
                    </List.Item>
                  )}
                />
                <Divider />
                <List
                  style={{ padding: "24px" }}
                  loading={false}
                  itemLayout="horizontal"
                  loadMore={false}
                  dataSource={this.state.users}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Button
                          icon="delete"
                          onClick={() => this.handleUserDelete(item.id)}
                        />
                      ]}
                    >
                      <Skeleton title={false} loading={item.loading} active>
                        <Row gutter={16} style={{ width: "100%" }}>
                          <Col key={0} span={5}>
                            {item.id}
                          </Col>
                          <Col key={1} span={3}>
                            {item.name}
                          </Col>
                          <Col key={2} span={4}>
                            {item.department}
                          </Col>
                          <Col key={3} span={4}>
                            {item.class}
                          </Col>
                          <Col key={4} span={8}>
                            <Cascader
                              allowClear={false}
                              defaultValue={[item.group, item.role]}
                              options={options}
                              onChange={(value, selectedOptions) =>
                                this.handleAuthChange(
                                  item.id,
                                  value,
                                  selectedOptions
                                )
                              }
                            />
                          </Col>
                        </Row>
                      </Skeleton>
                    </List.Item>
                  )}
                />
              </div>
            ) : this.state.selectedMenu === "1" ? (
              <div style={{ height: "60vh", overflow: "auto" }}>
                <InfiniteScroll
                  useWindow={false}
                  initialLoad={true}
                  pageStart={0}
                  loadMore={this.handleInfiniteLoadMore}
                  hasMore={!this.state.loading && this.state.hasMore}
                >
                  <List
                    style={{ padding: "24px" }}
                    itemLayout="horizontal"
                    loading={this.state.loading}
                    dataSource={this.state.allArticles}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          <Switch
                            defaultChecked={false}
                            checkedChildren="已发布"
                            unCheckedChildren="未发布"
                            checked={item.visible || false}
                            onChange={checked =>
                              this.handleVisibleChange(item.id, checked)
                            }
                          />,
                          <Button
                            icon="delete"
                            onClick={() => this.handleArticleDelete(item.id)}
                          />
                        ]}
                      >
                        <Skeleton title={false} loading={item.loading} active>
                          <Row gutter={16} style={{ width: "100%" }}>
                            <Col key={0} span={2}>
                              {item.id}
                            </Col>
                            <Col key={1} span={6}>
                              <Link to={`/articles/${item.alias}`}>
                                {item.title}
                              </Link>
                            </Col>
                            <Col key={2} span={4}>
                              {item.alias}
                            </Col>
                            <Col key={3} span={4}>
                              {item.author}
                            </Col>
                            <Col key={4} span={8}>
                              <this.Tags tags={item.tags} />
                            </Col>
                          </Row>
                        </Skeleton>
                      </List.Item>
                    )}
                  />
                </InfiniteScroll>
              </div>
            ) : this.state.selectedMenu === "2" ? (
              <div style={{ height: "60vh", overflow: "auto" }}>
                <InfiniteScroll
                  useWindow={false}
                  initialLoad={true}
                  pageStart={0}
                  loadMore={this.handleInfiniteLoadMore}
                  hasMore={!this.state.loading && this.state.hasMore}
                >
                  <List
                    style={{ padding: "24px" }}
                    itemLayout="horizontal"
                    dataSource={this.state.allReservations}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          <Switch
                            defaultChecked={false}
                            checkedChildren="已通过"
                            unCheckedChildren="待审核"
                            checked={item.approved || false}
                            onChange={checked =>
                              this.handleApprovedChange(item.id, checked)
                            }
                          />,
                          <Button
                            icon="delete"
                            onClick={() =>
                              this.handleReservationDelete(item.id)
                            }
                          />
                        ]}
                      >
                        <Skeleton title={false} loading={item.loading} active>
                          <Row gutter={16} style={{ width: "100%" }}>
                            <Col key={0} span={2}>
                              {item.id}
                            </Col>
                            <Col key={1} span={4}>
                              {item.itemId === -1 ? "活动室" : item.itemName}
                            </Col>
                            <Col key={2} span={4}>
                              {item.userName}
                            </Col>
                            <Col key={3} span={6}>
                              {item.itemId === -1
                                ? moment(item.from).format("MM/DD HH:mm") +
                                  " - " +
                                  moment(item.to).format("HH:mm")
                                : moment(item.from).format("MM/DD") +
                                  " - " +
                                  moment(item.to).format("MM/DD")}
                            </Col>
                            <Col key={4} span={8}>
                              {item.reason}
                            </Col>
                          </Row>
                        </Skeleton>
                      </List.Item>
                    )}
                  />
                </InfiniteScroll>
              </div>
            ) : (
              <div style={{ height: "60vh", overflow: "auto" }}>
                <InfiniteScroll
                  useWindow={false}
                  initialLoad={true}
                  pageStart={0}
                  loadMore={this.handleInfiniteLoadMore}
                  hasMore={!this.state.loading && this.state.hasMore}
                >
                  <List
                    style={{ padding: "24px" }}
                    loading={this.state.loading}
                    itemLayout="horizontal"
                    dataSource={this.state.allUsers}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          <Button
                            icon="delete"
                            onClick={() => this.handleUserDelete(item.id)}
                          />
                        ]}
                      >
                        <Skeleton title={false} loading={item.loading} active>
                          <Row gutter={16} style={{ width: "100%" }}>
                            <Col key={0} span={5}>
                              {item.id}
                            </Col>
                            <Col key={1} span={3}>
                              {item.name}
                            </Col>
                            <Col key={2} span={4}>
                              {item.department}
                            </Col>
                            <Col key={3} span={4}>
                              {item.class}
                            </Col>
                            <Col key={4} span={8}>
                              <Cascader
                                allowClear={false}
                                defaultValue={[item.group, item.role]}
                                options={options}
                                onChange={(value, selectedOptions) =>
                                  this.handleAuthChange(
                                    item.id,
                                    value,
                                    selectedOptions
                                  )
                                }
                              />
                            </Col>
                          </Row>
                        </Skeleton>
                      </List.Item>
                    )}
                  />
                </InfiniteScroll>
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default ManagePage;
