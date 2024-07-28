import React, { useEffect, useState } from 'react';
import { Modal, Typography, Button, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const loginInfo = localStorage.getItem('loginInfo');
const userId = loginInfo ? JSON.parse(loginInfo).userId : null;

const WordDetailModal = ({ open, word, onCancel }) => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (word) {
      const imageList = word.image ? word.image.map((img, index) => ({
        uid: `-${index}`,
        name: `image${index}.png`,
        status: 'done',
        url: img.link,
      })) : [];
      setFileList(imageList);
    }
  }, [word]);

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <Modal
      title={<div style={{ textAlign: 'center' }}>Word Detail</div>}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Close
        </Button>,
      ]}
    >
      <div>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Word: </Text>
          <Text>{word?.word}</Text>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Meaning: </Text>
          <Text>{word?.meaning}</Text>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Description: </Text>
          <Paragraph>{word?.note}</Paragraph>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Subject: </Text>
          <Text>{word?.subject}</Text>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Image:</Text>
          {word?.image?.length > 0 ? (
            <div>
              {word.image.map((img, index) => (
                <div key={index} style={{ marginBottom: 8 }}>
                  <img src={img.link} alt={`Image ${index + 1}`} style={{ maxWidth: '100%', height: 'auto' }} />
                  <div>
                    <Text>Image {index + 1}: {img.name}</Text>
                    <a href={img.link} target="_blank" rel="noreferrer">
                      <Text underline>View Image</Text>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Text>No images available</Text>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default WordDetailModal;
