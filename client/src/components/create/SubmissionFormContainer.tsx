import React, { useState } from "react";
import {Steps, Typography} from "antd";
import TeamInfoForm from "./form/TeamInfoForm";
import PrizeInfoForm from "./form/PrizeInfoForm";
import DevpostInfoForm from "./form/DevpostInfoForm";
import { User } from "../../types/types";
import ResultForm from "./form/ResultForm";
import ReviewForm from "./form/ReviewForm";
import axios from "axios";

const { Title } = Typography;
const { Step } = Steps;

interface Props {
  user: User;
}

const SubmissionFormContainer: React.FC<Props> = (props) => {
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState<any>({});

  const [submissionsOpen, setSubmissionsOpen] = useState<any>(false);
  axios.get("/config/submissionStatus").then(result => {
    console.log(result.data.submissionsOpen);
    if (result.data.submissionsOpen === true) {
      setSubmissionsOpen(true);
    }
  });

  const nextStep = () => {
    if ([0, 1, 2, 3].includes(current)) {
      setCurrent(current + 1);
    }
  }

  const prevStep = () => {
    if ([1, 2, 3].includes(current)) {
      setCurrent(current - 1);
    }
  }

  // Ensures that all the data isn't overwritten, just the changed portions
  const updateData = (updatedData: any) => {
    setData({
      ...data,
      ...updatedData
    });
  }

  const renderComponent = (current: number) => {
    switch (current) {
      case 0:
        return <TeamInfoForm updateData={updateData} data={data} user={props.user} nextStep={nextStep} />
      case 1:
        return <PrizeInfoForm updateData={updateData} data={data} nextStep={nextStep} prevStep={prevStep} />
      case 2:
        return <DevpostInfoForm updateData={updateData} data={data} nextStep={nextStep} prevStep={prevStep} />
      case 3:
        return <ReviewForm updateData={updateData} data={data} nextStep={nextStep} prevStep={prevStep} />
      case 4:
        return <ResultForm />;
    }
  }

  console.log(data);
  console.log(submissionsOpen);

  return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
          {submissionsOpen &&
          <div>
            <div>
                {renderComponent(current)}
            </div>
            <Steps current={current} style={{ marginBottom: "16px" }}>
                <Step key={0} title="Team Info" />
                <Step key={1} title="Prize Info" />
                <Step key={2} title="Devpost Info" />
                <Step key={3} title="Review" />
            </Steps>
          </div>}
          {!submissionsOpen &&
          <div>
            <Title level={2}>Create Submission</Title>
            <Title level={5}>Submissions are closed</Title>
          </div>
          }
      </div>
  )
}

export default SubmissionFormContainer;
