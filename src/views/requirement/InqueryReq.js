import React,{useState,Suspense, useEffect} from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CContainer,
  CCardTitle,
  CFormText,
  CFormLabel,
  CButton,
  CFormInput,
} from '@coreui/react'
import { FaCamera, FaInbox, FaMaskFace, FaTruck } from 'react-icons/fa6'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DatePicker, Input } from 'rsuite';

import { FilterMatchMode } from 'primereact/api'
import Select  from 'react-select';
import { useToast } from '../../App'

const InquiryReq = () => {
  const [loading, setLoading] = useState(false);
  const addToast = useToast()
  const [filterQuery, setFilterQuery] = useState({
    date: new Date(),
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [showModal, setShowModal] = useState({})
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'))
  const [loadingImport, setLoadingImport] = useState(false)
  const [dummyData, setDummyData] = useState([])
  const [modalData, setModalData] = useState([])

  const exampleData = [{
    supplierName: "Argamanunggal Abadi Utama PT",
    driverName: "Justin Beiber",
    vehicleType: "Truck",
    receiveType: "Vendor",
    drivingEquipment: {
      licenseNumber: "",
      stnk: "",
      sim: ""
    },
    ppeEquipment: {
      safetyShoes: "",
      apd: ""
    },
    updatedAt: "2025-02-14"
  }]

  const getData = async() => {
    setDummyData(exampleData)}

  useEffect(()=>{
    getData()
  }, [])
  
  const onGlobalFilterChange = (e) => {
    const value = e;
    let _filters = { ...filterQuery };

    _filters['global'].value = value;

    setFilterQuery(_filters);
    setGlobalFilterValue(value);
  };

  const renderCustomEmptyMsg = () => {
    return(
      <div className='w-100 d-flex flex-column align-items-center justify-content-center py-3' style={{ color: "black", opacity: "50%"}}>
        <FaInbox size={40}/>
        <p>DATA NOT FOUND!</p>
      </div>
    )
  }

  const vehicleTypeBodyTemplate = (rowData) =>{
    const renderIcon = rowData.vehicleType.toLowerCase() === "truck" ? <FaTruck/> : ""
    return(
      <CButton 
        color='info' 
        style={{ color: "white"}} 
        onClick={()=>{
          setModalData(rowData)
          setShowModal({...showModal, vehicle: true})
        }}
      >
        {renderIcon}
      </CButton>
    )
  }

  const ppeEquipmentBodyTemplate = (rowData) => {
    return(
      <CButton 
        color='success'
        style={{ color: "white"}}
        onClick={()=>{
          setModalData(rowData)
          setShowModal({...showModal, ppe: true})
        }}
      >
        <FaMaskFace/>
      </CButton>
    )
  }

  return (
    <CContainer fluid>
      <CRow>
        <CCard className='p-0 mb-4' style={{ border: "1px solid #6482AD"}}>
          <CCardHeader style={{ backgroundColor: "rgb(100, 130, 173)", color: "white"}}>
            <CCardTitle className="text-center">INQUIRY VENDOR REQUIREMENT</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <CRow className='d-flex align-items-end justify-content-between'>
              
              <CCol className='d-flex justify-content-end gap-3'>
                <div>
                  <CFormText>Search</CFormText>
                  <Input value={globalFilterValue} onChange={onGlobalFilterChange} placeholder='Keyword search'/>
                </div>
                <div>
                  <CFormText>Filter by Updated Date</CFormText>
                  <DatePicker 
                    format='yyyy-MM-dd'
                    value={filterQuery.date ? filterQuery.date : null} 
                    placeholder="All time"
                    onChange={(e)=>{
                      console.log(e)
                      setFilterQuery({ ...filterQuery, date: e !== null ? e.toLocaleDateString('en-CA') : ""})
                    }} />
                </div>
              </CCol>
            </CRow>
            <CRow className='mt-4'>
              <DataTable 
                className='p-datatable-gridlines p-datatable-sm custom-datatable text-nowrap' 
                loading={loading} 
                emptyMessage={renderCustomEmptyMsg} 
                filters={filterQuery}
                value={dummyData} 
                removableSort
                scrollable 
                scrollHeight="500px" 
                showGridlines  
                stripedRows
                paginator 
                rows={10} 
                rowsPerPageOptions={[10, 25, 50, 100]} 
                tableStyle={{ minWidth: '50rem' }}
              >
                {/* <Column field="no" header="No" body={(rowData, { rowIndex }) => rowIndex + 1}></Column> */}
                <Column field="supplierName" sortable header="Vendor Name"></Column> 
                <Column field="driverName" sortable header="Driver Name"></Column>
                <Column field="vehicleType" sortable header="Vehicle Type"></Column>
                <Column field="" sortable header="Driving Equipment" align='center' body={vehicleTypeBodyTemplate}></Column>
                <Column field="" sortable header="PPE Fittings" align='center' body={ppeEquipmentBodyTemplate}></Column>
                <Column field="updatedAt" sortable header="Updated At"></Column>
              </DataTable>
            </CRow>
          </CCardBody>
        </CCard>
      </CRow>


      {/* ----------------------------------------------------------MODAL-------------------------------------------------- */}
      <CModal size='lg' visible={showModal.ppe} onClose={() => setShowModal({...showModal, ppe: false})}>
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">PPE Equipment</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol sm='5'>
              <CFormText>VENDOR NAME</CFormText>
              <CFormLabel>{modalData.supplierName}</CFormLabel>
            </CCol>
            <CCol>
              <CFormText>DRIVER NAME</CFormText>
              <CFormLabel>{modalData.driverName}</CFormLabel>
            </CCol>
          </CRow>
            <hr style={{ border: "1px solid #D3D4D4"}}></hr>
          <CRow>
            <CCol className='d-flex flex-column align-items-center justify-content-center'>
              <CFormLabel>Safety Shoes</CFormLabel>
              <CFormLabel className='d-flex flex-column align-items-center justify-content-center' style={{ width: "200px", height: "200px", border: "2px solid black", borderRadius: "25px"}}>
                <FaCamera/>
                <CFormText>Bukti Foto</CFormText>
              </CFormLabel>
                
            </CCol>
            <CCol className='d-flex flex-column align-items-center justify-content-center'>
              <CFormLabel>APD</CFormLabel>
              <CFormLabel className='d-flex flex-column align-items-center justify-content-center' style={{ width: "200px", height: "200px", border: "2px solid black", borderRadius: "25px"}}>
                <FaCamera/>
                <CFormText>Bukti Foto</CFormText>
              </CFormLabel>
            </CCol>
          </CRow>
        </CModalBody>
      
      </CModal>

      <CModal size='lg' visible={showModal.vehicle} onClose={() => setShowModal({...showModal, vehicle: false})}>
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">DRIVING EQUIPMENT</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol sm='5'>
              <CFormText>VENDOR NAME</CFormText>
              <CFormLabel>{modalData?.supplierName}</CFormLabel>
            </CCol>
            <CCol>
              <CFormText>RECEIVE TYPE</CFormText>
              <CFormLabel>{modalData?.receiveType}</CFormLabel>
            </CCol>
            <CCol>
              <CFormText>VEHICLE TYPE</CFormText>
              <CFormLabel>{modalData?.vehicleType}</CFormLabel>
            </CCol>
          </CRow>
            <hr style={{ border: "1px solid #D3D4D4"}}></hr>
          <CRow>
            <CCol className='d-flex flex-column align-items-center justify-content-center'>
              <CFormLabel>License Number</CFormLabel>
              <CFormLabel className='d-flex flex-column align-items-center justify-content-center' style={{ width: "200px", height: "200px", border: "2px solid black", borderRadius: "25px"}}>
                <FaCamera/>
                <CFormText>Bukti Foto</CFormText>
              </CFormLabel>
                
            </CCol>
            <CCol className='d-flex flex-column align-items-center justify-content-center'>
              <CFormLabel>STNK</CFormLabel>
              <CFormLabel className='d-flex flex-column align-items-center justify-content-center' style={{ width: "200px", height: "200px", border: "2px solid black", borderRadius: "25px"}}>
                <FaCamera/>
                <CFormText>Bukti Foto</CFormText>
              </CFormLabel>
            </CCol>

            <CCol className='d-flex flex-column align-items-center justify-content-center'>
              <CFormLabel>SIM</CFormLabel>
              <CFormLabel htmlFor='file-apd' className='d-flex flex-column align-items-center justify-content-center' style={{ width: "200px", height: "200px", border: "2px solid black", borderRadius: "25px"}}>
                <FaCamera/>
                <CFormText>Bukti Foto</CFormText>
              </CFormLabel>
            </CCol>
          </CRow>
        </CModalBody>
      
      </CModal>
    </CContainer>
  )
}

export default InquiryReq