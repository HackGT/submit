import React from "react";
import { ConfigProvider, List, Empty, Card, Typography } from "antd";
import useAxios from "axios-hooks";
import LoadingDisplay from "../../util/LoadingDisplay";
import ErrorDisplay from "../../util/ErrorDisplay";
import { Link } from "react-router-dom";

const { Meta } = Card;
const { Title } = Typography;

const Dashboard: React.FC = () => {

  const [{ data, loading, error }] = useAxios("/submission/dashboard");

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={data.message} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Title level={2}>Your Submissions</Title>
      <ConfigProvider
        renderEmpty={() => (
          <Empty description="You have no past Submissions" />
        )}
      >
        <List
          grid={{ gutter: 32, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 }}
          dataSource={data}
          renderItem={(submission: any) => (
            <List.Item>
              <Link to={"/submission/" + submission._id}>
                <Card title={submission.hackathon} cover={<img alt="" src="/public/hackgt7.jpg" />} hoverable>
                  <Meta
                    title={submission.name}
                    description={submission.members.map((item: any) => item.name).join(', ')}
                  />
                </Card>
              </Link>
            </List.Item>
          )}
        />
      </ConfigProvider>
    </div>
  )
}

export default Dashboard;
