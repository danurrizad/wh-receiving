import React, { useState, useEffect, useRef} from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CFormInput, CFormLabel, CFormText, CInputGroup, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToaster } from '@coreui/react'
import { dataReceivingDummy, dataSchedulesDummy, dataDummy } from '../../utils/DummyData'
import { Button, DatePicker } from 'rsuite';
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import useReceivingDataService from './../../services/ReceivingDataServices';
import { useToast } from '../../App'
import { InputText } from 'primereact/inputtext'


const Input = () => {
  const addToast = useToast()
  const [errMsg, setErrMsg] = useState("")

  const { getMaterialByDNData } = useReceivingDataService()

  const [dataVendorByDN, setDataVendorByDN] = useState([])
  const [dataMaterialsByDN, setDataMaterialsByDN] = useState([])
  const [formInput, setFormInput] = useState({
    dn_no: "",
    material_desc: "",
    vendor_code: "",
    vendor_name: "",
    status: "",
    arrival_date_actual: "",
    arrival_time_actual: "",
    departure_date_actual: "",
    departure_time_actual: "",

    
  })

  const [formQuantity, setFormQuantity] = useState({
    enabledEdit: false,
    material_desc: "",
    dn_no: "",
    actual_qty: 0,
  })

  const [ dataDummies, setDataDummies ] = useState(dataDummy)
  
  const [queryFilter, setQueryFilter] = useState({
    date: new Date(),
    sortType: "",
    day: new Date().getDay(),
    dn_no: ""
  })

  const getCurrentDateTime = () => {
    const now = new Date();
  
    // Format date as YYYY-MM-DD
    const date = now.toISOString().split('T')[0];
  
    // Get hours and minutes
    const padZero = (num) => String(num).padStart(2, '0');
    const hours = padZero(now.getHours());
    const minutes = padZero(now.getMinutes());
  
  
    // Format time as HH:MM - HH:MM
    const time = `${hours}:${minutes}`;
  
    return { date, time };
  };

  const getStatusBasedOnTime = () => {
    const { time } = getCurrentDateTime();
  
    // Compare times
    if (time <= dataVendorByDN.departurePlanTime) {
      return 'ON SCHEDULE'; // Status if current time is within the range
    } else {
      return 'DELAYED'; // Status if current time is outside the range
    }
  };

  const handleChangeInputDN = (e) => {
    setFormInput({ ...formInput, dn_no: e.target.value})
  }

  const handleClearInputDN = () => {
    setFormInput({ 
      ...formInput, 
      dn_no: "", 
      arrival_date_actual: "",
      arrival_time_actual: "",
      status: ""
    })
    setDataMaterialsByDN([])
    setDataVendorByDN([])
  }

  const handleClickArrival = async() => {
    if(formInput.dn_no === ""){
      addToast("Please insert the DN number!", 'error', 'error')
    }else{
      await getMaterialByDN(formInput.dn_no)
    }
  }

  const handleClickEditQuantity = (data) => {
    console.log("Clicked data :", data)
    console.log("Form input qty :", {
      dn_no: data.dnNumber,
      material_desc: data.description,
      actual_qty: data.actual_qty,
      enabledEdit: true
    } )
    setFormQuantity({
      dn_no: data.dnNumber,
      material_desc: data.description,
      actual_qty: data.actual_qty,
      enabledEdit: true
    })
  }

  
  const getMaterialByDN = async(dnNumber) => {
    const { date, time } = getCurrentDateTime();
    const statusSchedule = getStatusBasedOnTime()
    try {
      const response = await getMaterialByDNData(dnNumber)
      console.log("Response :", response)
      
      setDataMaterialsByDN(response.data.data[0].deliveryNotes)
      setDataVendorByDN(response.data.data[0].vendorSchedules[0])
    
      setFormInput({ 
        ...formInput, 
        arrival_date_actual: date,
        arrival_time_actual: time,
        status: statusSchedule
      })
    } catch (error) {
      console.error('error :', error)
      addToast(error.message, 'error', 'error')
    }
  }

  // useEffect(()=>{
  //   setInterval(()=>{
  //     console.log("CHANGES ON FORM QUANTITY :", formQuantity)
  //   }, 10000)
  // })

  // Received Quantity body template
  const receivedQuantityBodyTemplate = (rowData) => {
    const isInputEnabled = enabledRows.includes(rowData.id); // Check if this row is enabled

    const handleEnableInput = () => {
      setEnabledRows((prev) => [...prev, rowData.id]); // Add row ID to the enabled rows
    };

    return (
      <div className="d-flex align-items-center justify-content-center gap-2">
        {/* Input Field */}
        <InputText
          disabled={!isInputEnabled}
          value={rowData.receivedQuantity}
          onChange={(e) => (rowData.receivedQuantity = e.target.value)} // Update the value
          style={{ width: "50px"}}
        />
      </div>
    );
  };


  const [enabledRows, setEnabledRows] = React.useState([]); // Array of enabled row IDs
  // Action body template
  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2">
        {/* Button Field */}
        <CButton
          color='info'
          className="p-button-sm p-button-secondary text-white"
          // onClick={() => handleClickEditQuantity(rowData)}
          // onClick={handleEnableInput}
        >
          <CIcon icon={icon.cilPen}/>
        </CButton>
      </div>
    );
  };


  return (
    <CContainer fluid>
        <CRow>
          <CCard className='p-0'>
            <CCardHeader>
              <CCardTitle>RECEIVING PROCESS</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CRow className='d-flex justify-content-between'>
                <CCol sm={5} style={{ position: "relative"}} className='flex-grow-1'>
                  <CCard className='h-100'>
                    <CCardHeader style={{ backgroundColor: "#297BBF"}}>
                      <p style={{ fontWeight: "bold", color: "white"}}>INPUT DN NUMBER</p>
                    </CCardHeader>
                    <CCardBody className=''>
                      <CRow className=''>
                        <CCol sm={10}>
                          <p style={{fontWeight: "bold", fontSize: "10px"}}>VENDOR NAME</p>
                          <CFormLabel>{dataVendorByDN.length !== 0 ? dataVendorByDN?.supplierName : "-"}</CFormLabel>

                          <p style={{fontWeight: "bold", fontSize: "10px"}}>TRUCK STATION</p>
                          {/* <CFormLabel>{dataVendorByDN.length !== 0 ? dataVendorByDN?.truckStation : "GAS STATION"}</CFormLabel> */}
                          <CFormLabel>GAS STATION</CFormLabel>
                        </CCol>
                        <CCol sm={2}>
                          <p style={{fontWeight: "bold", fontSize: "10px"}}>RIT</p>
                          {/* <CFormLabel>{dataVendorByDN.length !== 0 ? dataVendorByDN?.rit : "1"}</CFormLabel> */}
                          <CFormLabel>1</CFormLabel>
                        </CCol>
                        
                        {/* <CTable borderless>
                          <CTableBody>
                            <CTableRow>
                              <CTableDataCell className='' style={{ fontWeight: 'bold', padding: "8px 0 5px 5px"}}>VENDOR NAME</CTableDataCell>
                              <CTableDataCell className=''>:</CTableDataCell>
                              <CTableDataCell className='px-0'>{dataVendorByDN?.supplierName}</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableDataCell className='' style={{ fontWeight: 'bold', padding: "8px 0 5px 5px"}}>TRUCK STATION</CTableDataCell>
                              <CTableDataCell className='px-'>:</CTableDataCell>
                              <CTableDataCell className='px-0'>-</CTableDataCell>
                            </CTableRow>

                          </CTableBody>
                        </CTable> */}
                      </CRow>

                      <CInputGroup>
                        <CFormInput 
                          type='number'
                          inputMode='numeric'
                          placeholder='Insert DN Number'
                          value={formInput.dn_no}
                          onChange={handleChangeInputDN}
                          />
                        <CButton onClick={() => dataVendorByDN.length === 0 ? handleClickArrival() : handleClearInputDN()} color={dataVendorByDN.length === 0 ? 'info' : 'warning'} className='d-flex align-items-center gap-2' style={{ color: "white"}}>{dataVendorByDN.length === 0 ? "Receive" : "Clear"}</CButton>
                      </CInputGroup>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol sm={5} className='flex-grow-1 '>
                  <CCard className='h-100'>
                    <CCardHeader style={{ backgroundColor: "#297BBF"}}>
                      <p style={{ fontWeight: 'bold', color: "white"}}>VENDOR STATUS</p>
                    </CCardHeader>
                    <CCardBody className='d-flex align-items-start justify-content-between'>
                      <CRow className='mt-1 w-100'>
                        <CCol>
                          <p style={{ fontWeight: 'bold'}}>RECEIVE PLAN </p>
                          <p style={{ fontWeight: ''}}>DATE &ensp;: <span style={{ fontWeight: "normal"}}>{dataVendorByDN?.arrivalPlanDate}</span></p>
                          <p style={{ fontWeight: ''}}>TIME &ensp; :<span style={{ fontWeight: "normal"}}>{dataVendorByDN?.arrivalPlanTime} - {dataVendorByDN?.departurePlanTime}</span></p>
                        </CCol>
                        <CCol>
                          <p style={{ fontWeight: 'bold'}}>ARRIVAL </p>
                          <p style={{ fontWeight: ''}}>DATE &ensp;: <span style={{ fontWeight: "normal"}}>{formInput.arrival_date_actual}</span></p>
                          <p style={{ fontWeight: ''}}>TIME &ensp; :<span style={{ fontWeight: "normal"}}>{formInput.arrival_time_actual}</span></p>
                        </CCol>
                        <CCol>
                          <p style={{ fontWeight: 'bold'}}>DEPARTURE </p>
                          <p style={{ fontWeight: ''}}>DATE &ensp;: <span style={{ fontWeight: "normal"}}>{formInput.departure_date_actual}</span></p>
                          <p style={{ fontWeight: ''}}>TIME &ensp; :<span style={{ fontWeight: "normal"}}>{formInput.departure_time_actual}</span></p>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol sm={2} className='flex-grow-1'>
                  <CCard className='h-100 overflow-hidden'>
                    <CCardHeader style={{ backgroundColor: "#297BBF", color: "white"}}>
                      <p style={{ fontWeight: 'bold'}}>SCHEDULE STATUS</p>
                    </CCardHeader>
                    <CCardBody style={{backgroundColor: 
                            formInput.status === "ON SCHEDULE" ? "#00DB42" : 
                            formInput.status === "DELAYED" ? "#F64242" : 
                            "transparent"
                            }} className='d-flex justify-content-center align-items-center' >
                      <h4 
                        style={{ 
                          color: 'white', padding: '10px', borderRadius: "10px"}}>{formInput.status}</h4>
                      {/* <h6 style={{backgroundColor: "#F64242", color: 'white', padding: '10px', borderRadius: "10px"}}>DELAYED</h6> */}
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
              <CRow className='mt-4'>
                  
                  {/* Table */}
                  <DataTable className='p-datatable-gridlines p-datatable-sm custom-datatable text-nowrap' size='small' showGridlines value={dataMaterialsByDN} paginator rows={10} dataKey="id" emptyMessage="No materials found.">
                      <Column className='' field="" header="No" body={(rowData, { rowIndex }) => rowIndex + 1}/>
                      <Column className='' field='materialNo' header="Material No"  />
                      <Column className='' field='description' header="Material Description"  />
                      <Column className='' field="address" header="Rack Address" />
                      <Column className='' field="reqQuantity" header="Req. Qty"  />
                      <Column className='' field="receivedQuantity" header="Act. Qty" body={receivedQuantityBodyTemplate} />
                      <Column className='' field="" header="UoM" />
                      <Column className='' field="remain" header="Remain" dataType="Remain"   />
                      <Column className='' field="" header="Status"/>
                      <Column className='' field="" header="Action" body={actionBodyTemplate} />
                  </DataTable>

                  
              </CRow>
            </CCardBody>
          </CCard>
        </CRow>


        {/* -----------------------------------------------------------------------------------MODAL RENDERING--------------------------------------------------------------------------------------- */}

        
       
       
        {/* Modal QR Scanner */}
        {/* <CModal 
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
           
            <div style={{position: "absolute", top: '30px', left: '30px', width: '75px', height: '75px', border: "10px solid white", borderRight: '0', borderBottom: '0'}}></div>
            <div style={{position: "absolute", top: '30px', right: '30px', width: '75px', height: '75px', border: "10px solid white", borderLeft: '0', borderBottom: '0'}}></div>
            <div style={{position: "absolute", bottom: '30px', left: '30px', width: '75px', height: '75px', border: "10px solid white", borderRight: '0', borderTop: '0'}}></div>
            <div style={{position: "absolute", bottom: '30px', right: '30px', width: '75px', height: '75px', border: "10px solid white", borderLeft: '0', borderTop: '0'}}></div>
          </CModalBody>
        </CModal> */}
    </CContainer>
  )
}

export default Input