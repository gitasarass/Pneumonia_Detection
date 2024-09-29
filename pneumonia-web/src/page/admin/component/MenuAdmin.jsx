import './MenuAdmin.css'
import React from 'react'
import logo from '../../assets/logo_unram.png'
import { SideBarAdminData } from './DataMenuAdmin';
import { NavLink } from 'react-router-dom'

function MenuAdmin() {
    return (
      <React.Fragment>
          <section>
              <div className='sidebar-menu'>
  
                  <aside className='sidebar-list-admin'>
  
                      <div className='logo-name'>
                          <img src={logo} alt="" />
                          <div className='logo-text'>
                              <p>Pneumonia Detection</p>
                              <p>Universitas Mataram</p>
                          </div>
                      </div>
  
                      <div className='menu-item-sidebar-admin'>
                      {SideBarAdminData.map((item, index) => (
                              <NavLink
                              key={index}
                              to={`/admin${item.path}`}
                              className={({ isActive }) => 
                                isActive ? 'menu-items-admin active' : 'menu-items-admin'
                              }
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

export default MenuAdmin;
