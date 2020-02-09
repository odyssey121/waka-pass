import React from 'react'
import { Modal, Button, Form, Input, Row } from 'antd';
import './showModal.css'
import QuestionPopover from '../questionPopover';

const { TextArea } = Input;

const config = (initialValue, required) => ({
  initialValue,
  validate: [
    {
      trigger: "onChange",
      rules: [
        {
          required: required,
          message: "обязательное для заполнения"
        }
      ]
    }
  ]
});

const { Fragment } = React;

class ShowModal extends React.PureComponent {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { content, form } = this.props;
    return (
      <Fragment>
        <Button type='link' ghost={true} onClick={this.showModal} id='create-user'>
          Создать пользователя
        </Button>
        <Modal
          title={this.props.title}
          visible={this.state.visible}
          onOk={this.handleOk}
          className="register-window"
          centered={true}
          onCancel={this.handleCancel}
          cancelText="Отмена"
          okText="Создать"
          cancelButtonProps={{ "type": 'danger' }}
        >
          <div className='register-layout'>
            <Form className='register-form'>
              <Form.Item
                label="Имя">
                {form.getFieldDecorator(
                  "name",
                  config("", true)
                )(<Input placeholder="Укажите" className="sm" />)}
              </Form.Item>
              <Form.Item
                label="Фамилия">
                {form.getFieldDecorator(
                  "last_name",
                  config("", true)
                )(<Input placeholder="Укажите" className="sm" />)}
              </Form.Item>
              <Form.Item
                label="api-key">
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
                >{content}</QuestionPopover>
              </Form.Item>
              <Form.Item
                label="О себе">
                <TextArea rows={3} className='about-input' cols={43}/>

              </Form.Item>


            </Form>

          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default Form.create()(ShowModal);