import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ClipLoader } from 'react-spinners';
import blank_image from '../assets/blank_image.png';
import logo from '../assets/logo_unram.png';
import './ResultPage.css';

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { prediction, imgUrl, patientData, diagnosisResult, treatment_info } = location.state || {};
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [newPrediction, setNewPrediction] = useState({});
    const [showPredictionForm, setShowPredictionForm] = useState(false); // State to show prediction form

    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const adminData = docSnap.data();
                        setUserDetails({ photo: adminData.photo });
                    } else {
                        console.log("User document does not exist");
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                console.log("User is not logged in");
                setLoading(false);
            }
        });
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleDropdown = () => {
        setOpen(!open);
    };

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            console.log("Successfully signed out");
            navigate('/login');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const handleInputChange = (key, value) => {
        setNewPrediction(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveNewPrediction = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const patientDocRef = doc(db, "patients", patientData.patientNo);
                await setDoc(patientDocRef, {
                    newPrediction,
                    createdAt: new Date(),
                }, { merge: true });
                console.log('New prediction saved successfully:', newPrediction);
                setNewPrediction({});
                navigate('/dokter/riwayat-pasien'); // Navigate to history after saving
            }
        } catch (error) {
            console.error('Error saving new prediction:', error);
        }
    };

    if (!userDetails) {
        return (
            <div className="loader-container">
                <ClipLoader size={50} color={"#123abc"} loading={loading} />
            </div>
        );
    }

    return (
        <div className='App'>
            <div className='header-db'>
                {/* Header and User Details */}
                <div className='top-headers'>
                                <div className='list-top'>
                                                    <div className='logo-name'>
                                                <img src={logo} alt="" />
                                                <div className='logo-texts'>
                                                    <p>Pneumonia Detection</p>
                                                    <p>Universitas Mataram</p>
                                                </div>
                                            </div>
                                            <div className='notification-top'>
                                                
                                            </div>

                                            <div className='image-top'>
                                                <img
                                                    src={userDetails.photo || blank_image }
                                                    alt=""
                                                    className='profile-image'
                                                    onClick={() => {setOpen(!open)}}
                                                />
                                            </div>
                    </div>
                </div>

                <div className='name-headers'>
                    <p>Cek Pneumonia</p>
                </div>

                <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`}>
                    <ul>
                        <li className="dropdownItem" onClick={handleDropdown}>
                            <a href="#">Pengaturan</a>
                        </li>
                        <li className="dropdownItem" onClick={handleSignOut}>
                            <a href="#">Keluar Akun</a>
                        </li>
                    </ul>
                </div>

                {/* Patient Data */}
                <div className='container-page'>
                    <div className='title-container'>
                        <ul>Cek Pneumonia</ul>
                        <p>- Data Pasien</p>
                    </div>
                    <div className='line-container' />

                    <div className='row-container'>
                        <div className='column-container'>
                            <div className='data-patient'>
                                <p>No Pasien</p>
                                <div className='form-data'>
                                    <p>{patientData.patientNo}</p>
                                </div>

                                <p>Nama Lengkap</p>
                                <div className='form-data'>
                                    <p>{patientData.fullName}</p>
                                </div>

                                <p>Kota Tempat Lahir</p>
                                <div className='form-data'>
                                    <p>{patientData.birthPlace}</p>
                                </div>

                                <p>Tanggal lahir</p>
                                <div className='form-data'>
                                    <p>{patientData.birthDate}</p>
                                </div>
                            </div>
                        </div>

                        <div className='column-container'>
                            <div className='data-patient'>
                                <p>Jenis Kelamin</p>
                                <div className='form-data'>
                                    <p>{patientData.genderPatient}</p>
                                </div>

                                <p>TB</p>
                                <div className='form-data'>
                                    <p>{patientData.height}</p>
                                </div>

                                <p>BB</p>
                                <div className='form-data'>
                                    <p>{patientData.weight}</p>
                                </div>

                                <p>Golongan Darah</p>
                                <div className='form-data'>
                                    <p>{patientData.bloodType}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <br />
                </div>

                {/* Results Section */}
                <div className='container-page'>
                    <div className='title-container'>
                        <ul>Hasil Pemeriksaan</ul>
                        <p> -  Prediksi Pneumonia</p>
                    </div>
                    <div className='line-container' />

                    <div className='row-resultsm'>
                        <div className='container-page-resultm'>
                            {prediction && imgUrl && patientData ? (
                                <div className='result-containers'>
                                    <div className='row-resultsm'>
                                        <img src={imgUrl} alt="X-Ray" className='result-image' />
                                    </div>
                                    <div className='column-resultsm'>
                                        <h2>Prediksi Pneumonia</h2>
                                        <ul>
                                            {Object.entries(prediction).map(([key, value]) => (
                                                <li key={key}>
                                                    {key}: {`${value.toFixed(2)}%`}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <p>Tidak ada data prediksi yang tersedia.</p>
                            )}
                            <br />
                        </div>

                        <div className='column-result-results'>
                            <div className='result-treatments'>
                                {treatment_info && (
                                    <div className="treatment-info-containers">
                                        <h2>Informasi Perawatan</h2>
                                        {typeof treatment_info === 'string' ? (
                                            <p>{treatment_info}</p>
                                        ) : (
                                            <ul>
                                                {Object.entries(treatment_info).map(([key, value]) => (
                                                    <li key={key}>
                                                        <strong>{key}:</strong> {value}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        <br />
                                    </div>
                                )}
                            </div>

                            <div className='diagnose-results'>
                                <h2>Penyakit Lainnya</h2>
                                <p>{diagnosisResult.join(', ')}</p>
                            </div>
                        </div>
                    </div>
                    <br />
                    <br />
                </div>

                {/* New Prediction Form */}
                    {showPredictionForm && (
                        <div className='new-prediction-form'>
                            <h2>Masukkan Prediksi Baru</h2>
                            <ul>
                                {Object.keys(prediction).map((key) => (
                                    <li key={key}>
                                        {key}:
                                        <input
                                            type="number"
                                            placeholder={`Masukkan ${key}`}
                                            value={newPrediction[key] || ''}
                                            onChange={(e) => handleInputChange(key, parseFloat(e.target.value))}
                                            onFocus={(e) => e.target.select()} // Automatically select input on focus
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}


                {/* Yes/No Buttons */}
                <div className='row-predict'>
                    <p>Apakah hasil prediksi sesuai?</p>
                    <button className='btn-history-pneumonias' onClick={handleSaveNewPrediction}>
                        Ya
                    </button>
                    <button className='btn-historys-pneumonias' onClick={() => setShowPredictionForm(true)}>
                        Tidak
                    </button>
                </div>

                

                <div className='span-spacing' />
                <br />
                <br />
            </div>
        </div>
    );
};

export default ResultPage;
