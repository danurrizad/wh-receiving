import React, { Suspense, useState, useEffect, createContext, useContext } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { CSpinner, useColorModes, CToaster, CToast, CToastHeader, CToastBody, CButton, CToastClose } from '@coreui/react'
import './scss/style.scss'
import 'rsuite/dist/rsuite.min.css'
import './scss/examples.scss'
import 'primereact/resources/themes/nano/theme.css'
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.min.css'
import CustomTableLoading from './components/LoadingTemplate'
import LoadingTWIIS from './components/LoadingTWIIS'
import Watermark from './components/Watermark'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCheckCircle, faInfo, faQuestionCircle, faWarning, faX } from '@fortawesome/free-solid-svg-icons'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))

// Create a context for toast
const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

const App = () => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    // const color = {
    //   success: 'success',
    //   info: 'info',
    //   warning: 'warning',
    //   error: 'danger',
    //   failed: 'danger',
    // }[type] || 'info'
    const color = {
      success: '#29d93e',
      info: '#6799FF',
      warning: '#FFBB00',
      error: '#e85454',
      failed: '#e85454',
    }[type] || '#e85454'

    setToasts((prevToasts) => [
      ...prevToasts,
      { message, type, color, id: Date.now() },
    ])
  }

  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // useEffect(() => {
  //   setColorMode('dark')
  // }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ToastContext.Provider value={addToast}>
      <HashRouter>
        <CToaster style={{ position: "fixed", right: "50%", transform: "translateX(50%)", top: "10px"}}>
          {toasts.map(({ id, message, type, color }) => (
            <CToast
              key={id}
              autohide={true}
              color={type}
              delay={5000}
              visible={true}
            >
              <CToastBody className='text-white d-flex justify-content-between align-items-center' closeButton>
                <div className='d-flex gap-3 align-items-center'>
                  <FontAwesomeIcon icon={ type === 'danger' || type === 'error' ? faWarning : type === 'success' ? faCheckCircle : type === 'warning' ? faWarning : type === 'info' ? faInfo : faQuestionCircle} size='lg'/>   
                  {message}
                </div> 
                <div className='d-flex align-items-center gap-2'>
                  <div style={{ borderLeft: '2px solid white', height: "20px", width: "1px"}}></div>
                  <CToastClose dark style={{ color: "white", opacity: 1, boxShadow: 'none', fontSize: '10px'}}/>
                </div>
              </CToastBody>
            </CToast>
          ))}
        </CToaster>
        {/* <Watermark/> */}
        <Suspense
          fallback={
            <div className="pt-3 text-center" style={{ height: "100vh"}}>
              <LoadingTWIIS/>
            </div>
          }
        >
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            {/* <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} /> */}
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </ToastContext.Provider>
  )
}

export default App
