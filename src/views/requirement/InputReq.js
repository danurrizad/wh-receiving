import React, { useState, useEffect, useRef} from 'react'
import { CButton, CTooltip, CButtonGroup, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CFormInput, CFormLabel, CFormText, CInputGroup, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToaster, CSpinner, CCardText, CBreadcrumb, CBreadcrumbItem, CAccordionButton, CFormCheck, CCardFooter } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench,faOilCan} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'
import { FaCamera, FaGear, FaOilCan, FaWrench } from 'react-icons/fa6';
import { RadioButton } from 'primereact/radiobutton';

const Input = () => {
  const navigate = useNavigate()
  const [ activeItem, setActiveItem ] = useState({
      item1: true,
      item2: false,
      item3: false,
      item4: false,
      item5: false,
    }) 

  return (
    <>
      <CCard className='p-0' style={{ border: "1px solid #6482AD", height: "100%"}}>
        <CCardHeader style={{backgroundColor: "#6482AD", color: "white", textAlign: "center"}}>
          <CCardTitle>VENDOR REQUREMENTS</CCardTitle>
        </CCardHeader>
        <CCardBody className='d-flex flex-column align-items-center'>
          <h3>Jenis Material</h3>
          <CFormLabel>
            Silakan pilih jenis material yang Anda bawa
          </CFormLabel>
          <div className='d-flex h-100 w-100 gap-4' style={{ padding: '10px 100px 100px 100px'}}>
            <div onClick={()=>navigate('/vendor/input/requirement-consumable')} className='card-req consumable d-flex flex-column justify-content-center align-items-center' style={{cursor: "pointer", border: '2px solid black', borderRadius: "20px", height: "100%", width: "100%"}}>
              <FontAwesomeIcon icon={faWrench} style={{ fontSize: "150px", padding: "25px"}}/>
              <h4>Consumable</h4>
              <CFormLabel>Material basic yang digunakan untuk produksi</CFormLabel>
            </div>
            <div onClick={()=>navigate('/vendor/input/requirement-chemical')} className='card-req chemical d-flex flex-column justify-content-center align-items-center' style={{cursor: "pointer", border: '2px solid black', borderRadius: "20px", height: "100%", width: "100%"}}>
              <FontAwesomeIcon icon={faOilCan} style={{ fontSize: "200px"}}/>
              <h4>Chemical</h4>
              <CFormLabel>Material basic yang digunakan untuk produksi</CFormLabel>
            </div>
          </div>
        </CCardBody>
      </CCard>
    </>   
  )
}

export default Input