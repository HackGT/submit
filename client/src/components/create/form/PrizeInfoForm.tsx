import React from "react";
import { Button, Col, Form, message, Row, Select, Typography } from "antd";
import { FORM_LAYOUT, FORM_RULES } from "../../../util/util";
import axios from "axios";

const { Title, Text } = Typography;

interface Props {
  data: any;
  updateData: React.Dispatch<any>;
  nextStep: () => void;
  prevStep: () => void;
}

const PrizeInfoForm: React.FC<Props> = (props) => {
  const onFinish = async (values: any) => {
    const hide = message.loading("Loading...", 0);

    axios.post("/submission/prize-validation", values)
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

  const prizeOptions = props.data.eligiblePrizes.map((prize: string) => {
    return {
      label: prize,
      value: prize
    }
  })

  let formInitialValue = props.data;

  return (
    <>
      <Title level={2}>Prize Info</Title>
      <Text>Please select the prizes you would like to be considered for. Based on your team members, these are the only prizes you eligible to choose from. If you believe something is wrong, please ask a question at help desk.</Text>
      <Form
        name="prize"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        autoComplete="off"
        style={{ marginTop: "10px" }}
        initialValues={formInitialValue}
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