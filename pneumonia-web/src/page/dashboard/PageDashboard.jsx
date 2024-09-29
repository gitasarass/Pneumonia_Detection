import React, { useEffect, useState } from 'react'
import './PageDashboard.css'
import { IoNotificationsSharp } from "react-icons/io5";
import CardCalendar from '../component/CardCalendar'
import { Circle } from 'rc-progress'
import { auth, db } from '../../firebase';
import { ClipLoader } from 'react-spinners';
import { doc, getDoc } from 'firebase/firestore';
import blank_image from '../assets/blank_image.png';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo_unram.png'

function PageDashboard() {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState('');
    const [totals, setTotals] = useState({
        lansia: 0,
        anakBalita: 0,
      })

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
            const querySnapshot = await getDocs(collection(db, "patients"));
            let lansiaCount = 0;
            let anakBalitaCount = 0;
            const currentYear = new Date().getFullYear();

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const birthYear = new Date(data.birthDate).getFullYear();
                const age = currentYear - birthYear;

                if (age >= 60) {
                    lansiaCount++;
                } else if (age <= 10) {
                    anakBalitaCount++;
                }
            });

            const totalPatientCount = lansiaCount + anakBalitaCount;

            setTotals({
                lansia: lansiaCount,
                anakBalita: anakBalitaCount,
                totalPatient: totalPatientCount,
                totalPatientCount: querySnapshot.size
            });
        } catch (error) {
            console.error("Error fetching patient data: ", error);
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
        fetchUserData();
        fetchPatientData();
    }, []);

    const handleDropdown = () => {
        navigate('/dokter/pengaturan')
      }
    
      const handleSignOut = async () => {
        try {
          await auth.signOut();
          console.log("Successfully signed out");
          navigate('/login')
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
            <div className="error-container">
                <p>Error loading user details</p>
            </div>
        );
    }

    const lansiaPercentage = totals.totalPatientCount > 0 ? (totals.lansia / totals.totalPatientCount) * 100 : 0;
    const anakBalitaPercentage = totals.totalPatientCount > 0 ? (totals.anakBalita / totals.totalPatientCount) * 100 : 0;


  return (
    <div className='header-db'>
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
                            src={userDetails?.photo || blank_image}
                            alt=""
                            className='profile-image'
                            onClick={() => { setOpen(!open) }}
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
                <Link className="dropdownItem" onClick={handleDropdown}>
                    <a>pengaturan</a>
                </Link>
                <Link className="dropdownItem" onClick={handleSignOut}>
                    <a>keluar akun</a>
                </Link>
          </ul>
        </div>

        <div className='count-pneumonia'>
            <ul className='title-db'>
                Pasien Pneumonia Total
            </ul>
            <div className='line-db'/>

            <div className='box-count'>
                <div className='box-container'>
                    <div className='line-box'/>
                    <p>Normal</p>
                    <h3>0 Pasien</h3>
                </div>
                <div className='box-container'>
                <div className='line-box'/>
                    <p>Bacterial</p>
                    <h3>0 Pasien</h3>
                </div>
                <div className='box-container'>
                <div className='line-box'/>
                    <p>Viral</p>
                    <h3>0 Pasien</h3>
                </div>
                <div className='box-container'>
                <div className='line-box'/>
                    <p>Covid</p>
                    <h3>2 Pasien</h3>
                </div>
            </div>
        </div>

        <div>
            <ul className='title-db'>
                Pasien Total
            </ul>
            <div className='line-db'/>
            
            <br />
            

            <div className='row-dashboard'>
            <div className='row-chart'>
    <div className='circles-containers'>
        {/* Single Circle for Lansia and Balita */}
        <div className='circle-container'>
            <Circle 
                className='circle-charts' 
                percent={totals.percentage}  // Adjust this if you have separate percentages for Lansia and Balita
                strokeWidth={6} 
                trailWidth={4} 
                strokeColor="#0074B6" 
                trailColor='#86B6F6'
            />
        </div>
    </div>
    <div className='column-txt'>
        <div className='point-txt'>
            <div className='row-point'>
                <div className='circle-line' style={{ backgroundColor: "#0074B6" }}/>
                <p>Lansia</p>
            </div>
            <div className='row-points'>
                <div className='circle-lines' style={{ backgroundColor: "#86B6F6" }}/>
                <p>Balita</p>
            </div>
        </div>
    </div>
</div>

                <div className='calendar'>
                    <CardCalendar/>
                </div>

            </div>

            
            <div className='tag-web'>
        </div>

        </div>
    </div>
  )
}

export default PageDashboard