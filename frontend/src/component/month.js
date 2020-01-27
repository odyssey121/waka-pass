import React, { useState, useEffect } from "react";
import TimeTable from "./TimeTable";
import { Form, Input, Button, Icon } from "antd";
import { ConfirmBlue, showSuccessModal } from "./modal";

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

const addUser = async values => {
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
        content: `Пользователь ${values["last_name"]}, успешно добавлен!`,
        className: "vehicleSuccess",
        okText: "Готово",
        icon: "check",
        closable: true,
        maskClosable: true,
        centered: true
      });
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
  }

};

function Month({ form, ...rest }) {
  const onSubmit = e => {
    e.persist();
    form.validateFields((err, values) => {
      if (!err) {
        addUser(values);
        form.resetFields();

      }
    });
  };

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [errors, setErrors] = useState(null);

  const getData = async () => {
    setLoading(true);
    const rawResponse = await fetch("/month")
    const content = await rawResponse.json();
    setLoading(false);
    setResult(content.data)
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <div>
            <Icon type="user" />
          </div>
          <Form className="user-form">
            <Form.Item>
              {form.getFieldDecorator(
                "name",
                config("", true)
              )(<Input placeholder="Укажите имя" className="sm" />)}
            </Form.Item>
            <Form.Item>
              {form.getFieldDecorator(
                "last_name",
                config("", true)
              )(<Input placeholder="Укажите фамилию" className="sm" />)}
            </Form.Item>
            <Form.Item>
              {form.getFieldDecorator(
                "api_key",
                config("", true)
              )(<Input placeholder="Введите Api-key" className="md" />)}
            </Form.Item>
            <div className="btn">
              <Button
                onClick={e =>
                  ConfirmBlue({
                    onOk: () => onSubmit(e)
                  })
                }
                type="primary"
              >
                Добавить
              </Button>
            </div>
          </Form>
        </div>
        <div>
          <div className='table-hat'>
            <Icon type="idcard" />
            <Icon type="clock-circle" onClick={getData} id="update"/>
          </div>

          <TimeTable result={result} history={rest.history} loading={loading} />
        </div>
      </div>
    </div >
  );
}

export default Form.create()(Month);
