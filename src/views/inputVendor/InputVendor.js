import React, { useState, useEffect, useRef } from "react";
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";
import {
  CButton,
  CTooltip,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCol,
  CContainer,
  CFormInput,
  CFormLabel,
  CFormText,
  CInputGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CToaster,
  CSpinner,
} from "@coreui/react";
import Select from "react-select";
import useReceivingDataService from "./../../services/ReceivingDataServices";
import { useToast } from "../../App";
import CustomTableLoading from "../../components/LoadingTemplate";
import useVendorDataService from "../../services/VendorDataService";
import useMasterDataService from "../../services/MasterDataService";

const InputVendor = () => {
  const colorMode = localStorage.getItem('coreui-free-react-admin-template-theme')
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const addToast = useToast();

  const { getMaterialByDNData, submitMaterialByDNData } = useReceivingDataService();
  const { getVendorScheduleByCode, submitVendorArrival } = useVendorDataService()
  const { getMasterData } = useMasterDataService()

  const [warehouse, setWarehouse] = useState([])
  const [dataVendor, setDataVendor] = useState([]);
  const [stateVendorArrived, setStateVendorArrived] = useState(false);
  const [disableInputVendor, setDisableInputVendor] = useState(false);

  const [selectedRit, setSelectedRit] = useState(0);
  const [selectedTruckStation, setSelectedTruckStation] = useState("")
  const [formManual, setFormManual] = useState({})
  const [formInput, setFormInput] = useState({
    rit: 0
  });
  
  const [showModal, setShowModal] = useState(false)
  let manualOptions = [
    {
      label: "Insert manual",
      valueTruckStation: "manual"
    }
  ]
  const [optionsSelectRit, setOptionsSelectRit] = useState([])
  const [allRit, setAllRit] = useState([])
  const [allPlant, setAllPlant] = useState([])
  const [allTruckStation, setAllTruckStation] = useState([])

  const fetchVendorByCode = async(vendorCode) => {
    try {
      const response = await getMasterData(`supplier-code?vendorCode=${vendorCode}`)
      console.log('response vendor by code: ', response)
      setDataVendor({
        id: response.data.data.id,
        supplierName: response.data.data.supplierName
      })
    } catch (error) {
      console.error(error)
    }
  }

  const fetchPlant = async() => {
    try {
      const response = await getMasterData('plant')
      const options = response.data.map((data)=>{
        return{
          label: data.plantName,
          value: data.id
        }
      })
      setAllPlant(options)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchRitandTruckStation = async(plantId) => {
    try {
      const response = await getMasterData(`truck-station/${plantId}`)
      const optionsTruckStations = response.data.data.truckStations.map((data)=>{
        return{
          label: data,
          value: data
        }
      })
      const optionsRit = response.data.data.rits.map((data)=>{
        return{
          label: data,
          value: data
        }
      })
      setAllTruckStation(optionsTruckStations)
      setAllRit(optionsRit)
    } catch (error) {
      console.error(error)
      setAllTruckStation([])
      setAllRit([])
    }
  }

  const handleSelectPlant = async(e) => {
    if(e === null){
      setFormManual({ 
        ...formManual, 
        plantName: "",
        plantId: "",
        truckStation: ""
      })
      setAllTruckStation([])
      setAllRit([])
    }else{
      setFormManual({ 
        ...formManual, 
        plantName: e !== null ? e.label : "", 
        plantId: e !== null ? e.value : "",
      })
      fetchRitandTruckStation(e.value)
    }
  }

  useEffect(()=>{
    fetchPlant()
  }, [])

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const padZero = (num) => String(num).padStart(2, "0");
    const hours = padZero(now.getHours());
    const minutes = padZero(now.getMinutes());
    const time = `${hours}:${minutes}`;

    return { date, time };
  };

  function addMinutes(time, minutesToAdd) {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    date.setMinutes(date.getMinutes() + minutesToAdd);

    return date.toTimeString().slice(0, 5);
  }


  const getStatusBasedOnTime = (matchesSchedule) => {
    const { date, time } = getCurrentDateTime();
    
    const timePartArrival = matchesSchedule.arrival.split("T")[1];
    const timeArrival = timePartArrival.slice(0, 5);

    const addedTime = addMinutes(timeArrival, 15);

    if (time <= addedTime) {
      return "on schedule"; // Status if current time is within the range
    } else {
      return "overdue"; // Status if current time is outside the range
    }
  };

  const handleChangeInputVendor = async (e) => {
    const inputValue = e.target.value;

    // Allow only numeric input and respect maxLength
    if (/^\d*$/.test(inputValue) && inputValue.length <= 10) {
      setFormInput({ ...formInput, vendorCode: e.target.value });
      if (inputValue.length === 6) {
        await fetchVendorScheduleByCode(inputValue)
        // if(optionsSelectRit.length === 1){
        //   setSelectedRit(optionsSelectRit[0].value)
        //   setSelectedTruckStation(optionsSelectRit[0].valueTruckStation)
        // }
      }
    }

    if (inputValue.length === 0) {
      handleClearInputVendor();
    }
  };

  const handleClearInputVendor = () => {
    setFormInput({
      vendorCode: "",
      rit: 0,
      truckStation: "",
      plantName: "",
      arrivalActualTime: "",
      arrivalPlanTime: ""
    });
    setSelectedRit(0);
    setSelectedTruckStation("")
    setDataVendor([]);
    setStateVendorArrived(false);
    setDisableInputVendor(false);
  };

  const handleOnEnterInputVendor = async (e) => {
    if (e.key === "Enter") {
      if (formInput.vendorCode === "") {
        addToast("Please insert the DN number!", "error", "error");
      } else {
        await fetchVendorScheduleByCode(formInput.vendorCode);
      }
    }
    if (e.key === "-") {
      setFormInput({ ...formInput, vendorCode: 252654 });
      await fetchVendorScheduleByCode(252654);
    }
  };

  const handleChangeSelectRitTruckStation = (e) => {
    if (e) {
      if(e.valueTruckStation === 'manual'){
        setShowModal(true)
        setFormManual({
          rit: null,
          truckStation: "",
          plantId: "",
          plantName: ""
        })
      }else{
        setShowModal(false)
        setSelectedRit(e.value);
        setSelectedTruckStation(e.valueTruckStation)
      }
    } else {
      setSelectedRit(0);
      setSelectedTruckStation("")
    }
  };

  

  const fetchVendorScheduleByCode = async(vendorCode) => {
    try {
      const response = await getVendorScheduleByCode(vendorCode)
      console.log("response schedule vendor: ", response)
      const responseVendor = response.data.vendor[0];
      if(!response){
        fetchVendorByCode(vendorCode)
      }

      const options = responseVendor?.Delivery_Schedules?.map((data) => {
          const timePartArrival = data.arrival.split("T")[1];
          const timeArrival = timePartArrival.slice(0, 5);
    
          const timePartDeparture = data.departure.split("T")[1];
          const timeDeparture = timePartDeparture.slice(0, 5);
    
        return {
          label: `${data.rit} (${timeArrival} - ${timeDeparture}) | ${data.truckStation}`,
          value: Number(data.rit),
          valueTruckStation: data.truckStation
        };
      })
      if(options){
        setOptionsSelectRit(options)
      }else{
        setOptionsSelectRit(manualOptions)
      }
      setDataVendor(responseVendor);
    } catch (error) {
      setOptionsSelectRit(manualOptions)
      fetchVendorByCode(vendorCode)
      console.error(error)
    }
  }


  const getArrivalNow = async(rit, truckStation) => {
    setLoading(true);
    const { date, time } = getCurrentDateTime();
    const matchesSchedule = dataVendor?.Delivery_Schedules?.find((data) => data.rit === rit && data.truckStation === truckStation) || null;
    const statusSchedule = matchesSchedule ? getStatusBasedOnTime(matchesSchedule) : 'unscheduled';

    const timePartArrival = matchesSchedule?.arrival?.split("T")[1] || null;
    const timeArrival = timePartArrival?.slice(0, 5) || null;
    
    const timePartDeparture = matchesSchedule?.departure?.split("T")[1] || null;
    const timeDeparture = timePartDeparture?.slice(0, 5) || null;

    const body = {
      supplierId: Number(dataVendor.id),
      arrivalPlanTime: timeArrival,
      arrivalActualTime: time,
      departurePlanTime: timeDeparture,
      truckStation: matchesSchedule?.truckStation || formManual.truckStation,
      rit: matchesSchedule?.rit || formManual.rit,
      plantId: matchesSchedule?.plantId || formManual.plantId
    };

    console.log("BODY TO SUBMIT ARRIVAL :", body)

    try {
      const response = await submitVendorArrival(body)
      // console.log("Response submit: ", response)
      addToast(response.data.message, 'success')
      setFormInput({
        ...formInput,
        supplierId: dataVendor.id,
        arrivalPlanTime: timeArrival,
        departurePlanTime: timeDeparture,
        rit: matchesSchedule?.rit || formManual.rit,
        truckStation: matchesSchedule?.truckStation || formManual.truckStation,
        arrivalActualTime: time,
        status: statusSchedule,
        plantName: matchesSchedule?.Plant?.plantName || formManual.plantName 
      });
    } catch (error) {
      console.error("ERRORRR SUBMITTING: ", error)
    } finally {
      setLoading(false)
    }
  };


  const renderTruckStation = () => {
    return formInput?.truckStation || "-"
  };
  const renderRit = () => {
    return formInput?.rit || "-"
  };

  const renderPlant = () => {
    return formInput?.plantName || "-"
  }

  const renderArrivalTimePlan = () => {
    return formInput?.arrivalPlanTime || "-"
  };

  const renderArrivalTimeAct = () => {
    return formInput?.arrivalActualTime || "-"
  };

  const renderStatusVendor = () => {
    return formInput?.status?.toUpperCase() || ""
  };

  const handleAddManual = () => {
    try {
      if(!formManual.rit || !formManual.truckStation){
        addToast("Please fill all required fields!", "danger", "error")
        return
      }
      manualOptions.push({ 
          label: `${formManual.rit} | ${formManual.truckStation}`, 
          value: formManual.rit, valueTruckStation: formManual.truckStation
      })
  
      setOptionsSelectRit(manualOptions)
      setSelectedRit(formManual.rit)
      setSelectedTruckStation(formManual.truckStation)
      setShowModal(false)
    } catch (error) {
      
    }
  }

  const renderModal = () => {
    return(
      <CModal
        visible={showModal}
        onClose={()=>setShowModal(false)}
      >
        <CModalHeader>
          <CModalTitle>Add Manual Schedule</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CCol xs={3}>
              <CFormLabel>Plant</CFormLabel>
            </CCol>
            <CCol>
              <Select
                options={allPlant}
                onChange={handleSelectPlant}
                value={allPlant.find((opt)=>opt.value === formManual.plantId) || ""}
                getOptionValue={(e) => e.value}
                getOptionLabel={(e) => e.label}
                isClearable
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol xs={3}>
              <CFormLabel>Rit</CFormLabel>
            </CCol>
            <CCol>
              <Select
                isDisabled={formManual.plantId === "" || formManual.plantId === null}
                value={allRit.find((opt)=>opt.value === formManual.rit) || ""}
                options={allRit}
                onChange={(e)=>setFormManual({ ...formManual, rit: e !== null ? e.value : ""})}
                getOptionValue={(e) => e.value}
                getOptionLabel={(e) => e.label}
                isClearable
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol xs={3}>
              <CFormLabel>Truck Station</CFormLabel>
            </CCol>
            <CCol>
              <Select
                isDisabled={formManual.plantId === "" || formManual.plantId === null}
                options={allTruckStation}
                onChange={(e)=>setFormManual({ ...formManual, truckStation: e !== null ? e.value : ""})}
                value={allTruckStation.find((opt)=>opt.value === formManual.truckStation) || ""}
                getOptionValue={(e) => e.value}
                getOptionLabel={(e) => e.label}
                isClearable
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton 
            style={{
              color: "white",
              backgroundColor: "#758694",
            }} 
            onClick={()=>setShowModal(false)}
          >
            Cancel
          </CButton>
          <CButton 
            color="success"
            style={{
              color: "white",
            }}
            onClick={handleAddManual}
          >
            Add
          </CButton>
        </CModalFooter>
      </CModal>
    )
  }

  return (
    <CContainer fluid>

      { renderModal() }

      <CRow className="mb-4">
        <CCard className="p-0" style={{ border: "1px solid #6482AD" }}>
          <CCardHeader
            style={{
              backgroundColor: "#6482AD",
              color: "white",
              textAlign: "center",
            }}
          >
            <CCardTitle>INPUT VENDOR ARRIVAL </CCardTitle>
          </CCardHeader>
          <CCardBody>
            <CRow className="d-flex justify-content-between">
              <CCol
                sm={6}
                lg={3}
                style={{ position: "relative" }}
                className="flex-grow-1"
              >
                <CCard className="h-100" style={{ border: "1px solid black" }}>
                  <CCardHeader
                    style={{
                      backgroundColor: "#F5EDED",
                      borderBottom: "1px solid black",
                    }}
                  >
                    <p style={{ fontWeight: "bold" }}>
                    INPUT VENDOR CODE
                    </p>
                  </CCardHeader>
                  <CCardBody className="d-flex flex-column gap-1">
                    <CRow className="px-0 d-flex">
                      <CFormText className="px-3">Vendor Code</CFormText>
                      <div className="px-2" style={{ position: "relative" }}>
                        <CFormInput
                          min={0} // Minimum value
                          max={99} // Maximum value (5 digits)
                          disabled={formInput?.rit !== 0 || disableInputVendor}
                          className=""
                          style={{
                            borderColor: "maroon",
                          }}
                          type="text"
                          inputMode="numeric"
                          placeholder="Insert Vendor Code"
                          value={formInput?.vendorCode}
                          onChange={handleChangeInputVendor}
                          onKeyDown={handleOnEnterInputVendor}
                        />
                        {formInput?.vendorCode?.length !== 0 && (
                          <CButton
                            onClick={handleClearInputVendor}
                            style={{
                              border: "0",
                              position: "absolute",
                              top: 0,
                              right: "10px",
                            }}
                          >
                            <CIcon icon={icon.cilX} />
                          </CButton>
                        )}
                      </div>
                    </CRow>
                    <CRow className="">
                      <CFormText>Rit | Truck Station</CFormText>
                      <Select
                        isDisabled={
                          // optionsSelectRit === undefined ||
                          // optionsSelectRit?.length === 0 ||
                          stateVendorArrived ||
                          formInput?.rit !== 0
                        }
                        isClearable
                        className="px-2"
                        placeholder="Select Rit and Truck Station"
                        value={
                          optionsSelectRit?.find(
                            (opt) => opt.value === selectedRit && opt.valueTruckStation === selectedTruckStation
                          ) || null
                        }
                        // value={'manual'}
                        getOptionValue={(e) => `${e.value}-${e.valueTruckStation}`}
                        getOptionLabel={(e) => e.label}
                        options={optionsSelectRit}
                        // options={
                        //   [{label: "Insert manual", value: 'manual'}]
                        // }
                        onChange={handleChangeSelectRitTruckStation}
                        styles={{
                          option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                            return {
                              ...styles,
                              backgroundColor: isDisabled
                                ? undefined
                                : isSelected ? "rgb(72, 96, 129)"
                                : isFocused ? "#6482AD"
                                : undefined,
                              color: colorMode === 'dark' && (!isFocused || isSelected) ? "white" : 
                              isFocused ? "white" : 
                              isSelected ? "white" :
                              colorMode === 'light' && (!isFocused) ? "black" : "",
                              ':active': {
                                ...styles[':active'],
                                color: "white",
                                backgroundColor: !isDisabled
                                  ? isSelected
                                    ? 'rgb(37, 50, 70)'
                                    : 'rgb(37, 50, 70)'
                                  : undefined,
                              },
                              ':hover': {
                                ...styles[':hover'],
                                color: "white"
                              }
                            };
                          },
                        }}
                      />
                    </CRow>
                    <CRow className="mt-1 px-2">
                      <CButton
                        disabled={selectedRit === 0 || stateVendorArrived}
                        onClick={() =>
                          formInput?.rit === 0
                            ? getArrivalNow(selectedRit, selectedTruckStation)
                            : handleClearInputVendor()
                        }
                        className=""
                        style={{
                          color: "white",
                          backgroundColor:
                            !formInput?.arrivalActualTime || formInput?.arrivalActualTime === ""
                              ? "#7FA1C3"
                              : "#758694",
                        }}
                      >
                        {!formInput?.arrivalActualTime || formInput?.arrivalActualTime === ""
                          ? "Submit"
                          : "Clear"}
                      </CButton>
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol
                sm={{ span: 12, order: "last" }}
                lg={{ span: 7, order: 2 }}
                className="flex-grow-1 pt-3 pt-lg-0"
              >
                <CCard className="h-100" style={{ border: "1px solid black" }}>
                  <CCardHeader
                    style={{
                      backgroundColor: "#F5EDED",
                      borderBottom: "1px solid black",
                    }}
                  >
                    <p style={{ fontWeight: "bold" }}>
                      VENDOR INFORMATION
                    </p>
                  </CCardHeader>
                  <CCardBody className="" style={{ position: "relative" }}>
                    {loading && (
                      <div className="position-absolute start-0 top-0 w-100 h-100">
                        <CustomTableLoading/>
                      </div>
                    )}
                    <CRow className="">
                      <CCol xs={12}>
                        <p
                          style={{
                            fontWeight: "bold",
                            fontSize: "10px",
                            color: "#6482AD",
                          }}
                        >
                          VENDOR NAME
                        </p>
                        <CFormLabel>
                          {dataVendor.length !== 0
                            ? dataVendor?.supplierName
                            : "-"}
                        </CFormLabel>
                      </CCol>
                    </CRow>

                    <CRow className="mt-1 w-100">
                      <CCol xs={6} sm={4}>
                        <p
                          style={{
                            fontWeight: "bold",
                            fontSize: "10px",
                            color: "#6482AD",
                          }}
                        >
                          TRUCK STATION
                        </p>
                        <CFormLabel>{renderTruckStation()}</CFormLabel>
                      </CCol>

                      <CCol xs={6} sm={4}>
                        <p
                          style={{
                            fontWeight: "bold",
                            fontSize: "10px",
                            color: "#6482AD",
                          }}
                        >
                          RIT
                        </p>
                        <CFormLabel>{renderRit()}</CFormLabel>
                      </CCol>
                      <CCol xs={6} sm={4}>
                        <p
                          style={{
                            fontWeight: "bold",
                            fontSize: "10px",
                            color: "#6482AD",
                          }}
                        >
                          PLANT
                        </p>
                        <CFormLabel>{renderPlant()}</CFormLabel>
                      </CCol>
                    </CRow>



                    <CRow className="mt-1 w-100">
                      <CCol xs={6} sm={4}>
                        <p
                          style={{
                            fontWeight: "bold",
                            fontSize: "10px",
                            color: "#6482AD",
                          }}
                        >
                          PLANNING
                        </p>
                        <CFormLabel>{renderArrivalTimePlan()}</CFormLabel>
                      </CCol>

                      <CCol xs={6} sm={4}>
                        <p
                          style={{
                            fontWeight: "bold",
                            fontSize: "10px",
                            color: "#6482AD",
                          }}
                        >
                          ARRIVAL
                        </p>
                        
                        <CFormLabel>{renderArrivalTimeAct()}</CFormLabel>
                      </CCol>
                      
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol
                sm={{ span: 6, order: 2 }}
                lg={{ span: 2, order: 3 }}
                className="flex-grow-1 mt-3 mt-sm-0"
              >
                <CCard
                  className="h-100 overflow-hidden"
                  style={{ border: "1px solid black" }}
                >
                  <CCardHeader
                    style={{
                      backgroundColor: "#F5EDED",
                      borderBottom: "1px solid black",
                    }}
                  >
                    <p style={{ fontWeight: "bold" }}>VENDOR STATUS</p>
                  </CCardHeader>
                  <CCardBody
                    style={{
                      backgroundColor:
                        stateVendorArrived &&
                        dataVendor[0]?.status === "on schedule"
                          ? "#00DB42"
                          : formInput?.status === "on schedule"
                            ? "#00DB42"
                            : stateVendorArrived &&
                                dataVendor[0]?.status === "overdue"
                              ? "#FBC550"
                              : formInput?.status === "overdue"
                                ? "#FBC550"
                                : formInput?.status === 'unscheduled'
                                ? "gray"
                                  : "transparent",
                    }}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <h4
                      style={{
                        color: "white",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      {renderStatusVendor()}
                    </h4>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CRow>
    </CContainer>
  );
};

export default InputVendor;
