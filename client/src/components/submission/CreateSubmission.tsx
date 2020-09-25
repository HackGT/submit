import React, { useState } from "react";
import { Steps } from "antd";
import TeamInfoForm from "./TeamInfoForm";
import PrizeInfoForm from "./PrizeInfoForm";
import DevpostInfoForm from "./DevpostInfoForm";
import { User } from "../../types/types";

const { Step } = Steps;

interface Props {
  user: User;
}

const CreateSubmission: React.FC<Props> = (props) => {
  const [current, setCurrent] = useState(0);

  const onChange = (newCurrent: number) => {
    setCurrent(newCurrent);
  }

  const nextStep = () => {
    if (current === 0 || current === 1) {
      setCurrent(current + 1);
    }
  }

  const prevStep = () => {
    if (current === 1 || current === 2) {
      setCurrent(current - 1);
    }
  }

  const renderForm = (current: number) => {
    switch (current) {
      case 0:
        return <TeamInfoForm user={props.user} nextStep={nextStep} />
      case 1:
        return <PrizeInfoForm />
      case 2:
        return <DevpostInfoForm />
    }
  }

  return (
    <>
      {renderForm(current)}
      <Steps current={current} onChange={onChange}>
        <Step key={0} title="Team Info" />
        <Step key={1} title="Prize Info" />
        <Step key={2} title="Devpost Info" />
      </Steps>
    </>
  )
}

export default CreateSubmission;
