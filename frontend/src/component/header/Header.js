import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Divider, Icon, Typography, Avatar, Popover } from "antd";
import { logout, resetUser } from "../auth/redux/actions";
import { Link } from "react-router-dom";
import { showSuccessModal } from "../modal";
import "./Header.css";
const { Text } = Typography;

const Header = ({ logout, ...rest }) => {
  useEffect(() => {
    switch (rest.authStatus) {
      case "SUCCESS":
        showSuccessModal({
          title: `Добро Пожаловать! ${rest.user["name"]} ${rest.user["last_name"]}`,
          className: "vehicleSuccess",
          okText: "Спасибо",
          icon: "check",
          closable: true,
          maskClosable: true,
          centered: true
        });
        break;
      default:
        break;
    }
  }, rest.authStatus);
  return (
    <header id="header">
      <div className="header-row">
        <div className="header-row-container">
          <div className="item-cell">
            {rest.user ? (
              <Link to="/">
                <a href="/">
                  <Icon type="experiment" />
                  <span>
                    <Text strong code>
                      Waka-Prime
                    </Text>
                  </span>
                </a>
              </Link>
            ) : (
              <React.Fragment>
                <Icon type="experiment" className="inactive" />
                <span>
                  <Text strong code>
                    Waka-Prime
                  </Text>
                </span>
              </React.Fragment>
            )}
          </div>
          <Divider type="vertical" />
          <div className="item-cell info-cell">
            {rest.user && (
              <Popover
                placement="bottom"
                content={
                  <div>
                    <Text style={{ "font-size": "18px" }} type="strong">
                      Ваша роль:
                      {rest.user.omnipotent ? "Администратор" : "Разработчик"}
                    </Text>
                  </div>
                }
                trigger={"click"}
                className="popover"
              >
                <Icon type="bell" />
              </Popover>
            )}
          </div>
          <Divider type="vertical" />
          <div className="item-cell">
            {rest.user && (
              <div className="user-area">
                <Avatar icon={<Icon type="user" />} />
                <Text style={{ "font-size": "18px" }} type="strong">
                  {rest.user && rest.user.last_name}
                </Text>
                <Icon type="logout" onClick={logout} />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default connect(
  state => ({
    authStatus: state.authentication.detail.status,
    user: state.authentication.user
  }),
  {
    logout
  }
)(Header);
