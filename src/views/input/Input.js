import React, { useState, useEffect, useRef} from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CButton, CTooltip, CButtonGroup, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CFormInput, CFormLabel, CFormText, CInputGroup, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToaster, CSpinner } from '@coreui/react'
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
import { FaCircleCheck, FaCircleExclamation, FaCircleXmark, FaInbox } from "react-icons/fa6";
import Swal from 'sweetalert2'
import CustomTableLoading from '../../components/LoadingTemplate'

const Input = () => {
  const [loading, setLoading] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const addToast = useToast()
  const [errMsg, setErrMsg] = useState("")
  const inputRefs = useRef({})

  const { getMaterialByDNData, submitMaterialByDNData } = useReceivingDataService()

  const [dataVendorByDN, setDataVendorByDN] = useState([])
  const [dataMaterialsByDN, setDataMaterialsByDN] = useState([])
  const [stateVendorArrived, setStateVendorArrived] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [confirmedRemaining, setConfirmedRemaining] = useState('0/0')
  const [disableInputDN, setDisableInputDN] = useState(false)

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
  const [qtyEachMaterials, setQtyEachMaterials] = useState({}) 
  const [remainQty, setRemainQty] = useState({})
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

  function addMinutes(time, minutesToAdd) {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    date.setMinutes(date.getMinutes() + minutesToAdd);
  
    // Format the result as HH:mm
    return date.toTimeString().slice(0, 5);
  }

  const getStatusBasedOnTime = (matchesVendor) => {
    const { date, time } = getCurrentDateTime();
    // console.log("date now :", date)
    // console.log("date plan :", matchesVendor.arrivalPlanDate)

    const addedTime = addMinutes(matchesVendor.arrivalPlanTime, 15);
    // console.log("added time plan:", addedTime)
    // console.log("time now :", time)
    // console.log("vendor by dn :", dataVendorByDN)
    // console.log("formInput :", matchesVendor)
    // console.log("departure plan :", matchesVendor.departurePlanTime)

    // Compare times
    if (date <= matchesVendor.arrivalPlanDate && time <= addedTime) {
      return 'on schedule'; // Status if current time is within the range
    } else {
      return 'overdue'; // Status if current time is outside the range
    }
  };

  const handleChangeInputDN = async(e) => {
    const inputValue = e.target.value;

    // Allow only numeric input and respect maxLength
    if (/^\d*$/.test(inputValue) && inputValue.length <= 10) {
      setFormInput({ ...formInput, dn_no: e.target.value})
      if(inputValue.length === 10){
        await getMaterialByDN(inputValue)
      }
    }
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
    setSelectedRit(0)
    setDataMaterialsByDN([])
    setDataVendorByDN([])
    setQtyEachMaterials({})
    setRemainQty({})
    setStateVendorArrived(false)
    setSelectedRows([])
    setDisableInputDN(false)
  }

  const handleOnEnterInputDN = async(e) => {
    if(e.key === "-"){
      setFormInput({ ...formInput, dn_no: 21002007})
    } else if(e.key === "-") {
      setFormInput({ ...formInput, dn_no: 21002007})
    }

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
      setLoading(true)
      const response = await getMaterialByDNData(dnNumber)

      if(response.data.data.length !== 0){
        const responseDN = response.data.data[0].deliveryNotes
        const responseVendor = response.data.data[0].vendorSchedules
        const responseStateArrived = response.data.viewOnly
        // console.log("Response:", response.data)
        // console.log("Response Status:", responseDN.map((data)=>data.status))
        console.log("Response DN:", responseDN)
        // console.log("Response Vendor:", responseVendor)
        // console.log("Response State Arrived:", responseStateArrived)
        
        setDataMaterialsByDN(responseDN)
        setDataVendorByDN(responseVendor)
        setQtyEachMaterials({
          incomingId: responseDN.map((data) => Number(data.incomingId)),
          qty: responseDN.map((data) => data.receivedQuantity === null ? data.reqQuantity : data.receivedQuantity),
          // qty: responseDN.map((data) => data.reqQuantity),
        });
        setRemainQty({
          qty: responseDN.map((data)=> ""),
          status: responseDN.map((data)=>data.status )
        })
        setStateVendorArrived(responseStateArrived)
        
        if(responseStateArrived){
          setSelectedRit(1)
          setConfirmedRemaining(`${responseDN.length}/${responseDN.length}`)
        } else{
          setConfirmedRemaining(`0/${responseDN.length}`)
        }
      }else{
        addToast("Invalid DN Number!", 'danger', 'error')
      }

    } catch (error) {
      console.error('error :', error)
      if(dataMaterialsByDN.length !== 0){
        handleClearInputDN()
      }
      // addToast(error.message, 'error', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getArrivalNow = (rit) => {
    setLoading(true)
    const { date, time } = getCurrentDateTime();
    const matchesVendor = dataVendorByDN.find((data)=> data.rit === rit)
    const statusSchedule = getStatusBasedOnTime(matchesVendor)
    // console.log("MATCHES :", matchesVendor)
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
    setLoading(false)
  }
  
  const [enabledRows, setEnabledRows] = React.useState([]); // Array of enabled row IDs
  const handleEnableInput = (rowData) => {
    setEnabledRows((prev) => [...prev, rowData.description]); // Add row ID to the enabled rows

    const refKey = rowData.description; // Use the row's unique identifier
    setTimeout(()=>{
      inputRefs.current[refKey]?.focus(); // Focus the specific input field
    }, 0)

  };

  const handleDisableInput = (rowData) => {
    setEnabledRows((prev) => prev.filter((id) => id !== rowData.description)); // Remove row ID from enabled rows
  };

  const handleEnterInputQty = (rowIndex, rowData, e) => {
      if (e.key === "Enter"){
        handleSubmitChangeQty(rowIndex, rowData)
      }
  }

  const handleSubmitChangeQty = (rowIndex, rowData) => {
    handleDisableInput(rowData)

    const remainInData = rowData.remain
    const reqQty = rowData.reqQuantity
    const inputAct = Number(qtyEachMaterials.qty[rowIndex.rowIndex])
    const newRemainQty = inputAct - reqQty

    setRemainQty((prevState) => ({
      ...prevState,
      qty: prevState.qty.map((value, index) =>
        index === rowIndex.rowIndex ? Number(newRemainQty) : value
      ),
      status: prevState.status.map((value, index) => 
        index === rowIndex.rowIndex && newRemainQty === 0 ? "completed" : 
        index === rowIndex.rowIndex && rowData.remain === null ? "not complete" : 
        index === rowIndex.rowIndex && newRemainQty === rowData.remain ? "partial" : 
        // index === rowIndex.rowIndex && newRemainQty === rowData.remain ? "partial" : 
        index === rowIndex.rowIndex && newRemainQty !== rowData.remain && newRemainQty < 0 ? "partial" : 
        index === rowIndex.rowIndex && newRemainQty !== rowData.remain && newRemainQty > 0 ? "completed" : 
        value
      )
    }))

    const alreadySelected = selectedRows.find((rows)=>rows.incomingId === rowData.incomingId)
    if(!alreadySelected){
      setSelectedRows([...selectedRows, rowData])
    }
  }



  const handleInputChangeQty = (rowIndex, rowData, eValue) => {
    setQtyEachMaterials((prevState) => ({
      ...prevState,
      qty: prevState.qty.map((value, index) =>
        index === rowIndex && Number(eValue) <= rowData.reqQuantity ? ''+Number(eValue) : value
      ),
    }));
  };



  // Received Quantity body template
  const receivedQuantityBodyTemplate = (rowData, rowIndex) => {
    const isInputEnabled = enabledRows.includes(rowData.description); 
    const indexMaterial = rowIndex.rowIndex
    return (
      <div className="d-flex align-items-center justify-content-center gap-2">
        {/* Input Field */}
        <InputText
           ref={(el) => (inputRefs.current[rowData.description] = el)}
           id={`inputQty-${rowData.description}`}
           type='text'
          disabled={!isInputEnabled}
          placeholder='-'
          value={qtyEachMaterials.qty[indexMaterial]}
          onChange={(e)=>handleInputChangeQty(indexMaterial, rowData, e.target.value)}
          onKeyDown={(e)=>handleEnterInputQty(rowIndex, rowData, e)}
          onBlur={()=>handleSubmitChangeQty(rowIndex, rowData)}
          // onBlur={(e)=>handleEnterInputQty(rowIndex, rowData, e)}
          style={{ width: "50px"}}
        />

        { !stateVendorArrived && formInput.rit !== 0 && isInputEnabled ? (
          <CButton
            color=''
            className="p-button-sm p-button-secondary text-white"
            // onClick={() => handleClickEditQuantity(rowData)}
            onClick={()=>handleSubmitChangeQty(rowIndex, rowData)}
          >
            <CIcon style={{ color: "green"}} icon={icon.cilCheck}/>
          </CButton>
        ) : !stateVendorArrived && formInput.rit !== 0 && !isInputEnabled ? (
          <CButton
            color=''
            className="p-button-sm p-button-secondary text-white"
            // onClick={() => handleClickEditQuantity(rowData)}
            onClick={()=>handleEnableInput(rowData)}
          >
            <CIcon style={{ color: "gray"}} icon={icon.cilPen}/>
          </CButton>

        ) : ""}
      </div>
    );
  };
  
  const createFormBody = (formInput, qtyEachMaterials) => {
    const { date, time } = getCurrentDateTime();
    const filteredQty = qtyEachMaterials.qty.filter((data,index)=>Number(data) !== Number(dataMaterialsByDN[index].receivedQuantity))
    
    
    return {
      // dnNumber: "2100198514",
      dnNumber: Number(formInput.dn_no),
      arrivalActualDate: formInput.arrival_date_actual,
      arrivalActualTime: formInput.arrival_time_actual,
      departureActualDate: date,
      departureActualTime: time,
      rit: formInput.rit,

      // incomingIds: qtyEachMaterials.incomingId.filter((data,index)=>Number(qtyEachMaterials.qty[index]) !== Number(dataMaterialsByDN[index].receivedQuantity) && Number(data)),
      // receivedQuantities: filteredQty.map(Number),

      incomingIds: qtyEachMaterials.incomingId,
      receivedQuantities: qtyEachMaterials.qty.map(Number)
    }
  }

  const handleSubmitMaterials = async() => {
      const { date, time } = getCurrentDateTime();

      Swal.fire({
        title: "Submit confirmation",
        text: "Please verify the material quantities before submitting!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Submit",
        preConfirm: async () => {
          try {
            setLoadingSubmit(true)
            Swal.showLoading();
            console.log("----------------------SUBMIT LOG---------------------", )      
            setFormInput({
              ...formInput,
              departure_date_actual: date,
              departure_time_actual: time
            })
            const formBody = createFormBody(formInput, qtyEachMaterials)
            const warehouseId = dataMaterialsByDN[0].warehouseId
      
            console.log("formBody to submit :", formBody)
            console.log("warehouseId :", dataMaterialsByDN[0].warehouseId)

            const response = await submitMaterialByDNData(warehouseId, formBody)
            console.log("Response submit :", response)
            await getMaterialByDN(formBody.dnNumber)
            setFormInput({...formInput, rit: 0})
            setSelectedRows([])
            setConfirmedRemaining('0 / 0')
            setDisableInputDN(true)
            // return response.data.message
            return "Material quantities received!"
          } catch (error) {
            console.error(error)
            return error
          } finally {
            setLoadingSubmit(false)
          }
        }
      }).then(async(result) => {
        if (result.isConfirmed) {
          if(result.value === "Material quantities received!"){
            Swal.fire({
              title: "Submitted!",
              text: result.value,
              icon: "success",
              confirmButtonColor: "#3085d6",
            });
          } else {
            Swal.fire({
              title: "Failed!",
              text: result.value,
              icon: "error",
              confirmButtonColor: "#3085d6",
            });
          }
        }
      });
      
      
      
  }

  

  const remainBodyTemplate = (rowData, rowIndex) => {
    return(
      <p style={{ color: Number(remainQty.qty[rowIndex.rowIndex]) < 0 ? "#FF0000" : "black"}}>{remainQty.qty[rowIndex.rowIndex]}</p>
    )
  }

  const statusBodyTemplate = (rowData, rowIndex) => {
    const indexMaterial = rowIndex.rowIndex
    return(
      <div className='d-flex justify-content-center'>
        <CTooltip 
          content={ 
            remainQty.status[indexMaterial] === "not complete" ? "NOT DELIVERED" : 
            remainQty.status[indexMaterial] === "partial" ? "NOT COMPLETED" : 
            remainQty.status[indexMaterial] === "completed" ? "COMPLETED" : 
            remainQty.status[indexMaterial] === "" ? "" : 
            "COMPLETED"
          } 
          placement="top"
          >
          <CButton style={{ border: 0}}>
            { remainQty.status[indexMaterial] === "not complete" ? <FaCircleXmark style={{ color: "#FF0000", fontSize: "24px"}}/> : 
              remainQty.status[indexMaterial] === "partial" ? <FaCircleExclamation style={{ color: "#FFD43B", fontSize: "24px"}}/> : 
              remainQty.status[indexMaterial] === "completed" ? <FaCircleCheck style={{ color: "#00DB42", fontSize: "24px"}}/> : 
              remainQty.status[indexMaterial] === "" ? "-" : 
              <FaCircleCheck style={{ color: "#00DB42", fontSize: "24px"}}/>
            }
            
          </CButton>
        </CTooltip>
      </div>
    )
  }


  const renderTruckStation = () => {
    const arrivedVendor = dataVendorByDN.find((data)=>data.status!=='scheduled')
    return(
      arrivedVendor ? arrivedVendor.truckStation : formInput.truckStation !== "" ? formInput?.truckStation : "-"
    )
  }
  const renderRit = () => {
    const arrivedVendor = dataVendorByDN.find((data)=>data.status!=='scheduled')
    return(
      arrivedVendor ? arrivedVendor.rit : formInput.rit !== 0 ? formInput?.rit : "-"
    )
  }

  const renderArrivalDatePlan = () => {
    const arrivedVendor = dataVendorByDN.find((data)=>data.status!=='scheduled')
    return(
      arrivedVendor ? arrivedVendor.arrivalPlanDate : formInput.arrival_date_plan !== "" ? formInput?.arrival_date_plan : " -"
    )
  }
  
  const renderArrivalTimePlan = () => {
    const arrivedVendor = dataVendorByDN.find((data)=>data.status!=='scheduled')
    return(
      arrivedVendor ? `${arrivedVendor.arrivalPlanTime} - ${arrivedVendor.departurePlanTime}` 
      : formInput.arrival_time_plan !== "" ? `${formInput?.arrival_time_plan} - ${formInput?.departure_time_plan}` 
      : " -"
    )
  }

  const renderArrivalDateAct = () => {
    const arrivedVendor = dataVendorByDN.find((data)=>data.status!=='scheduled')
    return(
      arrivedVendor ? arrivedVendor.arrivalActualDate : formInput.arrival_date_actual ? formInput.arrival_date_actual : " -"
    )
  }

  const renderArrivalTimeAct = () => {
    const arrivedVendor = dataVendorByDN.find((data)=>data.status!=='scheduled')
    return(
      arrivedVendor ? arrivedVendor.arrivalActualTime : formInput.arrival_time_actual ? formInput.arrival_time_actual : " -"
    )
  }

  const renderDepartureDateAct = () => {
    const arrivedVendor = dataVendorByDN.find((data)=>data.status!=='scheduled')
    return(
      arrivedVendor ? arrivedVendor.departureActualDate : formInput.departure_date_actual ? formInput.departure_date_actual : " -"
    )
  }

  const renderDepartureTimeAct = () => {
    const arrivedVendor = dataVendorByDN.find((data)=>data.status!=='scheduled')
    return(
      arrivedVendor ? arrivedVendor.departureActualTime : formInput.departure_time_actual ? formInput.departure_time_actual : " -"
    )
  }

  const renderStatusVendor = () => {
    const arrivedVendor = dataVendorByDN.find((data)=>data.status!=='scheduled')
    // console.log(arrivedVendor)
    return(
      arrivedVendor ? arrivedVendor.status.toUpperCase() : formInput.status ? formInput.status.toUpperCase() : " -"
    )
  }

  const renderCustomEmptyMsg = () => {
    return(
      <div className='w-100 d-flex flex-column align-items-center justify-content-center py-3' style={{ color: "black", opacity: "50%"}}>
        <FaInbox size={40}/>
        <p>Material Data Not Found!</p>
      </div>
    )
  }

  const handleSelectRow = (e) => {
    if(formInput.rit){
      // console.log("selected row:", e)
      setSelectedRows(e.value)
    }
  }

  const onRowSelect = (e) =>{
    // console.log(e.data)
    console.log("qtyEachMaterials: ", qtyEachMaterials)
    const indexRow = qtyEachMaterials.incomingId.indexOf(e.data.incomingId)
    
    //   const remainInData = e.value.remain
      const reqQty = e.data.reqQuantity
      const inputAct = Number(qtyEachMaterials.qty[indexRow])
      const newRemainQty = inputAct - reqQty

      setRemainQty((prevState) => ({
        ...prevState,
        qty: prevState.qty.map((value, index) =>
          index === indexRow ? Number(newRemainQty) : value
        ),
        status: prevState.status.map((value, index) => 
          index === indexRow && newRemainQty === 0 ? "completed" : 
          index === indexRow && e.data.remain === null ? "note complete" : 
          index === indexRow && newRemainQty === e.data.remain ? "partial" : 
          index === indexRow && newRemainQty !== e.data.remain && newRemainQty < 0 ? "partial" : 
          index === indexRow && newRemainQty !== e.data.remain && newRemainQty > 0 ? "completed" : 
          value
        )
      }))
  }

  useEffect(()=>{
    if(!stateVendorArrived){
      // const remaining = dataMaterialsByDN.length - selectedRows.length
      setConfirmedRemaining(`${selectedRows.length}/${dataMaterialsByDN.length}`)
    }
  }, [selectedRows])

  return (
    <CContainer fluid>
        <CRow className='mb-4'>
          <CCard className='p-0' style={{ border: "1px solid #6482AD"}}>
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
                            disabled={formInput.rit !== 0 || disableInputDN}
                            className=''
                            style={{
                              borderColor: "maroon"
                            }}
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
                          <Select isDisabled={optionsSelectRit.length===0 || stateVendorArrived || formInput.rit !== 0} isClearable className='px-2' placeholder='Select Rit' value={optionsSelectRit.find((opt)=>opt.value === selectedRit) || 0} options={optionsSelectRit} onChange={handleChangeSelectRit}/>
                      </CRow>
                      <CRow className='mt-1 px-2'>
                          <CButton disabled={selectedRit === 0 || stateVendorArrived} onClick={() => formInput.rit === 0 ? getArrivalNow(selectedRit) : handleClearInputDN()} className='' style={{ color: "white", backgroundColor: formInput.arrival_date_actual === "" ? "#7FA1C3" : "#758694"}}>{formInput.arrival_date_actual === "" ? "Process" : "Clear"}</CButton>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol sm={8} className='flex-grow-1 '>
                  <CCard className='h-100' style={{ border: "1px solid black"}}>
                    <CCardHeader style={{ backgroundColor: "#F5EDED", borderBottom: "1px solid black"}}>
                      <p style={{ fontWeight: 'bold', color: "black"}}>DELIVERY INFORMATION</p>
                    </CCardHeader>
                    <CCardBody className='' style={{ position: "relative"}}>
                      { loading && <div className='d-flex justify-content-center align-items-center flex-column' style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "#ffffff9f", borderRadius: "0 0 5px 5px"}}><CSpinner/>Loading...</div> }
                      <CRow className=''>
                        <CCol xs={12}>
                          <p style={{fontWeight: "bold", fontSize: "10px", color: "#6482AD"}}>VENDOR NAME</p>
                          <CFormLabel>{dataVendorByDN.length !== 0 ? dataVendorByDN[0]?.supplierName : "-"}</CFormLabel>
                        </CCol>
                      </CRow>
                      <CRow className='mt-1 w-100'>
                        <CCol xs={3}>
                          <p style={{fontWeight: "bold", fontSize: "10px", color: "#6482AD"}}>TRUCK STATION</p>
                          <CFormLabel>{renderTruckStation()}</CFormLabel>
                          {/* <CFormLabel>{formInput.truckStation !== "" ? formInput?.truckStation : "-"}</CFormLabel> */}
                          
                          <p style={{fontWeight: "bold", fontSize: "10px", color: "#6482AD"}}>RIT</p>
                          <CFormLabel>{renderRit()}</CFormLabel>
                          {/* <CFormLabel>{formInput.rit !== 0 ? formInput?.rit : "-"}</CFormLabel> */}
                        </CCol>

                        <CCol>
                          <p style={{ fontWeight: 'bold', fontSize: "10px", color: "#6482AD"}}>RECEIVE PLAN </p>
                          <CFormLabel className='col-12' style={{fontWeight: "light"}}>Date : <span style={{ fontWeight: "normal"}}>{renderArrivalDatePlan()}</span></CFormLabel>
                          {/* <CFormLabel className='col-12' style={{fontWeight: "light"}}>Date : <span style={{ fontWeight: "normal"}}>{formInput.arrival_date_plan !== "" ? formInput?.arrival_date_plan : " -"}</span></CFormLabel> */}
                          <p style={{ fontWeight: 'bold', fontSize: "10px", color: "transparent", userSelect: "none"}}>Divider </p>
                          <CFormLabel className='col-12' style={{fontWeight: "light"}}>Time : <span style={{ fontWeight: "normal"}}>{renderArrivalTimePlan()}</span></CFormLabel>
                          {/* <CFormLabel className='col-12' style={{fontWeight: "light"}}>Time : <span style={{ fontWeight: "normal"}}>{formInput?.arrival_time_plan} - {formInput?.departure_time_plan}</span></CFormLabel> */}
                        </CCol>
                        <CCol>
                          <p style={{ fontWeight: 'bold', fontSize: "10px", color: "#6482AD"}}>ARRIVAL </p>
                          <CFormLabel className='col-12' style={{fontWeight: "light"}}>Date : <span style={{ fontWeight: "normal"}}>{renderArrivalDateAct()}</span></CFormLabel>
                          <p style={{ fontWeight: 'bold', fontSize: "10px", color: "transparent", userSelect: "none"}}>Divider </p>
                          <CFormLabel className='col-12' style={{fontWeight: "light"}}>Time : <span style={{ fontWeight: "normal"}}>{renderArrivalTimeAct()}</span></CFormLabel>
                        </CCol>
                        <CCol>
                          <p style={{ fontWeight: 'bold', fontSize: "10px", color: "#6482AD"}}>DEPARTURE </p>
                          <CFormLabel className='col-12' style={{fontWeight: "light"}}>Date : <span style={{ fontWeight: "normal"}}>{renderDepartureDateAct()}</span></CFormLabel>
                          <p style={{ fontWeight: 'bold', fontSize: "10px", color: "transparent", userSelect: "none"}}>Divider </p>
                          <CFormLabel className='col-12' style={{fontWeight: "lighter"}}>Time : <span style={{ fontWeight: "normal"}}>{renderDepartureTimeAct()}</span></CFormLabel>
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
                            stateVendorArrived && dataVendorByDN[0]?.status === "on schedule" ? "#00DB42" : 
                            formInput.status === "on schedule" ? "#00DB42" : 
                            stateVendorArrived && dataVendorByDN[0]?.status === "overdue" ? "#FBC550" : 
                            formInput.status === "overdue" ? "#FBC550" : 
                            "transparent"
                            }} className='d-flex justify-content-center align-items-center' >
                      <h4 
                        style={{ 
                          color: 'white', padding: '10px', borderRadius: "10px"}}>{renderStatusVendor()}</h4>
                      {/* <h6 style={{backgroundColor: "#F64242", color: 'white', padding: '10px', borderRadius: "10px"}}>DELAYED</h6> */}
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
              <CRow className='mt-4'>
                <h5>Confirmed Remaining : {confirmedRemaining}</h5>
              </CRow>
              <CRow className='mt-1 mb-2 px-2'>
                <CCard className='p-0 overflow-hidden' >
                  <CCardBody className="p-0">
                    {/* Table */}
                    <DataTable 
                      loading={loading}
                      loadingIcon={<CustomTableLoading/>}
                      className='p-datatable-gridlines p-datatable-sm custom-datatable text-nowrap' 
                      style={{minHeight: "140px"}}
                      size='small'  
                      showGridlines 
                      stripedRows 
                      value={dataMaterialsByDN} 
                      paginator 
                      rows={10} 
                      dataKey="materialNo" 
                      emptyMessage={renderCustomEmptyMsg}
                      selectionMode={formInput.rit ? "multiple" : undefined} 
                      selection={selectedRows} 
                      onSelectionChange={handleSelectRow}
                      onRowSelect={onRowSelect}
                    >
                        <Column className='' field="" header="No" body={(rowData, { rowIndex }) => rowIndex + 1}/>
                        <Column className='' field='materialNo' header="Material No"  />
                        <Column className='' field='description' header="Material Description"  />
                        <Column className='' field="address" header="Rack Address" />
                        <Column className='' field="reqQuantity" header="Req. Qty"  />
                        <Column className='' field="receivedQuantity" header="Act. Qty" body={receivedQuantityBodyTemplate} />
                        <Column className='' field="uom" header="UoM" />
                        <Column className='' field="remain" header="Remain" body={remainBodyTemplate}/>
                        <Column className='' field="" header="Status Qty" body={statusBodyTemplate}/>
                        {/* <Column className='' field="" header="Action" body={actionBodyTemplate} /> */}
                    </DataTable>

                  </CCardBody>
                </CCard>
              </CRow>
              <CRow className='d-flex justify-content-end'>
                <CCol xs='auto'>
                  { stateVendorArrived ? <CButton style={{ backgroundColor: "#758694"}} className='text-white' onClick={handleClearInputDN}>Clear</CButton> 
                      : 
                  // <CButton disabled={formInput.rit === 0 || qtyEachMaterials?.qty?.filter((data)=>data===null).length > 0} style={{ backgroundColor: "#5B913B"}} className='text-white' onClick={handleSubmitMaterials}>Submit</CButton>
                  <CButton disabled={formInput.rit === 0 || confirmedRemaining === '0 / 0' || dataMaterialsByDN.length !== selectedRows.length} style={{ backgroundColor: "#5B913B"}} className='text-white' onClick={handleSubmitMaterials}>Submit</CButton>
                        }
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