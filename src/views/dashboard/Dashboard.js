import React, { useState, useEffect } from 'react'
import { dataSchedulesDummy, dataReceivingDummy } from '../../utils/DummyData'
import  colorStyles from '../../utils/StyleReactSelect'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.css'
import Pagination from '../../components/Pagination'
import 'primeicons/primeicons.css'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import 'primereact/resources/themes/nano/theme.css'
import 'primereact/resources/primereact.min.css'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CBadge,
  CCardHeader,
  CCardText,
  CCardTitle,
  CCol,
  CContainer,
  CFormLabel,
  CFormText,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import {
  cilCalendar,
} from '@coreui/icons'

import useChartData from '../../services/ChartDataServices'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import CIcon from '@coreui/icons-react'
import * as icon from "@coreui/icons"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const Dashboard = () => {
  const [ dataSchedules, setDataSchedules ] = useState(dataSchedulesDummy)
  const [ dataReceiving, setDataReceiving ] = useState(dataReceivingDummy)
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1)
  const [dates, setDates] = useState([null, null]) // State for date range
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const [selectedPlant, setSelectedPlant] = useState({ value: 'all', label: 'All' })
  const [plant, setPlant] = useState([])
  const [isVisible, setIsVisible] = useState(true); // State to control visibility
  const toggleVisibility = () => setIsVisible(!isVisible); // Toggle function
  const currentItems =
    dataSchedules.length > 0
        ? dataSchedules.slice(indexOfFirstItem, indexOfLastItem)
        : dataSchedules.slice(indexOfFirstItem, indexOfLastItem)

  useEffect(()=>{
     const currentItems = dataSchedules.length > 0
        ? dataSchedules.slice(indexOfFirstItem, indexOfLastItem)
        : dataSchedules.slice(indexOfFirstItem, indexOfLastItem)
  }, [currentPage])

  const {setChartData, getChartOption} = useChartData({currentItems})
  const options = [
    // { value: 'all', label: 'All' },
    { value: 'Shortage', label: 'Shortage' },
    { value: 'Optimal', label: 'Optimal' },
  ]

  const [ showCard, setShowCard ] = useState({
    summary: true,
    schedule: true,
    receiving: true
  })
  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };
  const getDataSchedules = () => {
    setDataSchedules(dataSchedulesDummy)
  }

  const getDataReceiving = () => {
    setDataReceiving(dataReceivingDummy)
  }

  const handleFilterSchedule = (selectedOption) => {
    if (!selectedOption) {
      // If no option selected, reset to all data
      setDataSchedules(dataSchedulesDummy);
    } else {
      // Filter based on the selected status
      const filtered = dataSchedulesDummy.filter(
        (item) => item.status === selectedOption.value
      );
      setDataSchedules(filtered);
    }
  }

  const handleFilterReceiving = (selectedOption) => {
    if (!selectedOption) {
      // If no option selected, reset to all data
      setDataReceiving(dataReceivingDummy);
    } else {
      // Filter based on the selected status
      if(selectedOption.value === "Shortage"){
        const filtered = dataReceivingDummy.filter(
          (item) => item.difference !== 0
        );
        setDataReceiving(filtered)
      } else{
        const filtered = dataReceivingDummy.filter(
          (item) => item.difference === 0
        )
        setDataReceiving(filtered)
      }
    }
  }

  const handleChangeSearch = (e) => {
    if(e){
      console.log("e :", e)
      if(e.value === ""){
        setDataReceiving(dataReceivingDummy)
      }
      else{
        const matchesSearch = dataReceiving.filter((data)=>data.material_no.includes(e.value)) || dataReceiving.filter((data)=>data.material_desc.includes(e.value))
        setDataReceiving(matchesSearch);
      }
    } else{
      setDataReceiving(dataReceivingDummy)
    }
  }


  
  useEffect(()=>{
    getDataSchedules()
    getDataReceiving()
  }, [])

const optionsSelectDN = Array.from(
    new Set(dataReceivingDummy.map((data) => data.dn_no))
  ).map((uniqueValue) => {
    return {
      value: uniqueValue,
      label: uniqueValue,
    };
  });
  
  const renderHeader = () => {
    return (
      <div>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
            style={{ width: '100%', borderRadius: '5px' }}
          />
        </IconField>
      </div>
    )
  }
  const plantOptions = [
    { value: 'all', label: 'All' }, // Menambahkan opsi "All" di awal
    ...plant.map((plant) => ({
      value: plant.id,
      label: plant.plantName,
    })),
  ]

  const handlePlantChange = (selectedPlant) => {
    if (selectedPlant && selectedPlant.value !== 'all' && selectedPlant.value !== '') {
    
    } else {
      setSelectedPlant({ value: 'all', label: 'All' })
    
    }
  }

  return (
  <CContainer fluid>
    <CRow className='mb-3'>
      <CCard
         className="px-0 bg-white text-black"
          style={{
          maxHeight: `${showCard.summary ? "1000px" : "50px"}`,
          overflow: "hidden",
          transitionDuration: "500ms",
          border: "1px solid #9AA6B2", // Menambahkan border dengan warna #074799
        }}>
         <CCardHeader
            style={{
            position: "relative",
            cursor: "pointer",
            backgroundColor: "#9AA6B2", // Warna latar belakang header tetap putih
            color: "white", }}
            onClick={() => setShowCard({ ...showCard, summary: !showCard.summary })} >
             <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
             <CCardTitle className="text-center fs-4">SUMMARY RECEIVING WAREHOUSE</CCardTitle>
             </div>
         </CCardHeader>
    <CCardBody style={{ overflow: "auto"  }}>
    <CRow className="d-flex justify-content-between align-items-center">
  {/* Tombol Hide/Show di pojok kiri */}
      <CCol md={7} className="d-flex justify-content-start gap-2">
            <button
              className="btn"
              style={{
              backgroundColor: "#D9EAFD",
              color: "#000",}}
              onClick={toggleVisibility}
              >
              {isVisible ? "Hide Detail" : "Show Detail"}
            </button>
         <Select
            className="basic-single"
            classNamePrefix="select"
            isClearable
            options={plantOptions} // plantOptions termasuk "All"
            value={selectedPlant} // Menetapkan state sebagai value yang dipilih
            id="plant"
            onChange={handlePlantChange}/>
         <Select 
       onChange={handleFilterSchedule} 
       placeholder="All" 
       isClearable  
       styles={colorStyles} 
       options={[{label: "On Schedule", value: "On Schedule"}, {label: "Delayed", value: "Delayed"}]}/>
   </CCol>
  {/* Elemen Header dan Date Picker di pojok kanan */}
  <CCol md={5} className="d-flex justify-content-end gap-3">
    <div>{renderHeader()}</div>
    <div
      className="flatpickr-wrapper"
      style={{ position: "relative", width: "50%" }} // Atur ukuran date picker sesuai kebutuhan
    >
      <Flatpickr
        onChange={(selectedDates) => setDates(selectedDates)}
        options={{
          mode: "range",
          dateFormat: "Y-m-d",
        }}
        className="form-control"
        placeholder="Select a date"
        style={{
          paddingLeft: "40px", // Beri ruang untuk ikon
          height: "100%",
        }}
      />
      <CIcon
        icon={cilCalendar}
        size="lg"
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: "black", // Warna ikon
        }}
      />
    </div>
  </CCol>
</CRow>

     <hr className="m-1" />
      <CRow>
        <CCol xs={12} sm={7} md={7} xl={7} >
        <label className="fs-5 fw-bold text-center d-block">ARRIVAL MONITORING</label>
        <CCard  style={{ backgroundColor: "white",border: "1px solid #BCCCDC"}} className="p-1">
        <CRow className="justify-content-center gap-0">
        <CCol  xs={6} sm={3} md={3} xl={3}>
        <CCard 
         className="mb-2 mt-1 bg-transparent" 
         style={{ border: "1px solid #3D3D3D" }}
        >
          <CCardHeader
          className="text-muted small text-center"
          style={{ backgroundColor: "#F64242" }}>
          <h6 style={{ color: "black", fontSize: "11px" }}>DELAYED</h6>
          </CCardHeader>
          <CCardBody className="text-center ">
         <CCardText className="fs-3 fw-bold" style={{ color: "black" }}>46</CCardText>
       </CCardBody>
     </CCard>
     </CCol>

     <CCol  xs={6} sm={3} md={3} xl={3}>
     <CCard 
         className="mb-2 mt-1 bg-transparent" 
         style={{ border: "1px solid #3D3D3D" }}
        >
        <CCardHeader
         className="text-muted small text-center"
         style={{ backgroundColor: "#35A535" }}
         >
         <h6 style={{ color: "black", fontSize: "11px" }}>ON SCHEDULE</h6>
         </CCardHeader>
         <CCardBody className="text-center">
        <CCardText className="fs-3 fw-bold" style={{ color: "black" }}>25</CCardText>
      </CCardBody>
    </CCard>
  </CCol>

  <CCol  xs={6} sm={3} md={3} xl={3}>
    <CCard 
         className="mb-2 mt-1 bg-transparent" 
         style={{ border: "1px solid #3D3D3D" }}
        >
      <CCardHeader
        className="text-muted small text-center"
        style={{ backgroundColor: "gray" }}>
         <h6 style={{ color: "black", fontSize: "11px" }}>REMAINING</h6>
        </CCardHeader>
          <CCardBody className="text-center">
           <CCardText className="fs-3 fw-bold" style={{ color: "black" }}>46</CCardText>
         </CCardBody>
        </CCard>    
      </CCol>
      <CCol  xs={6} sm={3} md={3} xl={3}>
      <CCard 
         className="mb-2 mt-1 bg-transparent" 
         style={{ border: "1px solid #3D3D3D" }}
        >
      <CCardHeader
        className="text-muted small text-center"
        style={{ backgroundColor: "white" }}
      >
        <h6 style={{ color: "black", fontSize: "10px" }}>TOTAL</h6>
      </CCardHeader>
        <CCardBody className="text-center">
          <CCardText className="fs-3 fw-bold"style={{ color: "black" }}>46</CCardText>
        </CCardBody>
       </CCard>
      </CCol>
     </CRow>
      <hr className="m-0" />
        <CRow>
        <Bar 
        options={getChartOption()} 
        data={setChartData()} 
        height={200} // Tinggi chart
       />
      </CRow>
      </CCard>
     </CCol>
     {/* //untuk tabel */}

   <CCol sm={5} >
    <label className="fs-5 fw-bold text-center d-block">TABLE RECEIVING MATERIAL</label>
    <CCard  style={{ backgroundColor: "white",border: "1px solid #BCCCDC"}} className="p-1">
      {/* Informasi Header */}
      <CRow className="mb-1">
        <CCol sm={12}>
          <div><strong>Supplier:</strong> Supplier Name</div>
        </CCol>
        <CRow>
        <CCol sm={6}>
          <div><strong>Day:</strong> Monday</div>
        </CCol>
        <CCol sm={6}>
          <div><strong>Schedule Plan:</strong> 10:00 AM</div>
        </CCol>
        </CRow>
        <CRow>
        <CCol sm={6}>
          <div><strong>Arrival:</strong> 9:45 AM</div>
        </CCol>
        <CCol sm={6}>
          <div><strong>Status:</strong>Delay</div>
        </CCol>
        </CRow>
        </CRow>
     <CTable style={{fontSize:'10px'}} bordered>
       <CTableHead color='light'>
         <CTableRow>
          <CTableHeaderCell>Material Description</CTableHeaderCell>
          <CTableHeaderCell>Rack Address</CTableHeaderCell>
          <CTableHeaderCell>Plan Qty</CTableHeaderCell>
          <CTableHeaderCell>Act Qty</CTableHeaderCell>
          <CTableHeaderCell>Diff</CTableHeaderCell>
           <CTableHeaderCell>Date</CTableHeaderCell>
          </CTableRow>
            </CTableHead>
             <CTableBody>
              {currentItems.map((data, index) => (
              <CTableRow key={index}>
               <CTableDataCell>{data.material_desc}</CTableDataCell>
                <CTableDataCell>{data.rack_address}</CTableDataCell>
                  <CTableDataCell>{data.req_qty}</CTableDataCell>
                   <CTableDataCell>{data.actual_qty}</CTableDataCell>
                    <CTableDataCell>{data.difference || "-"}</CTableDataCell>
                    <CTableDataCell>{data.date}</CTableDataCell>
                    </CTableRow>
                  ))}
                  {currentItems.length === 0 && (
                    <CTableRow>
                      <CTableDataCell colSpan={6} className="text-center">
                        No data available
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCard>
          </CCol>
        </CRow>
      </CCardBody>
       </CCard>
        </CRow>
        {isVisible && (
        <CRow className='mb-3'>
          <CCard className='px-0' style={{ maxHeight: `${showCard.schedule ? "2000px" : "50px"}`, overflow: "hidden", transitionDuration: '500ms'}}>
            <CCardHeader style={{ position: "relative", cursor: "pointer"}} onClick={()=>setShowCard({ ...showCard, schedule: !showCard.schedule})}>
                <CCardTitle className='text-center'>VENDOR ARRIVAL SCHEDULE </CCardTitle>
                </CCardHeader>
            <CCardBody style={{overflow: 'auto'}}>
              <CRow className='py-3'>
                <CCol className='d-flex gap-2' xxl={7} md={8}>
                <h5><CBadge color="primary">ARRIVAL PLAN</CBadge> </h5>
                <h5><CBadge color="danger">ARRIVAL DELAYED</CBadge></h5>
                <h5><CBadge color="success">ARRIVAL ON SCHEDULE</CBadge></h5>
                </CCol>
                <CCol className='d-flex gap-2 align-items-center justify-content-end'xxl={5} md={4}>
                    <span>Filter by Status</span>
                  
                </CCol>
              </CRow>
              <CRow className='p-3'>
                <CCard>
                  <Bar
                    options={getChartOption()}
                    data={setChartData()}
                  />
                </CCard>
                <div className="mt-3 d-flex justify-content-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(
                      dataReceiving.length > 0
                        ? dataReceiving.length / itemsPerPage
                        : dataReceiving.length / itemsPerPage,
                    )}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              </CRow>
              <CRow className='p-3'>
                <CCard className='p-3'>
                  <CTable bordered>
                    <CTableHead color='light'>
                      <CTableRow align='middle'>
                        <CTableHeaderCell rowSpan={2}>No</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Vendor ID</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Vendor Name</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Day</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Date</CTableHeaderCell>
                        <CTableHeaderCell colSpan={2}>Schedule Time</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Arrival Time</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Status</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Delay Time</CTableHeaderCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell >From</CTableHeaderCell>
                        <CTableHeaderCell >To</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        { currentItems.map((data, index)=> {
                          return(
                            <CTableRow key={index}>
                              <CTableDataCell>{index+1}</CTableDataCell>
                              <CTableDataCell>{data.vendor_id}</CTableDataCell>
                              <CTableDataCell>{data.vendor_name}</CTableDataCell>
                              <CTableDataCell>{data.day}</CTableDataCell>
                              <CTableDataCell>{data.date}</CTableDataCell>
                              <CTableDataCell>{data.schedule_from}</CTableDataCell>
                              <CTableDataCell>{data.schedule_to}</CTableDataCell>
                              <CTableDataCell>{data.arrival_time}</CTableDataCell>
                              <CTableDataCell className='text-center'>
                                <div className="py-1 px-2 " style={{ backgroundColor: data.status === "Delayed" ? "#F64242" : "#35A535", color: 'white', borderRadius: '5px'}}>
                                  {data.status.toUpperCase()}  
                                  </div>
                                </CTableDataCell>
                              <CTableDataCell style={{ color: data.status === "Delayed" ? "#F64242" : ""}}> {data.delay_time !== 0 ? `- ${data.delay_time}` : ""}</CTableDataCell>
                            </CTableRow>
                          )
                        })}
                    </CTableBody>
                  </CTable>    
                </CCard>
                <div className="mt-3 d-flex justify-content-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(
                      dataReceiving.length > 0
                        ? dataReceiving.length / itemsPerPage
                        : dataReceiving.length / itemsPerPage,
                    )}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              </CRow>
            </CCardBody>
          </CCard>
        </CRow>
       )}
      </CContainer>
  )
}

export default Dashboard
