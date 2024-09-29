import React, { useState, useEffect } from 'react';
import './PageHealth.css';
import { IoNotificationsSharp } from "react-icons/io5";
import { auth, db } from '../../firebase';
import { doc, getDoc, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { ClipLoader } from 'react-spinners';
import blank_image from '../assets/blank_image.png';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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

function PageHealth() {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [patients, setPatients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [patientsPerPage] = useState(5);
    const navigate = useNavigate();

    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
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
                setLoading(false);
            } else {
                console.log("User is not logged in");
                setLoading(false);
            }
        });
    };

    const fetchPatientsData = async () => {
        try {
            if (!userDetails) {
                console.log('User details not available');
                setLoading(false);
                return;
            }

            const doctorName = userDetails.fullName; 
            const q = query(collection(db, 'patients'), where('doctor.name', '==', doctorName), where('detailCheck', '==', 'Cek Kesehatan'));
            const patientsSnapshot = await getDocs(q);
            const patientsData = patientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPatients(patientsData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching patients data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchUserData();
            if (userDetails) {
                await fetchPatientsData();
            }
        };
        fetchData();
    }, [userDetails]);

    if (!userDetails) {
        return (
            <div className="loader-container">
                <ClipLoader size={50} color={"#123abc"} loading={loading} />
            </div>
        );
    }

    const handleAccept = (patient) => {
        navigate(`/patient-detail/${patient.id}`);
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
    const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);

    const nextPage = () => setCurrentPage(currentPage + 1);
    const prevPage = () => setCurrentPage(currentPage - 1);

    return (
        <div className='header-db-admin'>
            <div className='top-headers'>
                <div className='list-tops'>
                    <div className='notification-tops'>
                        <IoNotificationsSharp className='icon-headers' />
                    </div>
                    <div className='image-tops'>
                        <img src={userDetails.photo || blank_image} alt="" />
                    </div>
                </div>
            </div>

            <div className='name-headers'>
                <p>Cek Kesehatan</p>
            </div>

            <div className='container-page'>
                <div className='title-container'>
                    <ul>Cek Kesehatan</ul>
                    <p>- Daftar Pasien</p>
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
                            {currentPatients
                                .sort((a, b) => (a.patientNo < b.patientNo) ? 1 : -1)
                                .map((patient, index) => (
                                    <tr key={index}>
                                        <td>{patient.registrationDate}</td>
                                        <td>{patient.patientNo}</td>
                                        <td>{patient.fullName}</td>
                                        <td>{calculateAge(patient.birthDate)}</td>
                                        <td>{patient.poliObject}</td>
                                        <td>{patient.doctor.name}</td>
                                        <td>{patient.typePatient}</td>
                                        <td>
                                            <Button variant="success" onClick={() => handleAccept(patient)} className='btn-action-table'>Terima</Button>
                                
                                            <Button variant="danger" onClick={() => handleDelete(patient.id)} className='btn-action-tables' >Hapus</Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                    <div className="pagination">
                        {currentPage > 1 && (
                            <span onClick={prevPage}>{"<<"}</span>
                        )}
                        {[...Array(Math.ceil(patients.length / patientsPerPage)).keys()].map(page => (
                            <span
                                key={page}
                                className={currentPage === page + 1 ? 'active' : ''}
                                onClick={() => setCurrentPage(page + 1)}
                            >
                                {page + 1}
                            </span>
                        ))}
                        {currentPage < Math.ceil(patients.length / patientsPerPage) && (
                            <span onClick={nextPage}>{">>"}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PageHealth;
