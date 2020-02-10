import React, { useState, useEffect } from "react";
import TimeTable from "../table";
import { Form, Input, Button, Icon, Select } from "antd";
import { ConfirmBlue, showSuccessModal } from "../modal";
import { config } from '../conf';
import moment from 'moment';

const { Option } = Select;

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

  const calculateDate = (retrieve) => {
    if (!retrieve.days || !retrieve.month) {
      alert('error in fetch api')
      return
    }
    let scope_days = {};
    const userArr = retrieve.month.reduce(
      (acc, record) =>
        acc.includes(record.last_name) ? acc : [...acc, record.last_name],
      []
    ).forEach(user => {
      scope_days[user] = retrieve.days.filter(day => day.last_name == user)
    })

    return retrieve.month.map(record => ({ ...record, 'days': scope_days[record.last_name] }))
  }

  const getMonth = async values => {
    setLoading(true);
    const rawResponse = await fetch("/month_retrieve", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });
    const content = await rawResponse.json();
    setLoading(false);
    setResult(content.data);
  };

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [errors, setErrors] = useState(null);
  const [monthFilter, setMonthFilter] = useState(moment.utc().format("MM/YYYY").toString())

  // const monthChange = e => getMonth({ 'month': e });

  const getData = async () => {
    setLoading(true);
    const rawResponse = await fetch("/fetch");
    const content = await rawResponse.json();
    setLoading(false);
    setResult(calculateDate(content));
  };



  useEffect(() => {
    getData();
  }, []);



  return (
    <div className="App">
        <div className="row">
            {/* <Icon type="user" />
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
        </div> */}
        <div>
          <div className="table-hat">
            <div>
              <Icon type="idcard" />
              <Select
                className="select-month"
                placeholder="месяца"
                onChange={(e) => setMonthFilter(e)}
                value={monthFilter}
              >
                {result &&
                  result
                    .reduce(
                      (acc, record) =>
                        acc.includes(record.date) ? acc : [...acc, record.date],
                      []
                    )
                    .map(record => (
                      <Option key={record} value={record}>{record}</Option>
                    ))}
              </Select>
            </div>

            <Icon type="clock-circle" onClick={getData} id="update" />
          </div>
          <TimeTable
            result={result}
            history={rest.history}
            loading={loading}
            monthFilter={monthFilter} />
        </div>
      </div>
    </div>
  );
}

export default Form.create()(Month);
