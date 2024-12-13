import SplitPane from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';
import './style.css';

const SplitPaneComponent = (props) => {
  const { children } = props;

  return <SplitPane {...props}>{children}</SplitPane>;
};

export default SplitPaneComponent;
