import React from "react";
import { Button, Col, Form, Input, message, Row, Typography } from "antd";
import { FORM_LAYOUT, FORM_RULES } from "../../util/util";

const { Title, Text } = Typography;

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}

const DevpostInfoForm: React.FC<Props> = (props) => {
  const onFinish = async (values: any) => {
    console.log("Form Success:", values);

    const devpost = values.devpost;
    const name = values.name;

    // TODO: Send query to server with devpost link

  };

  const onFinishFailed = (errorInfo: any) => {
    message.error("Please complete the required fields.", 2);
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Title level={2}>Devpost Info</Title>
      <Text>Please create a submission on devpost.com, and list the url for your submission and team name below.</Text>
      <Form
        name="devpost"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        autoComplete="off"
        style={{ marginTop: "10px" }}
      >

        <Row justify="center">
          <Col {...FORM_LAYOUT.full}>
            <Form.Item
              name="devpost"
              rules={[FORM_RULES.requiredRule, FORM_RULES.urlRule]}
              label="Devpost URL"
            >
              <Input placeholder="https://devpost.com/software/dyne-cnild7" />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center">
          <Col {...FORM_LAYOUT.full}>
            <Form.Item
              name="name"
              rules={[FORM_RULES.requiredRule]}
              label="Team Name"
            >
              <Input placeholder="Alexa Assistant" />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center">
          <Col {...FORM_LAYOUT.full}>
            <Form.Item>
              <Button style={{ marginRight: "10px" }} onClick={() => props.prevStep()}>Back</Button>
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );


}

export default DevpostInfoForm;