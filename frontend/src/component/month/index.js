import React, { useState, useEffect } from "react";
import TimeTable from "../table";
import { Form, Input, Button, Icon, Select } from "antd";
import { ConfirmBlue, showSuccessModal } from "../modal";
import { config } from "../conf";
import moment from "moment";
import { connect } from "react-redux";

const { Option } = Select;

function Month({ form, authStatus, user, ...rest }) {
  const calculateDate = retrieve => {
    if (!retrieve.days || !retrieve.month) {
      alert("error in fetch api");
      return [];
    }
    let scope_days = {};
    const userArr = retrieve.month
      .reduce(
        (acc, record) =>
          acc.includes(record.last_name) ? acc : [...acc, record.last_name],
        []
      )
      .forEach(user => {
        scope_days[user] = retrieve.days.filter(day => day.last_name == user);
      });

    return retrieve.month.map(record => ({
      ...record,
      days: scope_days[record.last_name]
    }));
  };

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
  const [monthFilter, setMonthFilter] = useState(
    moment
      .utc()
      .format("MM/YYYY")
      .toString()
  );

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
    <div className="month-app">
      <div className="row">
        <div>
          <div className="table-hat">
            <div style={{ display: "flex" }}>
              <Icon type="idcard" />
              <Select
                className="select-month"
                placeholder="месяца"
                onChange={e => setMonthFilter(e)}
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
                      <Option key={record} value={record}>
                        {record}
                      </Option>
                    ))}
              </Select>
            </div>

            <Icon type="clock-circle" onClick={getData} id="update" />
          </div>
          <TimeTable
            result={
              user
                ? user.omnipotent
                  ? result
                  : result.filter(r => r.last_name === user.last_name)
                : []
            }
            history={rest.history}
            loading={loading}
            monthFilter={monthFilter}
          />
        </div>
      </div>
    </div>
  );
}

export default connect(
  state => ({
    loading: state.authentication.detail.loading,
    authStatus: state.authentication.detail.status,
    authError: state.authentication.detail.error,
    restoreStatus: state.authentication.restore.status,
    user: state.authentication.user
  }),
  {}
)(Form.create()(Month));
