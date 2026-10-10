// src/components/DataTable.jsx
// An Ant Design Table on tablets and desktops; on phones the same rows are
// shown as stacked cards, so nothing has to be scrolled sideways and the
// action buttons are always visible.
//
// Takes the usual Table props. Columns may add `mobile`:
//   "media"  – small image / icon shown beside the card title
//   "hidden" – left out on phones (e.g. a row number)
// The first column without a flag becomes the card title; the column titled
// "Actions" becomes the button row at the bottom of the card.
import { useState } from "react";
import { Empty, Grid, Pagination, Spin, Table } from "antd";

const cell = (column, record, index) => {
  const value = column.dataIndex === undefined ? undefined : record[column.dataIndex];
  return column.render ? column.render(value, record, index) : value;
};

const keyOf = (rowKey, record, index) =>
  typeof rowKey === "function" ? rowKey(record) : record[rowKey] ?? index;

const CardList = ({ columns, dataSource, rowKey, loading, pagination, locale, onRow }) => {
  const [page, setPage] = useState(1);

  const visibleColumns = columns.filter((column) => column.mobile !== "hidden");
  const actions = visibleColumns.find((column) => column.title === "Actions");
  const media = visibleColumns.find((column) => column.mobile === "media");
  const rest = visibleColumns.filter((column) => column !== actions && column !== media);
  const [title, ...details] = rest;

  const pageSize = pagination ? pagination.pageSize || 10 : dataSource.length;
  const lastPage = Math.max(1, Math.ceil(dataSource.length / pageSize));
  const current = Math.min(page, lastPage);
  const rows = pagination
    ? dataSource.slice((current - 1) * pageSize, current * pageSize)
    : dataSource;

  return (
    <Spin spinning={Boolean(loading)}>
      {dataSource.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={locale?.emptyText || "No data"}
          style={{ padding: "24px 16px" }}
        />
      ) : (
        <ul className="data-cards">
          {rows.map((record, index) => {
            const rowProps = onRow?.(record) || {};
            return (
              <li
                key={keyOf(rowKey, record, index)}
                className={`data-card ${rowProps.onClick ? "data-card--clickable" : ""}`}
                onClick={rowProps.onClick}
              >
                <div className="data-card__head">
                  {media && <div className="data-card__media">{cell(media, record, index)}</div>}
                  <div className="data-card__title">{title && cell(title, record, index)}</div>
                </div>

                {details.length > 0 && (
                  <dl className="data-card__details">
                    {details.map((column) => (
                      <div key={column.title} className="data-card__detail">
                        <dt>{column.title}</dt>
                        <dd>{cell(column, record, index)}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {actions && (
                  // Buttons act on the card, not as a click on the whole card
                  <div className="data-card__actions" onClick={(event) => event.stopPropagation()}>
                    {cell(actions, record, index)}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {pagination && dataSource.length > pageSize && (
        <div className="data-cards__pagination">
          <Pagination
            simple
            current={current}
            pageSize={pageSize}
            total={dataSource.length}
            onChange={setPage}
          />
        </div>
      )}
    </Spin>
  );
};

const DataTable = (props) => {
  const screens = Grid.useBreakpoint();
  // `md` is undefined until the first measurement: start with the table
  const isPhone = screens.md === false;

  if (isPhone) return <CardList {...props} />;
  return <Table {...props} />;
};

export default DataTable;
