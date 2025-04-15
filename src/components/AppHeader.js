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
import LogoTWIISDark from 'src/assets/images/logo-twiis.png'
import LogoReceiving from 'src/assets/images/LOGO-RECEIVING-2.png'
import LogoReceivingDark from 'src/assets/images/LOGO-RECEIVING-2-DARK.png'
import useVerify from '../hooks/UseVerify'
import { FaCode } from 'react-icons/fa6'
import AppHeaderDropdown from './header/AppHeaderDropdown'



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

  useEffect(()=>{
    localStorage.setItem('coreui-free-react-admin-template-theme', colorMode)
  }, [colorMode])

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4 d-flex justify-content-between" fluid>
        <div className='d-flex'>
          <CHeaderToggler
            onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
            style={{ marginInlineStart: '-14px' }}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
          <CHeaderNav className='d-sm-block d-none'>
            { !sidebarShow && <CImage src={ colorMode === 'light' ? LogoTWIIS2 : LogoTWIISDark} width={100} style={{ transitionDuration: 1000, transition: "all"}}/> }
            <CImage src={ colorMode === 'light' ? LogoReceiving : LogoReceivingDark} width={155} style={{ paddingBottom: 0}}/>
          </CHeaderNav>
        </div>

        
        <div className='d-flex flex-md-row flex-column-reverse align-items-md-center align-items-end'>
          <CHeaderNav>
            <CNavItem>
              <CNavLink className="text-date" style={{ textDecoration: 'none' }}>
                {dateState.toLocaleString('en-UK', {
                  dateStyle: 'full',
                })}
              </CNavLink>
            </CNavItem>
            <CNavItem >
              <CNavLink className="text-date" style={{ textDecoration: 'none' }}>
                {dateState.toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  second: '2-digit',
                  hourCycle: 'h24'
                })}
              </CNavLink>
            </CNavItem>
          </CHeaderNav>

          <div className='d-flex align-items-center'>
            {/* THEME MODE */}
            <CHeaderNav>
              <li className="nav-item py-1  py-0 d-flex align-items-center">
                <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
              </li>
              <CDropdown variant="nav-item" placement="bottom-end">
                <CDropdownToggle caret={false}>
                  {colorMode === 'dark' ? (
                    <CIcon icon={icon.cilMoon} size="lg" />
                  ) : colorMode === 'auto' ? (
                    <CIcon icon={icon.cilContrast} size="lg" />
                  ) : (
                    <CIcon icon={icon.cilSun} size="lg" />
                  )}
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem
                    active={colorMode === 'light'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('light')}
                  >
                    <CIcon className="me-2" icon={icon.cilSun} size="lg" /> Light
                  </CDropdownItem>
                  <CDropdownItem
                    active={colorMode === 'dark'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('dark')}
                  >
                    <CIcon className="me-2" icon={icon.cilMoon} size="lg" /> Dark
                  </CDropdownItem>
                  <CDropdownItem
                    active={colorMode === 'auto'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('auto')}
                  >
                    <CIcon className="me-2" icon={icon.cilContrast} size="lg" /> Auto
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
              <li className="nav-item py-1  py-0 d-flex align-items-center ">
                <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
              </li>
            </CHeaderNav>
            <CHeaderNav>
              <CNavItem className="d-flex align-items-center">
                <AppHeaderDropdown colorMode={colorMode} imgProfile={imgProfile} name={name} roleName={roleName}/>
              </CNavItem>
            </CHeaderNav>
          </div>

        </div>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
