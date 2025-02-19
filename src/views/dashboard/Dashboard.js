import React, { useState, useEffect,useRef } from 'react'
import '../../scss/_tabels.scss'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.css'
import { DatePicker, DateRangePicker, Input } from 'rsuite';
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import 'primereact/resources/themes/nano/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'; // Icon bawaan PrimeReact
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primeicons/primeicons.css';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import useReceivingDataService from '../../services/ReceivingDataServices'
import { cilChart,cilCog} from '@coreui/icons';
import { FaAnglesLeft, FaAnglesRight, FaArrowUpRightFromSquare, FaChevronLeft, FaChevronRight, FaCircleCheck, FaCircleExclamation, FaCircleInfo, FaCircleXmark, FaInbox } from 'react-icons/fa6';
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
import useDashboardReceivingService from '../../services/DashboardService'
import useChartData from '../../services/ChartDataServices'
import usePieChartDataService from '../../services/PieChartDataService.jsx'
import useMasterDataService from '../../services/MasterDataService'
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
import { Bar, Pie } from 'react-chartjs-2';
import CIcon from '@coreui/icons-react'
import { useToast } from '../../App'
import CustomTableLoading from '../../components/LoadingTemplate'
import useBarChartDataService from './../../services/BarChartDataService';


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


const Dashboard = () => {
  const addToast = useToast()
  const [loading, setLoading] = useState(false)
  const { getMasterData } = useMasterDataService()
  const apiPlant = 'plant-public'
  const { getCardStatusArrival,getChartReceiving } = useDashboardReceivingService()

  const [optionsSelectVendor, setOptionsSelectVendor] = useState({
    list: [],
    selected: ""
  }); // State untuk opsi vendor
  const [plant, setPlant] = useState([])
  const [visiblePages, setVisiblePages] = useState([])
  const [plants, setPlants] = useState([]); // Plants fetched from API
  const [selectedPlant, setSelectedPlant] = useState({ value: 'all', label: 'All' });
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [dataSchedules, setDataSchedules] = useState([]); // Menyimpan data dari API
  const [dataChartSchedules, setDataChartSchedules] = useState(dataSchedules.slice(1, 10)); // Synchronized chart data

  const [pagination, setPagination] = useState({ page: 0, rows: 12 });
  const [filteredData, setFilteredData] = useState([]);

  const [isVisible, setIsVisible] = useState(true); // State to control visibility

   const [totalPages, setTotalPages] = useState(1);
   const [currentPage, setCurrentPage] = useState(1);
   const [limitPerPage, setLimitPerPage] = useState({name: 12, code: 12})
   const [isFilterVisible, setIsFilterVisible] = useState(false);
   
   const vendorScheduleRef = useRef(null);
   const [ showModalInput, setShowModalInput] = useState({
      state: false,
      enableSubmit: false
    })
  const [ formUpdate, setFormUpdate ] = useState({})
  const [cardData, setCardData] = useState({
    onSchedule: 0,
    overdue: 0,
    delayed: 0,
    remaining: 0,
  });
  const [ dataMaterialsByDNInquery, setDataMaterialsByDNInquery ] = useState([])
 
  const [queryFilter, setQueryFilter] = useState({
    plantId: "",
    rangeDate: [
      // new Date("2025-02-14"),
      // new Date("2025-02-15"),
      new Date(new Date().setHours(0, 0, 0, 1)),  // Today at 00:00
      new Date(new Date().setHours(23, 59, 59, 999))  // Today at 23:59
    ],
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  const onChangeFilterVendor = (e) => {
    if(e !== null){
      const value = e.value;
      let _filters = { ...queryFilter };
  
      _filters['global'].value = value;
      setQueryFilter(_filters);
      setOptionsSelectVendor({...optionsSelectVendor, selected: e !== null ? value : ""});
    } else{
      let _filters = { ...queryFilter };
      _filters['global'].value = null;
      setQueryFilter(_filters);
      setOptionsSelectVendor({...optionsSelectVendor, selected: e !== null ? value : ""});
    }
};

  const onChangeFilterStatus = (e) => {
    if(e !== null){
      const value = e.value;
      let _filters = { ...queryFilter };
  
      _filters['global'].value = value;
      setQueryFilter(_filters);
      setSelectedStatus(e.value)
    } else{
      let _filters = { ...queryFilter };
      _filters['global'].value = null;
      setQueryFilter(_filters);
      setSelectedStatus("")
    }
};
 
  const fetchPlants = async () => {
    try {
      const response = await getMasterData(apiPlant);
      // console.log("API Response:", response); // Log seluruh response
      if (response && response.data) {
        
        const plantOptions = response.data.map((plant) => ({
          value: plant.id,
          label: plant.plantName,
        }));
        setPlants(plantOptions);
      }
    } catch (error) {
      console.error("Error fetching plants:", error);
    }
  };

  // Call fetchPlants on component mount
  useEffect(() => {
    fetchPlants();
  }, []);


  
  

  const calculateSummary = (data) => {
    // add options in vendor select
    console.log("dataInCalculateSUmmary:", data)
    // const dataUnique = data
    // ? Array.from(
    //     new Map(
    //       data
    //         .filter(vendor => vendor.vendorName) // Skip missing names
    //         .map(vendor => [
    //           vendor.vendorName,
    //           {
    //             ...vendor
    //           }
    //         ])
    //     ).values()
    //   )
    // : []; // Return empty array if response.data is not valid
    // console.log("data unique vendor:", dataUnique)
    setCardData({
      onSchedule: data.filter((data)=>data.status === 'on schedule').length,
      overdue: data.filter((data)=>data.status === 'overdue').length,
      delayed: data.filter((data)=>data.status === 'delayed').length,
      remaining: data.filter((data)=>data.status === 'scheduled').length,
    })
  }

  const GetDataArrivalDashboard = async (plantId) => {
    try {
      // console.log("Fetching Arrival Data for Plant ID:", plantId || "All Plants");
  
      const response = await getCardStatusArrival(
        plantId || "", // Jika "All" dipilih, kirim string kosong
        "",
        "",
        queryFilter.rangeDate[0].toISOString().split('T')[0], // Format YYYY-MM-DD
        queryFilter.rangeDate[1].toISOString().split('T')[0]  // Format YYYY-MM-DD
      );
  
      if (response && response.data) {
        setCardData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching arrival monitoring data:", error);
    }
  };
  

  const fetchChartReceivingData = async (status, vendorId, currentPage, limitPerPage) => {
    try {
      // setLoading(true)
      const [fromDate, fromMonth, fromYear] = queryFilter.rangeDate[0].toLocaleDateString('en-GB').split("/").map(Number)
      const [toDate, toMonth, toYear] = queryFilter.rangeDate[1].toLocaleDateString('en-GB').split("/").map(Number)

      const formattedFrom = `${fromYear}-${fromMonth}-${fromDate}`
      const formattedTo = `${toYear}-${toMonth}-${toDate}`

      const response = await getChartReceiving(
        queryFilter.plantId, 
        // status !== null ? status?.value : "", // status kosong
        "",
        vendorId,
        formattedFrom, 
        formattedTo,
        currentPage,
        limitPerPage
      );
      if (response) {
        console.log("Data Chart Receiving:", response.data);
        const allResponse = response.data
        const filteredResponse = response.data.filter((data)=>data.status !== 'no schedule')

        setDataSchedules(filteredResponse); // Simpan data dari API ke state
        updateChartData(filteredData.length > 0 ? filteredData : filteredResponse, pagination.page, pagination.rows);
        calculateSummary(filteredResponse)

        // add options in vendor select
        const vendorOptions = filteredResponse
        ? Array.from(
            new Map(
              filteredResponse
                .filter(vendor => vendor.vendorName) // Skip missing names
                .map(vendor => [
                  vendor.vendorName,
                  {
                    label: vendor.vendorName,
                    value: vendor.vendorName,
                  }
                ])
            ).values()
          )
        : []; // Return empty array if response.data is not valid
        
        setOptionsSelectVendor({ ...optionsSelectVendor, list: vendorOptions});
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
      
    } finally{
      // setLoading(false)
    }
  };
  

  // auto fetch in every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchChartReceivingData(selectedStatus, optionsSelectVendor.selected, currentPage, limitPerPage.code);
      // GetDataArrivalDashboard(queryFilter.plantId)
    }, 10000);
  
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [selectedStatus, optionsSelectVendor.selected, currentPage, limitPerPage, queryFilter, pagination]); 

  useEffect(() => {
    async function fetchFirstLoad() {
      setLoading(true)
      await fetchChartReceivingData(selectedStatus, optionsSelectVendor.selected, currentPage, limitPerPage.code);
      setLoading(false)
    } 

    fetchFirstLoad()

  }, [queryFilter.plantId, optionsSelectVendor.selected, queryFilter.rangeDate, currentPage]);  

  const handleClickOpenMaterials = (data) => {
    setShowModalInput({...showModalInput, state: true})
    
    const dataVendor = data?.deliveryNotes ? data?.deliveryNotes : data
    const dataMaterials = data?.deliveryNotes?.Materials ? data?.deliveryNotes?.Materials : data.Materials
    // console.log("data vendor:", dataVendor)
    // console.log("data material:", dataMaterials)
    setDataMaterialsByDNInquery(dataMaterials)

    setFormUpdate({
      dnNumber: dataVendor.dnNumber,
      vendorName: dataVendor.vendorName,
      rit: dataVendor.rit,
      incomingIds: dataMaterials.map((data)=>data.incomingId),
      receivedQuantities: dataMaterials.map((data)=>data.receivedQuantity),
      statuses: dataMaterials.map((data)=>data.status),
      remains: dataMaterials.map((data)=>data.remain)
    })
  }

  const { setChartData, getChartOption } = useChartData({ dataChartSchedules, handleClickOpenMaterials });
  const { setPieChartData, getPieChartOption } = usePieChartDataService({ dataChartSchedules });
  const { setBarChartData, getBarChartOptions } = useBarChartDataService({ dataChartSchedules });

  

  const [ showCard, setShowCard ] = useState({
    schedule: true,
    receiving: true
  })
  
  const planTimeBodyTemplate = (rowData) => {
    const timeFrom = rowData.arrivalPlanTime !== null ? rowData.arrivalPlanTime : "";
    const timeTo = rowData.departurePlanTime !== null ? rowData.departurePlanTime : "";
    return (
      <div>
        {timeFrom} - {timeTo}
      </div>
    );
  };
  

  const remainBodyTemplate = (rowBody, {rowIndex}) => {
    const colorText = formUpdate.remains[rowIndex] < 0 ? "red" : "black" 
    return(
      <p style={{color: colorText}}>
        {formUpdate.remains[rowIndex]}
      </p>
    )
  }

  const statusVendorBodyTemplate = (rowData) => {
    const status = rowData.status
    const bgColor = 
      status === "delayed" ? "#F64242" : 
      status === "scheduled" ? "#6E9CFF" : 
      status === "overdue" ? "#FBC550" : 
      status === "on schedule" ? "#43AB43" : 
      status === "no schedule" ? "gray" : 
      "transparent"
    return(
      <CTooltip 
        content={ 
          status === "delayed" ? "Vendor belum tiba dan melebihi jadwal" : 
          status === "scheduled" ? "Vendor belum tiba" : 
          status === "overdue" ? "Vendor telah tiba dengan melebihi jadwal" : 
          status === "on scheduled" ? "Vendor telah tiba tepat waktu" : 
          status === "no schedule" ? "Tidak ada jadwal" : 
          ""
        } 
        placement="top"
        >
          <button
            className='text-center' 
            style={{ 
              backgroundColor: bgColor, 
              color: status === "overdue" ? "black" : "white",
              width: "100%",
              padding: "5px 10px",
              fontWeight: "bold",
              borderRadius: "8px", 
              textTransform: "uppercase",
              cursor: "pointer"
            }}
          >
            {status}
          </button>
        </CTooltip>
    )
  }

  const statusMaterialBodyTemplate = (rowBody) => {
    const complete = rowBody.statusMaterial.split(" / ")[0]
    const total = rowBody.statusMaterial.split(" / ")[1]
    const color = complete !== total ? "red" : "black"
    return(
      <div>
        {rowBody.statusMaterial !== '0 / 0' ? <span style={{color: color}}>{complete}<span style={{color: "black"}}> / {total}</span></span> : ""}
      </div>
    )
  }

   const materialsBodyTemplate = (rowBody) => {
      return(
        <div className='d-flex align-items-center justify-content-center'>
         <CButton onClick={() => handleClickOpenMaterials(rowBody)} color='info' className='d-flex justify-content-center align-items-center p-2 '>
           <FaArrowUpRightFromSquare style={{ color: "white" }} size={13} />
         </CButton>
        </div>
      )
    }

     const statusQtyBodyTemplate = (rowData, rowIndex) => {
          return(
            <div className='d-flex justify-content-center'>
              <CTooltip 
                content={ 
                  rowData.status === "not complete" ? "NOT DELIVERED" : 
                  rowData.status === "partial" ? "NOT COMPLETED" : 
                  rowData.status === "completed" ? "COMPLETED" : 
                  "COMPLETED"
                } 
                placement="top"
                >
                <CButton style={{ border: 0}}>
                  { rowData.status === "not complete" ? <FaCircleXmark style={{ color: "#FF0000", fontSize: "24px"}}/> : 
                    rowData.status === "partial" ? <FaCircleExclamation style={{ color: "#FFD43B", fontSize: "24px"}}/> : 
                    rowData.status === "completed" ? <FaCircleCheck style={{ color: "#00DB42", fontSize: "24px"}}/> : 
                    <FaCircleCheck style={{ color: "#00DB42", fontSize: "24px"}}/>
                  }
                  
                </CButton>
              </CTooltip>
            </div>
          )
        }

        const selectStatusStyles = {
          option: (base, {data, isDisabled, isSelected}) => ({
            ...base,
            backgroundColor: data.color,
            display: 'flex',
            justifyContent: "center",
            padding: "10px",
            borderRadius: '5px',
            marginTop: "10px",
            marginLeft: "10px",
            width: '90%',
            color: "white",
            fontWeight: "bold",
            ':active': {
              ...base[':active'],
              backgroundColor: data.color ,
            },
            ':hover': {
              ...base[':hover'],
              backgroundColor: 
                data.value === 'scheduled' ? "#B8CEFF" : 
                data.value === 'delayed' ? "#FFA4A4" : 
                data.value === 'on schedule' ? "#97D497" : 
                data.value === 'overdue' ? "#FFDE97" : 
                "gray"
            }
          }),
          placeholder: (base) => ({
            ...base,
            // color: "red", // Warna merah untuk placeholder
            // fontWeight: "bold",
          }),
          singleValue: (base, state) => ({
            ...base,
            color: "white",
            // color: state.data.value === "delayed" ? "red" : "green", // Warna sesuai status
            backgroundColor: 
              state.data.value === "delayed" ? "#F64242" : 
              state.data.value === "scheduled" ? "#6E9CFF" : 
              state.data.value === "overdue" ? "#FBC550" : 
              state.data.value === "on schedule" ? "#43AB43" : 
              "transparent",
            fontWeight: "bold",
            padding: "5px 10px",
            borderRadius: "5px",
            display: 'flex',
            justifyContent: "center",
          }),
          control: (base) => ({
            ...base,
            height: "42px",
            minWidth: "220px"
          })
        };

        const handleScrollToVendorSchedule = () => {
          if (vendorScheduleRef.current) {
            vendorScheduleRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        };

        const toggleFilterVisibility = () => {
          setIsFilterVisible(!isFilterVisible);
        };
        
        const renderCustomEmptyMsg = () => {
            return(
              <div className='w-100 d-flex h-100 flex-column align-items-center justify-content-center py-3' style={{ color: "black", opacity: "50%"}}>
                <FaInbox size={40}/>
                <p>NO SCHEDULES FOUND FROM {queryFilter.rangeDate[0].toLocaleDateString('en-CA')} UNTIL {queryFilter.rangeDate[1].toLocaleDateString('en-CA')}</p>
              </div>
            )
          }

         const groupedOptions = [
            {
              label: 'PLAN',
              options: [
                { label: "SCHEDULED", value: "scheduled", color: '#6F9CFF' },
                { label: "DELAYED", value: "delayed", color: '#F64242' },
              ],
            },
            {
              label: 'ARRIVAL',
              options: [
                { label: "ON SCHEDULE", value: "on schedule", color: '#49C05F' },
                { label: "OVERDUE", value: "overdue", color: '#FBC550' },
              ],
            },
          ];
    
          const handlePageChange = (event) => {
            setPagination({ page: event.page, rows: event.rows });
            updateChartData(filteredData.length > 0 ? filteredData : dataSchedules, event.page, event.rows);
          };

          useEffect(()=>{
            const interval = setInterval(()=>{
              const totalPage = Math.ceil(dataSchedules.length / pagination.rows)
              // console.log(pagination)
              // console.log("totalPage:", totalPage)
              // console.log(queryFilter)
              if(queryFilter.plantId === "" && queryFilter.global.value === null){
                if(pagination.page >= totalPage-1){
                  setPagination({ ...pagination, page: 0})
                  updateChartData(filteredData.length > 0 ? filteredData : dataSchedules, 0, pagination.rows);
                } else{
                  setPagination({ ...pagination, page: pagination.page + 1})
                  updateChartData(filteredData.length > 0 ? filteredData : dataSchedules, pagination.page+1, pagination.rows);
                }
              }
            }, 24000)

            return () => clearInterval(interval);
          }, [pagination, queryFilter.plantId])
          
          const handleFilter = (event) => {
            console.log("EVENT:", event)
            if (event.filters) {
              console.log("EVENT FILTERS: ", event.filters)
              const filtered = dataSchedules.filter((item) => {
                return Object.keys(event.filters).every((key) => {
                  if (!event.filters[key].value) return true; // No filter applied
                  return item[key]?.toString().toLowerCase().includes(event.filters[key].value.toLowerCase());
                });
              });
              setFilteredData(filtered);
              updateChartData(filtered, pagination.page, pagination.rows);
            }
          };
          
          const updateChartData = (data, page, rows) => {
            const paginatedData = data.slice(page * rows, (page + 1) * rows);
            setDataChartSchedules(paginatedData);
          };

      
      
  return (
  <CContainer fluid>
    <CRow className='mt-1'>
      <CCard
        className="px-0 bg-white text-black mb-1"
        style={{
          overflow: "hidden",
          transitionDuration: "500ms",
          border: "1px solid #6482AD", // Menambahkan border dengan warna #074799
      }}>
        <CCardHeader
          style={{
            zIndex: 4,
            backgroundColor: "#6482AD",
            color: "white",
            padding: "10px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <CTooltip content="Scroll to Vendor Schedule">
              <button
                className="btn d-flex align-items-center justify-content-center me-2 btn-toggle"
                style={{
                  // backgroundColor: "white",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                }}
                onClick={handleScrollToVendorSchedule}
              >
                <CIcon icon={cilChart} size="lg" className='icon-toggle'/>
              </button>
            </CTooltip>
            <CTooltip content="Toggle Filter Visibility">
              <button
                className="btn d-flex align-items-center justify-content-center btn-toggle"
                style={{
                  // backgroundColor: "#B0B0B0",
                  // backgroundColor: "white",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                }}
                onClick={toggleFilterVisibility}
              >
                <CIcon icon={cilCog} size="sm" className='icon-toggle' />
              </button>
            </CTooltip>
            <CCardTitle className="text-center fs-4" style={{ flexGrow: 1 }}>
              MONITORING RECEIVING WAREHOUSE
            </CCardTitle>
          </div>
        </CCardHeader>
        <CCardBody className='px-4' style={{overflow: 'auto', minHeight: "400px"}}>
          <CRow className="d-flex justify-content-between align-items-center mb-2">
          {/* Tombol Hide/Show di pojok kiri */}

          {isFilterVisible && (
            <div className="d-flex  gap- mt-1">
              <CCol sm={12} md={12} lg={5} xl={5} className="d-flex gap-1">
                <div>
                  <CFormText>Filter Plant</CFormText>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    isClearable
                    id="plant"
                    options={plants}
                    value={plants.find((opt)=>opt.value === queryFilter.plantId) || ""}
                    onChange={(e)=>{
                      setQueryFilter({...queryFilter, plantId: e !== null ? e.value : ""})
                    }}
                    styles={{
                      control: (base) => {
                        return ({
                          ...base,
                          width: '250px', // Atur lebar lebih kecil agar lebih proporsional
                          minWidth: '200px',
                          maxWidth: '100%',
                          borderRadius: '5px',
                          padding: '2px',
                          zIndex: 3, // Memberikan prioritas tinggi agar dropdown muncul di atas elemen lain
                          position: 'relative',
                          height: "100%"
                        })
                      },
                      menu: (base) => ({
                        ...base,
                        zIndex: 3, // Pastikan menu dropdown tidak tertutup elemen lain
                      })
                    }}
                  />
                </div>
                <div>
                  <CFormText >Filter by Status</CFormText>
                  <Select
                    onChange={onChangeFilterStatus}
                    // onChange={(e)=>console.log(groupedOptions)}
                    placeholder="All" // Default placeholder
                    isClearable
                    isSearchable={false}
                    styles={ selectStatusStyles}
                    value={groupedOptions.flatMap((group) => group.options).find(option => option.value === selectedStatus) || ""}
                    options={groupedOptions}
                  />
                </div>
              </CCol>
              {/* Kolom kedua */}
              <CCol sm={12} md={12} lg={7} xl={7} className="d-flex justify-content-end gap-2 "> 
                <div>
                  <CFormText style={{ alignSelf: "flex-start" }}>Search vendor</CFormText>
                  <Select 
                    options={optionsSelectVendor?.list} 
                    value={optionsSelectVendor?.list?.find((option)=>option.value===optionsSelectVendor?.selected) || ""}
                    onChange={onChangeFilterVendor}
                    isClearable 
                    placeholder="Vendor name" 
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        width: "250px", // Sesuaikan lebar input Select
                        zIndex: 1000, // Z-index untuk elemen container
                      }),
                      control: (base) => ({
                        ...base,
                        height: '42px'
                      })
                    }}
                  />
                </div>
                {/* <div className="flatpickr-wrapper d-flex flex-column align-items-end" style={{ position: "relative", width: "100%" }}> */}
                <div>
                  <CFormText>Filter by Date</CFormText>
                  <DateRangePicker 
                    format='yyyy-MM-dd' character=" – "
                    showOneCalendar 
                    placeholder='All time' 
                    position='start' 
                    value={queryFilter.rangeDate} 
                    onChange={(e)=>{
                      console.log(e)
                      setCurrentPage(1)
                      setQueryFilter({ 
                        ...queryFilter, 
                        rangeDate: [
                          new Date(e[0].setHours(0, 0, 0, 1)), 
                          new Date(e[1].setHours(23, 59, 59, 59))
                        ]
                      })
                    }}/>
                </div>
              </CCol>
            </div>
          )}
         </CRow>
          <CRow style={{ minHeight: "300px"}}>
            <CCard className='p-0 overflow-hidden h-100'>
              <CCardBody className="p-0">
                <DataTable
                  loading={loading}
                  loadingIcon={<CustomTableLoading/>}
                  removableSort
                  globalFilterFields={['dnNumber', 'vendorName', 'vendorCode', 'truckStation', 'status']}
                  filters={queryFilter}
                  showGridlines 
                  size="small"
                  paginator
                  rows={pagination.rows}
                  tableStyle={{ minWidth: '50rem', height: "100%" }}
                  value={filteredData.length > 0 ? filteredData : dataSchedules} // Sync filter
                  first={pagination.page * pagination.rows}
                  filterDisplay="row"
                  className="custom-table dashboard"
                  emptyMessage={renderCustomEmptyMsg}
                  onPage={(e)=>{
                    // console.log("e handlePageChange", e)
                    handlePageChange(e)
                  }} // Track pagination
                  onFilter={(e)=>{
                    console.log(e)
                    handleFilter(e)
                  }} // Track filtering
                >
                  <Column className='' header="No" body={(rowBody, { rowIndex }) => rowIndex + 1}></Column>
                  {/* <Column className='' field='dnNumber'  header="DN No"></Column> */}
                  <Column className='' field='vendorCode'  header="Vendor Code"></Column>
                  <Column className='' field='vendorName'  header="Vendor Name" ></Column>
                  <Column className='' field='statusMaterial'  header="Status Received" body={statusMaterialBodyTemplate}></Column>
                  <Column className='' field='truckStation'  header="Truck Station" ></Column>
                  <Column className='' field='rit'  header="Rit" ></Column>
                  <Column className='' field='arrivalPlanDate'  header="Plan Date" ></Column>
                  <Column className='' field='arrivalPlanTime'  header="Plan Time" body={planTimeBodyTemplate} ></Column>
                  <Column className='' field='arrivalActualDate'  header="Arriv. Date" ></Column>
                  <Column className='' field='arrivalActualTime'  header="Arriv. Time" ></Column>
                  {/* <Column className='' field='deliveryNotes.departureActualDate'  header="Departure Date" /> */}
                  <Column className='' field='departureActualTime'  header="Dept. Time" ></Column>
                  <Column className='' field='status'  header="Status Arrival" body={statusVendorBodyTemplate} ></Column>
                  {/* <Column className='' field=''  header="Materials" body={materialsBodyTemplate} ></Column> */}
              
                </DataTable>
              </CCardBody>
            </CCard>
          </CRow>


          {/* -------------------------------------------MODAL----------------------------------------------------------- */}
            <CModal 
              visible={showModalInput.state}
              onClose={() => setShowModalInput({state: false, enableSubmit: false})}
              size='xl'
              backdrop="static"
            >
              <CModalHeader>
                <CModalTitle>List Materials Received</CModalTitle>
              </CModalHeader>
              <CModalBody> 
                <CRow>
                  <CCol sm='3'>
                    <CFormText>DN NO</CFormText>  
                    <CFormLabel>{formUpdate.dnNumber}</CFormLabel>
                  </CCol>
                  <CCol>
                    <CFormText>VENDOR NAME</CFormText>  
                    <CFormLabel>{formUpdate.vendorName}</CFormLabel>
                  </CCol>
                </CRow>
                <CRow className='pt-1'>
                  <DataTable
                    className="p-datatable-sm custom-datatable text-nowrap"
                    loading={loading}
                    loadingIcon={<CustomTableLoading/>}
                    tableStyle={{ minWidth: '50rem' }}
                    removableSort
                    size="small"
                    scrollable
                    scrollHeight="50vh"
                    showGridlines
                    // paginator
                    rows={10}
                    value={dataMaterialsByDNInquery}
                    filterDisplay="row"
                  >
                    <Column header="No" body={(rowBody, {rowIndex})=>rowIndex+1} />
                    <Column field='materialNo'  header="Material No" />
                    <Column field='description'  header="Material Description" />
                    <Column field='address'  header="Rack Address" />
                    <Column field="reqQuantity" header="Req. Qty" body={(data) => <div className="text-center">{data.reqQuantity}</div>} />
                    <Column field="receivedQuantity" header="Act. Qty" body={(data) => <div className="text-center">{data.receivedQuantity}</div>} />
                    <Column field="remain" header="Remain" body={remainBodyTemplate} align="center" />
                    <Column   field='status'  header="Status" body={statusQtyBodyTemplate} />
                  </DataTable>
                </CRow>
                <CRow  className='mt-1 px-2'></CRow>
              </CModalBody>
            </CModal>
          </CCardBody>   
       </CCard>
      </CRow>
        
        {isVisible && (
        <CRow ref={vendorScheduleRef} className='mb-3 mt-5 '>
          <CCard  className='px-0 ' style={{maxHeight: `${showCard.schedule ? "2000px" : "50px"}`, overflow: "hidden", transitionDuration: '500ms', border: "1px solid #6482AD"}}>
            <CCardHeader style={{ position: "relative", cursor: "pointer", backgroundColor: "#6482AD", color: "white"}} onClick={()=>setShowCard({ ...showCard, schedule: !showCard.schedule})}>
              <CCardTitle className='text-center fs-4'> DETAIL VENDOR ARRIVAL SCHEDULE </CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol sm={2} className='d-flex flex-column justify-content-between'>

                  <CCard className=" bg-transparent" style={{ border: "2px solid #49C05F" }}>
                    <CCardHeader className="text-muted small text-center" style={{ backgroundColor: "#49C05F" }}>
                      <h6 style={{ color: "white", fontSize: "12px" }}>ON SCHEDULE ARRIVAL</h6>
                    </CCardHeader>
                    <CCardBody className="text-center">
                      <CCardText className="fs-3 fw-bold" style={{ color: "black" }}>
                        {cardData.onSchedule}
                      </CCardText>
                    </CCardBody>
                  </CCard>

                  <CCard className=" bg-transparent" style={{ border: "2px solid #FBC550" }}>
                    <CCardHeader className="text-muted small text-center" style={{ backgroundColor: "#FBC550" }}>
                      <h6 style={{ color: "black", fontSize: "12px" }}>OVERDUE ARRIVAL</h6>
                    </CCardHeader>
                    <CCardBody className="text-center">
                      <CCardText className="fs-3 fw-bold"style={{ color: "black" }}>{cardData.overdue}</CCardText>
                    </CCardBody>
                  </CCard>

                  <CCard className="bg-transparent" style={{ border: "2px solid #F64242" }}>
                    <CCardHeader className="text-muted small text-center" style={{ backgroundColor: "#F64242" }}>
                      <h6 style={{ color: "white", fontSize: "12px" }}>DELAYED PLAN</h6>
                    </CCardHeader>
                    <CCardBody className="text-center ">
                      <CCardText className="fs-3 fw-bold" style={{ color: "black" }}> 
                        {cardData.delayed}
                      </CCardText>
                    </CCardBody>
                  </CCard>

                  <CCard className=" bg-transparent" style={{ border: "2px solid #6E9CFF" }} >
                    <CCardHeader className="text-muted small text-center" style={{ backgroundColor: "transparent", borderBottom: "2px solid #6E9CFF" }}>
                      <h6 style={{ color: "#6E9CFF", fontSize: "12px" }}>REMAINING</h6>
                    </CCardHeader>
                    <CCardBody className="text-center">
                      <CCardText className="fs-3 fw-bold" style={{ color: "black" }}>{cardData.remaining}</CCardText>
                    </CCardBody>
                  </CCard>    

                </CCol>

                <CCol xs={12} sm={10}  >
                  <CCard className='p-3' style={{ maxHeight:"70vh", overflow: "auto"  }} >
                    <CRow>
                      <CCol className='d-flex gap-2'>
                        <CTooltip content="Vendor belum tiba" placement="top">
                          <button style={{ backgroundColor: "transparent"}}>
                            <h6><CBadge style={{width: "160px", border: "2px solid #6F9CFF", backgroundColor: "transparent", color: "#6F9CFF"}}>SCHEDULED PLAN</CBadge> </h6>
                          </button>
                        </CTooltip>

                        <CTooltip content="Vendor telah tiba" placement="top">
                          <button style={{ backgroundColor: "transparent"}}>
                            <h6><CBadge style={{width: "160px", border: "2px solid #6F9CFF", backgroundColor: "#6F9CFF"}}>ARRIVED</CBadge> </h6>
                          </button>
                        </CTooltip>

                        <CTooltip content="Vendor belum tiba dan melebihi jadwal" placement="top">
                          <button style={{ backgroundColor: "transparent"}}>
                            <h6><CBadge style={{width: "160px", border: "2px solid #FF0000", backgroundColor: "#FF0000"}}>DELAYED PLAN</CBadge></h6>
                          </button>
                        </CTooltip>

                        <CTooltip content="Kedatangan terlambat" placement="top">
                          <button style={{ backgroundColor: "transparent"}}>
                            <h6><CBadge style={{width: "160px", border: "2px solid #FBC550", backgroundColor: "#FBC550", color: "black"}}>OVERDUE ARRIVAL</CBadge> </h6>
                          </button>
                        </CTooltip>
                        
                        <CTooltip content="Kedatangan tepat waktu" placement="top">
                          <button style={{ backgroundColor: "transparent"}}>
                            <h6><CBadge style={{width: "160px", border: "2px solid #49C05F", backgroundColor: "#49C05F"}}>ON SCHEDULE ARRIVAL</CBadge></h6>
                          </button>
                        </CTooltip>
                        
                      </CCol>
                    </CRow>
                    <hr style={{ border: "1px solid #D3D4D4"}}></hr>
                    <CRow className='' style={{ overflow: "auto", height: "2000px"}}>
                      <div style={{height: "100%"}}>
                        <Bar 
                          options={getChartOption()} 
                          data={setChartData()} 
                          height={600}
                        />
                      </div>
                    </CRow>
                  </CCard>
                </CCol>
              {/* //untuk tabel */}
        </CRow>
      </CCardBody>
    </CCard>
  </CRow>
        
  )}


  {/* Modal List Materials */}

  </CContainer>
  )
}

export default Dashboard
