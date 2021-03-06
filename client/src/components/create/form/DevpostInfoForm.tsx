import React from "react";
import { Alert, Button, Col, Form, Input, message, Row, Typography } from "antd";
import { FORM_LAYOUT, FORM_RULES } from "../../../util/util";
import axios from "axios";

const { Title, Text } = Typography;

interface Props {
  data: any;
  updateData: React.Dispatch<any>;
  nextStep: () => void;
  prevStep: () => void;
}

const DevpostInfoForm: React.FC<Props> = (props) => {
  const onFinish = async (values: any) => {
    const hide = message.loading("Loading...", 0);

    axios.post("/submission/devpost-validation", values)
      .then((res) => {
        hide();

        if (res.data.error) {
          message.error(res.data.message, 2);
        } else {
          props.updateData(values);
          props.nextStep();
        }
      })
      .catch((err) => {
        hide();
        message.error("Error: Please ask for help", 2);
        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error("Please complete the required fields.", 2);
  };

  let formInitialValue = props.data;

  return (
    <>
      <Alert type="error" style={{ marginBottom: "15px" }} message={<strong>All information you submit in this form is FINAL, including registering for sponsor challenges. There will be no changes made after you submit your project.</strong>} />
      <Title level={2}>Devpost Info</Title>
      <Text>Please create a submission on our <a href="https://hackgt2020.devpost.com" target="_blank">Devpost</a> and list the URL for your submission and project name below. Make sure to include a 2-minute project demo with your Devpost submission.</Text>
      <Form
        name="devpost"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        autoComplete="off"
        initialValues={formInitialValue}
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
              label="Project Name (should match Devpost submission name)"
            >
              <Input placeholder="Alexa Assistant" />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center">
          <Col {...FORM_LAYOUT.full}>
            <Form.Item>
              <Button style={{ marginRight: "10px" }} onClick={() => props.prevStep()}>Back</Button>
              <Button type="primary" htmlType="submit">Next</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );


}

export default DevpostInfoForm;