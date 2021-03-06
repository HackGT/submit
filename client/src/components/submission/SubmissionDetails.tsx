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
            <Text>Congrats on moving to the next round! If the conference below isn't working, the link to join the judging call can be found <a href={data.submission.meetingUrl} target="_blank" rel="noopener noreferrer"><b>here</b></a>. You are in expo number {data.submission.expo || 1}.</Text>}
          type="success"
          showIcon
        />;
      case "REJECTED":
        return <Alert
          message="Thank you for your submission to HackGT 7! After reviewing your submission, we will not be moving it forward to round two of judging as it does not meet our live judging criteria. We hope you enjoyed the event and join us for future HackGT events! We invite you to stay for live judging and closing ceremonies."
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

      <Title level={2} style={{ textAlign: "center", marginTop: "25px" }}>
        Judging Call
      </Title>
      <iframe
        src={data.submission.meetingUrl}
        allow="camera; microphone; fullscreen; speaker"
        width="90%"
        style={{ height: "75vh", margin: "15px auto" }}>
      </iframe>
    </div>
  )
}

export default SubmissionDetails;