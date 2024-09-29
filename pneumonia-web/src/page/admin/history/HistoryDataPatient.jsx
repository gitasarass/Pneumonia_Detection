import React, { useState, useEffect } from 'react';
import blank_image from '../../assets/blank_image.png';
import { auth, db } from '../../../firebase';
import { getDoc, doc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { Table } from 'react-bootstrap';
import './HistoryDataPatient.css';
import ClipLoader from "react-spinners/ClipLoader";
import logo from '../../assets/logo_unram.png';
import NotificationModal from '../component/NotificationModal';
import { notification } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { IoIosSearch } from "react-icons/io";

const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const month = today.getMonth() - birth.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return `${age} th`;
}

function HistoryDataPatient() {
  const [userDetails, setUserDetails] = useState(null);
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(5);
  const [loading, setLoading] = useState(true); 
  const [searchTerm, setSearchTerm] = useState(''); // State untuk pencarian
  const [showNotification, setShowNotification] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const fetchAdminData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "admins", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
          setLoading(false)
        } else {
          console.log("User document does not exist");
          setLoading(false)
        }
      } else {
        console.log("User is not logged in");
        setLoading(false)
      }
    });
  };

  const reRegisterPatient = async (patientId) => {
    try {
      const patientRef = doc(db, 'patients', patientId);
      await updateDoc(patientRef, {
        registrationDate: new Date() // Set tanggal pendaftaran ke tanggal saat ini
      });
  
      // Perbarui data pasien di state
      setPatients(prevPatients => 
        prevPatients.map(patient => 
          patient.id === patientId 
            ? { ...patient, registrationDate: new Date() } // Perbarui tanggal di state
            : patient
        )
      );
  
      notification.success({
        message: 'Berhasil',
        description: 'Pasien telah didaftarkan ulang.',
      });
    } catch (error) {
      console.error('Error re-registering patient:', error);
      notification.error({
        message: 'Error',
        description: 'Terjadi kesalahan saat mendaftarkan ulang pasien.',
      });
    }
  };  

  const fetchPatientsData = async () => {
    try {
      const patientsSnapshot = await getDocs(collection(db, 'patients'));
      const patientsData = patientsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  
      // Sort patients by registrationDate (latest first)
      const sortedPatients = patientsData.sort((a, b) => {
        const dateA = a.registrationDate ? a.registrationDate.toDate() : new Date(0); // fallback to epoch if not available
        const dateB = b.registrationDate ? b.registrationDate.toDate() : new Date(0);
        return dateB - dateA; // Sort descending
      });
  
      setPatients(sortedPatients);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patients data:', error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchAdminData(), fetchPatientsData()]);
    };
    fetchData();
  }, []);

  const handleDropdown = () => {
    navigate('/admin/pengaturan')
  }

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log("Successfully signed out");
      navigate('/admin-login')
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!userDetails) {
    return (
      <div className="loader-container">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  // Pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  
  // Filter pasien berdasarkan pencarian
  const filteredPatients = patients.filter((patient) => {
    const fullNameMatch = patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const patientNoMatch = patient.patientNo?.toString().includes(searchTerm);
    const poliMatch = patient.poliObject?.toLowerCase().includes(searchTerm.toLowerCase());
  
    return fullNameMatch || patientNoMatch || poliMatch;
  });
  

  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  return (
    <React.Fragment>
      <section>
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
                  src={userDetails.photo || blank_image}
                  alt="Profile"
                  className='profile-image'
                  onClick={() => { setOpen(!open) }}
                />
              </div>
            </div>
          </div>
          <div className='name-headers'>
            <p>Riwayat Pasien</p>
          </div>

          <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`}>
            <ul>
              <Link to={"/admin/pengaturan"} className="dropdownItem" onClick={handleDropdown}>
                <a>Pengaturan</a>
              </Link>
              <Link className="dropdownItem" onClick={handleSignOut}>
                <a>Keluar Akun</a>
              </Link>
            </ul>
          </div>

          <div className='container-page'>
            <div className='title-container'>
              <ul>Riwayat Pasien</ul>
              <p>- Informasi Pasien</p>
              {/* Input Pencarian */}
              
              <div className='icon-searchs'>
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
              <Table className="custom-table" striped bordered hover>
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>No Pasien</th>
                    <th>Nama Pasien</th>
                    <th>Umur</th>
                    <th>Poli</th>
                    <th>Dokter</th>
                    <th>Ket.</th>
                    <th>Status</th>
                    <th>Daftar Ulang</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPatients.map((patient, index) => (
                    <tr key={index}>
                      <td>
                        {patient.registrationDate && typeof patient.registrationDate.toDate === 'function' 
                          ? patient.registrationDate.toDate().toLocaleDateString('id-ID') 
                          : 'Tidak tersedia'}
                      </td>

                      <td>{patient.patientNo}</td>
                      <td>{patient.fullName}</td>
                      <td>{calculateAge(patient.birthDate)}</td>
                      <td>{patient.poliObject}</td>
                      <td>{patient.doctor?.name || "Tidak tersedia"}</td>
                      <td>{patient.detailCheck}</td>
                      <td>{patient.typePatient}</td>
                      <td>
                        <button className='btn-action-table' onClick={() => reRegisterPatient(patient.id)}>Daftar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              <div className="pagination">
                {currentPage > 1 && (
                  <span onClick={prevPage}>{"<<"}</span>
                )}
                {[...Array(Math.ceil(filteredPatients.length / patientsPerPage)).keys()].map(page => {
                  return (
                    <span
                      key={page}
                      className={currentPage === page + 1 ? 'active' : ''}
                      onClick={() => setCurrentPage(page + 1)}
                    >
                      {page + 1}
                    </span>
                  );
                })}
                {currentPage < Math.ceil(filteredPatients.length / patientsPerPage) && (
                  <span onClick={nextPage}>{">>"}</span>
                )}
              </div>
            </div>
          </div>

        </div>
        <div className='tag-web'>
        </div>
      </section>

      {showNotification && (
        <NotificationModal notification={selectedNotification} onClose={handleCloseNotification} />
      )}
    </React.Fragment>
  );
}

export default HistoryDataPatient;
