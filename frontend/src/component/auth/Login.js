import React, { useEffect } from "react";
import { Button, Form, Input, Icon } from "antd";
import { connect } from "react-redux";
import { config } from "../conf";
import { login } from "./redux/actions";
import QuestionPopover from "../questionPopover";
import { showSuccessModal } from "../modal";
import Register from "../showModal";
import "./Login.css";

const content = (
  <div>
    api-key можно посмотреть https://wakatime.com/dashboard в настройках
  </div>
);

const Login = ({
  form,
  login,
  loading,
  authStatus,
  user,
  authError,
  ...rest
}) => {
  const submitLogin = e => {
    e.persist();
    form.validateFields((err, values) => {
      if (!err) {
        login(values);
      }
    });
  };

  useEffect(() => {
    if (authError) {
      showSuccessModal({
        title: `Ошибка! `,
        content: `При авторизации возникли ошибки << ${authError} >>`,
        className: "vehicleSuccess vehicleSuccess_warning",
        okText: "Ок",
        icon: "warning",
        closable: true,
        maskClosable: true,
        centered: true
      });
    }
  }, authError);

  return (
    <div id="login">
      <Form className="login-form" autoComplete="off" onSubmit={submitLogin}>
        <h1>
          Вход
          <Icon type="login" />
        </h1>
        <div>
          <Form.Item>
            {form.getFieldDecorator(
              "api_key",
              config("", true)
            )(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Укажите api-key"
              />
            )}
          </Form.Item>
          <QuestionPopover
            width="24"
            height="24"
            trigger="click"
            fill="#00a8ff"
            position="top"
          >
            {content}
          </QuestionPopover>
        </div>

        <div className="login-area">
          <Form.Item>
            {form.getFieldDecorator(
              "last_name",
              config("", true)
            )(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Укажите фамилию"
              />
            )}
          </Form.Item>
          <Button
            onClick={submitLogin}
            className="login-btn"
            type="primary"
            loading={loading}
          >
            Вход
          </Button>
        </div>

        <Register content={content} title="Создание нового пользователя" />
      </Form>
    </div>
  );
};

export default connect(
  state => ({
    loading: state.authentication.detail.loading,
    authStatus: state.authentication.detail.status,
    authError: state.authentication.detail.error,
    restoreStatus: state.authentication.restore.status,
    user: state.authentication.user
  }),
  {
    login
  }
)(Form.create()(Login));
