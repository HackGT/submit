import React from "react";
import { ConfigProvider, List, Empty, Card } from "antd";
import { Submission } from "../../types/types";
import { Link } from "react-router-dom";

const { Meta } = Card;

const Dashboard: React.FC = () => {

  // TODO: Get user's submissions from server

  const submissionsData = [
    {
      name: "Test name",
      hackathon: {
        name: "HackGT 7",
        image: "/public/hackgt7.jpg"
      },
      members: [
        {
          name: "Ayush Goyal"
        },
        {
          name: "Michael Raman"
        },
        {
          name: "Rahul Rajan"
        }
      ]
    },
    {
      name: "Test name",
      hackathon: {
        name: "HackGT 7",
        image: "/public/hackgt7.jpg"
      },
      members: [
        {
          name: "Ayush Goyal"
        },
        {
          name: "Michael Raman"
        },
        {
          name: "Rahul Rajan"
        }
      ]
    }
  ]


  return (
    <>
      <ConfigProvider
        renderEmpty={() => (
          <Empty description="You have no past Submissions" />
        )}
      >
        <List
          grid={{ gutter: 32, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 }}
          dataSource={submissionsData}
          renderItem={(submission: any) => (
            <List.Item>
              {/* TODO: Fill in link */}
              <Link to="/">
                <Card title={submission.hackathon.name} cover={ <img alt="" src={submission.hackathon.image} /> } hoverable>
                  <Meta
                    title={submission.name}
                    description={submission.members.map((item: any) => item.name).join(', ')}
                  />
                </Card>
              </Link>
            </List.Item>
          )}
        />
      </ConfigProvider>
    </>
  )
}

export default Dashboard;
