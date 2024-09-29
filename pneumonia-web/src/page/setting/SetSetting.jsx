import React, { useState, useEffect } from 'react';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { IoNotificationsSharp } from "react-icons/io5";
import { auth, db } from '../../firebase';
import blank_image from '../assets/blank_image.png'
import './SetSetting.css'
import logo from '../assets/logo_unram.png'
import { Link } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";


function SetSetting() {

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [open, setOpen] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserDetails(data);
          setFullName(data.fullName);
          setEmail(data.email);
          setBirthDate(data.birthDate);
          setPhone(data.phone);
          setSpecialist(data.specialist);

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

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log("Successfully signed out");
      navigate('/login')
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDropdown = () => {
    navigate('/dokter/pengaturan')
  }

  const handleSave = async () => {
    try {
      let photo = userDetails.photo || null;

      if (profileImage) {
        const storage = getStorage();
        const storageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, profileImage);
        photo = await getDownloadURL(storageRef);
      }

      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {
        fullName,
        birthDate,
        phone,
        specialist,
        photo,
      });

      setUserDetails((prevState) => ({
        ...prevState,
        fullName,
        birthDate,
        phone,
        specialist,
        photo,
      }));

      alert('Pengaturan Berhasil Disimpan');
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };
  

  if (loading) {
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
            <p>Pengaturan Profil</p>
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


          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className='container-page'>
            <div className='title-container'>
              <ul>Profil</ul>
              <p>- Edit Profil</p>
            </div>
            <div className='line-container' />

            <div className='column-container-setting-container-admin'>
            <div className='image-profile-container'>
                  <img src={profileImage ? URL.createObjectURL(profileImage) : (userDetails.photo || blank_image)} alt="Profile" />
                </div>

                <label className="btn-edit-profil" htmlFor="fileInput">Ubah Foto</label>
                <input type="file" id="fileInput" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />

              <div className='row-container-setting-admin'>
                  <div className='column-container-setting-admin'>
                    <div className='data-setting'>
                      <p>Nama Lengkap</p>
                      <div className='form-setting'>
                        <input
                          type="text"
                          placeholder={userDetails.fullName}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>

                      <div className='data-setting'>
                      <p>Email</p>
                      <div className='form-setting'>
                          <div className='text-form-admin'>
                              {userDetails.email}
                          </div>
                      </div> 

                      <div className='data-setting'>
                      <p>Tanggal Lahir</p>
                      <div className='form-setting'>
                        <input
                          type="date"
                          placeholder={userDetails.birthDate}
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                        />
                      </div> 

                      </div>
                      </div>
                      </div>
                </div>

                <div className='column-container-setting-admin'>
                    <div className='data-setting'>

                      <div className='data-setting'>
                      <p>Spesialis</p>
                      <div className='form-setting'>
                        <input
                          type="text"
                          placeholder={userDetails.specialist}
                          value={specialist}
                          onChange={(e) => setSpecialist(e.target.value)}
                        />
                      </div> 

                      <div className='data-setting'>
                      <p>Nomor Telepon</p>
                      <div className='form-setting'>
                        <input
                          type="number"
                          placeholder={userDetails.phone}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div> 

                      </div>
                      </div>
                      </div>
                      </div>

                      

                      

                
              </div>

              </div>

              <br />
              <br />
              <br />

              
            
          </div>



          <button type='submit' className='btn-save-profil'>
                Simpan
              </button>             
          </form>
          
           




       
        </div>
      </section>
    </React.Fragment>
  )
}

export default SetSetting