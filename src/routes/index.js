import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from '../components/login/login.component';
import AdminPage from '../components/admin/admin.component' ;
import PreviewWord from '../components/previewWord/previewWord.component';

import {Routes, Route, HashRouter  } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/admin" element={<AdminPage />} />
//         <Route path="/" element={<Navigate to="/mainweb" />} />
//         <Route path = "/mainweb" element = {<PreviewWord />}/>
//         {/* Thêm các route khác ở đây */}
//       </Routes>
//     </Router>
//   );
// };
    return (
      <HashRouter>
        <Routes>
          {/* Các routes khác */}
          <Route path='/' element={<PreviewWord />} />
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/per" element={<Per />} /> */}
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} >
            {/* <Route path="manage-accounts" element={<ManageAccounts />} />
            <Route path="manage-users" element={<ManageUsers />} /> */}

          </Route>
        </Routes>
      </HashRouter>
    );
}

export default App;
