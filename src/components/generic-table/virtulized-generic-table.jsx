import React, { useState, useEffect, useRef } from 'react';

import _ from 'lodash';
import { useVirtualizer } from '@tanstack/react-virtual';

import ascendingIcon from 'assets/arrow-up.svg';
import noFound from 'assets/no-found.svg';

import TableCell from './table-cell';

const GenericTable = ({
  columns = [],
  filters,
  dataSource,
  loading = false,
  height,
  width,
  noFoundHeight,
  classes,
  paddingTop,
  onClickHeader = () => {},

  overflowX = 'auto',

  id,
}) => {
  const [rows, setRows] = useState([]);
  const genericTableRef = useRef();
  const addWidth = useRef(null);

  const virtualRef = useRef();

  useEffect(() => {
    setRows([...dataSource]);
  }, [dataSource]);

  const rowVirtualizer = useVirtualizer({
    count: dataSource.length,
    getScrollElement: () => virtualRef.current,
    estimateSize: () => 45,
    overscan: 20,
  });

  return (
    <>
      {rows.length ? (
        <div
          style={{
            height,
            overflowY: 'auto',
            overflowX,
            paddingTop: paddingTop,
            width,
          }}
          id={id}
          ref={virtualRef}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            <div
              style={{
                width: `${genericTableRef?.current?.offsetWidth}px`,
              }}
              className={loading ? classes?.tableOnLoading : classes?.tableOffLoading}
            ></div>

            <table
              ref={genericTableRef}
              className={classes?.table}
              style={{
                tableLayout: 'fixed',
                position: 'relative',
              }}
            >
              <thead className={classes?.thead}>
                <tr ref={addWidth}>
                  {columns?.map(({ name, key, hidden, customHeaderClass, widthAndHeight }, i) => {
                    return (
                      !hidden && (
                        <th
                          key={key || i}
                          className={`${classes?.th} ${customHeaderClass}`}
                          style={{
                            width: `${widthAndHeight?.width} !important`,
                            padding: '0px 10px',
                          }}
                          onClick={() =>
                            !_.isEmpty(filters) &&
                            key !== 'actions' &&
                            onClickHeader({
                              sortBy: key,
                              sort: filters?.sortBy === key ? (filters?.sort === 'asc' ? 'desc' : 'asc') : 'asc',
                            })
                          }
                        >
                          <span
                            className={classes?.th}
                            style={{
                              cursor: key !== 'actions' && 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '10px',
                              position: 'relative',
                            }}
                          >
                            {name}
                            {filters?.sortBy === key &&
                              (filters?.sort === 'asc' ? (
                                <img
                                  src={ascendingIcon}
                                  style={{
                                    height: '8px',
                                    position: 'absolute',
                                    right: '-10px',
                                  }}
                                />
                              ) : (
                                <img
                                  src={ascendingIcon}
                                  style={{
                                    transform: 'rotate(180deg)',
                                    height: '8px',
                                    position: 'absolute',
                                    right: '-10px',
                                  }}
                                />
                              ))}
                          </span>
                        </th>
                      )
                    );
                  })}
                </tr>
              </thead>

              <tbody className={classes?.tableBody}>
                {rowVirtualizer.getVirtualItems().map((virtualItem) => (
                  <tr
                    key={virtualItem.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start + 20}px)`,
                    }}
                  >
                    {columns.map(
                      (col, index2) =>
                        !col.hidden && (
                          <TableCell
                            isOpen={false}
                            index={index2}
                            id={rows?.[virtualItem.index]?._id}
                            key={col?.id}
                            column={col}
                            row={{ ...rows[virtualItem?.index], index: virtualItem?.index }}
                          />
                        ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: noFoundHeight ? noFoundHeight : '100%',
          }}
        >
          <img src={noFound} alt="" />
        </div>
      )}
    </>
  );
};

export default React.memo(GenericTable);
