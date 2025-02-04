import React, { useState, useEffect, useRef} from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CFormInput, CFormLabel, CFormText, CInputGroup, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToaster } from '@coreui/react'
import { dataReceivingDummy, dataSchedulesDummy, dataDummy } from '../../utils/DummyData'
import { DatePicker, DateRangePicker } from 'rsuite';
import  colorStyles from '../../utils/StyleReactSelect'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import Pagination from '../../components/Pagination'
import { handleExport } from '../../utils/ExportToExcel'
import TemplateToast from '../../components/TemplateToast'
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import Receiving from './../receiving/Receiving';
import useReceivingDataService from '../../services/ReceivingDataServices'


const Book = () => {
  const [toast, addToast] = useState()
  const toaster = useRef(null)

  const [ dataDummies, setDataDummies ] = useState(dataDummy)
  const [ dataSchedules, setDataSchedules ] = useState(dataSchedulesDummy)

  const { getMaterialByDNData, getDNByDateData, submitMaterialByDNData } = useReceivingDataService()

  const [dataVendorByDN, setDataVendorByDN] = useState([])
  const [dataMaterialsByDN, setDataMaterialsByDN] = useState([])
  const [stateVendorArrived, setStateVendorArrived] = useState(false)


  const [ showModalInput, setShowModalInput] = useState(false)
  const [ showModalScanner, setShowModalScanner ] = useState(false)

  const defaultOptionsSelectVendor = dataDummies?.map((data)=>{
    return{
      label: `${data.vendor_id} - ${data.vendor_name}`,
      value: {
        id: data.vendor_id,
        name: data.vendor_name,
      }
    }
  })
  const [ optionsSelectVendor, setOptionsSelectVendor] = useState(defaultOptionsSelectVendor)
  // const now = new Date();
  // // Format date as YYYY-MM-DD
  // const date = now.toISOString().split('T')[0];
  

  const [queryFilter, setQueryFilter] = useState({
    date: new Date(),
    sortType: "",
    day: new Date().getDay(),
    dn_no: ""
  })

  const getDNbyDate = async(date) => {
    try {
      const dateFormat = date.toISOString().split('T')[0]
      const response = await getDNByDateData(date) 
      console.log("response :", response)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(()=>{
    getDNbyDate(queryFilter.date)
  }, [queryFilter.date])
 
  const handleClickDetail = (data) => {
    


    setShowModalInput(true)
  }

  const getDataSchedulesToday = () => {
    const filteredDataSchedule = dataDummy.filter((item) => {
      if(queryFilter.day !== 7){
        // Compare only the date part (ignore time)
        return item.day === queryFilter.day
      } else{
        return item
      }
    });
    // console.log("filteredDataSchedule :", filteredDataSchedule)
    setDataDummies(filteredDataSchedule)
  }

  const getDataScheduleByDay = () => {
    // Filter data by date
    const filteredDataSchedule = dataDummy.filter((item) => {
      if(queryFilter.day !== 7){
        return item.day === queryFilter.day
      } else{
        console.warn("here")
        return item
      }
    });
    if(queryFilter.sortType === "Newest"){
      const filteredSortedAscending = [...filteredDataSchedule].sort((a, b) => parseDate(a.date) - parseDate(b.date));
      setDataDummies(filteredSortedAscending)
    } else if(queryFilter.sortType === "Oldest"){
      const filteredSortedDescending = [...filteredDataSchedule].sort((a, b) => parseDate(b.date) - parseDate(a.date));
      setDataDummies(filteredSortedDescending)
    }
    else{
      setDataDummies(filteredDataSchedule)
    }
  }
  // Function to convert "DD-MM-YYYY" to Date object
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  

  const handleChangeFilter = (e) =>{
    if(e){
      setQueryFilter({...queryFilter, day: e.value})
    }else{
      setQueryFilter({...queryFilter, day: 7})
    }
  }

  
  
  useEffect(()=>{
    // getDataSchedules()
    // getDataSchedulesToday()
  }, [])

  // useEffect(()=>{
  //   getDataScheduleByDay()
  // }, [queryFilter.day])

  
  const optionsSelectDay = [
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 },
    { label: "Sunday", value: 0 },
  ]



  


  return (
    <CContainer fluid>
        <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
        <CRow>
          <CCard className='p-0'>
            <CCardHeader>
              <CCardTitle>LOGS DATA</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CRow className=''>
                
                <CCol sm='4' className=''>
                    <CFormText>Search vendor</CFormText>
                    <Select options={optionsSelectVendor} isClearable placeholder='Vendor code or name' />
                </CCol>

                <CCol className='d-flex justify-content-end gap-4'>
                  <CCol sm='4' className=''>
                      <CFormText>Filter by Date</CFormText>
                      <DateRangePicker showOneCalendar placeholder='All time' position='start' />
                  </CCol>
                  <CCol sm='3' className=''>
                      <CFormText>Filter by Day</CFormText>
                      <Select isClearable options={optionsSelectDay} value={optionsSelectDay.find((option)=>option.value === queryFilter.day) || 7} onChange={handleChangeFilter} placeholder='All day' />
                  </CCol>
                </CCol>
              </CRow>
              <CRow className='mt-3'>
                  <CTable responsive bordered hover>
                    <CTableHead color='light'>
                      <CTableRow align='middle' className='text-center'>
                        <CTableHeaderCell rowSpan={2}>No</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>DN No</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Vendor Code</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Vendor Name</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Day</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Date</CTableHeaderCell>
                        <CTableHeaderCell colSpan={2}>Schedule Time Plan</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Arrival Time</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Status</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Delay Time</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Log</CTableHeaderCell>
                      </CTableRow>
                      <CTableRow align='middle' className='text-center'>
                        <CTableHeaderCell >From</CTableHeaderCell>
                        <CTableHeaderCell >To</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        
                    </CTableBody>
                  </CTable>
              </CRow>
            </CCardBody>
          </CCard>
        </CRow>


        {/* -----------------------------------------------------------------------------------MODAL RENDERING--------------------------------------------------------------------------------------- */}

        {/* Modal Upload File */}
        <CModal 
          visible={showModalInput}
          onClose={() => setShowModalInput(false)}
          size='xl'
          backdrop="static"
        >
          <CModalHeader>
            <CModalTitle>Log Receiving</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol md={4}>
                  <CFormText>Vendor Code</CFormText>
                  {/* <CFormInput disabled value={formInput.vendor_id} className='w-100' placeholder='Vendor code'/> */}
              </CCol>
              <CCol md={4} className='pt-md-0 pt-3'>
                <CFormText>Vendor Name</CFormText>
                {/* <CFormInput disabled value={formInput.vendor_name} className='w-100' placeholder='Vendor name'/> */}
              </CCol>
             
            </CRow>  
          <CRow className='pt-3'>
            <CTable responsive bordered hover>
              <CTableHead color='light'>
                <CTableRow>
                  <CTableHeaderCell>DN No</CTableHeaderCell>
                  <CTableHeaderCell>Material No</CTableHeaderCell>
                  <CTableHeaderCell>Material Description</CTableHeaderCell>
                  <CTableHeaderCell>Rack Address</CTableHeaderCell>
                  <CTableHeaderCell>Planning Quantity</CTableHeaderCell>
                  <CTableHeaderCell>Actual Quantity</CTableHeaderCell>
                  <CTableHeaderCell>Difference</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
               
              </CTableBody>
            </CTable>
          </CRow>
          </CModalBody>
          
        </CModal>
       
       
        {/* Modal QR Scanner */}
        <CModal 
          visible={showModalScanner}
          onClose={() => setShowModalScanner(false)}
        >
          <CModalHeader>
            <CModalTitle>Scan Barcode DN No</CModalTitle>
          </CModalHeader>
          <CModalBody className='w-100 overflow-hidden' style={{ position: "relative"}}>
            <BarcodeScannerComponent
              width='100%'
              height='100%'
              onUpdate={(err, result) => {
                if (result) console.log("RESULT :", result);
                else console.warn("BARCODE NOT FOUND");
              }}
            />
            {/* design border camera */}
            <div style={{position: "absolute", top: '30px', left: '30px', width: '75px', height: '75px', border: "10px solid white", borderRight: '0', borderBottom: '0'}}></div>
            <div style={{position: "absolute", top: '30px', right: '30px', width: '75px', height: '75px', border: "10px solid white", borderLeft: '0', borderBottom: '0'}}></div>
            <div style={{position: "absolute", bottom: '30px', left: '30px', width: '75px', height: '75px', border: "10px solid white", borderRight: '0', borderTop: '0'}}></div>
            <div style={{position: "absolute", bottom: '30px', right: '30px', width: '75px', height: '75px', border: "10px solid white", borderLeft: '0', borderTop: '0'}}></div>
          </CModalBody>
        </CModal>
    </CContainer>
  )
}

export default Book