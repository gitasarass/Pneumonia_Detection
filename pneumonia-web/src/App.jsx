import React, { useState } from 'react';
import './App.css';

import Login from './page/login/Login';
import Register from './page/signup/SignUp';
import DashboardPage from './page/dashboard/Dashboard';
import PageDashboard from './page/dashboard/PageDashboard';
import SetSetting from './page/setting/SetSetting';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import SelectionPage from './SelectionPage';
import AdminLogin from './page/admin/login/AdminLogin';
import SignUpAdmin from './page/admin/signup/SignUpAdmin';
import DashboardAdminPage from './page/admin/dashboard/DashboardAdmin';
import DashboardPageAdmin from './page/admin/dashboard/DashboardPageAdmin';
import SettingAdmin from './page/admin/setting/SettingAdmin';
import DataPatient from './page/admin/data_page/DataPatient';
import HistoryDataPatient from './page/admin/history/HistoryDataPatient';
import PagePneumonia from './page/check_page/PagePneumonia';
import DataPneumonia from './page/check_page/DataPneumonia';
import Pneumonia from './page/check_page/Pneumonia';
import ResultPage from './page/check_page/ResultPage';
import HistoryPatient from './page/history/HistoryPatient';
const route = (isAuthenticated, setIsAuthenticated, userRole) => createBrowserRouter([
  {
    path: '/',
    element: <SelectionPage onLogin={() => setIsAuthenticated(true)} />
  },
  {
    path: '/admin-login',
    element: <AdminLogin onLogin={() => setIsAuthenticated(true)}/>
  },
  {
    path: '/login',
    element: <Login onLogin={() => setIsAuthenticated(true)} />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/register-admin',
    element: <SignUpAdmin />
  },
  {
    path: '/dokter',
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="user">
        <DashboardPage />
      </ProtectedRoute>
    ),
    children: [, 
      { path: 'dashboard', element: <PageDashboard /> },
      { 
        path: 'pneumonia',
          element: (
            <Pneumonia />
          ),
          children: [
            { path: '', element: <PagePneumonia /> },
            { path: 'pneumonia-pasien', element: <PagePneumonia /> },
            { path: 'data', element: <DataPneumonia /> },
            { path: 'hasil', element: <ResultPage /> },
          ]
          
      },
      { path: 'riwayat-pasien', element: <HistoryPatient/> },
      { path: 'pengaturan', element: <SetSetting /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="admin">
        <DashboardAdminPage />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPageAdmin/> },
      { path: 'pasien-baru', element: <DataPatient /> },
      { path: 'riwayat-pasien', element: <HistoryDataPatient/> },
      { path: 'pengaturan', element: < SettingAdmin /> },
    ],
  },
]);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('user');

  return (
    <RouterProvider router={route(isAuthenticated, setIsAuthenticated, userRole)} />
  );
}

export default App;
