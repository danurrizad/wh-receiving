import React, { useState, useEffect, useRef} from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import
 {  CButton, 
    CTooltip,
    CButtonGroup,
    CCard,
    CCardBody, 
    CCardHeader, 
    CCardTitle, CCol, 
    CPagination,
    CPaginationItem, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToaster, CSpinner, CCardText } from '@coreui/react'
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
import 'primereact/resources/themes/nano/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'; // Icon bawaan PrimeReact
import 'primeicons/primeicons.css';
import { useToast } from '../../App'
import { InputText } from 'primereact/inputtext'
import { FaChevronRight ,FaAnglesLeft ,FaChevronLeft ,FaAnglesRight, FaCircleExclamation, FaCircleXmark, FaInbox } from "react-icons/fa6";
import Swal from 'sweetalert2'

const TrackRecord = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [visiblePages, setVisiblePages] = useState([])
  const [totalPages, setTotalPages] = useState(1);
  const { getMaterialByDNData, submitMaterialByDNData } = useReceivingDataService()

  return (
   
    <CRow >
          <CCard className='p-0' style={{ border: "1px solid #6482AD",backgroundImage: `url("https://static.vecteezy.com/system/resources/thumbnails/034/825/346/original/abstract-scene-of-futuristic-cyber-world-sci-fi-grid-technology-glowing-surface-neon-night-scene-digital-science-background-4k-animation-virtual-reality-concept-video.jpg")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
              minHeight: "53rem",}}>
            <CCardHeader style={{backgroundColor: "#6482AD", color: "white", textAlign: "center"}}>
              <CCardTitle>Vendor Queue</CCardTitle>
            </CCardHeader>
            <CCardBody className='d-flex align-items-center justify-content-center gap-3 mt-4 mb-3'>
          <CRow className='mb-2'>
                <CCol md='12'>
                <div style={{ display: "flex",flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: "lighter" }}>
                        Queue Number
                    </span>
                    <span className="fw-bold" style={{ fontSize: "8rem" }}>01</span>
                 </div>
                <div style={{ display: "flex",flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
               <span style={{ fontSize: '1rem', fontWeight: 'lighter' }}>
                Vendor Name
               </span>
               
               <span className="fw-bold" style={{ fontSize: "4rem" }}>
                KANSAI PAINT INDONESIA SEJAHTERA
                </span>

               </div>
               <br />
               <div style={{ display: "flex",flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
               <span  style={{ fontSize: '1rem', fontWeight: 'lighter' }}>
               Estimated Remaining Time
               </span>
                  <span  className="fw-bold" style={{ fontSize: "6rem" }}>00:04:26</span>
               </div>
               </CCol>
                </CRow>
          </CCardBody>
          </CCard>
          </CRow>
          /* <CCol md='6'>
             <CCardBody className="p-0">
            <DataTable
                removableSort
                showGridlines 
                size="small"
                // paginator
                rows={10}
                rowsPerPageOptions={[15, 25, 50, 100]}
                tableStyle={{ minWidth: '50rem' }}
                filterDisplay="row"
                className="custom-table"
            >
                <Column className='' header="No" body={(rowBody, {rowIndex})=>rowIndex+1}></Column>
                <Column className='' field=''  header="Vendor Name" ></Column>
                <Column className='' field=''  header="Upcoming" ></Column>
                <Column className='' field=''  header="Start" ></Column>
            
            </DataTable>
            <CCol className="d-flex justify-content-center py-3">
                    <CPagination aria-label="Page navigation">
                    <CPaginationItem
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(1)}
                    >
                        <FaAnglesLeft/>
                    </CPaginationItem>
                    <CPaginationItem
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        <FaChevronLeft/>
                    </CPaginationItem>

                    {visiblePages.map((page) => (
                        <CPaginationItem
                        key={page}
                        active={currentPage === page}
                        onClick={() => handlePageChange(page)}
                        >
                        {page}
                        </CPaginationItem>
                    ))}

                    <CPaginationItem
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        <FaChevronRight/>
                    </CPaginationItem>
                    <CPaginationItem
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                    >
                        <FaAnglesRight/>
                    </CPaginationItem>
                    </CPagination>
                </CCol>
            </CCardBody>
           </CCol> */
        )
        }

        export default TrackRecord