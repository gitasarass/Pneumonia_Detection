import React, { useState } from 'react';
import './Login.css';
import logo_page from '../assets/logo_unram.png';
import { MdOutlineMail, MdLockOutline } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from 'react-spinners';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters", {
                position: "bottom-center",
            });
            return;
        }

        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in Successfully!");
            toast.success("User logged in Successfully", {
                position: "top-center",
            });
            onLogin();
            navigate('/dokter/dashboard');
        } catch (error) {
            console.log(error.message);
            toast.error(error.message, {
                position: "bottom-center",
            });
            alert("Email atau Password salah!");
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='login-admin'>
            {loading && (
                <div className='loading-overlay'>
                    <ClipLoader size={50} color={"#fff"} />
                </div>
            )}
            <div className='logo-name'>
                <img src={logo_page} alt="" />
                <div className='logo-text'>
                    <p>Pnemonia Detection</p>
                    <p>Universitas Mataram</p>
                </div>
            </div>
            <div className='container-form'>
                <div className='header-form'>
                    <h1>Masuk Akun 🩺</h1>
                    <p>Silakan masuk ke akun Anda untuk<br />memudahkan akses 👇</p>
                </div>
                <form className='form-detail' onSubmit={handleSubmit}>
                    <div className='form-input'>
                        <MdOutlineMail className='icon-form'/>
                        <input
                            type="email"
                            placeholder='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='form-input'>
                        <MdLockOutline className='icon-form'/>
                        <input
                            type="password"
                            placeholder='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <button type='submit' className='btn-log' disabled={loading}>Masuk</button>
                    <Link to={'/register'}>
                        <button className='btn-more' disabled={loading}>Buat Akun</button>
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Login;
