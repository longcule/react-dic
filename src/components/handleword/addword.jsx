import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { addWord } from '../../services/wordService';

const loginInfo = localStorage.getItem('loginInfo');
const userId = loginInfo ? JSON.parse(loginInfo).id : null;

const AddWord = ({ open, onOk, onCancel }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

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
    // console.log('Received values of form: ', values);
    // console.log('Received values of form 2: ', fileList);
  
    // Check if fileList exists and is an array
    const attachments = (fileList || []).map(file => {
      console.log('File: ', file); // Log each file object
      return {
        "attachment": file.thumbUrl.split(",")[1]// Ensure thumbUrl exists
      };
    });
  
    const completeData = {
      "word": values.word,
      "meaning": values.meaning,
      "note": values.note,
      "user_add": userId.toString(),
      "subject": values.subject,
      "image": attachments
    };
  
    console.log('Complete Data: ', completeData);
    try {
      const response = await addWord(completeData);
      console.log("response",response);
      if (response.statusCode !== '200') {
        message.success(response.message);
      } else {
        message.success('Word added successfully');
        console.log('API Response:', response);
        onOk(response);
      }
    } catch (error) {
      message.error('Error adding word');
      console.error('Error adding word:', error);
    }
  };

  return (
    <Modal
      title="Add New Word"
      open={open}
      onOk={() => form.submit()}
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
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          label="Word"
          name="word"
          rules={[{ required: true, message: 'Please input the word!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Meaning"
          name="meaning"
          rules={[{ required: true, message: 'Please input the meaning!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="note">
          <Input />
        </Form.Item>
        <Form.Item label="User Edit" name="user_add" initialValue={userId} hidden>
          <Input />
        </Form.Item>
        <Form.Item label="Subject" name="subject">
          <Input />
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
      </Form>
    </Modal>
  );
};

export default AddWord;