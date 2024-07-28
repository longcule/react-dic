import React, { useEffect, useState } from 'react';
import { Table, Spin, Input, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getAllWord } from '../../services/wordService';
import WordDetailModal from './wordDetailModal';
import styles from './peviewWord.module.scss';

const loginInfo = localStorage.getItem('loginInfo');
const userIdLogin = loginInfo ? JSON.parse(loginInfo).userId : null;

const PreviewWord = () => {
  const [WordData, setWordData] = useState([]);
  const [filteredWordData, setFilteredWordData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    const getWord = async () => {
      setLoading(true);
      try {
        const response = await getAllWord();
        setWordData(response);
        setFilteredWordData(response);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError('Failed to fetch words');
      }
    };
    getWord();
  }, []);

  useEffect(() => {
    const filteredData = WordData.filter((word) =>
      word.word.toLowerCase().includes(searchText.toLowerCase()) ||
      word.subject.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredWordData(filteredData);
  }, [searchText, WordData]);

  const handleModalCancel = () => {
    setIsModalOpen(false);
  }

  const handleModalOk = () => {
    setIsModalOpen(true)
  }

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => index + 1,
      width: 50,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => moment(date, 'HH:mm:ss DD/MM/YYYY').format('DD-MM-YYYY'),
    },
    {
      title: 'Word',
      dataIndex: 'word',
      key: 'word',
      sorter: (a, b) => a.word.localeCompare(b.word),
    },
    {
      title: 'Meaning',
      dataIndex: 'meaning',
      key: 'meaning',
      sorter: (a, b) => a.meaning.localeCompare(b.meaning),
    },
    {
      title: 'Description',
      dataIndex: 'note',
      key: 'note',
      sorter: (a, b) => a.note.localeCompare(b.note),
      render: text => (
        <div>
          {text.length > 30 ? `${text.substring(0, 23)}...` : text}
        </div>
      ),
    },
    {
      title: 'User Edit',
      dataIndex: 'user_add',
      key: 'user_add',
      sorter: (a, b) => a.user_add.localeCompare(b.user_add),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: image => <img src={image[0].link} style={{ width: 25, height: 25 }} />,
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      sorter: (a, b) => a.subject.localeCompare(b.subject),
    },
  ];

  const handleRowClick = (record) => {
    setSelectedWord(record);
    setIsModalOpen(true);
  };

  return (
    <div>
      <h2 className={styles['headerCentral']}>Manager Word</h2>
      <Row justify="end" style={{ marginBottom: '16px' }}>
        <Col>
          <Input
            placeholder="Search by word or subject"
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 270 }}
          />
        </Col>
      </Row>
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
        <Table
          columns={columns}
          dataSource={filteredWordData}
          pagination={{ pageSize: 8 }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {selectedWord && (
        <WordDetailModal
          open={isModalOpen}
          word={selectedWord}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        />
      )}
    </div>
  );
};

export default PreviewWord;
