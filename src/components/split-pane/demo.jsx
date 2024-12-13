import { useState } from 'react';

import SplitPane from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';

const Demo = () => {
  const [sizes, setSizes] = useState([100, 200, 'auto']);

  const layoutCSS = {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={{ height: '100px' }}>
      <p>Split used to drag and drop to modify panel size</p>
      <SplitPane sizes={sizes} onChange={(sizes) => setSizes(sizes)}>
        <div style={{ ...layoutCSS, background: '#ddd' }}>pane1</div>
        <div style={{ ...layoutCSS, background: '#d5d7d9' }}>pane2</div>
        <div style={{ ...layoutCSS, background: '#a1a5a9' }}>pane2</div>
      </SplitPane>
    </div>
  );
};

export default Demo;
