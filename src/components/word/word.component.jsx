import React, { useState, useEffect } from 'react';
import { Modal, Table, Space, Button, Spin, Input, Row, Col } from 'antd';
import { SearchOutlined, FileExcelOutlined } from '@ant-design/icons';
import { getAllWord, DeleteWord, addWord } from '../../services/wordService';
import AddWord from '../handleword/addword';
import EditWord from '../handleword/editword'
import moment from 'moment';
import * as XLSX from 'xlsx';
const fallbackImageUrl = 'https://via.placeholder.com/25'; // Replace with your desired fallback image URL
const loginInfo = localStorage.getItem('loginInfo');
const userIdLogin = loginInfo ? JSON.parse(loginInfo).userId : null;

const monthFilters = [
  { text: 'January', value: '01' },
  { text: 'February', value: '02' },
  { text: 'March', value: '03' },
  { text: 'April', value: '04' },
  { text: 'May', value: '05' },
  { text: 'June', value: '06' },
  { text: 'July', value: '07' },
  { text: 'August', value: '08' },
  { text: 'September', value: '09' },
  { text: 'October', value: '10' },
  { text: 'November', value: '11' },
  { text: 'December', value: '12' },
];

const Word = () => {
  const [WordData, setWordData] = useState([]);
  const [filteredWordData, setFilteredWordData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentWord, setCurrentWord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [totalWords, setTotalWords] = useState(0);

  useEffect(() => {
    const getWord = async () => {
      setLoading(true);
      try {
        const response = await getAllWord();
        const formattedResponse = response.map(word => ({
          ...word,
          formattedDate: moment(word.date, 'HH:mm:ss DD/MM/YYYY').format('DD-MM-YYYY')
        }))
        .sort((a, b) => 
          a.subject.trim().localeCompare(b.subject.trim(), undefined, { sensitivity: 'base' })
        );
        setWordData(formattedResponse);
        setFilteredWordData(formattedResponse);
        setLoading(false);
      } catch (error) {
        setError('Fetch data failed');
        setLoading(false);
      }
    };
    getWord();
  }, []);

  useEffect(() => {
    const filteredData = WordData.filter((word) => {
      const isTextMatch = word.word.toLowerCase().includes(searchText.toLowerCase()) ||
        word.subject.toLowerCase().includes(searchText.toLowerCase());
      const isMonthMatch = !selectedMonth || moment(word.date, 'HH:mm:ss DD/MM/YYYY').format('MM') === selectedMonth;
      return isTextMatch && isMonthMatch;
    });
    setFilteredWordData(filteredData);
    setTotalWords(filteredData.length);
  }, [searchText, selectedMonth, WordData]);

  const handleAddWord = (newWord) => {
    const formattedNewWord = {
      ...newWord,
      formattedDate: moment(newWord.date, 'HH:mm:ss DD/MM/YYYY').format('DD-MM-YYYY')
    };
    setWordData([...WordData, formattedNewWord]);
    setFilteredWordData([...WordData, formattedNewWord]);
    setIsAddModalVisible(false);
  };

  const handleCancelAdd = () => {
    setIsAddModalVisible(false);
  };
  const showEditModal = (word) => {
    setCurrentWord(word);
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
    const deleteEmployee = async () => {
      try {
        console.log(record.id)
        const idProduct = {
          "id_product" : record.id.toString()
        };
        console.log("id", idProduct)
        const response = await DeleteWord(idProduct);
        if (response.status === 200) {
          const updatedWordData = WordData.filter((word) => word.id !== record.id);
          setWordData(updatedWordData);
          setFilteredWordData(updatedWordData);
          console.error('Deletedata', response)
        } else {
          console.suscess(response);
        }
      } catch (error) {
        console.log('Error deleting word:', error);
      }
    };

    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this word?',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        deleteEmployee();
      },
    });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredWordData.map(word => ({
      "STT": word.index + 1,
      "Date": word.formattedDate,
      "Word": word.word,
      "Meaning": word.meaning,
      "Description": word.note,
      "User Edit": word.user_add,
      "Subject": word.subject
    })));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Words");
    XLSX.writeFile(wb, "WordsExport.xlsx");
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
      title: 'Date',
      dataIndex: 'formattedDate',
      key: 'formattedDate',
      filters: monthFilters,
      onFilter: (value, record) => moment(record.date, 'HH:mm:ss DD/MM/YYYY').format('MM') === value,
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
      render: (text) => (
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
      render: (image) => (
        <img
          src={image && image[0] && image[0].link ? image[0].link : fallbackImageUrl}
          style={{ width: 25, height: 25 }}
        />
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      sorter: (a, b) => a.subject.localeCompare(b.subject),
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
      <h2>Manager Word</h2>
      <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
        <Col>
          <Row gutter={16}>
            <Col>
              <Input
                placeholder="Search by word or subject"
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 200 }}
              />
            </Col>
            <Col style={{ marginLeft: 16 }}>
              <h3>Total Words: {totalWords}</h3>
            </Col>
          </Row>
        </Col>
        <Col>
          <Button 
            onClick={exportToExcel} 
            type="primary" 
            icon={<FileExcelOutlined />}
            style={{ marginRight: 16 }}
          >
            Export to Excel
          </Button>
          <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
            Add Word
          </Button>
        </Col>
      </Row>
      <div style={{ position: 'relative' }}>
        {loading && (
          <div
            style={{
              position: 'fixed',
              top: '45%',
              left: '55%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
            }}
          >
            <Spin tip="Loading..." size="large" />
          </div>
        )}
        <Table columns={columns} dataSource={filteredWordData} pagination={{ pageSize: 20 }} />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <AddWord
        open={isAddModalVisible}
        onOk={handleAddWord}
        onCancel={handleCancelAdd}
      />
      <EditWord
        open={isEditModalOpen}
        word={currentWord}
        onOk={handleEdit}
        onCancel={handleEditCancel}
      />
    </div>
  );
};

export default Word;
