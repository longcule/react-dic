import React, {useEffect} from 'react';
import { useState } from 'react';
import { getAllUser, deleteUser } from '../../services/acountService'; 
import {Modal, Table, Space, Button, Spin } from 'antd';
import AddUser from '../handleaccount/addacount'
import userEvent from '@testing-library/user-event';
import EditUser from '../handleaccount/editaccount';

const loginInfo = localStorage.getItem('loginInfo');
const userIdLogin = loginInfo ? JSON.parse(loginInfo).id : null;

const User = () => {
  const [UserData, setUserData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const response = await getAllUser();
        setUserData(response);
          console.log(response);
          setLoading(false);
      } catch (error) {
        setError('Fetch data fail')
        setLoading(false)
      }
    };
    getUser();
  }, []);

  const handleAddUser = (newUser) => {
    setUserData([...UserData, newUser]);
    setIsAddModalVisible(false);
  };

  const handleCancelAdd = () => {
    setIsAddModalVisible(false);
  };

  const showEditModal = (user) => {
    setCurrentUser(user);
    setIsEditModalOpen(true);
  };

  const handleEdit = (record) => {
    console.log('Editing record', record);
    showEditModal(record);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const handleDelete = (record) => {
    // Define a function to handle actual deletion
    console.log('Deleting record', record);
    const deleteEmployee = async (userIdDelete, userId) => {
      try {
        const userId = record.id;
        const completeData = {
          "id_user_src": userIdLogin.toString(),
          "id_user_target": userId.toString()
        };

        // console.log("data del: ", completeData)
        const response = await deleteUser(completeData);
        console.log(response)
        if (response.status === 200)
        {
          setCurrentUser(currentUser.filter((word) => word.id !== record.id));
        } else
        {
          console.error('Error deleting employee:', response);
        }
      } catch (error) {
        console.log('Error deleting employee:', error);
      }
    };
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this Account ?',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        deleteEmployee();
      },
    });
  };
  
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => index + 1,
      width: 50,
    },
    {
      title: 'Username',
      dataIndex: 'user_name',
      key: 'user_name',
      sorter: (a, b) => a.user_name.localeCompare(b.user_name),
    },
    {
      title: 'PassWord',
      dataIndex: 'password',
      key: 'password',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: image => <img src={image} style={{ width: 25, height: 25 }} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Manager Account</h2>
      <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
        Add Account
      </Button>
      <div style={{ position: 'relative' }}>
        {loading && (
          <div style={{
            position: 'fixed',
            top: '45%',
            left: '55%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999
          }}>
            <Spin tip="Loading..." size="large" />
          </div>
        )}
        <Table columns={columns} dataSource={UserData} pagination={{ pageSize: 6 }} />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <AddUser
        open={isAddModalVisible}
        onOk={handleAddUser}
        onCancel={handleCancelAdd}
      />
      <EditUser
        open={isEditModalOpen}
        user={currentUser}
        onOk={handleEdit}
        onCancel={handleEditCancel}
      />
    </div>
  );
};

export default User;