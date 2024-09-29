import React, { useState, useEffect } from 'react';
import './DataPneumonia.css';
import { FaUpload } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ClipLoader } from 'react-spinners';
import DataTable from 'react-data-table-component';
import blank_image from '../assets/blank_image.png'; 
import axios from 'axios';
import InputForm from '../component/InputForm'; 
import DropdownInput from '../component/DropdownInput'
import logo from '../assets/logo_unram.png'
import { notification } from 'antd';

const data = [
        { id: 1, code: '001', check: 'Riwayat Penyakit Hati', type: 'dropdown', value: 'tidak' },
        { id: 2, code: '002', check: 'Riwayat Penyakit Jantung Kongestif', type: 'dropdown', value: 'tidak' },
        { id: 3, code: '003', check: 'Riwayat Penyakit Ginjal', type: 'dropdown', value: 'tidak' },
        { id: 4, code: '004', check: 'Riwayat Penyakit Asma', type: 'dropdown', value: 'iya' },
        { id: 5, code: '005', check: 'Mengalami Batuk', type: 'dropdown', value: 'iya' },
        { id: 6, code: '006', check: 'Batuk Berdahak selama > 2-3 Minggu', type: 'dropdown', value: 'iya' },
        { id: 7, code: '007', check: 'Batuk Berdahak', type: 'dropdown', value: 'iya' },
        { id: 8, code: '008', check: 'Demam Tinggi', type: 'dropdown', value: 'tidak' },
        { id: 9, code: '009', check: 'Sesak Nafas dan Nyeri Dada', type: 'dropdown', value: 'iya' },
        { id: 10, code: '010', check: 'Mual dan Muntah', type: 'dropdown', value: 'tidak' },
        { id: 11, code: '011', check: 'Kesehatan Menurun', type: 'dropdown', value: 'iya' },
        { id: 12, code: '012', check: 'Tubuh Mulai Lelah', type: 'dropdown', value: 'iya' },
        { id: 13, code: '013', check: 'Keringat Malam tanpa Aktivitas', type: 'dropdown', value: 'tidak' },
];

const diagnoseDisease = (data) => {
    const diseases = {
        Pneumonia: [
            'Mengalami Batuk',
            'Batuk Berdahak selama > 2-3 Minggu',
            'Batuk Berdahak',
            'Demam Tinggi',
            'Sesak Nafas dan Nyeri Dada',
            'Efusi Plura'
        ],
        Asma: [
            'Riwayat Penyakit Asma',
            'Sesak Nafas dan Nyeri Dada',
            'Kesehatan Menurun',
            'Tubuh Mulai Lelah'
        ],
        'Penyakit Paru Obstruktif Kronis (PPOK)': [
            'Mengalami Batuk',
            'Batuk Berdahak',
            'Sesak Nafas dan Nyeri Dada',
            'Kesehatan Menurun',
            'Tubuh Mulai Lelah'
        ],
        Tuberkulosis: [
            'Batuk Berdahak selama > 2-3 Minggu',
            'Demam Tinggi',
            'Keringat Malam tanpa Aktivitas',
            'Kesehatan Menurun',
            'Tubuh Mulai Lelah'
        ]
    };

    let diagnosis = {
        Pneumonia: [],
        Asma: [],
        'Penyakit Paru Obstruktif Kronis (PPOK)': [],
        Tuberkulosis: []
    };

    data.forEach(item => {
        if (item.value === 'iya') {
            Object.keys(diseases).forEach(disease => {
                if (diseases[disease].includes(item.check)) {
                    diagnosis[disease].push(item);
                }
            });
        }
    });

    const filteredDiagnosis = {};
    Object.keys(diagnosis).forEach(disease => {
        if (diagnosis[disease].length > 0) {
            filteredDiagnosis[disease] = diagnosis[disease];
        }
    });

    return filteredDiagnosis;
};

function DataPneumonia() {
    const navigate = useNavigate();
    const location = useLocation();
    const { patientId } = location.state || {};
    const [patientData, setPatientData] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [imgUrl, setImgUrl] = useState(null);
    const [formData, setFormData] = useState({});
    const [diagnosisResult, setDiagnosisResult] = useState(null);
    const [treatmentInfo, setTreatmentInfo] = useState(null); 

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const adminData = docSnap.data();
                            setUserDetails({
                            photo: adminData.photo,
                        });
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

    const fetchPatientData = async () => {
        try {
            if (!patientId) {
                console.log('Patient ID not provided');
                setLoading(false);
                return;
            }
            const patientDoc = doc(db, 'patients', patientId);
            const patientSnap = await getDoc(patientDoc);
            if (patientSnap.exists()) {
                setPatientData(patientSnap.data());
            } else {
                console.log('Patient data not found');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching patient data:', error);
            setLoading(false);
        }
    };

    const handleDropdown = () => {
        navigate('/dashboard/setting');
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

    const handlePredict = async () => {
        if (!file) {
            alert("Please upload an image first.");
            return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            const response = await axios.post('http://localhost:5000/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            console.log('Server Response:', response.data); 
    
            if (response.data && response.data.prediction && response.data.img_url && response.data.treatment_info) {
                setPrediction(response.data.prediction);
                setImgUrl(response.data.img_url);
                setTreatmentInfo(response.data.treatment_info);

                const result = diagnoseDisease(data);
                setDiagnosisResult(result);

                await updatePatientData(patientId, {
                    prediction: response.data.prediction,
                    imgUrl: response.data.img_url,
                    diagnosisResult: result,
                    treatment_info: response.data.treatment_info
                });

                notification.success({
                    message: 'Pengajuan Prediksi Berhasil',
                    description: 'Silakan Untuk Melihat Hasil Prediksi.',
                });

                navigate('/dokter/pneumonia/hasil', {
                    state: {
                        prediction: response.data.prediction,
                        imgUrl: response.data.img_url,
                        diagnosisResult: Object.keys(result),
                        patientData: patientData,
                        treatment_info: response.data.treatment_info
                    }
                });
            } else {
                console.error('Invalid response format:', response);
            }
        } catch (error) {
            console.error("Error making prediction:", error);
            notification.error({
                message: 'Pengajuan Prediksi Gagal',
                description: 'Terjadi kesalahan. Silakan coba lagi.',
            });            
        }
    };
    

    const updatePatientData = async (patientId, newData) => {
        const patientRef = doc(db, 'patients', patientId);
        try {
            await updateDoc(patientRef, newData);
            console.log('Patient data updated successfully');
        } catch (error) {
            console.error('Error updating patient data:', error);
        }
    };
    
    useEffect(() => {
        fetchUserData();
        fetchPatientData();
    }, [patientId]);

    const tableData = data.map(item => ({
        ...item,
        action: item.value || 'tidak', // Default to 'tidak'
    }));

    const handleInputChange = (id, value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [id]: value
        }));
    };

    const columns = [
        {
            name: 'No',
            selector: row => row.id,
            sortable: true,
            width: '150px'
        },
        {
            name: 'Kode',
            selector: row => row.code,
            sortable: true,
            width: '250px'
        },
        {
            name: 'Pemeriksaan',
            selector: row => row.check,
            width: '500px'

        },
        {
            name: 'Keterangan',
            selector: row => row.action,
            cell: row => (
                <DropdownInput
                    value={formData[row.id] || "tidak"}
                    onChange={(e) => handleInputChange(row.id, e.target.value)}
                />
            ),
            width: '300px'
        }
    ];

    const customStyles = {
        rows: {
            style: {
                minHeight: '50px',
            },
        },
        headCells: {
            style: {
                paddingLeft: '30px',
                paddingRight: '30px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#4A4A4A'
            },
        },
        cells: {
            style: {
                paddingLeft: '30px',
                paddingRight: '30px',
                fontSize: '14px'
            },
        },
    };

    
    if (loading) {
        return (
            <div className="loader-container">
                <ClipLoader size={50} color={"#123abc"} loading={loading} />
            </div>
        );
    }

    if (!userDetails || !patientData) {
        return (
            <div className="loader-container">
                <ClipLoader size={50} color={"#123abc"} loading={loading} />
            </div>
        );
    }

    return (
        <React.Fragment>
            <div className='App'>
                <div className='header-db'>
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
                        <p>
                            Cek Pneumonia
                        </p>
                    </div>

                    <div className={`dropdown-menu ${open? 'active' : 'inactive'}`} >
                        <ul>
                            <li className="dropdownItem" onClick={handleDropdown}>
                                <a href="#">Pengaturan</a>
                            </li>
                            <li className="dropdownItem" onClick={handleSignOut}>
                                <a href="#">Keluar Akun</a>
                            </li>
                        </ul>
                    </div>

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
                                        <p>{patientData?.patientNo}</p>
                                    </div>

                                    <p>Nama Lengkap</p>
                                    <div className='form-data'>
                                        <p>{patientData?.fullName}</p>
                                    </div>

                                    <p>Kota Tempat Lahir</p>
                                    <div className='form-data'>
                                        <p>{patientData?.birthPlace}</p>
                                    </div>

                                    <p>Tanggal lahir</p>
                                    <div className='form-data'>
                                        <p>{patientData?.birthDate}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='column-container'>
                                <div className='data-patient'>
                                    <p>Jenis Kelamin</p>
                                    <div className='form-data'>
                                        <p>{patientData?.genderPatient}</p>
                                    </div>

                                    <p>TB</p>
                                    <div className='form-data'>
                                        <p>{patientData?.height}</p>
                                    </div>

                                    <p>BB</p>
                                    <div className='form-data'>
                                        <p>{patientData?.weight}</p>
                                    </div>

                                    <p>Golongan Darah</p>
                                    <div className='form-data'>
                                        <p>{patientData?.bloodType}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <br />
                    </div>

                    <div className='container-page'>
                        <div className='title-container'>
                            <ul>Data Pasien</ul>
                            <p>- Status Pasien</p>
                        </div>
                        <div className='line-container' />

                        <div className='column-container'>
                            <div className='data-patients'>
                                <p>Status Pasien</p>
                                <div className='form-datas'>
                                    <p>Pasien {patientData?.typePatient}</p>
                                </div>

                                <p>Nomor BPJS</p>
                                <div className='form-datas'>
                                    <p>{patientData?.bpjsNumber}</p>
                                </div>
                            </div>
                        </div>
                        <br />
                        <br />
                    </div>

                    <div className='container-page'>
                        <div className='title-container'>
                            <ul>Data Pasien </ul>
                            <p>- Penanggung Jawab</p>
                        </div>
                        <div className='line-container' />

                        <div className='row-container'>
                            <div className='column-container'>
                                <div className='data-patient'>
                                    <p>Nama</p>
                                    <div className='form-data'>
                                        <p>{patientData?.guardianName}</p>
                                    </div>

                                    <p>Hubungan Dengan Pasien</p>
                                    <div className='form-data'>
                                        <p>{patientData?.relationPatient}</p>
                                    </div>

                                    <p>Alamat</p>
                                    <div className='form-data'>
                                        <p>{patientData?.guardianAddress}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='column-container'>
                                <div className='data-patient'>
                                    <p>Jenis Kelamin</p>
                                    <div className='form-data'>
                                        <p>{patientData?.genderPerson}</p>
                                    </div>

                                    <p>Pekerjaan</p>
                                    <div className='form-data'>
                                        <p>{patientData?.guardianOccupation}</p>
                                    </div>

                                    <p>Nomor Telepon</p>
                                    <div className='form-data'>
                                        <p>{patientData?.PhoneNumber}</p>
                                    </div>
                                </div>
                                <div className='span-spacing'/>
                            </div>
                        </div>
                        <br />
                        <br />
                    </div>

                    <div className='container-page'>
                                <div className='title-container'>
                                    <ul>Cek Pneumonia</ul>
                                    <p>- Formulir Gejala</p>
                                </div>
                                <div className='line-container' />

                                <form>
                                    <div className='data-container'>
                                    <DataTable
                                        columns={columns}
                                        data={tableData} // Use the updated tableData
                                        fixedHeader
                                        className='custom-tables'
                                        customStyles={customStyles}
                                        conditionalRowStyles={[
                                            {
                                                when: row => row.year > 2000,
                                                style: {
                                                    backgroundColor: 'rgba(63, 195, 128, 0.9)',
                                                    color: 'white',
                                                    '&:hover': {
                                                        cursor: 'pointer',
                                                    },
                                                },
                                            },
                                        ]}
                                        pagination
                                        style={{ display: 'flex', justifyContent: 'center' }} // Center the table
                                    />
                                    </div>
                                </form>
                            </div>

                    
                                   

                    <div className='container-page'>
                        <div className='title-container'>
                            <ul>Data Pasien</ul>
                            <p>- Upload X-Ray</p>
                        </div>
                        <div className='line-container' />

                        <div className='image-uploaded'>
                            <input 
                                type='file' 
                                id='file-upload' 
                                className='input-file' 
                                onChange={handleFileChange} 
                            />
                            {preview && <img src={preview} alt="Preview" className='previews-image' />}
                            {!preview && <FaUpload className='icons-uploaded' />}
                            <label htmlFor='file-upload' className='custom-file-upload'>
                                Pilih Gambar
                            </label>
                        </div>
                        <br />

                        <div className='span-spacings' />
                    </div>
                    <br />
                    <br />

                    <div className='span-spacings' />
                        <button className='btn-form-pneumonia' onClick={handlePredict}>
                            Prediksi
                        </button>
                    <div className='span-spacing' />
                 <br />
                 <br />
                 <br />
                 <br />
                 <br />
                 <br />

                </div>
            </div>
        </React.Fragment>
    );
}

export default DataPneumonia;
