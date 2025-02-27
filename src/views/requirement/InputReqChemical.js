import React, { useState, useEffect, useRef} from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CButton, CTooltip, CButtonGroup, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CFormInput, CFormLabel, CFormText, CInputGroup, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToaster, CSpinner, CCardText, CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { dataReceivingDummy, dataSchedulesDummy, dataDummy } from '../../utils/DummyData'
import { Button, DatePicker } from 'rsuite';
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { DataTable } from 'primereact/datatable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench,faOilCan} from '@fortawesome/free-solid-svg-icons';
import { Column } from 'primereact/column'
import useReceivingDataService from '../../services/ReceivingDataServices';
import { useToast } from '../../App'
import { InputText } from 'primereact/inputtext'
import { FaCircleCheck, FaCircleExclamation, FaCircleXmark, FaInbox } from "react-icons/fa6";
import Swal from 'sweetalert2'

const InputChemical = () => {
  const [isInputPlatDisabled, setIsInputPlatDisabled] = useState(true);
  const [isSTNKButtonDisabled, setIsSTNKButtonDisabled] = useState(true);
  const [isInputSTNKDisabled, setIsInputSTNKDisabled] = useState(true);
  const { getMaterialByDNData, submitMaterialByDNData } = useReceivingDataService()
  const [ activeItem, setActiveItem ] = useState({
    item1: true,
    item2: false,
    item3: false,
  }) 

  return (
    <>
      <div>
        <CCard >
          <CCardHeader style={{backgroundColor: "#6482AD", color: "white", textAlign: "center"}}>
            <CCardTitle> INPUT VENDOR REQUREMENTS - CHEMICAL</CCardTitle>
          </CCardHeader>
          <CCardBody style={{ paddingTop: "30px", paddingBottom: "0"}}>
            <CBreadcrumb>
              <CBreadcrumbItem active={activeItem.item1} onClick={()=>setActiveItem({ item1: true, item2: false, item3: false})}><span style={{border: "2px solid black", borderRadius: "100%", padding: "10px 15px", cursor: "pointer"}}>1</span></CBreadcrumbItem>
              <CBreadcrumbItem active={activeItem.item2} onClick={()=>setActiveItem({ item1: true, item2: true, item3: false})}><span style={{border: "2px solid black", borderRadius: "100%", padding: "10px 15px", cursor: "pointer"}}>2</span></CBreadcrumbItem>
              <CBreadcrumbItem active={activeItem.item3} onClick={()=>setActiveItem({ item1: true, item2: true, item3: true})}><span style={{border: "2px solid black", borderRadius: "100%", padding: "10px 15px", cursor: "pointer"}}>3</span></CBreadcrumbItem>
            </CBreadcrumb>
          </CCardBody>
        {activeItem.item1 && !activeItem.item2 && !activeItem.item3 && (
          <CCardBody>
            <CRow className='mb-2'>
              <CCol>
                <CCard className='p-3'>
                  <span className='fs-5 fw-bold'>Identitas Vendor</span>
                  <span>(Silahkan lengkapi identitas Anda)</span>
                  <CRow>
                    <CCol md='5'>
                      <CFormText >Vendor Code</CFormText>
                      <CFormInput 
                        type='text'
                        inputMode='numeric'
                        placeholder='Insert vendor code'
                        />
                    </CCol>
                    <CCol md='5'>
                      <CFormText >Truck Station</CFormText>
                      <CFormInput 
                        type='text'
                        inputMode='numeric'
                        placeholder='Insert truck station'
                        />
                    </CCol>
                  </CRow>
                  <hr/>
                  <CRow className='mb-2'>
                    <span className='fs-5 fw-bold'>Identitas  Driver</span>
                    <span>(Silahkan lengkapi identitas Anda)</span>
                    <CRow>
                      <CCol md='5'>
                        <CFormText >Nama Driver</CFormText>
                        <CFormInput 
                          type='text'
                          inputMode='numeric'
                          placeholder='Insert name'
                          />
                      </CCol>
                      <CCol md='3'>
                        <CFormText >Apakah Anda Dalam Kondisi Sehat?</CFormText>
                        <div>
                          <CButton color="success" variant="outline" className="mx-2" >Yes</CButton>
                          <CButton color="danger" variant="outline" className="mx-2" >No</CButton>
                        </div>
                      </CCol>
                      <CCol md='4'>
                        <CFormText >Kondisi yang dirasakan apabila Tidak Sehat</CFormText>
                        <CFormInput 
                          type='text'
                          inputMode='numeric'
                          placeholder='...'
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
                        <CFormText >Tipe Pengiriman</CFormText>
                        <CFormInput 
                          type='text'
                          inputMode='numeric'
                          placeholder='Insert delivery type'
                          />
                      </CCol>
                      <CCol md='5'>
                        <CFormText >Jenis Kendaraan</CFormText>
                        <CFormInput 
                          type='text'
                          inputMode='numeric'
                          placeholder='Insert vehicle type'
                          />
                      </CCol>
                    </CRow>
                  </CRow>
                  <hr/>
                  <CCol className="d-flex justify-content-center gap-3 mb-2">
                    <CButton color="primary" variant="outline" className="mx-2" onClick={()=>setActiveItem({item1: true, item2: false, item3: false})}>Kembali</CButton>
                    <CButton color="secondary" variant="outline" className="mx-2" onClick={()=>setActiveItem({item1: true, item2: true, item3: false})}>Selanjutnya</CButton>
                  </CCol>
                </CCard>   
              </CCol>
            </CRow>
          </CCardBody>
        )}
          
        { activeItem.item1 && activeItem.item2 && !activeItem.item3 && (
          <CCardBody>
            <CRow className='mb-2'>
              <CCol>
                <CCard className='p-3'>
                  <span className='fs-5 fw-bold'>Identitas Kelengkapan Kendaraan</span>
                  <span>(Silahkan lengkapi identitas Anda)</span>
                  <CRow>
                    <CCol md='5'>
                      <CFormText >Apakah Anda Membawa SIM?</CFormText>
                      <div>
                        <CButton color="success" variant="outline" className="mx-2">Ya</CButton>
                        <CButton color="danger" variant="outline"  className="mx-2">Tidak</CButton>
                      </div>
                    </CCol>
                    <CCol md='5'>
                      <CFormText >Berapa Jangka Waktu SIM Anda?</CFormText>
                      <CFormInput 
                        type='text'
                        inputMode='numeric'
                        placeholder='Silahkan isi'
                        />
                    </CCol>
                  </CRow>
                  <hr/>
                  <CRow className='mb-2'>
                    <CRow>
                      <CCol md='5'>
                        <CFormText >Apakah Anda Membawa STNK</CFormText>
                        <div>
                          <CButton color="success" variant="outline" className="mx-2" onClick={() => setIsSTNKButtonDisabled(false)}>
                            Ya
                          </CButton>
                          <CButton color="danger" variant="outline" className="mx-2" onClick={() => setIsSTNKButtonDisabled(true)}>
                            Tidak
                          </CButton>
                        </div>
                      </CCol>
                      <CCol md='3'>
                      <CFormText >STNK Anda dalam kondisi pajak ?</CFormText>
                        <div>
                          <CButton 
                            color="success" 
                            variant="outline"
                            onClick={() => setIsInputSTNKDisabled(false)}
                            disabled={isSTNKButtonDisabled}
                            className="mx-2"
                          >
                            Hidup
                          </CButton>
                          <CButton 
                            color="danger" 
                            variant="outline"
                            onClick={() => setIsInputSTNKDisabled(true)}
                            disabled={isSTNKButtonDisabled}
                            className="mx-2"
                          >
                            Mati
                          </CButton>
                        </div>
                      </CCol>
                      <CCol md='4'>
                        <CFormText >Berapa lama Jangka Pajak STNK anda</CFormText>
                        <CFormInput 
                          type='text'
                          inputMode='numeric'
                          placeholder='Insert DN Number'
                          disabled={isInputSTNKDisabled}
                          />
                      </CCol>
                    </CRow>
                  </CRow>
                  <hr/>
                  <CRow className='mb-2'>
                    <CCol md='5'>
                      <CFormText >Apakah Plat No Polisi Anda Terpasang?</CFormText>
                      <div>
                        <CButton color="success" variant="outline" className="mx-2" onClick={() => setIsInputPlatDisabled(false)}>
                          Ya
                        </CButton>
                        <CButton color="danger"variant="outline" className="mx-2" onClick={() => setIsInputPlatDisabled(true)}>
                          Tidak
                        </CButton>
                      </div>
                    </CCol>
                    <CCol md='5'>
                      <CFormText >Berapakah Akhir Periode Plat No Polisi anda?</CFormText>
                      <CFormInput 
                        type='text'
                        inputMode='numeric'
                        placeholder='Silahkan isi'
                        disabled={isInputPlatDisabled}
                        />
                    </CCol>
                  </CRow>
                  <hr/>
                  <CCol className="d-flex justify-content-center gap-3 mb-2">
                    <CButton color="primary" variant="outline" className="mx-2" onClick={()=>setActiveItem({item1: true, item2: false, item3: false})}>Kembali</CButton>
                    <CButton color="secondary" variant="outline" className="mx-2" onClick={()=>setActiveItem({item1: true, item2: true, item3: true})}>Selanjutnya</CButton>
                  </CCol>
                </CCard>   
              </CCol>
            </CRow>
          </CCardBody>
        )}

        { activeItem.item1 && activeItem.item2 && activeItem.item3 && (
          <CCardBody>
            <CRow className='mb-2'>
              <CCol>
                <CCard className='p-3'>
                  <span className='fs-5 fw-bold'>Identitas Vendor</span>
                  <span>(Silahkan lengkapi identitas Anda)</span>
                  <CRow>
                    <CCol md='5'>
                      <CFormText >Vendor Name</CFormText>
                      <CFormInput 
                        type='text'
                        inputMode='numeric'
                        placeholder='Insert vendor name'
                        />
                    </CCol>
                    <CCol md='5'>
                      <CFormText >Truck Station</CFormText>
                      <CFormInput 
                        type='text'
                        inputMode='numeric'
                        placeholder='Insert truck station'
                        />
                    </CCol>
                  </CRow>
                  <hr/>
                  <CRow className='mb-2'>
                    <span className='fs-5 fw-bold'>Identitas  Driver</span>
                    <span>(Silahkan lengkapi identitas Anda)</span>
                    <CRow>
                      <CCol md='5'>
                        <CFormText >Nama Driver</CFormText>
                        <CFormInput 
                          type='text'
                          inputMode='numeric'
                          placeholder='Insert name'
                          />
                      </CCol>
                      <CCol md='3'>
                        <CFormText >Apakah Anda Dalam Kondisi Sehat?</CFormText>
                        <div>
                          <CButton color="success" variant="outline">Yes</CButton>
                          <CButton color="danger" variant="outline">No</CButton>
                        </div>
                      </CCol>
                      <CCol md='4'>
                        <CFormText >Kondisi yang dirasakan apabila Tidak Sehat</CFormText>
                        <CFormInput 
                          type='text'
                          inputMode='numeric'
                          placeholder='...'
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
                        <CFormText >Tipe Pengiriman</CFormText>
                        <CFormInput 
                          type='text'
                          inputMode='numeric'
                          placeholder='Insert delivery type'
                          />
                      </CCol>
                      <CCol md='5'>
                        <CFormText >Jenis Kendaraan</CFormText>
                        <CFormInput 
                          type='text'
                          inputMode='numeric'
                          placeholder='Insert vehicle type'
                          />
                      </CCol>
                    </CRow>
                  </CRow>
                  <hr/>
                  <CCol className="d-flex justify-content-center gap-3 mb-2">
                    <CButton color="primary" variant="outline" onClick={()=>setActiveItem({item1: true, item2: true, item3: false})}>Kembali</CButton>
                    <CButton color="secondary" variant="outline">Selanjutnya</CButton>
                  </CCol>
                </CCard>   
              </CCol>
            </CRow>
          </CCardBody>
        )}
        </CCard>
      </div>
    </>   
  )
}

export default InputChemical