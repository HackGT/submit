import React from "react";
import { Spin } from "antd";

const LoadingDisplay: React.FC = () => {
  return <Spin style={{ position: "absolute", top: "48%", left: "48%" }} />;
}

export default LoadingDisplay;