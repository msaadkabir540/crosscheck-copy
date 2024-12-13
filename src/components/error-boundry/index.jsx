import React from 'react';

import ErrorUI from './error-ui/error';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    // NOTE: Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // NOTE: Update state so the next render will show the fallback UI

    return { hasError: true };
  }

  componentDidCatch(error) {
    // NOTE: You can use your own error logging service here
    console.error(error);
  }

  render() {
    // NOTE: Check if the error is thrown
    if (this.state.hasError) {
      // NOTE: You can render any custom fallback UI
      return <ErrorUI />;
    }

    // NOTE: Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
