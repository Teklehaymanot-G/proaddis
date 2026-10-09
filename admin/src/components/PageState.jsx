// src/components/PageState.jsx
import { Button, Result, Skeleton } from "antd";

// Shows a skeleton while loading, a retry screen on failure, else the page
const PageState = ({ loading, error, onRetry, children }) => {
  if (error) {
    return (
      <Result
        status="error"
        title="Could not load this page"
        subTitle={error}
        extra={
          <Button type="primary" onClick={onRetry}>
            Try again
          </Button>
        }
      />
    );
  }
  if (loading) return <Skeleton active paragraph={{ rows: 8 }} />;
  return children;
};

export default PageState;
