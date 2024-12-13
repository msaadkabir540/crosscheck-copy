import { useState, useEffect } from 'react';

import { Responsive, WidthProvider } from 'react-grid-layout';

import Button from 'components/button';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import style from './styles.module.scss';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Index = ({
  rowHeight = 30,
  cols = { lg: 12, md: 12, sm: 2, xs: 1, xxs: 1 },
  breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  containerPadding = [0, 0],
  compactType = 'vertical',
  className,
  cardClassName,
  gridClassName,
  layout = [],
  isAllowEditing = false,
  isAddNewWidget = false,
  onLayoutChange,
  onAddNewWidget = () => {},
  Component = () => {
    return <></>;
  },
  componentProps = {},
}) => {
  const [layoutStructure, setLayoutStructure] = useState({ lg: [] });
  const [allowResizing, setAllowResizing] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setAllowResizing(isAllowEditing);
  }, [isAllowEditing]);

  useEffect(() => {
    const newLayout = {
      lg: layout.map((layoutItem) => ({
        ...layoutItem.dataGrid,
        x: layoutItem.dataGrid.x,
        y: layoutItem.dataGrid.y,
        w: layoutItem.dataGrid.w,
        h: layoutItem.dataGrid.h,
        i: layoutItem.dataGrid.i,
      })),
    };
    setLayoutStructure({ ...newLayout });
  }, [layout]);

  const onLayoutChangeHandler = (layout, layouts) => {
    setLayoutStructure({ ...layouts });
    onLayoutChange && onLayoutChange(layout);
  };

  const onAddNewWidgetHandler = () => {
    onAddNewWidget && onAddNewWidget(true);
  };

  const generateDOM = () => {
    return layout.map((item) => {
      return (
        <div key={item?.dataGrid?.i} className={cardClassName}>
          <Component {...{ ...componentProps, item }} />
          {}
        </div>
      );
    });
  };

  return (
    <div className={style.main}>
      <div className={style.editDiv}>
        {isAddNewWidget && <Button handleClick={onAddNewWidgetHandler} text="Add New Widget" btnClass={style.btn} />}
      </div>
      <div className={`${style.grid} ${gridClassName}`}>
        <ResponsiveReactGridLayout
          className={`layout ${className}`}
          rowHeight={rowHeight}
          cols={cols}
          breakpoints={breakpoints}
          containerPadding={containerPadding}
          layouts={layoutStructure}
          measureBeforeMount={false}
          useCSSTransforms={mounted}
          compactType={compactType}
          preventCollision={!compactType}
          onLayoutChange={onLayoutChangeHandler}
          isBounded={allowResizing}
          isDroppable={allowResizing}
          isDraggable={allowResizing}
          isResizable={allowResizing}
          resizeHandles={['se']}
        >
          {generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    </div>
  );
};

export default Index;
