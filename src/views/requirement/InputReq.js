import React, { useState, useEffect, useRef} from 'react'
import { CButton, CTooltip, CButtonGroup, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CFormInput, CFormLabel, CFormText, CInputGroup, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToaster, CSpinner, CCardText, CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench,faOilCan} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'

const Input = () => {
  const navigate = useNavigate()
  return (
    <>
      <div>
        <CCard className='p-0' style={{ border: "1px solid #6482AD"}}>
          <CCardHeader style={{backgroundColor: "#6482AD", color: "white", textAlign: "center"}}>
            <CCardTitle>VENDOR REQUREMENTS</CCardTitle>
          </CCardHeader>
          <CCardBody className='mt-5 mb-5'>
            <CRow className='mb-5'>
              <CCol md='6'>
                <CCard style={{ minHeight: '200px', cursor: "pointer"}} className='card-req consumable' onClick={()=>{navigate('/vendor/input/requirement-consumable')}}>
                  <CCardBody className='d-flex align-items-center justify-content-center gap-3'>
                    <CCardText className='fs-1 fw-bold'>
                      Consumable
                      <br />
                      <span style={{ fontSize: '1rem', fontWeight: 'lighter' }}>
                        Consumable and need regular replenishment
                      </span>
                    </CCardText>
                    <FontAwesomeIcon icon={faWrench}  size="6x"  style={{ marginLeft: '16px' }} />
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol md='6'>
                <CCard  style={{ minHeight: '200px', cursor: "pointer"}} className='card-req chemical' onClick={()=>{navigate('/vendor/input/requirement-chemical')}}>
                  <CCardBody className='d-flex align-items-center justify-content-center gap-3'>
                    <div className='d-flex align-items-center justify-content-center gap-3'>
                      <CCardText className='fs-1 fw-bold'>
                          Chemical
                        <br />
                        <span style={{ fontSize: '1rem', fontWeight: 'lighter' }}>
                          Basic materials used in the production
                        </span>
                      </CCardText>
                      <FontAwesomeIcon icon={faOilCan}  size="6x"  style={{ marginLeft: '16px' }} />
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            <CRow>
              
            </CRow>
          </CCardBody>
        </CCard>
      </div>
    </>   
  )
}

export default Input