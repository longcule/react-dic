import { Modal, Form, Input, Button, message, Upload, Select } from 'antd';
import React, { useState } from 'react';
import {PlusOutlined} from '@ant-design/icons'
import {TextArea} from "antd/lib/input";
import { addUser } from '../../services/acountService';

const { Option } = Select;

const loginInfo = localStorage.getItem('loginInfo');
const userId = loginInfo ? JSON.parse(loginInfo).id : null; // Ensure that loginInfo is not null


const AddUser = ({ open, onOk, onCancel }) => {
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };


  const handleFinish = async (values) => {

    const attachments = (fileList || []).map(file => {
      console.log('File: ', file); // Log each file object
      return {
        "attachment": file.thumbUrl.split(",")[1]// Ensure thumbUrl exists
      };
    });

    // console.log('Received values of form: ', values);
    const completeData = {
      id_user_add: userId.toString(),
      user_name: values.user_name,
      password: values.password,
      role: values.role,
      image: attachments,
    };
    console.log('Received values of form: ', completeData);
    try {
      const response = await addUser(completeData);
      console.log(response);
      if (response.statusCode !== '200') {
        message.error(response.message);      
      } else {
        message.success('Word added successfully');
        console.log('API Response:', response);
        onOk(response); // Call the onOk passed from parent, and send form data to it
      }
    } catch (error) {
      message.error('Error adding word');
      console.error('Error adding word:', error);
    }
  };

  return (
    <Modal
      title="Add New User"
      open={open}
      onOk={() => form.submit()} // Call form.submit to trigger onFinish
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Submit
        </Button>,
      ]}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleFinish}
      >
        <Form.Item
          label="UserName"
          name="user_name"
          rules={[{ required: true, message: 'Please input the word!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input the meaning!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Role"
          name="role" 
          rules={[{ required: true, message: 'Please select the role!' }]}
        >
          <Select placeholder="Select a role">
            <Option value="admin">Admin</Option>
            <Option value="employee">Customer</Option>
            {/* <Option value= "3">Long deptrai 2k2</Option>
            <Option value= "3">Long deptrai</Option>
            <Option value= "3">Long sieudeptrai</Option> */}
          </Select>
        </Form.Item>
        <Form.Item
          label="Upload"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
            multiple
          >
            {fileList.length >= 5 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        {/* <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload action="/upload.do" listType="picture-card">
            <button
                style={{
                  border: 0,
                  background: 'none',
                }}
                type="button"
            >
              <PlusOutlined />
              <div
                  style={{
                    marginTop: 8,
                  }}
              >
                Upload
              </div>
            </button>
          </Upload>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default AddUser;
