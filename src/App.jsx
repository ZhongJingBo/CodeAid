import React, { Suspense } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Layout, Spin, ConfigProvider } from "antd";
import SideBar from "./components/sideBar";
import { routes } from "./router";
import "./App.less";

export default () => {

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#722ed1',
          colorInfo: '#722ed1',
          colorLink: '#722ed1',
          colorSuccess: '#722ed1',
          colorPrimaryHover: '#9254de',
          colorPrimaryActive: '#531dab',
          colorPrimaryText: '#722ed1',
          colorPrimaryTextHover: '#9254de',
          colorPrimaryTextActive: '#531dab',
        },
      }}
    >
      <BrowserRouter>
        <div className="app-container">
          <div className="app-main">
            <Layout>
              <Suspense fallback={<Spin />}>
                <Switch>
                  {routes.map((route, index) => (
                    <Route
                      key={index}
                      exact={route.exact}
                      path={route.path}
                      component={route.component}
                    />
                  ))}
                  <Redirect from="*" to="/" />
                </Switch>
              </Suspense>
            </Layout>
          </div>

          <div className="side-bar">
            <SideBar />
          </div>
        </div>
      </BrowserRouter>
    </ConfigProvider>
  );
};
