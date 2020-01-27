import React, { useEffect, useState } from "react";
import { Table, Icon, Button } from "antd";
import TimeTable from "./TimeTable";
import { Link } from 'react-router-dom';

const placeholder = <Icon type="loading" style={{ fontSize: 44 }} spin />;

const Days = props => {
  const getData = async last_name => {
    setLoading(true);
    let content;
    fetch(`/days/${last_name}`, {
      method: "GET",
      mode: "no-cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(data => console.log(data));

    setLoading(false);
    console.log(content);
  };
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [errors, setErrors] = useState(null);
  useEffect(() => {
    const { last_name } = props.match.params;
    getData(last_name);
  }, []);
  return (
    <div className="container">
      <div className="row">
        <Link to="/">
          <Button type="link" id="index-btn" ghost={true}>
            На главную
          </Button>
        </Link>
      </div>
      <TimeTable />
    </div>
  );
};

export default Days;
