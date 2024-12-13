import { useCallback, useEffect, useRef, useState } from 'react';

import { useCaptureContext } from 'context/capture-context';

import ActionsText from 'components/capture-components/actions-text';
import Icon from 'components/icon/themed-icon';
import DevtoolsLayout from 'components/devtools-layout';

import style from './action.module.scss';

const Index = ({ actions }) => {
  const { playedSecond, setClickedPlayedSecond } = useCaptureContext();
  const [currentTime, setCurrentTime] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef(null);
  const actionRefs = useRef([]);

  useEffect(() => {
    setClickedPlayedSecond(currentTime);
  }, [currentTime, setClickedPlayedSecond]);

  useEffect(() => {
    const indicesToHighlight = actions?.reduce((acc, action, index) => {
      if (Math.round(action.second) === Math.round(playedSecond)) {
        acc.push(index);
      }

      return acc;
    }, []);

    if (indicesToHighlight?.length > 0) {
      indicesToHighlight.forEach((indexToHighlight, index) => {
        setTimeout(() => {
          setHighlightedIndex(indexToHighlight);
        }, index * 100);
      });
    } else {
      setHighlightedIndex(-1);
    }
  }, [playedSecond, actions]);

  useEffect(() => {
    if (highlightedIndex !== -1 && actionRefs.current[highlightedIndex]) {
      const combinedHeight = actionRefs.current
        .slice(0, highlightedIndex)
        .reduce((acc, el) => acc + el.clientHeight, 0);

      containerRef.current.scrollTop = combinedHeight;
    }
  }, [highlightedIndex, actions]);

  const handleCurrentTime = useCallback((e) => {
    setCurrentTime(e);
  }, []);

  return (
    <DevtoolsLayout ref={containerRef}>
      <div>
        {actions && actions?.length ? (
          <div id="box" className={style.action_text_container}>
            {actions?.map((x, index) => (
              <div key={x?.second} ref={(el) => (actionRefs.current[index] = el)}>
                <ActionsText data={x} onClickChange={handleCurrentTime} isHighlighted={index === highlightedIndex} />
              </div>
            ))}
          </div>
        ) : (
          <div className={style.icon_container}>
            <Icon name={'NoDataIcon'} />
          </div>
        )}
      </div>
    </DevtoolsLayout>
  );
};

export default Index;
