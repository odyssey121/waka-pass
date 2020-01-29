import React, { useEffect, useState } from "react";
import { Button } from "antd";
import TimeTable from "./TimeTable";
import { Link } from 'react-router-dom';

const Days = props => {
  const getData = async last_name => {
    setLoading(true);
    const rawResponse = await fetch(`/days/${last_name}`)
    const content = await rawResponse.json();
    setLoading(false);
    setResult(content.data)
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
      <TimeTable loading={loading} result={result} />
    </div>
  );
};

export default Days;
