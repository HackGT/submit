import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from './util/PrivateRoute';
import { HeartOutlined } from "@ant-design/icons";
import { Layout, Spin } from 'antd';
import Dashboard from "./components/dashboard/Dashboard";
import Navigation from './components/navigation/Navigation';
import AdminHome from './components/admin/AdminHome';
import CreateSubmission from "./components/submission/CreateSubmission";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/auth/check")
      .then((res) => {
        setUser(res.data);
        setLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setUser]);

  if (loading) {
    return <Spin style={{ position: "absolute", top: "48%", left: "48%" }} />;
  }

  if (!user) {
    throw new Error("User not authenticated");
  }

  return (
    <Router>
      <Layout className="App" style={{ minHeight: "100vh" }}>
        <Header style={{ padding: "0px 30px" }}>
          <Navigation user={user} />
        </Header>
        <Content id="wrapper">
          <div style={{ background: "#fff", padding: "24px", flexGrow: 1 }}>
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route exact path="/create" render={() => <CreateSubmission user={user!} />} />
              <PrivateRoute exact path="/admin" component={AdminHome} user={user} />
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          {"Made with "}
          <HeartOutlined />
          {" by the HackGT Team"}
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;
