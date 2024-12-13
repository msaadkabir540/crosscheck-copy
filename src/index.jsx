import ReactDOM from 'react-dom/client';

import './index.scss';

import App from './app';
import reportWebVitals from './report-web-vitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// NOTE: If you want to start measuring performance in your app, pass a function
// NOTE: or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
