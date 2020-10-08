import React from "react";
import { Form, Row, Col, message, Input, Button, Typography } from "antd";
import { FORM_LAYOUT, FORM_RULES } from "../../../util/util";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { User } from "../../../types/types";
import axios from "axios";

const { Title, Text } = Typography;

interface Props {
  data: any;
  updateData: React.Dispatch<any>;
  user: User;
  nextStep: () => void;
}

const TeamInfoForm: React.FC<Props> = (props) => {
  const onFinish = async (values: any) => {
    console.log("Form Success:", values);

    axios.post("/submission/team-validation", values)
      .then((res) => {
        console.log(res.data);

        if (res.data.error) {
          message.error(res.data.message, 2);
        } else {
          props.updateData({ ...values, eligiblePrizes: res.data.eligiblePrizes });
          props.nextStep();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error("Please complete the required fields.", 2);
  };

  let formInitialValue = {};

  if (props.data.members) {
    formInitialValue = props.data;
  } else {
    formInitialValue = {
      members: [{
        email: props.user.email
      }]
    };
  }

  return (
    <>
      <Title level={2}>Team Info</Title>
      <Text>List the emails of all your team members. Please make sure the emails used are the ones that they were accepted for.</Text>
      <Form
        name="team"
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
                      <Input
                        placeholder="hello@gmail.com"
                        disabled={index === 0}
                        suffix={fields.length > 1 && index !== 0
                          ? <Button
                            type="text"
                            size="small"
                            style={{margin: 0}}
                            icon={<DeleteOutlined />}
                            onClick={() => remove(field.name)}
                            />
                          : undefined}
                        defaultValue=""
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ))}
              {/* Max team size is 4 */}
              {fields.length < 4 ? (
                <Row justify="center">
                  <Col {...FORM_LAYOUT.full}>
                    <Form.Item>
                      <Button type="dashed" onClick={add} block>
                        <PlusOutlined />
                        {" Add Member"}
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              ) : null }
            </div>
          )}
        </Form.List>

        <Row justify="center">
          <Col {...FORM_LAYOUT.full}>
            <Form.Item>
              <Button type="primary" htmlType="submit">Next</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default TeamInfoForm;