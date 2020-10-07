import React from "react";
import { Button, Result } from "antd";

interface Props {
  error: string;
}

const ErrorDisplay: React.FC<Props> = (props) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Result
        status="error"
        title="Something Went Wrong :("
        subTitle={props.error}
        extra={<Button type="primary" onClick={() => window.location.reload()}>Refresh Page</Button>}
      />
    </div>
  );
};

export default ErrorDisplay;
