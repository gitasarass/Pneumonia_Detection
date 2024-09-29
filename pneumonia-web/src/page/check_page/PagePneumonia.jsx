import React, { useState, useEffect } from 'react';
import './PagePneumonia.css';
import { IoNotificationsSharp } from "react-icons/io5";
import { auth, db } from '../../firebase';
import { doc, getDoc, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { ClipLoader } from 'react-spinners';
import blank_image from '../assets/blank_image.png';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo_unram.png';
import { IoIosSearch } from "react-icons/io";

const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth() - birth.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return `${age} tahun`;
}

function PagePneumonia() {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [patients, setPatients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [patientsPerPage] = useState(5);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch user data
    const fetchUserData = async () => {
        return new Promise((resolve, reject) => {
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const adminData = docSnap.data();
                        setUserDetails({
                            photo: adminData.photo,
                            fullName: adminData.fullName,
                        });
                        resolve();
                    } else {
                        console.log("User document does not exist");
                        reject();
                    }
                } else {
                    console.log("User is not logged in");
                    reject();
                }
            });
        });
    };

    // Fetch patient data
    const fetchPatientsData = async () => {
        try {
            if (!userDetails) {
                console.log('User details not available');
                setLoading(false);
                return;
            }

            const today = new Date();
            const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
            const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

            const doctorName = userDetails.fullName;

            const q = query(
                collection(db, 'patients'), 
                where('doctor.name', '==', doctorName),
                where('detailCheck', '==', 'Cek Pneumonia'),
                where('registrationDate', '>=', todayStart),
                where('registrationDate', '<=', todayEnd)
            );

            const patientsSnapshot = await getDocs(q);
            const patientsData = patientsSnapshot.docs.map(doc => {
                const data = doc.data();
                return { 
                    id: doc.id, 
                    ...data,
                    registrationDate: data.registrationDate.toDate(),
                };
            });
            setPatients(patientsData);
        } catch (error) {
            console.error('Error fetching patients data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchUserData();
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (userDetails) {
            fetchPatientsData();
        }
    }, [userDetails]);

    if (loading) {
        return (
            <div className="loader-container">
                <ClipLoader size={50} color={"#123abc"} loading={loading} />
            </div>
        );
    }

    if (!userDetails) {
        return <div>User details not available</div>;
    }

    const handleNavigateToData = (patientId) => {
        navigate('/dokter/pneumonia/data', { state: { patientId } });
    };

    const handleDelete = async (patientId) => {
        try {
            if (!patientId) {
                console.error('Patient ID is undefined');
                return;
            }
            console.log('Deleting patient with ID:', patientId);
            await deleteDoc(doc(db, 'patients', patientId));
            setPatients(patients.filter(patient => patient.id !== patientId));
        } catch (error) {
            console.error('Error deleting patient:', error);
        }
    };

    // Pagination
    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;

    // Filter patients based on search
    const filteredPatients = patients.filter((patient) =>
        patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        patient.patientNo.toString().includes(searchTerm) ||
        patient.poliObject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

    const nextPage = () => setCurrentPage(currentPage + 1);
    const prevPage = () => setCurrentPage(currentPage - 1);

    return (
        <div className='header-db-admin'>
            <div className='top-headers'>
                <div className='list-top'>
                    <div className='logo-name'>
                        <img src={logo} alt="" />
                        <div className='logo-texts'>
                            <p>Pneumonia Detection</p>
                            <p>Universitas Mataram</p>
                        </div>
                    </div>
                    <div className='notification-top'></div>

                    <div className='image-top'>
                        <img
                            src={userDetails.photo || blank_image }
                            alt=""
                            className='profile-image'
                        />
                    </div>
                </div>
            </div>

            <div className='name-headers'>
                <p>Cek Pneumonia</p>
            </div>

            <div className='container-page'>
                <div className='title-container'>
                <ul>Cek Pneumonia</ul>
                <p>- Data Pasien</p>
                {/* Input Pencarian */}
                
                <div className='icon-searchss'>
                    <IoIosSearch />
                </div>
                    <div className="search-container">
                    
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama, nomor pasien, atau poli"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    </div>
            </div>
                <div className='line-container' />

                <div className='table-container'>
                    <Table className="custom-table-user" striped bordered hover>
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>No Pasien</th>
                                <th>Nama Pasien</th>
                                <th>Umur</th>
                                <th>Poli</th>
                                <th>Dokter</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPatients.map((patient, index) => (
                                <tr key={index}>
                                    <td>{patient.registrationDate.toLocaleDateString()}</td>
                                    <td>{patient.patientNo}</td>
                                    <td>{patient.fullName}</td>
                                    <td>{calculateAge(patient.birthDate)}</td>
                                    <td>{patient.poliObject}</td>
                                    <td>{patient.doctor.name}</td>
                                    <td>{patient.typePatient}</td>
                                    <td>
                                        <Button variant="success" onClick={() => handleNavigateToData(patient.id)} className='btn-action-table'>Terima</Button>
                                        <Button variant="danger" onClick={() => handleDelete(patient.id)} className='btn-action-tables'>Hapus</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className="pagination">
                        {currentPage > 1 && (
                            <span onClick={prevPage}>{"<<"}</span>
                        )}
                        {[...Array(Math.ceil(filteredPatients.length / patientsPerPage)).keys()].map(page => (
                            <span
                                key={page}
                                className={currentPage === page + 1 ? 'active' : ''}
                                onClick={() => setCurrentPage(page + 1)}
                            >
                                {page + 1}
                            </span>
                        ))}
                        {currentPage < Math.ceil(filteredPatients.length / patientsPerPage) && (
                            <span onClick={nextPage}>{">>"}</span>
                        )}
                    </div>
                </div>
            
                
            </div>
        </div>

    );
}

export default PagePneumonia;