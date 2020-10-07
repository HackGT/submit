import React from "react";
import { Descriptions, List, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons/lib";

const { Title, Text } = Typography;

interface Props {
  submissionData: any;
}

const Label: React.FC<{ name: string }> = ({ name }) => {
  return <Text underline><strong>{name}</strong></Text>;
}

const SubmissionDetails: React.FC<Props> = (props) => {
  const data = props.submissionData;

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
    <>
      <Title level={2}>Your Submission Details</Title>
      <Descriptions layout="vertical">
        <Descriptions.Item label={<Label name="Name" />}>{data.name}</Descriptions.Item>
        <Descriptions.Item label={<Label name="Emails" />}>{data.members.map((item: any) => item.email).join(', ')}</Descriptions.Item>


        <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
        <Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
        <Descriptions.Item label="Remark">empty</Descriptions.Item>
        <Descriptions.Item label="Address">
          No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
        </Descriptions.Item>
      </Descriptions>,
    </>
  )
}

export default SubmissionDetails;