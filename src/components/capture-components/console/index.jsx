import { useCallback, useEffect, useRef, useState } from 'react';

import { useCaptureContext } from 'context/capture-context';

import DevtoolsLayout from 'components/devtools-layout';

import NoDataIcon from 'assets/no-data-icon';

import style from './console.module.scss';
import ConsoleItemRenderer from './data-render-container';

const ConsoleItem = ({ data, onClickChange }) => {
  const { playedSecond } = useCaptureContext();
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showFullTextArray, setShowFullTextArray] = useState(Array(data?.length)?.fill(false));

  const containerRef = useRef(null);
  const consoleRef = useRef([]);

  useEffect(() => {
    const indicesToHighlight = data?.reduce((acc, d, index) => {
      if (Math.round(d.second) === Math.round(playedSecond)) {
        acc.push(index);
      }

      return acc;
    }, []);

    if (indicesToHighlight?.length > 0) {
      indicesToHighlight?.forEach((indexToHighlight, index) => {
        setTimeout(() => {
          setHighlightedIndex(indexToHighlight);
        }, index * 100);
      });
    } else {
      setHighlightedIndex(-1);
    }
  }, [playedSecond, data]);

  const [showIndex, setShowIndex] = useState(null);

  const toggleShow = useCallback(
    (index) => {
      setShowIndex(showIndex === index ? null : index);
    },
    [showIndex],
  );

  const renderDataValue = useCallback((value) => {
    if (value === null || value === undefined) {
      return 'undefined';
    } else if (typeof value === 'string') {
      return value.replace(/^"(.*)"$/, '$1');
    } else if (typeof value === 'object') {
      return JSON.stringify(value);
    } else {
      return value;
    }
  }, []);

  const handleShowFullText = useCallback(
    (index) => {
      const newShowFullTextArray = [...showFullTextArray];
      newShowFullTextArray[index] = !showFullTextArray[index];
      setShowFullTextArray(newShowFullTextArray);
    },
    [showFullTextArray],
  );

  useEffect(() => {
    if (highlightedIndex !== -1 && consoleRef.current[highlightedIndex]) {
      const combinedHeight = consoleRef.current
        .slice(0, highlightedIndex)
        .reduce((acc, el) => acc + el.clientHeight, 0);

      containerRef.current.scrollTop = combinedHeight;
    }
  }, [highlightedIndex, data]);

  return (
    <DevtoolsLayout ref={containerRef}>
      {data &&
        data?.map((item, index) => (
          <div key={item?.createdAt} ref={(el) => (consoleRef.current[index] = el)}>
            <ConsoleItemRenderer
              onClickChange={onClickChange}
              item={item}
              index={index}
              highlightedIndex={highlightedIndex}
              showFullTextArray={showFullTextArray}
              showIndex={showIndex}
              handleShowFullText={handleShowFullText}
              renderDataValue={renderDataValue}
              toggleShow={toggleShow}
            />
          </div>
        ))}
      {!data && (
        <div className={style.no_data_icon_container}>
          <NoDataIcon />
        </div>
      )}
    </DevtoolsLayout>
  );
};

export default ConsoleItem;
