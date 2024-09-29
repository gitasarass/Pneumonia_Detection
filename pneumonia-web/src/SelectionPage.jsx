import React from 'react';
import './page/login/Login.css';
import logo_page from './page/assets/logo_unram.png';
import { Link } from 'react-router-dom';

const SelectionPage = () => {

  return (
    <div className='login-admin'>
      <div className='logo-name'>
        <img src={logo_page} alt="" />
        <div className='logo-text'>
          <p>Pneumonia Detection</p>
          <p>Universitas Mataram</p>
        </div>
      </div>
      <div className='container-form-selected'>
        <div className='header-form'>
          <h1>Selamat Datang 🩺</h1>
        </div>
        <Link to={'/admin-login'}>
            <button className='btn-more-selected'>
            Masuk sebagai Admin
            </button>
        </Link>
        <br />
        <Link to={'/login'}>
            <button className='btn-more-selected-more'>
            Masuk sebagai Dokter
            </button>
        </Link>
      </div>
    </div>
  );
};

export default SelectionPage;
