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
  const [formInput, setFormInput] = useState({
    rit: 0
  });
    
  const optionsSelectRit = dataVendor?.Delivery_Schedules?.map((data) => {
      const timePartArrival = data.arrival.split("T")[1];
      const timeArrival = timePartArrival.slice(0, 5);

      const timePartDeparture = data.departure.split("T")[1];
      const timeDeparture = timePartDeparture.slice(0, 5);

    return {
      label: `${data.rit} (${timeArrival} - ${timeDeparture}) | ${data.truckStation}`,
      value: Number(data.rit),
      valueTruckStation: data.truckStation
    };
  });

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

    // Compare times
    // if (date < matchesSchedule.arrivalPlanDate) {
    //   return "on schedule";
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
        // await getMaterialByDN(inputValue);
        await fetchVendorShceduleByCode(inputValue)
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
        await fetchVendorShceduleByCode(formInput.vendorCode);
      }
    }
    if (e.key === "-") {
      setFormInput({ ...formInput, vendorCode: 252654 });
      await fetchVendorShceduleByCode(252654);
    }
  };

  const handleChangeSelectRitTruckStation = (e) => {
    if (e) {
      setSelectedRit(e.value);
      setSelectedTruckStation(e.valueTruckStation)
    } else {
      setSelectedRit(0);
      setSelectedTruckStation("")
    }
  };

  const fetchVendorShceduleByCode = async(vendorCode) => {
    try {
      const response = await getVendorScheduleByCode(vendorCode)
      console.log("response schedule vendor: ", response)
      const responseVendor = response.data.vendor[0];
      setDataVendor(responseVendor);
    } catch (error) {
      console.error(error)
    }
  }

  

  const getArrivalNow = async(rit, truckStation) => {
    setLoading(true);
    const { date, time } = getCurrentDateTime();
    const matchesSchedule = dataVendor.Delivery_Schedules.find((data) => data.rit === rit && data.truckStation === truckStation);
    const statusSchedule = getStatusBasedOnTime(matchesSchedule);

    const timePartArrival = matchesSchedule.arrival.split("T")[1];
    const timeArrival = timePartArrival.slice(0, 5);
    
    const timePartDeparture = matchesSchedule.departure.split("T")[1];
    const timeDeparture = timePartDeparture.slice(0, 5);

    const body = {
      supplierId: Number(dataVendor.id),
      arrivalPlanTime: timeArrival,
      arrivalActualTime: time,
      departurePlanTime: timeDeparture,
      truckStation: matchesSchedule.truckStation,
      rit: matchesSchedule.rit,
      plantId: matchesSchedule.plantId
    };

    try {
      const response = await submitVendorArrival(body)
      // console.log("Response submit: ", response)
      addToast(response.data.message, 'success')
      setFormInput({
        ...formInput,
        supplierId: dataVendor.id,
        arrivalPlanTime: timeArrival,
        departurePlanTime: timeDeparture,
        rit: matchesSchedule.rit,
        truckStation: matchesSchedule.truckStation,
        arrivalActualTime: time,
        status: statusSchedule,
        plantName: matchesSchedule.Plant.plantName
      });
    } catch (error) {
      console.error("ERRORRR SUBMITTING: ", error)
    } finally {
      setLoading(false)
    }
  };


  const renderTruckStation = () => {
    const arrivedVendor = dataVendor?.Delivery_Schedules?.find(
      (data) => data.status !== "scheduled"
    );
    return formInput?.truckStation || "-"
    return arrivedVendor
      ? arrivedVendor.truckStation
      : formInput.truckStation !== ""
        ? formInput?.truckStation
        : "-";
  };
  const renderRit = () => {
    const arrivedVendor = dataVendor?.Delivery_Schedules?.find(
      (data) => data.status !== "scheduled"
    );
    return formInput?.rit || "-"
    return arrivedVendor
      ? arrivedVendor.rit
      : formInput.rit !== 0
        ? formInput?.rit
        : "-";
  };

  const renderPlant = () => {
    return formInput?.plantName || "-"
  }

  // const renderArrivalDatePlan = () => {
  //   const arrivedVendor = dataVendor?.Delivery_Schedules?.find(
  //     (data) => data.status !== "scheduled"
  //   );
  //   return arrivedVendor
  //     ? arrivedVendor.arrivalPlanDate
  //     : formInput.arrivalPlanDate !== ""
  //       ? formInput?.arrivalPlanDate
  //       : " -";
  // };

  const renderArrivalTimePlan = () => {
    const arrivedVendor = dataVendor?.Delivery_Schedules?.find(
      (data) => data.status !== "scheduled"
    );
    return formInput?.arrivalPlanTime || "-"
    return arrivedVendor
      ? `${arrivedVendor.arrivalPlanTime} - ${arrivedVendor.departurePlanTime}`
      : formInput.arrival_time_plan !== ""
        ? `${formInput?.arrival_time_plan} - ${formInput?.departure_time_plan}`
        : " -";
  };

  const renderArrivalTimeAct = () => {
    // const arrivedVendor = dataVendor.find(
    //   (data) => data.status !== "scheduled"
    // );
    return formInput?.arrivalActualTime || "-"
    return arrivedVendor
      ? arrivedVendor.arrivalActualTime
      : formInput.arrivalActualTime
        ? formInput.arrivalActualTime
        : " -";
  };

  const renderStatusVendor = () => {
    const arrivedVendor = dataVendor?.Delivery_Schedules?.find(
      (data) => data.status !== "scheduled"
    );
    return formInput?.status?.toUpperCase() || ""
    return arrivedVendor
      ? arrivedVendor.status.toUpperCase()
      : formInput.status
        ? formInput.status.toUpperCase()
        : " -";
  };



  return (
    <CContainer fluid>
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
                          optionsSelectRit?.length === 0 ||
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
                        getOptionValue={(e) => `${e.value}-${e.valueTruckStation}`}
                        getOptionLabel={(e) => e.label}
                        options={optionsSelectRit}
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
