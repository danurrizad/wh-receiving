import React, { useState, useEffect, useRef} from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CFormInput, CFormLabel, CFormText, CInputGroup, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToaster } from '@coreui/react'
import { dataReceivingDummy, dataSchedulesDummy, dataDummy } from '../../utils/DummyData'
import { DatePicker } from 'rsuite';
import  colorStyles from '../../utils/StyleReactSelect'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import Pagination from '../../components/Pagination'
import { handleExport } from '../../utils/ExportToExcel'
import TemplateToast from '../../components/TemplateToast'
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import Receiving from './../receiving/Receiving';


const Schedule2 = () => {
  const [toast, addToast] = useState()
  const toaster = useRef(null)
  const [errMsg, setErrMsg] = useState("")

  const [ dataDummies, setDataDummies ] = useState(dataDummy)
  // const [ dataSchedules, setDataSchedules ] = useState(dataSchedulesDummy)
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
  // const [ optionsSelectVendor, setOptionsSelectVendor] = useState(defaultOptionsSelectVendor)

  const [ formInput, setFormInput ] = useState({
    date: "",
    day: "",
    vendor_id: "",
    vendor_name: "",
    schedule_from: "",
    schedule_to: "",
    arrival_time: "",
    status: "",
    selected_material: "",
    selected_rack_address: "",
    selected_actual_qty: "",
    
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
  const [itemsPerPage, setItemsPerPage] = useState(15)
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

 
  const handleClickInput = (data) => {
    // const selectedDataReceiving = dataReceivingDummy.filter((dataReceiving)=>dataReceiving.vendor_id === data.vendor_id)
    // console.log('selectedDataReceiving :', selectedDataReceiving)
    console.log("data :", data)
    setFormInput({
      date: data.date,
      day: data.day,
      vendor_id: data.vendor_id,
      vendor_name: data.vendor_name,
      schedule_from: data.schedule_from,
      schedule_to: data.schedule_to,
      arrival_time: data.arrival_time,
      status: data.status,
      selected_material: "",
      selected_rack_address: "",
      selected_actual_qty: "",

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

  

  // const handleChangeFilter = (e) =>{
  //   // console.log(e.value)
  //   if(e){
  //     setQueryFilter({...queryFilter, day: e.value})
  //     // getDataScheduleByDay()
  //   }else{
  //     setQueryFilter({...queryFilter, day: 7})
  //   }
  // }

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

  const handleSelectReceivingDN = (data) => {
    setFormInput({ ...formInput, selected_material: data.material_desc, selected_rack_address: data.rack_address, selected_actual_qty: data.actual_qty})
    console.log("data :", data)
  }

  
  useEffect(()=>{
    // getDataSchedules()
    getDataSchedulesToday()
  }, [])

  useEffect(()=>{
    getDataScheduleByDay()
  }, [queryFilter.day])

  
  // const optionsSelectDay = [
  //   { label: "Monday", value: 1 },
  //   { label: "Tuesday", value: 2 },
  //   { label: "Wednesday", value: 3 },
  //   { label: "Thursday", value: 4 },
  //   { label: "Friday", value: 5 },
  //   { label: "Saturday", value: 6 },
  //   { label: "Sunday", value: 0 },
  // ]

  const optionsMaterialByDN = formInput?.materials?.map((material)=>{
    return{
      label: material.material_desc,
      value: material.material_desc,
    }
  })

  const handleChangeMaterialByDN = (e, data) => {
    if(e){
      if(e.value !== ""){
        const matchesMaterial = data.find((material)=>material.material_desc === e.value)
        if(matchesMaterial){
          setFormInput({ ...formInput, selected_material: e.value, selected_rack_address: matchesMaterial.rack_address, selected_actual_qty: matchesMaterial.actual_qty})
        }
      }
    } else{
      setFormInput({ ...formInput, selected_material: "", selected_rack_address: "", selected_actual_qty: ""})
    }
  }


  


  return (
    <CContainer fluid>
        <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
        
        <CRow className='pt-4'>
          <CCard className='p-0'>
            <CCardHeader>
              <CCardTitle>SCHEDULE DATA</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CRow className='d-flex justify-content-between align-items-start'>
                <CCol md={4} style={{ position: "relative"}} className=''>
                    <CFormText>DN No</CFormText>
                      <div>
                        <div style={{ position: "relative"}}>
                        <CInputGroup>
                          <CFormInput 
                            type='number'
                            inputMode='numeric'
                            placeholder='Insert DN Number'
                            onKeyDown={
                              (e)=>{
                                if(e.key === 'Enter'){
                                  console.log('here')
                                }
                              }
                            }
                            value={queryFilter.dn_no}
                            onChange={handleChangeInputDN}
                            />
                            { queryFilter.dn_no !== "" && 
                              <CButton onClick={handleClearInputDN} className='p-0 px-1' style={{border: "0", position: "absolute", top: '50%', right: '50px', translate: "0 -50%", zIndex: "50"}}>
                                <CIcon icon={icon.cilX}/> 
                              </CButton>
                            } 
                          <CButton onClick={()=>setShowModalScanner(true)} color='success' style={{ color: "white"}}><CIcon icon={icon.cilQrCode}/></CButton>
                        </CInputGroup>
                        <CFormText style={{ color: "red", opacity: '75%'}}>{errMsg}</CFormText>
                        </div>
                      </div>
                </CCol>
                {/* <CCol sm='2' className=''>
                    <CFormText>Filter by Day</CFormText>
                    <Select isClearable options={optionsSelectDay} value={optionsSelectDay.find((option)=>option.value === queryFilter.day) || 7} onChange={handleChangeFilter} placeholder='All day' />
                </CCol> */}
              </CRow>
              <CRow className='mt-3'>
                  <CTable responsive bordered hover>
                    <CTableHead color='light'>
                      <CTableRow align='middle' className='text-center'>
                        <CTableHeaderCell rowSpan={2}>DN No</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Vendor Code</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Vendor Name</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Day</CTableHeaderCell>
                        {/* <CTableHeaderCell rowSpan={2}>Date</CTableHeaderCell> */}
                        <CTableHeaderCell colSpan={2}>Schedule Time Plan</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Arrival Time</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Status</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Delay Time</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Input Material</CTableHeaderCell>
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
                              <CTableDataCell>{data.materials[0].dn_no}</CTableDataCell>
                              <CTableDataCell>{data.vendor_id}</CTableDataCell>
                              <CTableDataCell>{data.vendor_name}</CTableDataCell>
                              <CTableDataCell>{daysOfWeek[data.day]}</CTableDataCell>
                              {/* <CTableDataCell>{data.date}</CTableDataCell> */}
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
                                { !data.arrival_time ?  
                                  <CButton onClick={()=>handleClickInput(data)} color='info' style={{ color: "white", padding: "5px 5px 0 5px"}}>
                                    <CIcon size='lg' icon={icon.cilInput}/>
                                  </CButton>  
                                    :
                                  <CButton onClick={()=>handleClickInput(data)} color='warning' style={{ color: "white", padding: "5px 5px 0 5px"}}>
                                    <CIcon size='lg' icon={icon.cilColorBorder}/>
                                  </CButton> 
                                }
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
            <CModalTitle>Input Receiving</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className='mb-3'>
                  <CCol md={4} style={{ position: "relative"}}>
                      <CFormText>DN No</CFormText>
                      <CFormInput disabled value={formInput.materials[0].dn_no} />
                  </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={4}>
                        <CFormText>Material</CFormText>
                        <Select isClearable options={optionsMaterialByDN} value={optionsMaterialByDN.find((opt)=>opt.value === formInput.selected_material) || ""} onChange={(e)=>handleChangeMaterialByDN(e, formInput.materials)} className='w-100' placeholder='Select material'/>
                    </CCol>
                    <CCol md={4} className='pt-md-0 pt-3'>
                      <CFormText>Rack Address</CFormText>
                      <CFormInput disabled value={formInput.selected_rack_address}  className='w-100' placeholder='Rack address material'/>
                    </CCol>
                    <CCol md={2} xs={6} className='pt-md-0 pt-3'>
                      <CFormText>Quantity</CFormText>
                        <CInputGroup>
                          <CFormInput type='number' value={formInput.selected_actual_qtyactual_qty} onChange={()=>setFormInput({ ...formInput, selected_actual_qty: e.target.value})} inputMode='numeric'/>
                        </CInputGroup>
                    </CCol>
                    <CCol md={2} xs={6} className='d-flex justify-content-end align-items-end'>
                      <CButton 
                        // disabled={materialByDN.dn_no === "" || materialByDN.material_desc === "" || materialByDN.rack_address === ""} 
                        // onClick={()=>handleSubmitReceiving(materialByDN)} 
                        // color={`${materialByDN.dn_no === "" || materialByDN.material_desc === "" || materialByDN.rack_address === "" ? "warning" : "success"}`} 
                        color='info'
                        style={{color: 'white'}} 
                        className='flex-grow-0 d-flex align-items-center gap-2'
                        >
                          {/* <CIcon icon={icon.cilCheckAlt}/>
                          <div style={{border: "0.5px solid white", height: "10px", width: "2px"}}></div> */}
                          <span>Add</span>
                      </CButton>
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
                    <CTableRow key={index}  onClick={()=>handleSelectReceivingDN(data)}>
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
          <CModalFooter>
            {/* <CButton onClick={()=>setShowModalInput(false)} color="secondary">Close</CButton> */}
            <CButton onClick={()=>setShowModalInput(false)} color="success" style={{ color: 'white'}}>Submit</CButton>
          </CModalFooter>
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

export default Schedule2