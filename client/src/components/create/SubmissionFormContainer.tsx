import React, { useEffect, useState } from "react";
import { Spin, Steps } from "antd";
import TeamInfoForm from "./form/TeamInfoForm";
import PrizeInfoForm from "./form/PrizeInfoForm";
import DevpostInfoForm from "./form/DevpostInfoForm";
import { User } from "../../types/types";
import SubmissionDetails from "../submission/SubmissionDetails";
import axios from "axios";
import useAxios from "axios-hooks";
import { useParams } from "react-router-dom";
import LoadingDisplay from "../../util/LoadingDisplay";
import ErrorDisplay from "../../util/ErrorDisplay";
import ResultForm from "./form/ResultForm";

const { Step } = Steps;

interface Props {
  user: User;
}

const SubmissionFormContainer: React.FC<Props> = (props) => {
  // const submissionData =  {
  //   submissionId: 3,
  //   members: [
  //     {
  //       email: "test1@gmail.com",
  //       name: "Ayush Goyal"
  //     },
  //     {
  //       email: "test2@gmail.com",
  //       name: "Ayush Goyal"
  //     }
  //   ],
  //   prizes: [
  //     {
  //       id: 1,
  //       name: "Emerging Prize"
  //     },
  //     {
  //       id: 2,
  //       name: "General Prize"
  //     }
  //   ],
  //   name: "Test",
  //   devpost: "https://devpost.com/test",
  //   completed: false,
  // }

  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});

  if (loading) {
    return <LoadingDisplay />;
  }

  if (data.error) {
    return <ErrorDisplay error={data.message} />;
  }

  console.log(data);

  const nextStep = () => {
    if ([0, 1, 2].includes(current)) {
      setCurrent(current + 1);
    }
  }

  const prevStep = () => {
    if ([1, 2].includes(current)) {
      setCurrent(current - 1);
    }
  }

  const renderComponent = (current: number) => {
    switch (current) {
      case 0:
        return <TeamInfoForm setData={setData} data={data} user={props.user} nextStep={nextStep} />
      case 1:
        return <PrizeInfoForm setData={setData} data={data} nextStep={nextStep} prevStep={prevStep} />
      case 2:
        return <DevpostInfoForm setData={setData} data={data} nextStep={nextStep} prevStep={prevStep} />
      case 4:
        return <ResultForm />;
    }
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
        <div>
          {renderComponent(current)}
        </div>
        <Steps current={current} style={{ marginBottom: "16px" }}>
          <Step key={0} title="Team Info" />
          <Step key={1} title="Prize Info" />
          <Step key={2} title="Devpost Info" />
        </Steps>
      </div>
    </>
  )
}

export default SubmissionFormContainer;
