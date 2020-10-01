import React from "react";
import { Button, Col, Form, message, Row, Select, Typography } from "antd";
import { FORM_LAYOUT, FORM_RULES } from "../../util/util";

const { Title, Text } = Typography;

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}

const PrizeInfoForm: React.FC<Props> = (props) => {
  const onFinish = async (values: any) => {
    console.log("Form Success:", values);

    const prizes = values.prizes;

    // TODO: Send query to server with prizes

    props.nextStep();
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error("Please complete the required fields.", 2);
    console.log("Failed:", errorInfo);
  };

  // TODO: Get prize options from server
  const prizeOptions = [
    {
      label: "General Hacker",
      value: 1
    },
    {
      label: "Emerging Hacker",
      value: 2
    },
    {
      label: "NCR",
      value: 3
    }
  ]

  return (
    <>
      <Title level={2}>Prize Info</Title>
      <Text>Please select the prizes you would like to be considered for.</Text>
      <Form
        name="prize"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        autoComplete="off"
        style={{ marginTop: "10px" }}
      >

        <Row justify="center">
          <Col {...FORM_LAYOUT.full}>
            <Form.Item
              name="prizes"
              rules={[FORM_RULES.requiredRule]}
              label="Prizes"
            >
              <Select placeholder="Select prizes" mode="multiple" options={prizeOptions} showSearch optionFilterProp="label" />
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

export default PrizeInfoForm;