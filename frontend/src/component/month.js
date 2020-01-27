import React, { useState, useEffect } from "react";
import TimeTable from "./TimeTable";
import { Form, Input, Button, Icon } from "antd";
import { allMonth } from "./mock";
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
  console.log(content)
  console.log(rawResponse)
};

function Month({ form, ...rest }) {
  const onSubmit = e => {
    e.persist();
    form.validateFields((err, values) => {
      if (!err) {
        addUser(values);
        // form.resetFields();
        // showSuccessModal({
        //   title: "Успех!",
        //   content: `Пользователь ${values["last_name"]}, успешно добавлен!`,
        //   className: "vehicleSuccess",
        //   okText: "Готово",
        //   icon: "check",
        //   closable: true,
        //   maskClosable: true,
        //   centered: true
        // });
      }
    });
  };

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [errors, setErrors] = useState(null);

  const getData = async () => {
    setLoading(true);
    const rawResponse = fetch("/month", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    const content = await rawResponse.json();
    setLoading(false);
    console.log(content.body);
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
          <Icon type="idcard" />
          <TimeTable result={allMonth.data} history={rest.history} />
        </div>
      </div>
    </div>
  );
}

export default Form.create()(Month);
