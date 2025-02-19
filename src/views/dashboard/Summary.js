import React, { useState, useEffect,useRef } from 'react'
import '../../scss/_tabels.scss'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.css'
import { DatePicker, DateRangePicker, Input } from 'rsuite';
import 'primereact/resources/themes/nano/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'; // Icon bawaan PrimeReact
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primeicons/primeicons.css';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import useReceivingDataService from '../../services/ReceivingDataServices.jsx'
import { cilChart,cilCog} from '@coreui/icons';
import { FaAnglesLeft, FaAnglesRight, FaArrowUpRightFromSquare, FaChevronLeft, FaChevronRight, FaCircleCheck, FaCircleExclamation, FaCircleInfo, FaCircleRight, FaCircleXmark, FaInbox } from 'react-icons/fa6';
import {
  CAvatar,
  CModal ,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CButton,
  CButtonGroup,
  CPagination,
  CPaginationItem,
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
  CTooltip,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormInput,
} from '@coreui/react'
import {
  cilCalendar,
} from '@coreui/icons'
import useDashboardReceivingService from '../../services/DashboardService.jsx'
import useChartData from '../../services/ChartDataServices.jsx'
import usePieChartDataService from '../../services/PieChartDataService.jsx.jsx'
import useMasterDataService from '../../services/MasterDataService.jsx'
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement ,
  LineElement
} from 'chart.js';
import ChartDataLabels from "chartjs-plugin-datalabels";
import annotationPlugin from "chartjs-plugin-annotation";
import { Bar, Pie, Doughnut, Line  } from 'react-chartjs-2';
import CIcon from '@coreui/icons-react'
import { useToast } from '../../App.js'
import CustomTableLoading from '../../components/LoadingTemplate.js'
import useBarChartDataService from '../../services/BarChartDataService.jsx';
import TimeProgressBar from '../../components/TimeProgressBar.js'


ChartJS.register(
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
  ChartDataLabels
);


const Summary = () => {
  const [loading, setLoading] = useState(false)
  const [dataPieChart, setDataPieChart] = useState([])
  const { setPieChartData, getPieChartOption } = usePieChartDataService({ dataPieChart });
  const { setBarChartData, getBarChartOptions } = useBarChartDataService({  });

  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const monthsName = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const [filterDate, setFilterDate] = useState(new Date())
    const [filterMonth, setFilterMonth] = useState(new Date())
    

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based index (0 = January, 11 = December)

    const daysInMonth = new Date(year, month + 1, 0).getDate();

  const { getChartReceiving } = useDashboardReceivingService()

  const fetchChartReceiving = async() => {
    try {
        const fromDate = new Date(filterDate.setHours(0, 0, 1)).toLocaleDateString('en-CA')
        const endDate = new Date(filterDate.setHours(23, 59, 59)).toLocaleDateString('en-CA')
        console.log("from :", fromDate)
        console.log("end :", endDate)
        const response = await getChartReceiving(
            "",
            "",
            "",
            new Date(filterDate.setHours(0, 0, 1)).toLocaleDateString('en-CA'),
            new Date(filterDate.setHours(23, 59, 59)).toLocaleDateString('en-CA'),
            "",
            ""
        )
        console.log("Response: ", response)
        setDataPieChart(response.summaryMaterial)
    } catch (error) {
        
    }
  }

  useEffect(()=>{
    fetchChartReceiving()
  }, [filterDate])

  
    

  const renderCustomEmptyMsg = () => {
    return(
    <div className='w-100 d-flex h-100 flex-column align-items-center justify-content-center py-3' style={{ color: "black", opacity: "50%"}}>
        <FaInbox size={40}/>
        <p>NO DATA FOUND</p>
    </div>
    )
  }
      
return (
  <CContainer fluid>
  {/*--------------------------------------------------------------------PIE CHART-------------------------------------------------------------------------------  */}
    <CRow className='mb-3'>
      <CCard className='px-0 mb-3' style={{  border: "1px solid #6482AD" }}>
        <CCardHeader className='text-center' style={{ backgroundColor: "#6482AD", color: "white"}}>
          <CCardTitle className='fs-4'>DAILY MATERIALS RECEIVED</CCardTitle>
        </CCardHeader>
        <CCardBody className='px-4'>
            <CRow className='mb-3'>
                <CCol>
                    <CCard>
                        <CCardBody>
                            <CRow>
                                <CCol className="d-flex align-items-end">
                                    <h1>{weekday[filterDate.getDay()]} </h1>
                                </CCol>
                                <CCol className='d-flex align-items-end justify-content-end gap-2'>
                                    <div className="h-100">
                                        <CFormText>Filter by Plant</CFormText>
                                        <Select className='flex-shrink-0' style={{ width: "130px"}}/>
                                    </div>
                                    <div>
                                        <CFormText>Filter by Date</CFormText>
                                        <DatePicker 
                                            style={{ width: "130px"}} 
                                            format='yyyy-MM-dd'  
                                            placeholder="Select date" 
                                            value={filterDate} 
                                            onChange={(e)=>setFilterDate(e !== null ? e : new Date())}
                                            placement='left'
                                        />
                                    </div>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Time Bar Progress */}
            <CRow className='mb-3'>
                <CCol>
                    <CCard className='p-0'>
                        <CCardBody className='p-0 px-4'>
                            <TimeProgressBar/>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            { loading ? <CustomTableLoading/> : (
                <CRow className='d-flex align-items-between'>
                    <CCol sm='8'>
                    <CCard>
                        <CCardBody>
                        <Pie 
                            options={getPieChartOption()} 
                            data={setPieChartData()} 
                            height={500}
                            />
                        </CCardBody>
                    </CCard>
                    </CCol>
                    <CCol className='d-flex flex-column justify-content-between'>
                        <CCard className='px-0'>
                        <CCardHeader className='d-flex gap-3 align-items-center ' style={{ backgroundColor: "transparent", borderBottom: "2px solid #00DB42"}}>
                            <FaCircleCheck className='flex-grow-0' style={{ color: "#00DB42", fontSize: "30px" }}/>
                            <h6>COMPLETED</h6>
                        </CCardHeader>
                        <CCardBody className='d-flex align-items-end gap-2'>
                            <h2>{dataPieChart.completed}</h2>
                            <h4 className='mb-1'>Materials</h4>
                        </CCardBody>
                        </CCard>

                        <CCard className='px-0'>
                        <CCardHeader className='d-flex gap-3 align-items-center ' style={{ backgroundColor: "transparent", borderBottom: "2px solid #FFD43B"}}>
                            <FaCircleExclamation className='flex-grow-0' style={{ color: "#FFD43B", fontSize: "30px" }}/>
                            <h6>NOT COMPLETED</h6>
                        </CCardHeader>
                        <CCardBody className='d-flex align-items-end gap-2'>
                            <h2>{dataPieChart.notCompleted}</h2>
                            <h4 className='mb-1'>Materials</h4>
                        </CCardBody>
                        </CCard>

                        <CCard className='px-0'>
                        <CCardHeader className='d-flex gap-3 align-items-center ' style={{ backgroundColor: "transparent", borderBottom: "2px solid #FF0000"}}>
                            <FaCircleXmark className='flex-grow-0' style={{ color: "#FF0000", fontSize: "30px" }}/>
                            <h6>NOT DELIVERED</h6>
                        </CCardHeader>
                        <CCardBody className='d-flex align-items-end gap-2'>
                            <h2>{dataPieChart.notDelivered}</h2>
                            <h4 className='mb-1'>Materials</h4>
                        </CCardBody>
                        </CCard>

                        <CCard className='px-0'>
                        <CCardHeader className='d-flex gap-3 align-items-center ' style={{ backgroundColor: "transparent", borderBottom: "2px solid lightblue"}}>
                            <FaCircleInfo className='flex-grow-0' style={{ color: "lightblue", fontSize: "30px" }}/>
                            <h6>TOTAL</h6>
                        </CCardHeader>
                        <CCardBody className='d-flex align-items-end gap-2'>
                            <h2>{dataPieChart.total}</h2>
                            <h4 className='mb-1'>Materials</h4>
                        </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            )}
        </CCardBody>
      </CCard>
    </CRow>

    {/* -------------------------------------------------------------------VERTICAL BAR CHART--------------------------------------------- */}

    <CRow className='mb-3 mt-5 '>
      <CCard className='px-0' style={{  border: "1px solid #6482AD" }}>
        <CCardHeader className='text-center' style={{ backgroundColor: "#6482AD", color: "white" }}>
          <CCardTitle className='fs-4'>MONTHLY MATERIALS RECEIVED</CCardTitle>
        </CCardHeader>
        <CCardBody>
        <CRow className='mb-3'>
                <CCol>
                    <CCard>
                        <CCardBody>
                            <CRow>
                                <CCol className="d-flex align-items-end">
                                    <h1>{monthsName[filterMonth.getMonth()]} </h1>
                                </CCol>
                                <CCol className='d-flex flex-column align-items-end justify-content-end'>
                                    <div>
                                        <CFormText>Filter by Month</CFormText>
                                        <DatePicker 
                                            showOneCalendar
                                            format='MM-yyyy'  
                                            placeholder="Select month" 
                                            value={filterMonth} 
                                            onChange={(e)=>setFilterMonth(e !== null ? e : new Date(year, month, 1))}
                                        />
                                    </div>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            { loading ? <CustomTableLoading/> : (
                <CRow className='d-flex'>
                    <CCol sm='12'>
                    <CCard>
                        <CCardBody>
                        <Bar
                            data={setBarChartData()}
                            options={getBarChartOptions()}
                            height={540}
                        />
                        </CCardBody>
                    </CCard>
                    </CCol>
                    <CCol className='d-flex mt-3' sm='12'>
                    <CCard className='overflow-hidden w-100'>
                        <CCardBody className='p-0'>
                        <DataTable 
                            className="p-datatable-sm custom-datatable text-nowrap dashboard"
                            emptyMessage={renderCustomEmptyMsg}
                            loading={loading}
                            loadingIcon={CustomTableLoading}
                        >
                            <Column header='Vendor Name'/>
                            <Column header='Delayed Material'/>
                        </DataTable>
                        </CCardBody>
                    </CCard>
                    </CCol>
                </CRow>

            )}
        </CCardBody>
      </CCard>
    </CRow>

  {/* Modal List Materials */}

  </CContainer>
  )
}

export default Summary
