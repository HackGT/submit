import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
    <Result
      status="404"
      title="404 Error"
      subTitle="Hey buddy! Seems like the page you're looking for doesn't exist."
      extra={<Link to="/"><Button type="primary">Return Home</Button></Link>}
    />
  </div>
);

export default NotFound;