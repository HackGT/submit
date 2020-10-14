import React from "react";
import { Descriptions, Typography, Alert } from "antd";
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

  const [{ data, loading }] = useAxios("/submission/submission/" + submissionId);

  if (loading) {
    return <LoadingDisplay />;
  }

  if (data.error) {
    console.error(data.error);
    return <ErrorDisplay />;
  }

  const createMessage = () => {
    switch (data.submission.round) {
      case "FLAGGED":
      case "SUBMITTED":
        return <Alert
          message="Thank you for your submission to HackGT 7! Please check back later to see your submission status."
          type="info"
          showIcon
        />;
      case "ACCEPTED":
        return <Alert
          message={
            <Text>Congrats on moving to the next round! Here is the video link for you to join the judging call: <a href={data.submission.wherebyRoom.hostRoomUrl} target="_blank" rel="noopener noreferrer">Join Here</a></Text>}
          type="success"
          showIcon
        />;
      case "REJECTED":
        return <Alert
          message="After reviewing your submission in round 1, you will not be eligible for live judging. However, you can still win emerging prizes if you are an emerging team, so look out for the prizes at closing ceremonies!"
          type="info"
          showIcon
        />;
      default:
        return null;
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {createMessage()}
      <Title level={2} style={{ margin: "30px 0" }}>{data.submission.hackathon} Submission Details</Title>
      <Descriptions layout="vertical">
        <Descriptions.Item label={<Label name="Name" />}>{data.submission.name}</Descriptions.Item>
        <Descriptions.Item label={<Label name="Emails" />}>{data.submission.members.map((item: any) => item.email).join(', ')}</Descriptions.Item>
        <Descriptions.Item label={<Label name="Devpost" />}><a href={data.submission.devpost}>{data.submission.devpost}</a></Descriptions.Item>
        <Descriptions.Item label={<Label name="Selected Prizes" />}>{data.submission.prizes.join(', ')}</Descriptions.Item>
      </Descriptions>
    </div>
  )
}

export default SubmissionDetails;