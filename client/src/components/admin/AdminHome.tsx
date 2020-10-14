import React, { useState } from "react";
import { Card, ConfigProvider, Empty, List, Typography, Tag, Button } from "antd";
import useAxios from "axios-hooks";
import LoadingDisplay from "../../util/LoadingDisplay";
import ErrorDisplay from "../../util/ErrorDisplay";
import SubmissionEditModal from "./SubmissionEditModal";

const { Title, Text } = Typography;

const AdminHome: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInitialValues, setModalInitialValues] = useState<any>(null);
  const [{ data, loading }, refetch] = useAxios("/submission/all", { useCache: false });

  if (loading) {
    return <LoadingDisplay />;
  }

  if (data.error) {
    console.error(data.error);
    return <ErrorDisplay />;
  }

  const createStatus = (round: string) => {
    switch (round) {
      case "FLAGGED":
        return <Tag color="red">Flagged</Tag>;
      case "SUBMITTED":
        return <Tag>Submitted</Tag>;
      case "ACCEPTED":
        return <Tag color="green">Accepted</Tag>;
      case "REJECTED":
        return <Tag color="orange">Rejected</Tag>;
      default:
        return null;
    }
  }

  const openModal = (submissionData: any) => {
    setModalVisible(true);
    setModalInitialValues(submissionData);
  }

  const closeModal = () => {
    setModalVisible(false);
    setModalInitialValues(null);
    refetch();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Title level={2}>All Submissions</Title>
      <ConfigProvider
        renderEmpty={() => (
          <Empty description="No Submissions" />
        )}
      >
        <List
          grid={{ gutter: 32, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 }}
          dataSource={data}
          renderItem={(submission: any) => (
            <List.Item>
              <Card
                title={submission.name}
                extra={<Button onClick={() => openModal(submission)}>Edit</Button>}
              >
                <div style={{ marginBottom: "10px" }}>
                  {createStatus(submission.round)}
                </div>
                <Text style={{ display: "block" }}>Members: {submission.members.map((item: any) => item.name).join(', ')}</Text>
                <Text style={{ display: "block" }}>Devpost: {<a href={submission.devpost} target="_blank" rel="noopener noreferrer">Here</a>}</Text>
                <Text style={{ display: "block" }}>Prizes: {submission.prizes.join(', ')}</Text>
              </Card>
            </List.Item>
          )}
        />
      </ConfigProvider>
      <SubmissionEditModal visible={modalVisible} initialValues={modalInitialValues} closeModal={closeModal} />
    </div>
  )
}

export default AdminHome;