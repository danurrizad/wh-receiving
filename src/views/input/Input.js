import React, { useState, useEffect, useRef} from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CButton, CTooltip, CButtonGroup, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CFormInput, CFormLabel, CFormText, CInputGroup, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToaster } from '@coreui/react'
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
import { FaCircleXmark } from "react-icons/fa6";

const Input = () => {
  const addToast = useToast()
  const [errMsg, setErrMsg] = useState("")
  const inputRefs = useRef({})

  const { getMaterialByDNData } = useReceivingDataService()

  const [dataVendorByDN, setDataVendorByDN] = useState([])
  const [dataMaterialsByDN, setDataMaterialsByDN] = useState([])

  const [selectedRit, setSelectedRit] = useState(0)
  const [formInput, setFormInput] = useState({
    dn_no: "",
    material_desc: "",
    vendor_code: "",
    vendor_name: "",
    status: "",

    arrival_date_plan: "",
    arrival_time_plan: "",
    departure_time_plan: "",
    rit: 0,
    truckStation: "",

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

  const optionsSelectRit = dataVendorByDN.map((data)=>{
    return{
      label: `${data.rit} (${data.arrivalPlanTime} - ${data.departurePlanTime})`,
      value: Number(data.rit),
    }
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
    const inputValue = e.target.value;

    // Allow only numeric input and respect maxLength
    if (/^\d*$/.test(inputValue) && inputValue.length <= 10) {
      setFormInput({ ...formInput, dn_no: e.target.value})
    }
    // setFormInput({ ...formInput, dn_no: 2100198514})
  }

  const handleClearInputDN = () => {
    setFormInput({ 
      ...formInput, 
      dn_no: "",
      material_desc: "",
      vendor_code: "",
      vendor_name: "",
      status: "",

      arrival_date_plan: "",
      arrival_time_plan: "",
      departure_time_plan: "",
      rit: 0,
      truckStation: "",

      arrival_date_actual: "",
      arrival_time_actual: "",
      departure_date_actual: "",
      departure_time_actual: "",
    })
    setDataMaterialsByDN([])
    setDataVendorByDN([])
  }

  const handleOnEnterInputDN = async(e) => {
    if(e.key === 'Enter'){
      if(formInput.dn_no === ""){
        addToast("Please insert the DN number!", 'error', 'error')
      }else{
        await getMaterialByDN(formInput.dn_no)
      }
    }
  }

  const handleChangeSelectRit = (e) => {
    if(e){
      setSelectedRit(e.value)
    }else{
      setSelectedRit(0)
    }
  }

  
  const getMaterialByDN = async(dnNumber) => {
    try {
      const response = await getMaterialByDNData(dnNumber)
      console.log("Response :", response)
      console.log("Response Vendor:", response.data.data[0].vendorSchedules)
      
      setDataMaterialsByDN(response.data.data[0].deliveryNotes)
      setDataVendorByDN(response.data.data[0].vendorSchedules)
    
      
    } catch (error) {
      // console.error('error :', error)
      // addToast(error.message, 'error', 'error')
    }
  }

  const getArrivalNow = (rit) => {
    const { date, time } = getCurrentDateTime();
    const statusSchedule = getStatusBasedOnTime()
    console.log(rit)
    const matchesVendor = dataVendorByDN.find((data)=> data.rit === rit)
    console.log("MATCHES :", matchesVendor)
    setFormInput({ 
      ...formInput, 
      arrival_date_plan: matchesVendor.arrivalPlanDate,
      arrival_time_plan: matchesVendor.arrivalPlanTime,
      departure_time_plan: matchesVendor.departurePlanTime,
      truckStation: matchesVendor.truckStation,
      rit: matchesVendor.rit,

      arrival_date_actual: date,
      arrival_time_actual: time,
      status: statusSchedule,
    })
  }
  
  const [enabledRows, setEnabledRows] = React.useState([]); // Array of enabled row IDs
  const handleEnableInput = (rowData) => {
    setEnabledRows((prev) => [...prev, rowData.description]); // Add row ID to the enabled rows

    const refKey = rowData.description; // Use the row's unique identifier
    setTimeout(()=>{
      inputRefs.current[refKey]?.focus(); // Focus the specific input field
    }, 0)

  };

  const handleInputChangeQty = (value, rowIndex) => {
    setDataMaterialsByDN((prevData) => {
      const updatedData = [...prevData];
      updatedData[rowIndex].receivedQuantity = value; // Update the specific row
      return updatedData;
    });
  };

  // Received Quantity body template
  const receivedQuantityBodyTemplate = (rowData) => {
    const isInputEnabled = enabledRows.includes(rowData.description); 

    return (
      <div className="d-flex align-items-center justify-content-center gap-2">
        {/* Input Field */}
        <InputText
           ref={(el) => (inputRefs.current[rowData.description] = el)}
           id={`inputQty-${rowData.description}`}
          disabled={!isInputEnabled}
          value={rowData.receivedQuantity}
          // onChange={(e) => (handleInputChangeQty(e.target.value, rowData))} // Update the value
          // onChange={(e) => (rowData.receivedQuantity = e.target.value)} // Update the value
          onKeyDown={(e)=>console.log(e.key)}
          style={{ width: "50px"}}
        />

        { isInputEnabled ? (
          <CButton
            for='inputQty'
            color=''
            className="p-button-sm p-button-secondary text-white"
            // onClick={() => handleClickEditQuantity(rowData)}
            onClick={()=>handleEnableInput(rowData)}
          >
            <CIcon style={{ color: "green"}} icon={icon.cilCheck}/>
          </CButton>
        ) : (
          <CButton
            for='inputQty'
            color=''
            className="p-button-sm p-button-secondary text-white"
            // onClick={() => handleClickEditQuantity(rowData)}
            onClick={()=>handleEnableInput(rowData)}
          >
            <CIcon style={{ color: "gray"}} icon={icon.cilPen}/>
          </CButton>

        )}
      </div>
    );
  };


  const statusBodyTemplate = (rowData) => {
    return(
      <div className='d-flex justify-content-center'>
        <CTooltip content="NOT DELIVERED" placement="top">
          <CButton style={{ border: 0}}>
            <FaCircleXmark style={{ color: "#FF0000", fontSize: "24px"}}/>
          </CButton>
        </CTooltip>
      </div>
    )
  }

  return (
    <CContainer fluid>
        <CRow className='mb-4'>
          <CCard className='p-0' style={{ border: "1px solid black"}}>
            <CCardHeader style={{backgroundColor: "#6482AD", color: "white", textAlign: "center"}}>
              <CCardTitle>RECEIVING PROCESS</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CRow className='d-flex justify-content-between'>
                <CCol sm={2} style={{ position: "relative"}} className='flex-grow-1'>
                  <CCard className='h-100' style={{ border: "1px solid black"}}>
                    <CCardHeader style={{ backgroundColor: "#F5EDED", borderBottom: "1px solid black"}}>
                      <p style={{ fontWeight: "bold", color: "black"}}>INPUT DN NUMBER</p>
                    </CCardHeader>
                    <CCardBody className='d-flex flex-column gap-1'>
                      <CRow className='px-0 d-flex'>
                        <CFormText className='px-3'>DN Number</CFormText>
                        <div className='px-2' style={{ position: "relative"}}>
                          <CFormInput 
                            min={0} // Minimum value
                            max={99} // Maximum value (5 digits)
                            className=''
                            type='text'
                            inputMode='numeric'
                            placeholder='Insert DN Number'
                            value={formInput.dn_no}
                            onChange={handleChangeInputDN}
                            onKeyDown={handleOnEnterInputDN}
                            />
                            { formInput.dn_no.length !== 0 && <CButton onClick={handleClearInputDN} style={{ border: "0", position: "absolute", top: 0, right: "10px" }}><CIcon icon={icon.cilX}/></CButton>}
                        </div>
                      </CRow>
                      <CRow className=''>
                          <CFormText>Rit</CFormText>
                          <Select isDisabled={optionsSelectRit.length===0} isClearable className='px-2' placeholder='Select Rit' value={optionsSelectRit.find((opt)=>opt.value === selectedRit) || 0} options={optionsSelectRit} onChange={handleChangeSelectRit}/>
                      </CRow>
                      <CRow className='mt-1 px-2'>
                          <CButton disabled={selectedRit === 0} onClick={() => formInput.rit === 0 ? getArrivalNow(selectedRit) : handleClearInputDN()} className='' style={{ color: "white", backgroundColor: formInput.arrival_date_actual === "" ? "#7FA1C3" : "#758694"}}>{formInput.arrival_date_actual === "" ? "Process" : "Clear"}</CButton>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol sm={8} className='flex-grow-1 '>
                  <CCard className='h-100' style={{ border: "1px solid black"}}>
                    <CCardHeader style={{ backgroundColor: "#F5EDED", borderBottom: "1px solid black"}}>
                      <p style={{ fontWeight: 'bold', color: "black"}}>DELIVERY INFORMATION</p>
                    </CCardHeader>
                    <CCardBody className=''>
                      <CRow className=''>
                        <CCol xs={12}>
                          <p style={{fontWeight: "bold", fontSize: "10px", color: "#6482AD"}}>VENDOR NAME</p>
                          <CFormLabel>{dataVendorByDN.length !== 0 ? dataVendorByDN[0]?.supplierName : "-"}</CFormLabel>
                        </CCol>
                      </CRow>
                      <CRow className='mt-1 w-100'>
                        <CCol xs={3}>
                          <p style={{fontWeight: "bold", fontSize: "10px", color: "#6482AD"}}>TRUCK STATION</p>
                          <CFormLabel>{formInput.truckStation !== "" ? formInput?.truckStation : "-"}</CFormLabel>
                          
                          <p style={{fontWeight: "bold", fontSize: "10px", color: "#6482AD"}}>RIT</p>
                          <CFormLabel>{formInput.rit !== 0 ? formInput?.rit : "-"}</CFormLabel>
                        </CCol>

                        <CCol>
                          <p style={{ fontWeight: 'bold', fontSize: "10px", color: "#6482AD"}}>RECEIVE PLAN </p>
                          <CFormLabel className='col-12' style={{fontWeight: "light"}}>Date : <span style={{ fontWeight: "normal"}}>{formInput.arrival_date_plan !== "" ? formInput?.arrival_date_plan : " -"}</span></CFormLabel>
                          <CFormLabel className='col-12' style={{fontWeight: "light", marginTop: "20px"}}>Time : <span style={{ fontWeight: "normal"}}>{formInput?.arrival_time_plan} - {formInput?.departure_time_plan}</span></CFormLabel>
                        </CCol>
                        <CCol>
                          <p style={{ fontWeight: 'bold', fontSize: "10px", color: "#6482AD"}}>ARRIVAL </p>
                          <CFormLabel className='col-12' style={{fontWeight: "light"}}>Date : <span style={{ fontWeight: "normal"}}>{formInput.arrival_date_actual ? formInput.arrival_date_actual : " -"}</span></CFormLabel>
                          <CFormLabel className='col-12' style={{fontWeight: "light", marginTop: "20px"}}>Time : <span style={{ fontWeight: "normal"}}>{formInput.arrival_time_actual ? formInput.arrival_time_actual : "-"}</span></CFormLabel>
                        </CCol>
                        <CCol>
                          <p style={{ fontWeight: 'bold', fontSize: "10px", color: "#6482AD"}}>DEPARTURE </p>
                          <CFormLabel className='col-12' style={{fontWeight: "light"}}>Date : <span style={{ fontWeight: "normal"}}>{formInput.departure_date_actual ? formInput.departure_date_actual : "-"}</span></CFormLabel>
                          <CFormLabel className='col-12' style={{fontWeight: "lighter", marginTop: "20px"}}>Time : <span style={{ fontWeight: "normal"}}>{formInput.departure_time_actual ? formInput.departure_time_actual : "-"}</span></CFormLabel>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol sm={2} className='flex-grow-1'>
                  <CCard className='h-100 overflow-hidden' style={{ border: "1px solid black"}}>
                    <CCardHeader style={{ backgroundColor: "#F5EDED", color: "black", borderBottom: '1px solid black'}}>
                      <p style={{ fontWeight: 'bold'}}>DELIVERY STATUS</p>
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
                      <Column className='' field="uom" header="UoM" body={<p>Kilogram</p>} />
                      <Column className='' field="remain" header="Remain" dataType="Remain"   />
                      <Column className='' field="" header="Status Qty" body={statusBodyTemplate}/>
                      {/* <Column className='' field="" header="Action" body={actionBodyTemplate} /> */}
                  </DataTable>
              </CRow>
              <CRow className='d-flex justify-content-end'>
                <CCol xs='auto'>
                  <CButton style={{ backgroundColor: "#5B913B"}} className='text-white'>Submit</CButton>
                </CCol>
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