import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  FileWordOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileExcelOutlined,
  DesktopOutlined
} from '@ant-design/icons';
import { AiOutlineMenu } from 'react-icons/ai';
import styles from './admin.module.scss';
import { useNavigate } from 'react-router-dom';
import { IoLogOutOutline } from 'react-icons/io5';
import Logout from '../logout/logout.component';
import Account from '../account/account.component';
import Word from '../word/word.component';
import Profile from '../profile/profile.component';

const { Header, Content, Footer, Sider } = Layout;

const AdminPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const navigate = useNavigate();

  useEffect(() => {
    const loginInfo = localStorage.getItem('loginInfo');
    if (!loginInfo) {
      navigate('/login');
    }
  }, [navigate]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: 'Manager Account',
    },
    {
      key: '2',
      icon: <FileWordOutlined />,
      label: 'Manager Word',
    },
    {
      key: '3',
      icon: <UserOutlined />,
      label: 'Profile User',
    },
    {
      key: '4',
      icon: <IoLogOutOutline />,
      label: 'Logout',
      className: 'logout',
    },
  ];

  const getContent = () => {
    switch (selectedKey) {
      case '1':
        return <Account />;
      case '2':
        return <Word />;
      case '3':
        return <Profile />;
      case '4':
        return <Logout />;
      default:
        return <h2>Select a tab</h2>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
        <div className={styles.footer}>
          <DesktopOutlined /> {/* This line adds the icon next to the text */}
          <span>Admin Dic</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={menuItems}
          onSelect={({ key }) => setSelectedKey(key)}
        />
      </Sider>
      <Layout className={styles.siteLayout}>
        <Header className={styles.siteLayoutBackground} style={{ padding: 0 }}>
          <AiOutlineMenu className={styles.trigger} onClick={toggleCollapsed} style={{ color: 'white' }} />
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div className={styles.siteLayoutBackground} style={{ padding: 24, minHeight: 360 }}>
            {getContent()}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Admin Dashboard  Created by Đỗ Ngọc Long
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminPage;
