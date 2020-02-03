import React, { useEffect, useState } from "react";
import { Button, Select } from "antd";
import TimeTable from "./TimeTable";
import { Link } from 'react-router-dom';
import moment from 'moment';
// import { alldays } from './mock';

const { Option } = Select;

const Days = props => {
  const getData = async (last_name, date) => {
    setLoading(true);
    const rawResponse = await fetch(`/days/${last_name}`)
    const content = await rawResponse.json();
    setLoading(false);
    setResult(content.data.filter(r => r.date.slice(3) == date.replace('_', '/')))
  };

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [errors, setErrors] = useState(null);
  const [daysFilter, setDaysFilter] = useState(moment.utc().format("MM/YYYY").toString())

  useEffect(() => {
    const { last_name, date } = props.match.params;
    getData(last_name, date);
  }, []);
  return (
    <div className="container">
      <div className="row">
        <Link to="/">
          <Button type="link" id="index-btn" ghost={true}>
            На главную
          </Button>
        </Link>
        {/* <Select
          className="select-month"
          placeholder="месяца"
          onChange={(e) => setDaysFilter(e)}
          value={daysFilter}
        >
          {result &&
            result
              .reduce(
                (acc, record) =>
                  acc.includes(record.date.slice(3)) ? acc : [...acc, record.date.slice(3)],
                []
              )
              .map(record => (
                <Option key={record} value={record}>{record}</Option>
              ))}
        </Select> */}
      </div>
      <TimeTable loading={loading} result={result} daysFilter={daysFilter} />
    </div>
  );
};

export default Days;
