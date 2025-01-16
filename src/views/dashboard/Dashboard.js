import React, { useState, useEffect } from 'react'
import { dataSchedulesDummy, dataReceivingDummy } from '../../utils/DummyData'
import  colorStyles from '../../utils/StyleReactSelect'
import Select from 'react-select'
import Pagination from '../../components/Pagination'
import { DatePicker } from 'rsuite';
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
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

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
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
  

  return (
      <CContainer fluid>
        <CRow className='mb-3'>
        <CCard
         className="px-0"
       style={{
        maxHeight: `${showCard.summary ? "1000px" : "50px"}`,
        overflow: "hidden",
        transitionDuration: "500ms",
         }}>
  <CCardHeader
    style={{ position: "relative", cursor: "pointer" }}
    onClick={() => setShowCard({ ...showCard, summary: !showCard.summary })}
  >
    <CCardTitle className="text-center">SUMMARY RECEIVING WAREHOUSE</CCardTitle>
    <CButton
      onClick={() => setShowCard({ ...showCard, summary: !showCard.summary })}
      style={{ position: "absolute", top: 0, right: 0, margin: "5px 5px 0 0" }}
    >
      <CIcon icon={icon.cilHamburgerMenu} />
    </CButton>
  </CCardHeader>
  <CCardBody style={{ overflow: "auto" }}>
    <CRow>
      <CCol xs="auto">
      <CFormText>PLANT</CFormText>
      <Select isClearable 
     />
      </CCol>
      <CCol xs="auto">
      <CFormLabel style={{ fontSize: "0.8rem" }}>DATE</CFormLabel>
        <div className='d-flex align-items-center gap-2'>
        <DatePicker defaultValue={new Date()} className="w-100" placeholder="Select dates" size='lg' block />
       </div>
      </CCol>
    </CRow>
   <CRow>
        <CCol sm={7} >
        <CCard>
        <Bar 
        options={getChartOption()} 
        data={setChartData()} 
        height={200} // Tinggi chart
    />
       </CCard>
       </CCol>
       <CCol sm={5} >
       <CRow>
       <CCol sm="auto">
    <CCard className="mb-3 mt-1">
      <CCardHeader
        className="text-muted small text-center"
        style={{ backgroundColor: "#F64242" }}
      >
        <h6 style={{ color: "white", fontSize: "7px" }}>DELAYED</h6>
      </CCardHeader>
      <CCardBody className="text-center">
        <CCardText className="fs-5 fw-bold">46</CCardText>
      </CCardBody>
    </CCard>
  </CCol>

  <CCol sm="auto">
    <CCard className="mb-3 mt-1">
      <CCardHeader
        className="text-muted small text-center"
        style={{ backgroundColor: "#35A535" }}
      >
        <h6 style={{ color: "white", fontSize: "7px" }}>ON SCHEDULE</h6>
      </CCardHeader>
      <CCardBody className="text-center">
        <CCardText className="fs-5 fw-bold">25</CCardText>
      </CCardBody>
    </CCard>
  </CCol>

  <CCol sm="auto">
    <CCard className="mb-3 mt-1">
      <CCardHeader
        className="text-muted small text-center"
        style={{ backgroundColor: "gray" }}
      >
        <h6 style={{ color: "white", fontSize: "7px" }}>REMAINING</h6>
      </CCardHeader>
      <CCardBody className="text-center">
        <CCardText className="fs-5 fw-bold">46</CCardText>
      </CCardBody>
    </CCard>
  </CCol>
  </CRow>
   <CRow className='p-2 pt-3'>
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
                      { dataReceiving.map((data, index)=>{
                        return(
                          <CTableRow key={index} color={`${data.difference !== 0 ? "danger" : ""}`}>
                          {/* <CTableRow key={index} style={{ backgroundColor: `${data.difference !== 0 ? "red" : ""}`}}> */}
                          
                       
                            <CTableDataCell>{data.material_desc}</CTableDataCell>
                            <CTableDataCell>{data.rack_address}</CTableDataCell>
                            <CTableDataCell>{data.req_qty}</CTableDataCell>
                            <CTableDataCell>{data.actual_qty}</CTableDataCell>
                            <CTableDataCell className='text-center' style={{ borderLeft: '2px solid red', borderRight: '2px solid red', borderTop: index===0 && "2px solid red", borderBottom: index === 10 + 2 && "2px solid red", fontWeight: data.difference !== 0 && 'bold'}}>{data.difference === 0 ? "-" : data.difference}</CTableDataCell>
                            <CTableDataCell>{data.date}</CTableDataCell>
                          </CTableRow>
                        )
                      })}
                      { dataReceiving.length === 0 && (
                        <CTableRow>
                          <CTableDataCell colSpan={10} style={{ opacity: "50%"}}>
                            <div className='d-flex flex-column align-items-center justify-content-center py-4'>
                              <CIcon icon={icon.cilInbox} size='4xl'/>
                              <span>Data not found</span>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      )}
                    </CTableBody>
                  </CTable>
                </CRow>
                </CCol>
        </CRow>
  </CCardBody>
</CCard>

        </CRow>
        <CRow className='mb-3'>
          <CCard className='px-0' style={{ maxHeight: `${showCard.schedule ? "2000px" : "50px"}`, overflow: "hidden", transitionDuration: '500ms'}}>
            <CCardHeader style={{ position: "relative", cursor: "pointer"}} onClick={()=>setShowCard({ ...showCard, schedule: !showCard.schedule})}>
                <CCardTitle className='text-center'>ARRIVAL SCHEDULE</CCardTitle>
                <CButton onClick={()=>setShowCard({ ...showCard, schedule: !showCard.schedule})} style={{ position: 'absolute', top: 0, right: 0, margin: '5px 5px 0 0'}}>
                  <CIcon icon={icon.cilHamburgerMenu}/>
                </CButton>
            </CCardHeader>
            <CCardBody style={{overflow: 'auto'}}>
              <CRow className='py-3'>
                <CCol className='d-flex gap-2' xxl={7} md={12}>
                  <div style={{ backgroundColor: '#FFBB00', color: "white", fontWeight: "bold", borderRadius: '5px'}} className='px-4 py-2'>ARRIVAL PLAN</div>
                  <div style={{ backgroundColor: '#F64242', color: "white", fontWeight: "bold", borderRadius: '5px'}} className='px-4 py-2'>ARRIVAL DELAYED</div>
                  <div style={{ backgroundColor: '#35A535', color: "white", fontWeight: "bold", borderRadius: '5px'}} className='px-4 py-2'>ARRIVAL ON SCHEDULE</div>
                </CCol>
                <CCol className='d-flex gap-2 align-items-center justify-content-end'>
                    <span>Filter by Status</span>
                    <Select onChange={handleFilterSchedule} placeholder="All" isClearable className='w-50' styles={colorStyles} options={[{label: "On Schedule", value: "On Schedule"}, {label: "Delayed", value: "Delayed"}]}/>
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
        <CRow>
          <CCard className='px-0' style={{ maxHeight: `${showCard.receiving ? "2500px" : "50px"}`, overflow: "hidden", transitionDuration: '500ms'}}>
            <CCardHeader style={{ position: "relative", cursor: "pointer"}} onClick={()=>setShowCard({ ...showCard, receiving: !showCard.receiving})}>
              <CCardTitle className='text-center'>RECEIVING</CCardTitle> 
              <CButton onClick={()=>setShowCard({...showCard, receiving: !showCard.receiving})} style={{position: "absolute", top: 0, right: 0, margin: "5px 5px 0 0"}}>
                <CIcon icon={icon.cilHamburgerMenu}/>
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CRow className='py-2'>
                <CCol xs={3} className='d-flex align-items-center gap-4'>
                  <div>Filter</div>
                  <Select onChange={handleFilterReceiving} placeholder="All" className='w-100' isClearable options={options} styles={colorStyles}/>
                </CCol>
                <CCol xs={9} className='d-flex justify-content-end'>
                  <Select 
                      isClearable
                      className='w-25'
                      placeholder="Search by Material"
                      onChange={handleChangeSearch}
                      options={dataReceiving.map((data) => ({ 
                          value: data.material_no, 
                          label: `${data.material_no} - ${data.material_desc}` 
                      }))} 
                  />
                </CCol>
              </CRow>
              <CRow className='p-2 pt-3'>
                <CTable bordered>
                  <CTableHead color='light'>
                    <CTableRow>
                      <CTableHeaderCell>DN No</CTableHeaderCell>
                      <CTableHeaderCell>Material No</CTableHeaderCell>
                      <CTableHeaderCell>Material Description</CTableHeaderCell>
                      <CTableHeaderCell>Req Quantity</CTableHeaderCell>
                      <CTableHeaderCell>Actual Quantity</CTableHeaderCell>
                      <CTableHeaderCell>Difference</CTableHeaderCell>
                      <CTableHeaderCell>Date</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    { dataReceiving.map((data, index)=>{
                      return(
                        <CTableRow key={index} color={`${data.difference !== 0 ? "danger" : ""}`}>
                        {/* <CTableRow key={index} style={{ backgroundColor: `${data.difference !== 0 ? "red" : ""}`}}> */}
                          <CTableDataCell>{data.dn_no}</CTableDataCell>
                          <CTableDataCell>{data.material_no}</CTableDataCell>
                          <CTableDataCell>{data.material_desc}</CTableDataCell>
                          <CTableDataCell>{data.req_qty}</CTableDataCell>
                          <CTableDataCell>{data.actual_qty}</CTableDataCell>
                          <CTableDataCell>{data.difference}</CTableDataCell>
                          <CTableDataCell>{data.date}</CTableDataCell>
                        </CTableRow>
                      )
                    })}
                  </CTableBody>
                </CTable>
              </CRow>
              <CRow>
                
              </CRow>
            </CCardBody>
          </CCard>
        </CRow>
      </CContainer>
  )
}

export default Dashboard
