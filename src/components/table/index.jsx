import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Resizable } from 'react-resizable';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { useCaptureContext } from 'context/capture-context';

import 'react-resizable/css/styles.css';
import Tabs from 'components/tabs';
import DevtoolsLayout from 'components/devtools-layout';
import CollapsibleData from 'components/collapsible-data';

import { isErrorStatusCode } from 'utils/is-error-status-code';

import style from './table.module.scss';
import IconButtonContainer from './icon-button-container';

const ResizableHeaderCell = ({ column, onResize, width, isLastColumn, customBorderStyle, ...rest }) => {
  const handleResize = useCallback(
    (e, { size }) => {
      onResize(column.id, size.width);
    },
    [column.id, onResize],
  );

  const resizableComponent = isLastColumn ? null : (
    <Resizable
      width={width}
      height={0}
      handle={<div className={style.resizeHandle} />}
      onResize={handleResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th
        {...rest}
        className={style.padding_five}
        style={{ width, border: customBorderStyle ? '0.5px solid  #D6D6D6' : '' }}
      >
        {column.title}
      </th>
    </Resizable>
  );

  return isLastColumn ? (
    <th
      {...rest}
      className={`${style.table_head} ${style.padding_five}`}
      style={{ border: customBorderStyle ? '0.5px solid  #D6D6D6' : '' }}
    >
      {column.title}
    </th>
  ) : (
    resizableComponent
  );
};

const ResizableTable = ({ columns, data, customBorderStyle, onIconClick, checkId, isMobileView }) => {
  const { playedSecond } = useCaptureContext();

  const [highlightedRowIndex, setHighlightedRowIndex] = useState(-1);

  useEffect(() => {
    const indicesToHighlight = data?.reduce((d, data, index) => {
      if (Math.round(data.second) === Math.round(playedSecond)) {
        d.push(index);
      }

      return d;
    }, []);

    if (indicesToHighlight?.length > 0) {
      indicesToHighlight.forEach((indexToHighlight, index) => {
        setTimeout(() => {
          setHighlightedRowIndex(indexToHighlight);
        }, index * 100);
      });
    } else {
      setHighlightedRowIndex(-1);
    }
  }, [playedSecond, data]);

  const [openGeneralInfo, setOpenGeneralInfo] = useState({
    open: false,
    data: {},
  });
  const [activeGeneralTab, setActiveGeneralTab] = useState(0);
  const [isResizing, setIsResizing] = useState(false);
  const [columnWidths, setColumnWidths] = useState({});

  const handleResize = useCallback((columnId, width) => {
    const minWidth = -10;
    const maxWidth = 300;
    width = Math.max(minWidth, Math.min(width, maxWidth));
    setColumnWidths((prev) => ({ ...prev, [columnId]: width }));
    setIsResizing(true);
    setTimeout(() => {
      setIsResizing(false);
    }, 500);
  }, []);

  const generalPages = useMemo(() => {
    return [
      {
        id: 0,
        tabTitle: 'Headers',
        content: (
          <div>
            <CollapsibleData data={openGeneralInfo.data || {}} />
          </div>
        ),
      },
      openGeneralInfo?.data?.requestBody && {
        id: 1,
        tabTitle: 'Payload',
        data: openGeneralInfo?.data?.requestBody || {},
      },
      openGeneralInfo?.data?.response && {
        id: 2,
        tabTitle: 'Preview',
        data: openGeneralInfo?.data?.response || {},
      },
      openGeneralInfo?.data?.response && {
        id: 3,
        tabTitle: 'Response',
        data: openGeneralInfo?.data?.response || {},
      },
    ];
  }, [openGeneralInfo]);

  useEffect(() => {
    if (!openGeneralInfo.open) {
      return;
    }

    setActiveGeneralTab(0);
  }, [openGeneralInfo.data, openGeneralInfo.open]);

  const containerRef = useRef(null);
  const consoleRef = useRef([]);

  useEffect(() => {
    if (highlightedRowIndex !== -1 && consoleRef.current[highlightedRowIndex]) {
      const combinedHeight = consoleRef.current
        .slice(0, highlightedRowIndex)
        .reduce((acc, el) => acc + el.clientHeight, 0);

      containerRef.current.scrollTop = combinedHeight;
    }
  }, [highlightedRowIndex, data]);

  return (
    <>
      <PanelGroup autoSaveId="example" direction="horizontal" height="100%">
        <Panel id="left">
          <DevtoolsLayout ref={containerRef}>
            <div className={style.tableContainer}>
              <table className={style.resizableTable}>
                <thead>
                  <tr className={customBorderStyle && style.border_style}>
                    {onIconClick && <th className={`${style.padding_five} `}></th>}
                    {columns?.map((column, index) => (
                      <ResizableHeaderCell
                        customBorderStyle={customBorderStyle}
                        key={column?.id}
                        column={column}
                        onResize={handleResize}
                        width={columnWidths[column?.id] || 100}
                        isLastColumn={index === columns?.length - 1}
                      >
                        <span className={style.dataHeader}>{column?.title}</span>
                      </ResizableHeaderCell>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.map((row, rowIndex) => (
                    <tr
                      className={rowIndex === highlightedRowIndex && style.rowHoverClass}
                      key={row?.id}
                      // eslint-disable-next-line react/jsx-no-bind
                      ref={(el) => (consoleRef.current[rowIndex] = el)}
                    >
                      {onIconClick && (
                        <td style={{ border: customBorderStyle ? '0.5px solid  #D6D6D6' : '' }}>
                          <IconButtonContainer
                            onIconClick={onIconClick}
                            row={row}
                            rowIndex={rowIndex}
                            highlightedRowIndex={highlightedRowIndex}
                          />
                        </td>
                      )}
                      {columns?.map((column, colIndex) => (
                        <td
                          style={{ border: customBorderStyle ? '0.5px solid  #D6D6D6' : '' }}
                          key={column?.id}
                          // eslint-disable-next-line react/jsx-no-bind
                          onClick={() => !isResizing && setOpenGeneralInfo({ open: true, data: row.item })}
                        >
                          <Resizable
                            width={columnWidths[column?.id] || 70}
                            height={0}
                            handle={<div className={style.resizeHandle} />}
                            // eslint-disable-next-line react/jsx-no-bind
                            onResize={(e, { size }) => {
                              handleResize(column?.id, size?.width);
                            }}
                            draggableOpts={{ enableUserSelectHack: false }}
                            style={{
                              width: columnWidths[column?.id] || 100,
                              minWidth: columnWidths[column?.id] || 100,
                              overflow: colIndex === columns?.length - 1 ? 'hidden' : 'visible',
                            }}
                          >
                            <div
                              className={`${style.dataText} ${style.padding_five}`}
                              style={{
                                color: isErrorStatusCode(row?.status) ? 'red' : '',
                              }}
                            >
                              {row[column?.id]}
                            </div>
                          </Resizable>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DevtoolsLayout>
        </Panel>
        <PanelResizeHandle />
        {openGeneralInfo.open && !isResizing && (
          <Panel
            id="right"
            minSize={isMobileView ? 100 : 30}
            maxSize={isMobileView ? 100 : 80}
            className={style.right_panel}
          >
            <div className={style.info_parent_container}>
              <div className={style.generalInfo}>
                <div className={style.tabsSection}>
                  <Tabs
                    cross={true}
                    backBg={'var(--bg-b)'}
                    customActive={style.customActive}
                    setOpenGeneralInfo={setOpenGeneralInfo}
                    setActiveGeneralTab={setActiveGeneralTab}
                    customClass={style.customTabs}
                    pages={generalPages}
                    activeTab={activeGeneralTab}
                    setActiveTab={setActiveGeneralTab}
                    searchMode={false}
                    height={'100%'}
                    checkId={checkId}
                    curlURL={openGeneralInfo?.data}
                  />
                </div>
              </div>
            </div>
          </Panel>
        )}
      </PanelGroup>
    </>
  );
};

export default ResizableTable;
