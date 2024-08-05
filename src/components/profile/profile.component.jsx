import React, { useState, useEffect } from 'react';
import { Card, Avatar, Descriptions } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './profile.module.scss';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Replace 'currentUser' with your local storage user data key
    const userData = localStorage.getItem('loginInfo');
    if (userData) {
      setUserProfile(JSON.parse(userData));
    }
  }, []);

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <Card bordered={false}>
        <div className="card-body">
          <div className="avatar-container">
            <Avatar size={128} icon={<UserOutlined />} />
          </div>
          <Descriptions title="User Info" layout="horizontal" bordered column={1}>
            <Descriptions.Item label="Name">{userProfile.user_name}</Descriptions.Item>
            <Descriptions.Item label="PhoneNumber_Dev">{"0388508956"}</Descriptions.Item>
            <Descriptions.Item label="Password">{userProfile.password}</Descriptions.Item>
            <Descriptions.Item label="RolName">{userProfile.role}</Descriptions.Item>
            <Descriptions.Item label="Message">{"Cảm ơn bạn đã sử dụng hệ thống!"}</Descriptions.Item>
          </Descriptions>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
