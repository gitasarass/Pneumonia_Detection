import React, { useState, useEffect } from 'react';
import blank_image from '../assets/blank_image.png';
import { auth, db } from '../../firebase';
import { getDoc, doc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { Table } from 'react-bootstrap';
import ClipLoader from "react-spinners/ClipLoader";
import logo from '../assets/logo_unram.png';
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
};

function HistoryPatient() {
  const [userDetails, setUserDetails] = useState(null);
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const fetchAdminData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
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
      const patientsSnapshot = await getDocs(collection(db, 'patients'));
      const patientsData = patientsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      // Filter only patients with predictions
      const filteredPatients = patientsData.filter(patient => patient.prediction);

      const sortedPatients = filteredPatients.sort((a, b) => {
        const dateA = a.registrationDate ? a.registrationDate.toDate() : new Date(0);
        const dateB = b.registrationDate ? b.registrationDate.toDate() : new Date(0);
        return dateB - dateA;
      });

      setPatients(sortedPatients);
    } catch (error) {
      console.error('Error fetching patients data:', error);
    } finally {
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
    navigate('/admin/pengaturan');
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log("Successfully signed out");
      navigate('/admin-login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

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

  const filteredPatients = patients.filter((patient) => {
    const fullNameMatch = patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const patientNoMatch = patient.patientNo?.toString().includes(searchTerm) || false;
    const poliObjectMatch = patient.poliObject?.toLowerCase().includes(searchTerm.toLowerCase()) || false;

    return fullNameMatch || patientNoMatch || poliObjectMatch;
  });

  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  // Fungsi untuk mendapatkan hasil prediksi terbesar
  const getHighestPrediction = (prediction) => {
    if (!prediction) return null;

    const entries = Object.entries(prediction);
    const highest = entries.reduce((max, curr) => (curr[1] > max[1] ? curr : max), entries[0]);

    return highest;
  };

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
                    <th>Hasil</th>
                    <th>Gambar</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPatients.map((patient, index) => {
                    const highestPrediction = getHighestPrediction(patient.prediction);
                    return (
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
                        <td>
                          {highestPrediction ? (
                            <div>
                              {highestPrediction[0]}: {highestPrediction[1].toFixed(2)}%
                            </div>
                          ) : (
                            "Tidak ada prediksi"
                          )}
                        </td>
                        <td>
                            {patient.imgUrl ? (
                              <img
                                src={patient.imgUrl}
                                alt="Gambar Pneumonia"
                                className='patient-image'
                                style={{ width: '100px', height: 'auto' }} // Adjust the size as needed
                              />
                            ) : (
                              "Tidak ada gambar"
                            )}
                          </td>

                      </tr>
                    );
                  })}
                </tbody>
              </Table>

              {/* Pagination */}
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
      </section>
    </React.Fragment>
  );
}

export default HistoryPatient;
