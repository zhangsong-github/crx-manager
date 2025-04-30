import React from 'react';
import '@ant-design/v5-patch-for-react-19';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import WhitelistPage from './pages/WhitelistPage';
import BlacklistPage from './pages/BlacklistPage';
import 'antd/dist/reset.css';
import { Layout, Menu } from 'antd';
import { PermissionProvider } from './contexts/PermissionContext';

const { Header, Content } = Layout;


const AppRouter = () => {
  const location = useLocation();
  return (
    <Layout>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={[
            { key: '/whitelist', label: <Link to="/whitelist">白名单列表</Link> },
            { key: '/blacklist', label: <Link to="/blacklist">黑名单列表</Link> }
          ]}
        />
      </Header>
      <Content style={{ padding: '24px' }}>
        <Routes>
          <Route path="/whitelist" element={<WhitelistPage />} />
          <Route path="/blacklist" element={<BlacklistPage />} />
          <Route path="*" element={<WhitelistPage />} />
        </Routes>
      </Content>
    </Layout>
  );
};

const App = () => {
  return (
    <React.StrictMode>
      <PermissionProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </PermissionProvider>
    </React.StrictMode>
  )
}

export default App;
