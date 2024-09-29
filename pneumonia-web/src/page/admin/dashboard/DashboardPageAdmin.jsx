import React, { useEffect, useState } from 'react'
import { IoNotificationsSharp } from "react-icons/io5";
import logo from '../../assets/logo_unram.png'
import CardCalendar from '../../component/CardCalendar'
import { Circle } from 'rc-progress'
import { auth, db } from '../../../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { ClipLoader } from 'react-spinners';
import blank_image from '../../assets/blank_image.png'
import { useNavigate, Link } from 'react-router-dom';
import './DashboardPageAdmin.css'

function DashboardPageAdmin() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    cekKesehatan: 0,
    cekPneumonia: 0,
    lansia: 0,
    anakBalita: 0,
    totalPatient: 0,
    percentage: 0
  })
  const [doctorTotal, setDoctorTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState('');

  const fetchAdminData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const adminDocRef = doc(db, "admins", user.uid);
        const adminDocSnap = await getDoc(adminDocRef);

        if (adminDocSnap.exists()) {
          const adminData = adminDocSnap.data();
            setUserDetails({
              photo: adminData.photo,
          });
          await fetchPatientData();
          await fetchDoctorData();
        } else {
          console.log("User document does not exist");
        }
      } else {
        console.log("User is not logged in");
      }
      setLoading(false);
    });
  };

  const fetchPatientData = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "patients"));
        let cekKesehatanCount = 0;
        let cekPneumoniaCount = 0;
        let lansiaCount = 0;
        let anakBalitaCount = 0;
        const currentYear = new Date().getFullYear();

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const birthYear = new Date(data.birthDate).getFullYear();
            const age = currentYear - birthYear;

            if (data.detailCheck == "Cek Kesehatan") {
                cekKesehatanCount++;
            } else if (data.detailCheck == "Cek Pneumonia") {
                cekPneumoniaCount++;
            }

            if(age >= 60) {
                lansiaCount++;
            } else if (age <= 10) {
                anakBalitaCount++;
            }
        });

        const totalPatient = cekKesehatanCount + cekPneumoniaCount;
        const percentage = totalPatient > 0 ? (totalPatient / querySnapshot.size) * 100: 0;

        setTotals({
            cekKesehatan: cekKesehatanCount,
            cekPneumonia: cekPneumoniaCount,
            lansia: lansiaCount,
            anakBalita: anakBalitaCount,
            totalPatient: totalPatient,
            percentage: percentage.toFixed(2)
        });
    } catch (error) {
        console.error("Error fetching patient data: ", error);
    }
  }

  const fetchDoctorData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const totalDoctors = querySnapshot.size;
  
      console.log("Total Doctors: ", totalDoctors);
  
      setDoctorTotal(totalDoctors);
    } catch (error) {
      console.error("Error fetching doctor data: ", error);
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
  
  

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    setCurrentDate(formattedDate);
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  return (
    <div className='header-db-dash'>
        <div className='top-header'>
            <div className='list-top'>
                <div className='logo-name'>
                    <img src={logo} alt="" />
                    <div className='logo-text'>
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
        <div>
        </div>
    

        </div>

        <div className='name-header'>
            <p>
                Dashboard -
            </p>
            <h3> {currentDate}</h3>
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

        <div className='count-pneumonia'>
            <ul className='title-db'>
                Total Pasien Terdaftar
            </ul>
            <div className='line-db'/>

            <div className='box-count-ad'>
                <div className='box-container-ad'>
                <div className='line-box'/>
                    <p>Cek Pneumonia</p>
                    <h3>{totals.cekPneumonia} Pasien</h3>
                </div>
                <div className='box-container-ad'>
                <div className='line-box-ad'/>
                    <p>Lansia</p>
                    <h3>{totals.lansia} Pasien</h3>
                </div>
                <div className='box-container-ad'>
                <div className='line-box-ad'/>
                    <p>Anak/Balita</p>
                    <h3>{totals.anakBalita} Pasien</h3>
                </div>
            </div>
        </div>

        <div>
            <ul className='title-db'>
                Total Pasien & Dokter
            </ul>
            <div className='line-db'/>
            
            <br />
            

            <div className='row-dashboards'>
                <div className='row-charts'>
                    <div className='chart-bar'>
                        <div className='circles-containers'>
                            <Circle className='circle-charts' percent={totals.percentage}  strokeWidth={6} trailWidth={4} strokeColor="#0074B6" trailColor='#86B6F6'/>
                                <div className='circles-texts'>
                                    <h1>{totals.totalPatient}</h1>
                                    <p>Pasien</p>
                                </div>
                        </div>
                        <div className='circles-container'>
                            <Circle className='circle-charts' percent={doctorTotal > 0 ? (doctorTotal / 100) * 100 : 0} strokeWidth={6} trailWidth={4} strokeColor="#86B6F6" trailColor='#C4DDFF'/>
                                <div className='circles-texts'>
                                    <h2>{doctorTotal}</h2>
                                    <p>Dokter</p>
                                </div>
                        </div>
                    </div>
                </div>
                <div className='calendar-ad'>
                    <CardCalendar/>
                </div>

            </div>

        </div>

        <div className='tag-web'>
        </div>
    </div>
  )
}
  

export default DashboardPageAdmin

