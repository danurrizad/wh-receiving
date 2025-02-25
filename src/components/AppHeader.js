import React, { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
  CNavbarText,
  CImage,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as icon from "@coreui/icons";

import {
  cilMenu,
} from '@coreui/icons'
import LogoTWIIS2 from 'src/assets/images/logo-twiis-2.png'
import LogoReceiving from 'src/assets/images/LOGO-RECEIVING-2.png'
import useVerify from '../hooks/UseVerify'
import { FaCode } from 'react-icons/fa6'



const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const { name, roleName, imgProfile } = useVerify()

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [dateState, setDateState] = useState(new Date())

  const t = new Date()
  const c = t.getHours() - 12
  useEffect(() => {
    setInterval(() => {
      setDateState(new Date())
    }, 1000)
  }, [])

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        {/* <CHeaderNav style={{ position: 'fixed', top: "10px", left: "50px"}}>
          <CImage className="" src={LogoTWIIS2} height={52} />
        </CHeaderNav> */}
        {/* <CHeaderNav style={{ position: "absolute", left: "300px"}}>
         <div className='d-flex align-items-center gap-2'>
            <FaCode style={{ color:'rgb(72, 120, 187)', width: "40px"}}/>
            <h3 style={{ color:'rgb(72, 120, 187)'}}>
              UNDER DEVELOPMENT
              </h3>
            <FaCode style={{ color:'rgb(72, 120, 187)', width: "40px"}}/>
         </div>
        </CHeaderNav> */}

        <CHeaderNav>
          <CImage src={LogoReceiving} width={200}/>
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
          <CNavItem>
            <CNavLink className="" style={{ textDecoration: 'none' }}>
              {dateState.toLocaleString('en-US', {
                dateStyle: 'full',
              })}
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink className="" style={{ textDecoration: 'none' }}>
              {dateState.toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                second: '2-digit',
                hourCycle: 'h24'
              })}
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <div className="nav-item py-0 d-flex align-items-center" style={{ textDecoration: 'none', display: '' }}>
          <div className="vr h-100 mx-2 text-body text-opacity-100"></div>
        </div>
        <CHeaderNav>
          <CNavItem className="d-flex align-items-center">
            <CNavLink style={{ textDecoration: 'none' }}>
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  border: '1px solid black',
                  height: '30px',
                  width: '30px',
                  borderRadius: '100%',
                }}
              >
                { imgProfile ? <CImage src={imgProfile}/> : <CIcon icon={icon.cilUser} />}
              </div>
            </CNavLink>
            <CNavLink className="d-flex flex-column justify-content-center h-100" style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: '', marginTop: '0px'}}>{name}</span>
              <span style={{ fontSize: '10px', marginTop: '0px' }}>{roleName.toUpperCase()}</span>
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
