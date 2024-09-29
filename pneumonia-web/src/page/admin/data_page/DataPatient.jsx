import React, { useState, useEffect } from 'react';
import blank_image from '../../assets/blank_image.png'
import { getDoc, doc, collection, query, where, getDocs, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase';
import logo from '../../assets/logo_unram.png'
import { useNavigate, Link} from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import './DataPatient.css'
import { Timestamp } from 'firebase/firestore';

const DataPatient = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2,'0'); // Month as 3 digits
  const year = today.getFullYear();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    patientNo: '',
    fullName: '',
    birthPlace: '',
    birthDate: '',
    genderPatient: '',
    height: '',
    weight: '',
    bloodType: '',
    typePatient: '',
    bpjsNumber: '',
    guardianName: '',
    relationPatient: '',
    genderPerson: '',
    guardianAddress: '',
    guardianOccupation: '',
    guardianPhoneNumber: '',
    poliObject: '',
    doctor: '',
    detailCheck: '',
    registrationDate: new Date() // Ubah ini menjadi objek Date
  });

  const [users, setUsers] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [formattedDate, setFormattedDate] = useState(''); // Initialize formattedDate as a state

  const fetchAdminData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "admins", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
          setLoading(false);
        } else {
          console.log("User document does not exist");
          setLoading(false);
        }
      } else {
        console.log("User is not logged in");
        setLoading(false);
      }
    });
  };

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => doc.data());
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const generatePatientNo = async () => {
    try {
      const patientsSnapshot = await getDocs(collection(db, 'patients'));
      let lastPatientNo = 0;
  
      patientsSnapshot.forEach(doc => {
        const patientData = doc.data();
        const patientNo = patientData.patientNo;
  
        // Ensure patientNo is defined before using substring
        if (patientNo) {
          const numberPart = parseInt(patientNo.substring(1, 3), 10); // Ambil angka setelah 'P'
          if (numberPart > lastPatientNo) {
            lastPatientNo = numberPart;
          }
        } else {
          console.warn('patientNo is undefined for document:', doc.id);
        }
      });
  
      const newPatientNo = lastPatientNo + 1;
      const formattedPatientNo = `P${String(newPatientNo).padStart(2, '0')}${month}${year}`;
      setFormData(prevState => ({
        ...prevState,
        patientNo: formattedPatientNo
      }));
    } catch (error) {
      console.error('Error generating patient number:', error);
    }
  };
  
  
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchUsers(), generatePatientNo(), fetchAdminData()]);
    };
    fetchData();
  }, []); // Pastikan dependencies tidak menyebabkan masalah

  useEffect(() => {
    if (formData.registrationDate) {
      const date = formData.registrationDate.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      });
      setFormattedDate(date);
    }
  }, [formData.registrationDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const patientsRef = collection(db, 'patients');
  
      if (!selectedDoctor) {
        console.error('Informasi dokter belum dipilih');
        return;
      }
  
      const doctorQuery = query(collection(db, 'users'), where('fullName', '==', selectedDoctor));
      const doctorSnapshot = await getDocs(doctorQuery);
  
      if (doctorSnapshot.empty) {
        console.error('Dokter tidak ditemukan');
        return;
      }
  
      const doctorData = doctorSnapshot.docs[0].data();
  
      const updatedFormData = {
        ...formData,
        doctor: {
          name: selectedDoctor
        },
        registrationDate: Timestamp.fromDate(formData.registrationDate) // Konversi Date ke Timestamp
      };
  
      await setDoc(doc(patientsRef), updatedFormData);
      console.log('Data pasien berhasil disimpan');
  
      setFormData({
        ...formData,
        patientNo: '',
        fullName: '',
        birthPlace: '',
        birthDate: '',
        genderPatient: '',
        height: '',
        weight: '',
        bloodType: '',
        typePatient: '',
        bpjsNumber: '',
        guardianName: '',
        relationPatient: '',
        genderPerson: '',
        guardianAddress: '',
        guardianOccupation: '',
        guardianPhoneNumber: '',
        doctor: '',
        poliObject: '',
        statusForm: '',
        detailCheck: '',
        registrationDate: new Date() // Reset ke Date baru
      });
  
      setSelectedDoctor('');
      generatePatientNo();
      navigate('/admin/riwayat-pasien');
      setLoading(false);
    } catch (error) {
      console.error('Error menyimpan data pasien:', error);
      setLoading(false);
    }
  };

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

  return (
    <React.Fragment>
      <section>
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
            <p>Data Pasien</p>
          </div>

          <div className={`dropdown-menu ${open? 'active' : 'inactive'}`} >
          <ul>
                <Link to={"/admin/pengaturan"} className="dropdownItem" onClick={handleDropdown}>
                    <a>pengaturan</a>
                </Link>
                <Link className="dropdownItem" onClick={handleSignOut}>
                    <a>keluar akun</a>
                </Link>
          </ul>
          </div>

          <form onSubmit={handleSubmit}>
            <div className='container-page'>
              <div className='title-container'>
                <ul>Data Pasien</ul>
                <p>- Informasi Pasien</p>
              </div>
              <div className='line-container'/>
              <div className='row-container-patient'>
                <div className='column-container-patient'>
                  <div className='data-patient-admin'>
                    <p>No Pasien</p>
                    <div className='form-data-admin'>
                      <p>{formData.patientNo}</p>
                    </div>
                    <p>Nama Lengkap *</p>
                    <div className='form-data-admin'>
                    <input
                        type="text"
                        placeholder='Masukan Nama Lengkap Pasien'
                        value={formData.fullName}
                        name="fullName"
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                    <p>Tempat Lahir *</p>
                    <div className='form-data-admin'>
                    <input
                        type="text"
                        placeholder='Masukan Tempat Lahir Pasien'
                        value={formData.birthPlace}
                        name="birthPlace"
                        onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                      />
                    </div>
                    <p>Tanggal Lahir *</p>
                    <div className='form-data-admin'>
                    <input
                        type="date"
                        placeholder='Masukan Tanggal Pasien'
                        value={formData.birthDate}
                        name="birthDate"
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className='column-container-patient'>
                  <div className='data-patient-admin'>
                    <p>Jenis Kelamin *</p>
                    <div className='form-data-admin'>
                    <select
                        id="genderPatient"
                        name="genderPatient"
                        value={formData.genderPatient}
                        onChange={(e) => setFormData({ ...formData, genderPatient: e.target.value })}
                        required
                      >
                        <option value="" disabled>Pilih Jenis Kelamin</option>
                        <option value="Perempuan">Perempuan</option>
                        <option value="Laki-Laki">Laki-Laki</option>
                      </select>
                    </div>
                    <p>TB *</p>
                    <div className='form-data-admin'>
                    <input
                        type="text"
                        placeholder='Masukan Tinggi Badan'
                        value={formData.height}
                        name="height"
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      />
                    </div>
                    <p>BB *</p>
                    <div className='form-data-admin'>
                      <input
                        type="text"
                        placeholder='Masukan Berat Badan Pasien'
                        value={formData.weight}
                        name="weight"
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      />
                    </div>
                    <p>Golongan Darah *</p>
                    <div className='form-data-admin'>
                        <select
                        id="bloodType"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                        required
                      >
                        <option value="" disabled>Pilih Golongan Darah</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="O">O</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='container-page'>
              <div className='title-container'>
                <ul>Data Pasien</ul>
                <p>- Status Pasien</p>
              </div>
              <div className='line-container'/>
              <div className='row-container-patient'>
                <div className='column-container-patient-long'>
                  <div className='data-patient-admin-long'>
                    <p>Jenis Pasien</p>
                    <div className='form-data-admin-long'>
                      <select
                        id="typePatient"
                        name="typePatient"
                        value={formData.typePatient}
                        onChange={(e) => setFormData({ ...formData, typePatient: e.target.value })}
                        required
                      >
                        <option value="" disabled>Pilih</option>
                        <option value="Umum">Umum</option>
                        <option value="Asuransi">Asuransi</option>
                        <option value="BPJS">BPJS</option>
                      </select>
                    </div>
                    <p>Nomor BPJS</p>
                    <div className='form-data-admin-long'>
                      <input
                        type="text"
                        placeholder='Nomor BPJS'
                        value={formData.bpjsNumber}
                        name="bpjsNumber"
                        onChange={(e) => setFormData({ ...formData, bpjsNumber: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='container-page'>
              <div className='title-container'>
                <ul>Data Pasien</ul>
                <p>- Penanggung Jawab</p>
              </div>
              <div className='line-container'/>
              <div className='row-container-patient'>
                <div className='column-container-patient'>
                  <div className='data-patient-admin'>
                    <p>Nama Lengkap *</p>
                    <div className='form-data-admin'>
                      <input
                        type="text"
                        placeholder='Masukan Nama'
                        value={formData.guardianName}
                        name="guardianName"
                        onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                      />
                    </div>
                    <p>Hubungan Dengan Pasien *</p>
                    <div className='form-data-admin'>
                      <select
                        id="relationPatient"
                        name="relationPatient"
                        value={formData.relationPatient}
                        onChange={(e) => setFormData({ ...formData, relationPatient: e.target.value })}
                        required
                      >
                        <option value="" disabled>Pilih</option>
                        <option value="Orang Tua">Orang Tua</option>
                        <option value="Suami/Istri">Suami/Istri</option>
                        <option value="Anak">Anak</option>
                        <option value="Wali">Wali</option>
                      </select>
                    </div>
                    <p>Jenis Kelamin *</p>
                    <div className='form-data-admin'>
                      <select
                        id="genderPerson"
                        name="genderPerson"
                        value={formData.genderPerson}
                        onChange={(e) => setFormData({ ...formData, genderPerson: e.target.value })}
                        required
                      >
                        <option value="" disabled>Pilih Jenis Kelamin</option>
                        <option value="Wanita">Perempuan</option>
                        <option value="Pria">Laki-Laki</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className='column-container-patient'>
                  <div className='data-patient-admin'>
                    <p>Alamat *</p>
                    <div className='form-data-admin'>
                    <input
                        type="text"
                        placeholder='Masukan Alamat'
                        value={formData.guardianAddress}
                        name="guardianAddress"
                        onChange={(e) => setFormData({ ...formData, guardianAddress: e.target.value })}
                      />
                    </div>
                    <p>Pekerjaan *</p>
                    <div className='form-data-admin'>
                      <input
                        type="text"
                        placeholder='Masukan Pekerjaan'
                        value={formData.guardianOccupation}
                        name="guardianOccupation"
                        onChange={(e) => setFormData({ ...formData, guardianOccupation: e.target.value })}
                      />
                    </div>
                    <p>Nomor Telepon *</p>
                    <div className='form-data-admin'>
                      <input
                        type="text"
                        placeholder='Masukan Nomor Telepon'
                        value={formData.guardianPhoneNumber}
                        name="guardianPhoneNumber"
                        onChange={(e) => setFormData({ ...formData, guardianPhoneNumber: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='container-page'>
              <div className='title-container'>
                <ul>Data Pasien</ul>
                <p>- Poli Tujuan</p>
              </div>
              <div className='line-container'/>
              <div className='row-container-patient'>
                <div className='column-container-patient-long'>
                  <div className='data-patient-admin-long'>
                    <p>Poli Tujuan</p>
                    <div className='form-data-admin-long'>
                    <select
                              id="poliObject"
                              name="poliObject"
                              value={formData.poliObject}
                              onChange={(e) => setFormData({ ...formData, poliObject: e.target.value })}
                              required
                            >
                              <option value="" disabled>Pilih</option>
                              <option value="Paru">Spesialis Paru</option>
                            </select>
                    </div>
                    <p>Dokter Tujuan </p>
                    <div className='form-data-admin-long'>
                    <select
                        onFocus={fetchUsers}
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        required
                      >
                        <option value="" disabled>Pilih Dokter</option>
                        {users.map((user, index) => (
                          <option key={index} value={user.fullName}>
                            {user.fullName}
                          </option>
                        ))}
                      </select>
                      </div>

                      <p>Keterangan </p>
                    <div className='form-data-admin-long'>
                      <select
                          id="detailCheck"
                          name="detailCheck"
                          value={formData.detailCheck}
                          onChange={(e) => setFormData({ ...formData, detailCheck: e.target.value })}
                          required
                        >
                          <option value="" disabled>Pilih</option>

                          <option value="Cek Pneumonia">Cek Pneumonia</option>
                        </select>
                      </div>

                    <p>Tanggal Daftar</p>
                    <div className='form-data-admin-long'>
                    <input 
                      type="date" 
                      value={formData.registrationDate.toISOString().substring(0, 10)} 
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        registrationDate: new Date(e.target.value) 
                      })} 
                      required 
                    />
                      </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="container-button">
              <button type="submit" className='btn-form-patient'>
                Ajukan
              </button>
            </div>
          </form>
        </div>
      </section>
    </React.Fragment>
  );
}

export default DataPatient;
