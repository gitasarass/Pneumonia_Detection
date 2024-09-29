import React, { useState } from 'react';
import './SignUp.css';
import logo_page from '../assets/logo_unram.png';
import { MdOutlineMail, MdLockOutline } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../firebase';
import { ClipLoader } from 'react-spinners'

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password.length < 6 ) {
            toast.error("Password must be at least 6 character", {
                position: 'bottom-center'
            });
            return;
        }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log(user);
            if (user) {
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    email: user.email,
                    fullName: fullName,
                    specialist: "",
                    birthDate: "",
                    phone: "",
                    photo: "",
                });
                console.log("User Registered Successfully!");
                toast.success("User Registered Successfully!", {
                    position: 'bottom-center',
                });
                navigate('/login');
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message, {
                position: 'bottom-center',
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='register-admin'>
            
            {loading && (
                <div className='loading-overlay'>
                    <ClipLoader size={50} color={"#fff"} />
                </div>
            )}

            <div className='logo-name'>
                <img src={logo_page} alt="Logo Rumah Sakit Universitas Mataram" />
                <div className='logo-text'>
                    <p>Pnemonia Detection</p>
                    <p>Universitas Mataram</p>
                </div>
            </div>

            <div className='container-form'>
                <div className='header-form'>
                    <h1>Buat Akun 🩺</h1>
                    <p>Silakan buat akun Anda untuk memudahkan<br />akses 👇</p>
                </div>

                <form className='form-detail' onSubmit={handleRegister}>
                    <div className='form-input'>
                            <input
                                type="text"
                                placeholder='Nama Lengkap'
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                    </div>
                    <div className='form-input'>
                        <MdOutlineMail className='icon-form' />
                        <input
                            type="email"
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-input'>
                        <MdLockOutline className='icon-form' />
                        <input
                            type="password"
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type='submit' className='btn-log' disabled={loading}
                    >Buat Akun</button>
                    <Link to={'/'}>
                        <button className='btn-more' disabled={loading}>Masuk</button>
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
