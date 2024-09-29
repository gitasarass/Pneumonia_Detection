import React, {useState} from 'react'
import './MenuItem.css'
import logo from '../assets/logo_unram.png'
import { SideBarData } from './DataItem';
import { NavLink } from 'react-router-dom'



function MenuItem() {

    const [selected, setSelected]  = useState();
  return (
    <React.Fragment>
        <section>
            <div className='sidebar-menu'>

                <aside className='sidebar-list'>


                    <div className='logo-name'>
                        <img src={logo} alt="" />
                        <div className='logo-text'>
                            <p>Pneumonia Detection</p>
                            <p>Universitas Mataram</p>
                        </div>
                    </div>

                    <div className='menu-item-sidebar'>
                    {SideBarData.map((item, index) => (
                            <NavLink
                            key={index}
                            to={`/dokter${item.path}`}
                            className={selected === index ? 'menu-items active' : 'menu-items'}
                            onClick={() => setSelected(index)}
                            >
                            <item.icon />
                            <span>{item.heading}</span>
                            </NavLink>
                        ))} 
                    </div>
                    
                </aside>
            
            </div>
        </section>
    </React.Fragment>
    
  )
}

export default MenuItem