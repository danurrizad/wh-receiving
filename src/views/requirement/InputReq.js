import React, { useState, useEffect, useRef} from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CButton, CTooltip, CButtonGroup, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CFormInput, CFormLabel, CFormText, CInputGroup, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToaster, CSpinner, CCardText } from '@coreui/react'
import { dataReceivingDummy, dataSchedulesDummy, dataDummy } from '../../utils/DummyData'
import { Button, DatePicker } from 'rsuite';
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { DataTable } from 'primereact/datatable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench,faOilCan} from '@fortawesome/free-solid-svg-icons';
import { Column } from 'primereact/column'
import useReceivingDataService from './../../services/ReceivingDataServices';
import { useToast } from '../../App'
import { InputText } from 'primereact/inputtext'
import { FaCircleCheck, FaCircleExclamation, FaCircleXmark, FaInbox } from "react-icons/fa6";
import Swal from 'sweetalert2'

const Input = () => {

  const { getMaterialByDNData, submitMaterialByDNData } = useReceivingDataService()

  return (
    <CContainer>
    <CRow className="d-flex justify-content-center" style={{ paddingTop: "60px" }}>
          <CCard className='p-0' style={{ border: "1px solid #6482AD"}}>
            <CCardHeader style={{backgroundColor: "#6482AD", color: "white", textAlign: "center"}}>
              <CCardTitle>VENDOR REQUREMENTS</CCardTitle>
            </CCardHeader>
            <CCardBody className='mt-5 mb-5'>
          <CRow className='mb-5'>
          <CCol md='12'>
          <CCard style={{ backgroundColor: '#ff6600', color: 'white', minHeight: '200px'}}>
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
         
          </CRow>
          <CRow>
          <CCol md='12'>
          <CCard  style={{ backgroundColor: '#F7F7F7', color: 'black', minHeight: '200px'}}>
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
            </CCardBody>
          </CCard>
          </CRow>

         <CRow className='mt-2' style={{ paddingTop: "150px" }}>
        <CCard >
        <CCardHeader style={{backgroundColor: "#6482AD", color: "white", textAlign: "center"}}>
        <CCardTitle> INPUT VENDOR REQUREMENTS</CCardTitle>
        </CCardHeader>
            <CCardBody>
            <CRow className='mb-2'>
             <CCard>
                <span className='fs-5 fw-bold'>Identitas Vendor</span>
                <span>(Silahkan lengkapi identitas Anda)</span>
                <CRow>
                <CCol md='5'>
                 <CFormText className='px-3'>Vendor Name</CFormText>
                <CFormInput 
                  type='text'
                  inputMode='numeric'
                  placeholder='Insert DN Number'
                  />
                 
                </CCol>
                <CCol md='5'>
                 <CFormText className='px-3'>Truck Station</CFormText>
                <CFormInput 
                  type='text'
                  inputMode='numeric'
                  placeholder='Insert DN Number'
                  />
                 
                </CCol>
             </CRow>
             <hr/>
              <CRow className='mb-2'>
                <span className='fs-5 fw-bold'>Identitas  Driver</span>
                <span>(Silahkan lengkapi identitas Anda)</span>
                <CRow>
                <CCol md='5'>
                 <CFormText className='px-3'>Nama Driver</CFormText>
                <CFormInput 
                  type='text'
                  inputMode='numeric'
                  placeholder='Insert DN Number'
                  />
                 
                </CCol>
                <CCol md='3'>
                 <CFormText className='px-3'>Apakah Anda Dalam Kondisi Sehat?</CFormText>
                 <div>
                 <CButton color="success" variant="ghost">Yes</CButton>
                 <CButton color="danger" variant="ghost">No</CButton>
                 </div>
                </CCol>
                <CCol md='4'>
                 <CFormText className='px-3'>Kondisi yang dirasakan apabila Tidak Sehat</CFormText>
                <CFormInput 
                  type='text'
                  inputMode='numeric'
                  placeholder='Insert DN Number'
                  />
                 
                </CCol>
                </CRow>
                </CRow>
                <hr/>
                <CRow className='mb-2'>
                <span className='fs-5 fw-bold'>Identitas  Kendaraan</span>
                <span>(Silahkan lengkapi identitas Anda)</span>
                <CRow>
                <CCol md='5'>
                 <CFormText className='px-3'>Tipe Pengiriman</CFormText>
                <CFormInput 
                  type='text'
                  inputMode='numeric'
                  placeholder='Insert DN Number'
                  />
                 
                </CCol>
                <CCol md='5'>
                 <CFormText className='px-3'>Jenis Kendaraan</CFormText>
                <CFormInput 
                  type='text'
                  inputMode='numeric'
                  placeholder='Insert DN Number'
                  />
                </CCol>
                </CRow>
                </CRow>
                <hr/>
                <CCol className="d-flex justify-content-center gap-3 mb-2">
                  <CButton color="primary" variant="outline">Kembali</CButton>
                  <CButton color="secondary" variant="outline">Selanjutnya</CButton>
                 </CCol>
                </CCard>   
            </CRow>
            </CCardBody>
            <CCardBody>
            <CRow className='mb-2'>
             <CCard>
                <span className='fs-5 fw-bold'>Identitas Kelengkapan Kendaraan</span>
                <span>(Silahkan lengkapi identitas Anda)</span>
                <CRow>
                <CCol md='5'>
                 <CFormText className='px-3'>Vendor Name</CFormText>
                <CFormInput 
                  type='text'
                  inputMode='numeric'
                  placeholder='Insert DN Number'
                  />
                 
                </CCol>
                <CCol md='5'>
                 <CFormText className='px-3'>Truck Station</CFormText>
                <CFormInput 
                  type='text'
                  inputMode='numeric'
                  placeholder='Insert DN Number'
                  />
                 
                </CCol>
             </CRow>
             <hr/>
              <CRow className='mb-2'>
                <span className='fs-5 fw-bold'>Identitas  Driver</span>
                <span>(Silahkan lengkapi identitas Anda)</span>
                <CRow>
                <CCol md='5'>
                 <CFormText className='px-3'>Nama Driver</CFormText>
                <CFormInput 
                  type='text'
                  inputMode='numeric'
                  placeholder='Insert DN Number'
                  />
                 
                </CCol>
                <CCol md='3'>
                 <CFormText className='px-3'>Apakah Anda Dalam Kondisi Sehat?</CFormText>
                 <div>
                 <CButton color="success" variant="ghost">Yes</CButton>
                 <CButton color="danger" variant="ghost">No</CButton>
                 </div>
                </CCol>
                <CCol md='4'>
                 <CFormText className='px-3'>Kondisi yang dirasakan apabila Tidak Sehat</CFormText>
                <CFormInput 
                  type='text'
                  inputMode='numeric'
                  placeholder='Insert DN Number'
                  />
                 
                </CCol>
                </CRow>
                </CRow>
                <hr/>
                <CRow className='mb-2'>
                <span className='fs-5 fw-bold'>Identitas  Kendaraan</span>
                <span>(Silahkan lengkapi identitas Anda)</span>
                <CRow>
                <CCol md='5'>
                 <CFormText className='px-3'>Tipe Pengiriman</CFormText>
                <CFormInput 
                  type='text'
                  inputMode='numeric'
                  placeholder='Insert DN Number'
                  />
                 
                </CCol>
                <CCol md='5'>
                 <CFormText className='px-3'>Jenis Kendaraan</CFormText>
                <CFormInput 
                  type='text'
                  inputMode='numeric'
                  placeholder='Insert DN Number'
                  />
                </CCol>
                </CRow>
                </CRow>
                <hr/>
                <CCol className="d-flex justify-content-center gap-3 mb-2">
                  <CButton color="primary" variant="outline">Kembali</CButton>
                  <CButton color="secondary" variant="outline">Selanjutnya</CButton>
                 </CCol>
                </CCard>   
            </CRow>
            </CCardBody>
            <CCardBody>
            <CRow className='mb-2'>
             <CCard>
                <span className='fs-5 fw-bold'>Identitas Vendor</span>
                <span>(Silahkan lengkapi identitas Anda)</span>
                <CRow>
                <CCol md='5'>
                 <CFormText className='px-3'>Vendor Name</CFormText>
                <CFormInput 
                  type='text'
                  inputMode='numeric'
                  placeholder='Insert DN Number'
                  />
                 
                </CCol>
                <CCol md='5'>
                 <CFormText className='px-3'>Truck Station</CFormText>
                <CFormInput 
                  type='text'
                  inputMode='numeric'
                  placeholder='Insert DN Number'
                  />
                 
                </CCol>
             </CRow>
             <hr/>
              <CRow className='mb-2'>
                <span className='fs-5 fw-bold'>Identitas  Driver</span>
                <span>(Silahkan lengkapi identitas Anda)</span>
                <CRow>
                <CCol md='5'>
                 <CFormText className='px-3'>Nama Driver</CFormText>
                <CFormInput 
                  type='text'
                  inputMode='numeric'
                  placeholder='Insert DN Number'
                  />
                 
                </CCol>
                <CCol md='3'>
                 <CFormText className='px-3'>Apakah Anda Dalam Kondisi Sehat?</CFormText>
                 <div>
                 <CButton color="success" variant="ghost">Yes</CButton>
                 <CButton color="danger" variant="ghost">No</CButton>
                 </div>
                </CCol>
                <CCol md='4'>
                 <CFormText className='px-3'>Kondisi yang dirasakan apabila Tidak Sehat</CFormText>
                <CFormInput 
                  type='text'
                  inputMode='numeric'
                  placeholder='Insert DN Number'
                  />
                 
                </CCol>
                </CRow>
                </CRow>
                <hr/>
                <CRow className='mb-2'>
                <span className='fs-5 fw-bold'>Identitas  Kendaraan</span>
                <span>(Silahkan lengkapi identitas Anda)</span>
                <CRow>
                <CCol md='5'>
                 <CFormText className='px-3'>Tipe Pengiriman</CFormText>
                <CFormInput 
                  type='text'
                  inputMode='numeric'
                  placeholder='Insert DN Number'
                  />
                 
                </CCol>
                <CCol md='5'>
                 <CFormText className='px-3'>Jenis Kendaraan</CFormText>
                <CFormInput 
                  type='text'
                  inputMode='numeric'
                  placeholder='Insert DN Number'
                  />
                </CCol>
                </CRow>
                </CRow>
                <hr/>
                <CCol className="d-flex justify-content-center gap-3 mb-2">
                  <CButton color="primary" variant="outline">Kembali</CButton>
                  <CButton color="secondary" variant="outline">Selanjutnya</CButton>
                 </CCol>
                </CCard>   
            </CRow>
            </CCardBody>
            </CCard>
            </CRow>
            </CContainer>
      
       
         

  )
}

export default Input