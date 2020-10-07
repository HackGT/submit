import React from "react";
import { Form, Row, Col, message, Input, Button, Typography, Select } from "antd";
import { FORM_LAYOUT, FORM_RULES } from "../../../util/util";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { User } from "../../../types/types";
import axios from "axios";

const { Title, Text } = Typography;

interface Props {
  data: any;
  updateData: React.Dispatch<any>;
  nextStep: () => void;
  prevStep: () => void;
}

const ReviewForm: React.FC<Props> = (props) => {
  const onFinish = async (values: any) => {
    console.log("Form Success:", values);

    axios.post("/submission/create", { submission: props.data })
      .then((res) => {
        console.log(res.data);

        if (res.data.error) {
          message.error(res.data.message, 2);
        } else {
          // props.nextStep();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error("Please complete the required fields.", 2);
    console.log("Failed:", errorInfo);
  };

  let formInitialValue = props.data;

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
  ];

  return (
    <>
      <Title level={2}>Review Submission</Title>
      <Text>Please look over your submission details. You will not be able to change it after you submit.</Text>
      <Form
        name="review"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        autoComplete="off"
        initialValues={formInitialValue}
        style={{ marginTop: "10px" }}
      >
        <Form.List name="members">
          {(fields, { add, remove }) => (
            <div>
              {fields.map((field, index) => (
                <Row justify="center" key={field.key}>
                  <Col {...FORM_LAYOUT.full}>
                    <Form.Item
                      name={[field.name, "email"]}
                      fieldKey={[field.fieldKey, "email"]}
                      rules={[FORM_RULES.requiredRule, FORM_RULES.emailRule]}
                      label={"Member " + (index + 1)}
                    >
                      <Input disabled={true}/>
                    </Form.Item>
                  </Col>
                </Row>
              ))}
            </div>
          )}
        </Form.List>

        <Row justify="center">
          <Col {...FORM_LAYOUT.full}>
            <Form.Item
              name="prizes"
              rules={[FORM_RULES.requiredRule]}
              label="Prizes"
            >
              <Select disabled={true} mode="multiple" options={prizeOptions} showSearch optionFilterProp="label" />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center">
          <Col {...FORM_LAYOUT.full}>
            <Form.Item
              name="devpost"
              rules={[FORM_RULES.requiredRule, FORM_RULES.urlRule]}
              label="Devpost URL"
            >
              <Input disabled={true} />
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
              <Input disabled={true} />
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

export default ReviewForm;