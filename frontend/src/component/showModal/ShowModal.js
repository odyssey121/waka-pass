import React from "react";
import { Modal, Button, Form, Input, Row } from "antd";
import { showSuccessModal } from "../modal";
import { config } from "../conf";
import "./showModal.css";
import QuestionPopover from "../questionPopover";

const { TextArea } = Input;

const { Fragment } = React;

class ShowModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  addUser = async values => {
    const rawResponse = await fetch("/user", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });
    const content = await rawResponse.json();
    switch (content.status) {
      case 201:
        showSuccessModal({
          title: "Успех!",
          content: `Пользователь ${values["name"]} ${values["last_name"]}, успешно добавлен!`,
          className: "vehicleSuccess",
          okText: "Готово",
          icon: "check",
          closable: true,
          maskClosable: true,
          centered: true
        });
        this.setState({ visible: false });
        break;

      case 302:
        showSuccessModal({
          title: "Ошибка!",
          content: content.message,
          className: "vehicleSuccess vehicleSuccess_warning",
          okText: "Готово",
          icon: "warning",
          closable: true,
          maskClosable: true,
          centered: true
        });

        break;

      default:
        break;
    }
  };

  onSubmit = e => {
    e.persist();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.addUser(values);
        this.props.form.resetFields();
      }
    });
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  render() {
    const { content, form } = this.props;
    return (
      <Fragment>
        <Button
          type="link"
          ghost={true}
          onClick={this.showModal}
          id="create-user"
        >
          Создать пользователя
        </Button>
        <Modal
          title={this.props.title}
          visible={this.state.visible}
          onOk={this.onSubmit}
          className="register-window"
          centered={true}
          onCancel={this.handleCancel}
          cancelText="Отмена"
          okText="Создать"
          cancelButtonProps={{ type: "danger" }}
        >
          <div className="register-layout">
            <Form className="register-form" onSubmit={this.onSubmit}>
              <Form.Item label="Имя">
                {form.getFieldDecorator(
                  "name",
                  config("", true)
                )(<Input placeholder="Укажите" className="sm" />)}
              </Form.Item>
              <Form.Item label="Фамилия">
                {form.getFieldDecorator(
                  "last_name",
                  config("", true)
                )(<Input placeholder="Укажите" className="sm" />)}
              </Form.Item>
              <Form.Item label="api-key">
                {form.getFieldDecorator(
                  "api_key",
                  config("", true)
                )(<Input placeholder="Укажите" className="md" />)}
                <QuestionPopover
                  width="24"
                  height="24"
                  trigger="click"
                  fill="#00a8ff"
                  position="top"
                >
                  {content}
                </QuestionPopover>
              </Form.Item>
              {/* <Form.Item label="О себе">
                <TextArea rows={3} className="about-input" cols={43} />
              </Form.Item> */}
            </Form>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default Form.create()(ShowModal);
