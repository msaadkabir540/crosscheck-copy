import { Suspense, lazy, memo } from 'react';

const ObjectViewer = lazy(() => import('components/object-viewer'));
import style from './tabs.module.scss';
import Loader from '../loader';

const ObjectViewerContent = memo(({ component, isMobileView }) => {
  return (
    <div
      className={style.tab_content_style}
      style={{ height: isMobileView ? '50vh' : '', overflowY: isMobileView ? 'scroll' : '' }}
    >
      <Suspense fallback={<Loader className={style.loader_style} />}>
        <ObjectViewer data={component?.data} />
      </Suspense>
    </div>
  );
});

ObjectViewerContent.displayName = 'ObjectViewerContent';

export default ObjectViewerContent;
