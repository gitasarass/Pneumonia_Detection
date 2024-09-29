import React, { useState, useEffect } from 'react';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { IoNotificationsSharp } from "react-icons/io5";
import { auth, db } from '../../../firebase';
import blank_image from '../../assets/blank_image.png'
import { useNavigate, Link } from 'react-router-dom';
import './SettingAdmin.css'
import ClipLoader from "react-spinners/ClipLoader";
import logo from '../../assets/logo_unram.png'

function SettingAdmin() {

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "admins", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserDetails(data);
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setEmail(data.email);

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

  const handleSave = async () => {
    try {
      let photo = userDetails.photo || null;

      if (profileImage) {
        const storage = getStorage();
        const storageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, profileImage);
        photo = await getDownloadURL(storageRef);
      }

      const docRef = doc(db, "admins", auth.currentUser.uid);
      await updateDoc(docRef, {
        firstName,
        lastName,
        photo,
      });

      setUserDetails((prevState) => ({
        ...prevState,
        firstName,
        lastName,
        photo,
      }));

      alert('Profil berhasil disimpan');
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  const handleDropdown = () => {
    navigate('/admin/admin_setting')
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
            <p>Pengaturan Profil</p>
          </div>


          <div className={`dropdown-menu ${open? 'active' : 'inactive'}`} >
          <ul>
                <Link to={"/admin/admin_setting"} className="dropdownItem" onClick={handleDropdown}>
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
                <br />
                <label className="btn-edit-profil" htmlFor="fileInput">Ubah Foto</label>
                <input type="file" id="fileInput" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />

              <div className='row-container-setting-admin'>
                  <div className='column-container-setting-admin'>
                    <div className='data-setting'>
                      <p>Nama Depan</p>
                      <div className='form-setting'>
                        <input
                          type="text"
                          placeholder={userDetails.firstName}
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>                                              
                    </div>
                </div>

                <div className='data-setting'>
                      <p>Nama Belakang</p>
                      <div className='form-setting'>
                        <input
                          type="text"
                          placeholder={userDetails.lastName}
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                  </div>
              </div>

              <div className='data-setting-admin'>
                  <p>Email</p>
                  <div className='form-setting-admin'>
                
                      <div className='text-form-admin'>
                          {userDetails.email}
                      </div>
                  </div>
              </div>
            </div>
            
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

export default SettingAdmin