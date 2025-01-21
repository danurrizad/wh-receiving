import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import ImageBG from '../../../assets/images/bg-login.jpg'
// import { Player } from '@lottiefiles/react-lottie-player';
// import Lottie from 'lottie-react'
// import animationData from '../../../assets/lottie/lottie-login.json'
// import lottieAnimation from '../../../assets/lottie/lottie-login.json'
import LogoTWIIS from 'src/assets/images/logo-twiis.png';
// import { useToast } from '../../../App'
import { useToast } from './../../../App';

const Login = () => {
  const addToast = useToast()

  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true, 
  //   animationData: animationData,
  //   rendererSettings: {
  //     preserveAspectRatio: 'xMidYMid slice'
  //   }
  // };
  // console.log('defaultOptions :', defaultOptions)

  const handleTestToast = () => {
    addToast('This is a toast message!', 'success', 'success')
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CImage style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', opacity: '55%'}} src={ImageBG}/>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Username" autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton onClick={handleTestToast} color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard color='info' className="text-white py- p-0" style={{ width: '44%' }}>
                <CCardBody className="text-cente">
                  <CImage src={LogoTWIIS}/>
                  {/* <Lottie animationData={animationData} width={1000} loop={true} /> */}

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
