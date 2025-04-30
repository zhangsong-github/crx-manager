// ✅ client/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@ant-design/v5-patch-for-react-19';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import AddWhitelist from './pages/AddWhitelist';
import AddBlacklist from './pages/AddBlacklist';
import WhitelistPage from './pages/WhitelistPage';
import BlacklistPage from './pages/BlacklistPage';
import 'antd/dist/reset.css';
import { Layout, Menu } from 'antd';

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
            { key: '/addwhite', label: <Link to="/add">添加白名单扩展</Link> },
            { key: '/addblack', label: <Link to="/addblack">添加黑名单扩展</Link> },
            { key: '/whitelist', label: <Link to="/whitelist">白名单列表</Link> },
            { key: '/blacklist', label: <Link to="/blacklist">黑名单列表</Link> }
          ]}
        />
      </Header>
      <Content style={{ padding: '24px' }}>
        <Routes>
          <Route path="/addwhite" element={<AddWhitelist />} />
          <Route path="/addblack" element={<AddBlacklist />} />
          <Route path="/whitelist" element={<WhitelistPage />} />
          <Route path="/blacklist" element={<BlacklistPage />} />
          <Route path="*" element={<AddWhitelist />} />
        </Routes>
      </Content>
    </Layout>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </React.StrictMode>
);
