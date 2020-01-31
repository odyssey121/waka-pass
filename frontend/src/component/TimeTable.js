import React from "react";
import { Icon, Table } from "antd";

const placeholder = <Icon type="loading" style={{ fontSize: 44 }} spin />;

const normTime = time => {
  let newTime;
  var h = (time / 60) ^ 0;
  if (h) {
    var m = time % 60;
    if (m < 10) m = "0" + m;
    newTime = h + " ч " + m + " м";
  } else {
    newTime = time + " м";
  }
  return newTime;
};

const TimeTable = ({ result, loading, history }) => {
  const renderColumns = () => {
    return [
      {
        title: "Дата",
        dataIndex: "date",
        key: "date",
        width: "30%",
        render: date => <div>{date && date}</div>,
        sorter: (a, b) => {
          return a.date.localeCompare(b.date);
        }
      },
      {
        title: "Фамилия",
        dataIndex: "last_name",
        key: "last_name",
        width: "40%",
        render: last_name => <div>{last_name && last_name}</div>,
        sorter: (a, b) => {
          return a.last_name.localeCompare(b.last_name);
        }
      },
      {
        title: "Время",
        dataIndex: "running_min",
        key: "running_min",
        width: "30%",
        render: running_min => <div>{running_min && normTime(running_min)}</div>,
        sorter: (a, b) => {
          return b.running_min - a.running_min
        }
      }
    ];
  };

  const getDetail = last_name => history.push(`/detail/${last_name}`)


  return (
    <div className="Table-wrapper">
      <Table
        onRow={(record, index) => ({
          index,
          onClick: () => getDetail(record.last_name)
        })}
        locale={{ emptyText: loading ? placeholder : "Нету результатов..." }}
        dataSource={result}
        columns={renderColumns()}
      />
    </div>
  );
};

export default TimeTable;
