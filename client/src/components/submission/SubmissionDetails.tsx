import React from "react";
import { Descriptions, Typography } from "antd";
import { useParams } from "react-router-dom";
import useAxios from "axios-hooks";
import LoadingDisplay from "../../util/LoadingDisplay";
import ErrorDisplay from "../../util/ErrorDisplay";

const { Title, Text } = Typography;

const Label: React.FC<{ name: string }> = ({ name }) => {
  return <Text underline><strong>{name}</strong></Text>;
}

const SubmissionDetails: React.FC = (props) => {
  const { submissionId } = useParams();

  const [{ data, loading, error }] = useAxios("/submission/submission/" + submissionId);

  if (loading) {
    return <LoadingDisplay />;
  }

  if (data.error || error) {
    return <ErrorDisplay error={data.message} />;
  }

  // <List
  //   dataSource={props.submissionData.members}
  //   renderItem={(member: any) => (
  //     <List.Item>
  //       <Text>
  //         <UserOutlined style={{ marginRight: "5px" }} />
  //         {member.name}
  //       </Text>
  //     </List.Item>
  //   )}
  // />

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Title level={2} style={{marginBottom: "30px"}}>{data.submission.hackathon} Submission Details</Title>
      <Descriptions layout="vertical">
        <Descriptions.Item label={<Label name="Name" />}>{data.submission.name}</Descriptions.Item>
        <Descriptions.Item label={<Label name="Emails" />}>{data.submission.members.map((item: any) => item.email).join(', ')}</Descriptions.Item>
        <Descriptions.Item label={<Label name="Devpost" />}><a href={data.submission.devpost}>{data.submission.devpost}</a></Descriptions.Item>
        <Descriptions.Item label={<Label name="Selected Categories" />}>{data.submission.categories.join(', ')}</Descriptions.Item>
      </Descriptions>
    </div>
  )
}

export default SubmissionDetails;