import React from "react";
import { Button, Result } from "antd";

const ErrorDisplay: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Result
        status="error"
        title="Something Went Wrong :("
        subTitle="Please contact HackGT Staff if you see this message again"
        extra={<Button type="primary" onClick={() => window.location.reload()}>Refresh Page</Button>}
      />
    </div>
  );
};

export default ErrorDisplay;
