import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { updateWord } from '../../services/wordService';

const loginInfo = localStorage.getItem('loginInfo');
const userId = loginInfo ? JSON.parse(loginInfo).id.toString() : null;

const EditWord = ({ open, word, onOk, onCancel }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (word) {
      const imageList = word.image ? word.image.map((img, index) => ({
        uid: `-${index}`,
        name: `image${index}.png`,
        status: 'done',
        url: img.link,
      })) : [];
      form.setFieldsValue({
        ...word,
        image: imageList,
      });
      setFileList(imageList);
    }
  }, [word, form]);

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
    console.log('Received values of form: ', values);
    console.log('Received values of form 2: ', fileList);
  

    const newListImage = fileList.filter(file => !file.url)
    console.log('Received values of form 3: ', newListImage);
    const attachments = (newListImage || []).map(file => {
      console.log('File: ', file); // Log each file object
      return {
        "attachment": file.thumbUrl.split(",")[1]// Ensure thumbUrl exists
      };
    });
  
    const completeData = {
      "id_product": word.id.toString(),
      "id_user_src": userId,
      "word": values.word,
      "list_id_img": "1,2",
      "meaning": values.meaning,
      "note": values.note,
      "user_add": values.user_add,
      "subject": values.subject,
      "image": attachments
    };
  
    console.log('Complete Data: ', completeData);
    try {
      const response = await updateWord(completeData);
      console.log("response",response);
      if (response.message.startsWith("Thay đổi thông tin từ thành công")) {
        message.success('Word added successfully');
        console.log('API Response:', response);
        onOk(response);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error adding word:', error);
    }
  };

  return (
    <Modal
      title="Edit Word"
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
      <Form
        layout="vertical"
        form={form}
        onFinish={handleFinish}
      >
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
        <Form.Item
          label="Description"
          name="note"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="User Edit"
          name="user_add"
          initialValue={userId}
          hidden
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Subject"
          name="subject"
        >
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

export default EditWord;
