import React from "react";
import { Icon, Table } from "antd";
import { CSVLink } from "react-csv";
import { ConfirmBlue } from "../modal";
import { useState, useEffect } from "react";

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

const reversToMin = string => string.length > 4 && string.split(" ")[0] * 60 + string.split(" ")[2]


const headers = [
  { label: "Дата", key: "date" },
  { label: "Фамилия", key: "last_name" },
  { label: "Время", key: "running_min" },
  { label: "Дней отработано", key: "day_worked" },
  { label: "Дней > 4", key: "day_more" },
  { label: "Дней < 4", key: "day_less" }
];

const DownloadBtn = ({ result }) => {
  const [csvLink, setCsvLink] = useState(null);
  useEffect(() => {
    let link = document.getElementsByClassName("csvLink");
    setCsvLink(link.item(0) || null);
  }, []);

  return (
    <div>
      <Icon
        type="file-excel"
        onClick={() =>
          ConfirmBlue({
            title: "Внимание!",
            icon: <Icon type="warning" />,
            content: (
              <span>Вы действительно желаете скачать файл результатов?</span>
            ),
            onOk: () => {
              csvLink.click();
            },
            okText: "Согласен"
          })
        }
      />
      <CSVLink
        className="csvLink"
        filename={"Time-Tracker.csv"}
        data={result}
        headers={headers}
      ></CSVLink>
    </div>
  );
};

// const data = [
//   { details: { firstName: "Ahmed", lastName: "Tomi" }, job: "manager" },
//   { details: { firstName: "John", lastName: "Jones" }, job: "developer" }
// ];

const TimeTable = ({ result, loading, history, monthFilter, daysFilter }) => {
  const renderColumns = () => {
    let cols = [
      {
        title: "Дата",
        dataIndex: "date",
        key: "date",
        width: "10%",
        render: date => <div>{date && date}</div>,
        sorter: (a, b) => {
          return a.date.localeCompare(b.date);
        }
      },
      {
        title: "Фамилия",
        dataIndex: "last_name",
        key: "last_name",
        width: "10%",
        render: last_name => <div>{last_name && last_name}</div>,
        sorter: (a, b) => {
          return a.last_name.localeCompare(b.last_name);
        }
      },
      {
        title: "Время",
        dataIndex: "running_min",
        key: "running_min",
        width: "10%",
        render: running_min => <div>{running_min && running_min}</div>,
        sorter: (a, b) => {
          return reversToMin(b.running_min) - reversToMin(a.running_min);
        }
      }
    ];

    const addingCols = [
      {
        title: "Дней отработано",
        dataIndex: "day_worked",
        key: "day_worked",
        width: "10%",
        render: day_worked => <div>{day_worked && day_worked}</div>,
        sorter: (a, b) => {
          return b.day_worked - a.day_worked;
        }
      },
      {
        title: "дней > 4 часов",
        dataIndex: "day_more",
        key: "day_more",
        width: "10%",
        render: day_more => <div>{day_more && day_more}</div>,
        sorter: (a, b) => {
          return b.day_more - a.day_more;
        }
      },
      {
        title: "дней < 4 часов",
        dataIndex: "day_less",
        key: "day_less",
        width: "10%",
        render: day_less => <div>{day_less && day_less}</div>,
        sorter: (a, b) => {
          return b.day_less - a.day_less;
        }
      }
    ];
    return monthFilter !== undefined ? [...cols, ...addingCols] : [...cols];
  };

  const renderResult = () => {
    if (monthFilter !== undefined) {
      return result
        .map((record, index) => ({
          ...record,
          key: index,
          running_min: record.running_min && normTime(record.running_min),
          day_worked: String(
            record.days.filter(r => r.date.slice(3) == monthFilter).length
          ),
          day_more: String(
            record.days.filter(
              r => r.date.slice(3) == monthFilter && r.running_min > 240
            ).length
          ),
          day_less: String(
            record.days.filter(
              r => r.date.slice(3) == monthFilter && r.running_min < 240
            ).length
          )
        }))
        .filter(record =>
          monthFilter
            ? record.date == monthFilter
            : record.date.slice(3) == daysFilter
        );
    } else {
      return result.map((record, index) => ({
        ...record,
        key: index,
        running_min: record.running_min && normTime(record.running_min)
      }));
    }
  };

  const getDetail = (last_name, date) =>
    monthFilter && history.push(`/detail/${last_name}/${date}`);

  return (
    <div className="Table-wrapper">
      {!loading && (
        <div className="csv-area">
          <DownloadBtn result={renderResult()} />
        </div>
      )}

      <Table
        onRow={(record, index) => ({
          index,
          onClick: () =>
            monthFilter &&
            getDetail(record.last_name, monthFilter.replace("/", "_"))
        })}
        locale={{ emptyText: loading ? placeholder : "Нету результатов..." }}
        dataSource={renderResult()}
        columns={renderColumns()}
      />
    </div>
  );
};

export default TimeTable;
