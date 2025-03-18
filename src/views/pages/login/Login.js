import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as icon from "@coreui/icons";
import { cilLockLocked, cilUser, cibCircleci } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import useAuthDataService from '../../../services/AuthDataServices'
// import logo from '../../../assets/brand/TWIIS-NEW.png'
// import LogoTWIIS
import background from '../../../assets/images/bgwh.png'
import backgroundDark from '../../../assets/images/bgwh-dark.png'
import LogoTWIIS  from 'src/assets/images/logo-twiis-2.png';
import LogoTWIISDark  from 'src/assets/images/logo-twiis.png';

const MySwal = withReactContent(Swal)

const Login = () => {
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  const navigate = useNavigate()
  const { login } = useAuthDataService()

  useEffect(()=>{
      localStorage.setItem('coreui-free-react-admin-template-theme', colorMode)
    }, [colorMode])

  useEffect(() => {
    if (msg) {
      MySwal.fire({
        icon: 'error',
        title: 'Oops...',
        text: msg,
      })
      setMsg('')
    }
  }, [msg])

  const Auth = async (e) => {
    e.preventDefault()

    if (!username || !password) {
      setMsg('Username dan password harus diisi')
      return
    }

    if (password.length < 6) {
      setMsg('Password harus lebih dari 6 karakter')
      return
    }

    try {
      await login(username, password)
      navigate('/dashboard')
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg)
      } else {
        console.error('Error:', error.message)
      }
    }
  }

  return (
  <div
  className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center"
  style={{
    backgroundImage: `url(${colorMode === "light" ? background : backgroundDark})`, // Menggunakan gambar impor
    backgroundSize: 'cover', // Agar gambar menyesuaikan dengan ukuran viewport
    backgroundPosition: 'center', // Posisi gambar di tengah
    backgroundRepeat: 'no-repeat', // Mencegah pengulangan gambar
    overlay: "auto",
    }}
  >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={12} sm={12} lg={8} xl={7}>
           
            <CCardGroup className='d-flex flex-column-reverse flex-sm-row'>
             <div className='d-block d-sm-flex '>
              <CCard className=' px-3 max-sm-width-100 max-width-50px'>
                 <div className='d-flex pt-2 pt-sm-5 pb-2 flex-sm-column flex-row  align-items-center justify-content-center gap-3'>
                   <CButton onClick={() => setColorMode('light')} color={ colorMode === 'light' &&'dark'} className='border-0'>
                     <CIcon icon={icon.cilSun} size="lg" />
                   </CButton>
                   <CButton onClick={() => setColorMode('dark')} color={ colorMode === 'dark' && 'light'} className='border-0'>
                     <CIcon icon={icon.cilMoon} size="lg" />
                   </CButton>
                   {/* <CButton onClick={() => setColorMode('auto')} className='border-0'>
                     <CIcon icon={icon.cilContrast} size="lg" />
                   </CButton> */}
                 </div>
               </CCard>
               <CCard className="p-4">
                 <CCardBody>
                   <CForm onSubmit={Auth}>
                     <h1>Login</h1>
                     <p className="text-body-secondary">Sign In to your account</p>
                     <CInputGroup className="mb-3">
                       <CInputGroupText>
                         <CIcon icon={cilUser} />
                       </CInputGroupText>
                       <CFormInput
                         placeholder="Username"
                         autoComplete="username"
                         value={username}
                         onChange={(e) => setUsername(e.target.value)}
                       />
                     </CInputGroup>
                     <CInputGroup className="mb-4">
                       <CInputGroupText>
                         <CIcon icon={cilLockLocked} />
                       </CInputGroupText>
                       <CFormInput
                         type="password"
                         placeholder="Password"
                         autoComplete="current-password"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                       />
                     </CInputGroup>
                     <CRow>
                       <CCol xs={6}>
                         <CButton color={colorMode === 'light' ? "dark" : "secondary"} className="px-4" type="submit">
                           Login
                         </CButton>
                       </CCol>
                     </CRow>
                   </CForm>
                 </CCardBody>
               </CCard>
             </div>
              <CCard className="text-white py-5  px-1" style={{ width: '%' }}>
                <CCardBody className="text-center">
                  <img src={colorMode === "light" ? LogoTWIIS : LogoTWIISDark} alt="Logo" className="sidebar-brand-full" height={80} />

                  <label className="fw-bold fs-5" style={{ color: colorMode === "light" ? "black" : "white"}}>
                    Toyota Warehouse Integrated Inventory System
                  </label>

                 
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
