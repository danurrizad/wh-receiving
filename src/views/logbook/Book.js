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


const Book = () => {
  const [toast, addToast] = useState()
  const toaster = useRef(null)
  const [errMsg, setErrMsg] = useState("")

  const [ dataDummies, setDataDummies ] = useState(dataDummy)
  const [ dataSchedules, setDataSchedules ] = useState(dataSchedulesDummy)
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

  const [ formInput, setFormInput ] = useState({
    date: "",
    day: "",
    vendor_id: "",
    vendor_name: "",
    schedule_from: "",
    schedule_to: "",
    arrival_time: "",
    status: "",
    
    materials: [{
      vendor_id: "",
      dn_no: "",
      material_no: "",
      material_desc: "",
      rack_address: "",
      req_qty: "",
      actual_qty: "",
    }],
  })

  const [queryFilter, setQueryFilter] = useState({
    date: new Date(),
    sortType: "",
    day: new Date().getDay(),
    dn_no: ""
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems =
  dataDummies.length > 0
        ? dataDummies.slice(indexOfFirstItem, indexOfLastItem)
        : dataDummies.slice(indexOfFirstItem, indexOfLastItem)

  useEffect(()=>{
     const currentItems = dataDummies.length > 0
        ? dataDummies.slice(indexOfFirstItem, indexOfLastItem)
        : dataDummies.slice(indexOfFirstItem, indexOfLastItem)
  }, [currentPage])

 
  const handleClickDetail = (data) => {
    setFormInput({
      date: data.date,
      day: data.day,
      vendor_id: data.vendor_id,
      vendor_name: data.vendor_name,
      schedule_from: data.schedule_from,
      schedule_to: data.schedule_to,
      arrival_time: data.arrival_time,
      status: data.status,

      materials: data.materials.map((material)=>{return({
        vendor_id: material.vendor_id,
        dn_no: material.dn_no,
        material_no: material.material_no,
        material_desc: material.material_desc,
        rack_address: material.rack_address,
        date: material.date,
        req_qty: material.req_qty,
        actual_qty: material.actual_qty,
        difference: material.difference,
      })})
    })
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
    // console.log(e.value)
    if(e){
      setQueryFilter({...queryFilter, day: e.value})
      // getDataScheduleByDay()
    }else{
      setQueryFilter({...queryFilter, day: 7})
    }
  }

  const handleClearInputDN = () => {
    setQueryFilter({ ...queryFilter, dn_no: ""})
    setErrMsg("")
  }

  const handleChangeInputDN = (e) => {
    setErrMsg("DN is invalid. Can't find vendor with that DN number!")
    const foundData = dataDummies.filter((data)=>data.materials[0].dn_no === e.target.value)
    // console.log("foundData :", foundData)
    if(foundData.length !== 0){
      setErrMsg("")
    }
    if(e){
      setQueryFilter({ ...queryFilter, dn_no: e.target.value})
      if(e.target.value === ""){
        setErrMsg("")
      }
    } 
  }
  
  useEffect(()=>{
    // getDataSchedules()
    getDataSchedulesToday()
  }, [])

  useEffect(()=>{
    getDataScheduleByDay()
  }, [queryFilter.day])

  
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
                        { currentItems.map((data, index)=> {
                          const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                          return(
                            <CTableRow key={index}>
                              <CTableDataCell>{index+1}</CTableDataCell>
                              <CTableDataCell>{data.materials[0].dn_no}</CTableDataCell>
                              <CTableDataCell>{data.vendor_id}</CTableDataCell>
                              <CTableDataCell>{data.vendor_name}</CTableDataCell>
                              <CTableDataCell>{daysOfWeek[data.day]}</CTableDataCell>
                              <CTableDataCell>{data.date}</CTableDataCell>
                              <CTableDataCell>{data.schedule_from}</CTableDataCell>
                              <CTableDataCell>{data.schedule_to}</CTableDataCell>
                              <CTableDataCell>{data.arrival_time}</CTableDataCell>
                              <CTableDataCell className='text-center'>
                                <div className={`py-1 px-2 ${data.status.toLowerCase() === 'delayed' && "blink"}`} style={{ backgroundColor: data.status === "Delayed" ? "#F64242" : data.status === "On Schedule" ? "#35A535" : "transparent", color: 'white', borderRadius: '5px'}}>
                                  {data.status.toUpperCase()}  
                                  </div>
                                </CTableDataCell>
                              <CTableDataCell style={{ color: data.status === "Delayed" ? "#F64242" : ""}}> {data.delay_time !== 0 ? `- ${data.delay_time}` : ""}</CTableDataCell>
                              <CTableDataCell className='text-center'>
                                  <CButton onClick={()=>handleClickDetail(data)} color='info' style={{ color: "white", padding: "5px 5px 0 5px"}}>
                                    <CIcon size='lg' icon={icon.cilClone}/>
                                  </CButton> 
                              </CTableDataCell>
                            </CTableRow>
                          )
                        })}
                        { currentItems.length === 0 && (
                          <CTableRow>
                            <CTableDataCell colSpan={20} style={{ opacity: "50%"}}>
                              <div className='d-flex flex-column align-items-center justify-content-center py-4'>
                                <CIcon icon={icon.cilTruck} size='4xl'/>
                                <span>Data not found</span>
                              </div>
                            </CTableDataCell>
                          </CTableRow>
                        )}
                    </CTableBody>
                  </CTable>
                  <div className="mt-3 d-flex justify-content-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(
                      dataDummies.length > 0
                        ? dataDummies.length / itemsPerPage
                        : dataDummies.length / itemsPerPage,
                    )}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
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
                  <CFormInput disabled value={formInput.vendor_id} className='w-100' placeholder='Vendor code'/>
              </CCol>
              <CCol md={4} className='pt-md-0 pt-3'>
                <CFormText>Vendor Name</CFormText>
                <CFormInput disabled value={formInput.vendor_name} className='w-100' placeholder='Vendor name'/>
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
                {formInput.materials && formInput.materials.map((data,index,array)=>{
                  return(
                    <CTableRow key={index}  onClick={()=>addToast(TemplateToast("info", 'info', `clicked row ${index+1}`))}>
                      <CTableDataCell>{data.dn_no}</CTableDataCell>
                      <CTableDataCell>{data.material_no}</CTableDataCell>
                      <CTableDataCell>{data.material_desc}</CTableDataCell>
                      <CTableDataCell>{data.rack_address}</CTableDataCell>
                      <CTableDataCell>{data.req_qty}</CTableDataCell>
                      <CTableDataCell>{data.actual_qty}</CTableDataCell>
                      <CTableDataCell className='text-center' style={{ color: data.actual_qty<data.req_qty ? "red" : "black" }}>{ data.actual_qty > data.req_qty ? `+${data.actual_qty-data.req_qty}` : data.actual_qty < data.req_qty ? `-${data.req_qty-data.actual_qty}` : "" }</CTableDataCell>
                      {/* <CTableDataCell className='text-center' style={{ borderLeft: '1px solid red', borderRight: '1px solid red', borderTop: index+1===1 && "1px solid red", borderBottom: array.length-1 === index && "1px solid red", fontWeight: formInput.difference !== 0 && 'bold'}}>{formInput.difference === 0 ? "-" : formInput.difference}</CTableDataCell> */}
                      <CTableDataCell>{data.date}</CTableDataCell>
                    </CTableRow>

                    )
                })} 
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