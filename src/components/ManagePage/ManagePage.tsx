import {
  Button,
  Cascader,
  Col,
  Divider,
  Layout,
  List,
  Menu,
  message,
  Modal,
  Row,
  Skeleton,
  Switch,
  Tag,
  Tooltip
} from "antd";
import { BasicProps } from "antd/lib/layout/layout";
import { MenuProps } from "antd/lib/menu";
import axios from "axios";
import moment from "moment";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Link } from "react-router-dom";
import IArticleModel from "../../models/Article";
import IItemModel from "../../models/Item";
import IReservationModel from "../../models/Reservation";
import IUserModel from "../../models/User";
import { AuthContext } from "../AuthContext/AuthContext";
import "./ManagePage.css";

const { Content, Sider } = Layout;
const confirm = Modal.confirm;

const Tags = (props: { tags: string[] }) => {
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
      },
      {
        value: "keeper",
        label: "keeper"
      },
      {
        value: "editor",
        label: "editor"
      }
    ]
  }
];

interface IManagePageState {
  users: Array<
    IUserModel & {
      loading: boolean;
      itemName: string;
      userName: string;
    }
  >;
  articles: Array<IArticleModel & { loading: boolean; author: string }>;
  selectedMenu: "0" | "1" | "2" | "3";
  allUsers: Array<IUserModel & { loading: boolean }>;
  allArticles: Array<IArticleModel & { loading: boolean; author: string }>;
  page: number;
  loading: boolean;
  hasMore: boolean;
  reservations: Array<
    IReservationModel & {
      loading: boolean;
      itemName: string;
      userName: string;
    }
  >;
  allReservations: Array<
    IReservationModel & {
      loading: boolean;
      itemName: string;
      userName: string;
    }
  >;
  onlyShowForKeeper: boolean;
}

export default class ManagePage extends React.Component<{}, IManagePageState> {
  static contextType = AuthContext;
  context!: React.ContextType<typeof AuthContext>;

  scrollParentRef: React.RefObject<React.Component<BasicProps, any, any>>;

  constructor(props: {}) {
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
    this.scrollParentRef = React.createRef();
  }

  render() {
    const {
      selectedMenu,
      reservations,
      articles,
      allArticles,
      allReservations,
      allUsers,
      users,
      loading,
      hasMore
    } = this.state;

    return (
      <Layout className="ManagePage">
        <Sider width={200} style={{ background: "#fff" }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["0"]}
            selectedKeys={[selectedMenu]}
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
            ref={this.scrollParentRef}
          >
            {selectedMenu === "0" ? (
              <div style={{ padding: "24px" }}>
                <List
                  itemLayout="horizontal"
                  dataSource={reservations}
                  renderItem={this.renderReservationsList}
                />
                <Divider />
                <List
                  loading={false}
                  itemLayout="horizontal"
                  loadMore={false}
                  dataSource={articles}
                  renderItem={this.renderArticlesList}
                />
                <Divider />
                <List
                  loading={false}
                  itemLayout="horizontal"
                  loadMore={false}
                  dataSource={users}
                  renderItem={this.renderUsersList}
                />
              </div>
            ) : selectedMenu === "1" ? (
              <div style={{ height: "60vh", overflow: "auto" }}>
                <InfiniteScroll
                  useWindow={false}
                  initialLoad={true}
                  pageStart={0}
                  loadMore={this.handleInfiniteLoadMore}
                  hasMore={!loading && hasMore}
                >
                  <List
                    itemLayout="horizontal"
                    loading={loading}
                    dataSource={allArticles}
                    renderItem={this.renderArticlesList}
                  />
                </InfiniteScroll>
              </div>
            ) : selectedMenu === "2" ? (
              <div style={{ height: "60vh", overflow: "auto" }}>
                <InfiniteScroll
                  useWindow={false}
                  initialLoad={true}
                  pageStart={0}
                  loadMore={this.handleInfiniteLoadMore}
                  hasMore={!loading && hasMore}
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={allReservations}
                    renderItem={this.renderReservationsList}
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
                  hasMore={!loading && hasMore}
                >
                  <List
                    loading={loading}
                    itemLayout="horizontal"
                    dataSource={allUsers}
                    renderItem={this.renderUsersList}
                  />
                </InfiniteScroll>
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    );
  }

  renderReservationsList = (
    item: IReservationModel & {
      loading: boolean;
      itemName: string;
      userName: string;
    }
  ) => (
    <List.Item
      actions={[
        <Switch
          key={0}
          defaultChecked={false}
          checkedChildren="已通过"
          unCheckedChildren="待审核"
          checked={item.approved || false}
          // tslint:disable-next-line: jsx-no-lambda
          onChange={checked => this.handleApprovedChange(item.id, checked)}
        />,
        <Button
          key={1}
          icon="delete"
          // tslint:disable-next-line: jsx-no-lambda
          onClick={() => this.handleReservationDelete(item.id)}
        />
      ]}
    >
      <Skeleton title={false} loading={item.loading} active={true}>
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
  );

  renderArticlesList = (
    item: IArticleModel & { loading: boolean; author: string }
  ) => (
    <List.Item
      actions={[
        <Switch
          key={0}
          defaultChecked={false}
          checkedChildren="已发布"
          unCheckedChildren="未发布"
          checked={item.visible || false}
          // tslint:disable-next-line: jsx-no-lambda
          onChange={checked => this.handleVisibleChange(item.id, checked)}
        />,
        <Link key={1} to={`/articles/${item.alias}/edit`}>
          <Button icon="edit" />
        </Link>,
        <Button
          key={2}
          icon="delete"
          // tslint:disable-next-line: jsx-no-lambda
          onClick={() => this.handleArticleDelete(item.id)}
        />
      ]}
    >
      <Skeleton title={false} loading={item.loading} active={true}>
        <Row gutter={16} style={{ width: "100%" }}>
          <Col key={0} span={2}>
            {item.id}
          </Col>
          <Col key={1} span={6}>
            <Link to={`/articles/${item.alias}`}>{item.title}</Link>
          </Col>
          <Col key={2} span={4}>
            {item.alias}
          </Col>
          <Col key={3} span={4}>
            {item.author}
          </Col>
          <Col key={4} span={8}>
            <Tags tags={item.tags} />
          </Col>
        </Row>
      </Skeleton>
    </List.Item>
  );

  renderUsersList = (item: IUserModel & { loading: boolean }) => (
    <List.Item
      actions={[
        // tslint:disable-next-line: jsx-no-lambda
        <Button
          key={0}
          icon="delete"
          // tslint:disable-next-line: jsx-no-lambda
          onClick={() => this.handleUserDelete(item.id)}
        />
      ]}
    >
      <Skeleton title={false} loading={item.loading} active={true}>
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
              // tslint:disable-next-line: jsx-no-lambda
              onChange={value => this.handleAuthChange(item.id, value)}
            />
          </Col>
        </Row>
      </Skeleton>
    </List.Item>
  );

  componentDidMount = async () => {
    const userInfo = this.context.userInfo;

    if (userInfo && userInfo.role === "keeper") {
      this.setState({ onlyShowForKeeper: true });
    }

    if (userInfo && userInfo.role === "root") {
      const usersResponse = await axios.get(
        `/v1/users?begin=0&end=4&detailInfo=true`
      );
      this.setState({ users: usersResponse.data || [] });

      const articlesResponse = await axios.get(
        `/v1/articles?begin=0&end=4&invisible=true&noContent=true`
      );

      const articles = articlesResponse.data || [];
      for (let index = 0; index < articles.length; index++) {
        const article = articles[index];

        const userRes = await axios.get(`/v1/users/${article.authorId}`);
        const user = userRes.data;
        if (user) {
          article.author = user.name;
        }
        articles[index] = article;
      }
      this.setState({ articles });

      const reservationsResponse = await axios.get(
        `/v1/reservations?begin=0&end=4&roomOnly=all`
      );

      const reservations = reservationsResponse.data || [];
      for (let index = 0; index < reservations.length; index++) {
        const reservation = reservations[index];
        if (reservation.itemId !== -1) {
          const itemRes = await axios.get(`/v1/items/${reservation.itemId}`);
          const item = itemRes.data as IItemModel;
          if (item) {
            reservation.itemName = item.name;
          }
          reservations[index] = reservation;
        }

        const userRes = await axios.get(`/v1/users/${reservation.userId}`);
        const user = userRes.data as IUserModel;
        if (user) {
          reservation.userName = user.name;
        }
        reservations[index] = reservation;
      }
      this.setState({ reservations });
    }
  };

  handleAuthChange = async (userId: number, value: string[]) => {
    const newAuth = {
      group: value[0],
      role: value[1]
    };
    const users = this.state.selectedMenu === "0" ? "users" : "allUsers";

    try {
      await axios.put(`/v1/users/${userId}`, {
        group: newAuth.group,
        role: newAuth.role
      });
      const newUsers = [...this.state[users]];
      const index = newUsers.findIndex(v => v.id === userId);
      newUsers[index] = { ...newUsers[index], ...newAuth };
      this.setState({ [users]: newUsers } as any);
      message.success("用户权限更新成功");
    } catch {
      message.error("用户权限更新失败");
    }
  };

  handleUserDelete = (userId: number) => {
    confirm({
      title: "确认删除此用户？",
      content: "此操作不可恢复！",
      onOk: async () => {
        try {
          const users = this.state.selectedMenu === "0" ? "users" : "allUsers";

          await axios.delete(`/v1/users/${userId}`);
          let newUsers = [...this.state[users]];
          newUsers = newUsers.filter(value => value.id !== userId);
          this.setState({ [users]: newUsers } as any);
          message.success("删除用户成功");
        } catch {
          message.error("删除用户失败");
        }
      }
    });
  };

  handleReservationDelete = (reservationId: number) => {
    confirm({
      title: "确认删除此预约？",
      content: "此操作不可恢复！",
      onOk: async () => {
        try {
          const reservations =
            this.state.selectedMenu === "0"
              ? "reservations"
              : "allReservations";

          await axios.delete(`/v1/reservations/${reservationId}`);
          let newReservations = [...this.state[reservations]];
          newReservations = newReservations.filter(
            value => value.id !== reservationId
          );
          this.setState({ [reservations]: newReservations } as any);
          message.success("删除预约成功");
        } catch {
          message.error("删除预约失败");
        }
      }
    });
  };

  handleArticleDelete = (articleId: number) => {
    confirm({
      title: "确认删除此文章？",
      content: "此操作不可恢复！",
      onOk: async () => {
        try {
          const articles =
            this.state.selectedMenu === "0" ? "articles" : "allArticles";

          await axios.delete(`/v1/articles/${articleId}`);
          let newArticles = [...this.state[articles]];
          newArticles = newArticles.filter(value => value.id !== articleId);
          this.setState({ [articles]: newArticles } as any);
          message.success("删除文章成功");
        } catch {
          message.error("删除文章失败");
        }
      }
    });
  };

  handleVisibleChange = async (articleId: number, checked: boolean) => {
    try {
      const articles =
        this.state.selectedMenu === "0" ? "articles" : "allArticles";

      await axios.put(`/v1/articles/${articleId}`, {
        visible: checked
      });
      const newArticles = [...this.state[articles]];
      const index = newArticles.findIndex(value => value.id === articleId);
      newArticles[index] = { ...newArticles[index], visible: checked };
      this.setState({ [articles]: newArticles } as any);
      message.success("文章发布状态更新成功");
    } catch {
      message.error("文章发布状态更新失败");
    }
  };

  handleApprovedChange = async (reservationId: number, checked: boolean) => {
    try {
      const reservations =
        this.state.selectedMenu === "0" ? "reservations" : "allReservations";

      await axios.put(`/v1/reservations/${reservationId}`, {
        approved: checked
      });
      const newReservations = [...this.state[reservations]];
      const index = newReservations.findIndex(
        value => value.id === reservationId
      );
      newReservations[index] = {
        ...newReservations[index],
        approved: checked
      };
      this.setState({ [reservations]: newReservations } as any);
      message.success("预约状态更新成功");
    } catch {
      message.error("预约状态更新失败");
    }
  };

  handleMenuChange: MenuProps["onSelect"] = ({ key }) => {
    this.setState({
      selectedMenu: key as "0" | "1" | "2" | "3",
      page: 1,
      loading: false,
      hasMore: true
    });

    if (key === "1") {
      this.setState({ allArticles: this.state.articles });
    }
    if (key === "2") {
      this.setState({ allReservations: this.state.reservations });
    }
    if (key === "3") {
      this.setState({ allUsers: this.state.users });
    }
  };

  handleInfiniteLoadMore = async () => {
    const page = this.state.page;
    let data: any =
      this.state.selectedMenu === "1"
        ? this.state.allArticles
        : this.state.selectedMenu === "2"
        ? this.state.allReservations
        : this.state.allUsers;
    this.setState({
      loading: true
    });

    if (this.state.selectedMenu === "1") {
      try {
        const articlesResponse = await axios.get(
          `/v1/articles?begin=${page * 10 - 5}&end=${page * 10 +
            4}&noContent=true&invisible=true`
        );
        data = (data as IArticleModel[]).concat(
          articlesResponse.data as IArticleModel[]
        );

        for (let index = 0; index < data.length; index++) {
          const article = data[index];
          const userRes = await axios.get(`/v1/users/${article.authorId}`);
          const user = userRes.data;
          if (user) {
            article.author = user.name;
          }
          data[index] = article;
        }

        if (articlesResponse.data.length < 10) {
          this.setState({
            hasMore: false
          });
        }

        this.setState({
          page: page + 1,
          loading: false,
          allArticles: data
        });
      } catch {
        message.error("文章加载失败");
      }
    } else if (this.state.selectedMenu === "2") {
      try {
        const reservationsResponse = await axios.get(
          `/v1/reservations?begin=${page * 10 - 5}&end=${page * 10 +
            4}&roomOnly=all`
        );
        data = (data as IReservationModel[]).concat(
          reservationsResponse.data as IReservationModel[]
        );

        for (let index = 0; index < data.length; index++) {
          const reservation = data[index];
          if (reservation.itemId !== -1) {
            const itemRes = await axios.get(`/v1/items/${reservation.itemId}`);
            const item = itemRes.data;
            if (item) {
              reservation.itemName = item.name;
            }
            data[index] = reservation;
          }

          const userRes = await axios.get(`/v1/users/${reservation.userId}`);
          const user = userRes.data;
          if (user) {
            reservation.userName = user.name;
          }
          data[index] = reservation;
        }

        if (reservationsResponse.data.length < 10) {
          this.setState({
            hasMore: false
          });
        }

        this.setState({
          page: page + 1,
          loading: false,
          allReservations: data
        });
      } catch {
        message.error("预约加载失败");
      }
    } else {
      try {
        const usersResponse = await axios.get(
          `/v1/users?begin=${page * 10 - 5}&end=${page * 10 +
            4}&detailInfo=true`
        );
        data = (data as IUserModel[]).concat(
          usersResponse.data as IUserModel[]
        );

        if (usersResponse.data.length < 10) {
          this.setState({
            hasMore: false
          });
        }

        this.setState({
          page: page + 1,
          loading: false,
          allUsers: data
        });
      } catch {
        message.error("用户加载失败");
      }
    }
  };
}
