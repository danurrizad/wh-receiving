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
import {
  dataReceivingDummy,
  dataSchedulesDummy,
  dataDummy,
} from "../../utils/DummyData";
import { Button, DatePicker } from "rsuite";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import useReceivingDataService from "./../../services/ReceivingDataServices";
import { useToast } from "../../App";
import { InputText } from "primereact/inputtext";
import {
  FaCircleCheck,
  FaCircleExclamation,
  FaCircleXmark,
  FaInbox,
} from "react-icons/fa6";
import Swal from "sweetalert2";
import CustomTableLoading from "../../components/LoadingTemplate";

const InputVendor = () => {
  const colorMode = localStorage.getItem('coreui-free-react-admin-template-theme')
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const addToast = useToast();
  const [errMsg, setErrMsg] = useState("");
  const inputRefs = useRef({});

  const { getMaterialByDNData, submitMaterialByDNData } =
    useReceivingDataService();

  const [dataVendorByDN, setDataVendorByDN] = useState([]);
  const [dataMaterialsByDN, setDataMaterialsByDN] = useState([]);
  const [stateVendorArrived, setStateVendorArrived] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [confirmedRemaining, setConfirmedRemaining] = useState("0/0");
  const [disableInputDN, setDisableInputDN] = useState(false);

  const [selectedRit, setSelectedRit] = useState(0);
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
  });
  const [qtyEachMaterials, setQtyEachMaterials] = useState({});
  const [remainQty, setRemainQty] = useState({});
  const optionsSelectRit = dataVendorByDN.map((data) => {
    return {
      label: `${data.rit} (${data.arrivalPlanTime} - ${data.departurePlanTime}) | ${data.truckStation}`,
      value: Number(data.rit),
    };
  });

  const getCurrentDateTime = () => {
    const now = new Date();
    // Format date as YYYY-MM-DD
    const date = now.toISOString().split("T")[0];
    // Get hours and minutes
    const padZero = (num) => String(num).padStart(2, "0");
    const hours = padZero(now.getHours());
    const minutes = padZero(now.getMinutes());
    // Format time as HH:MM - HH:MM
    const time = `${hours}:${minutes}`;

    return { date, time };
  };

  function addMinutes(time, minutesToAdd) {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    date.setMinutes(date.getMinutes() + minutesToAdd);

    // Format the result as HH:mm
    return date.toTimeString().slice(0, 5);
  }

  const getStatusBasedOnTime = (matchesVendor) => {
    const { date, time } = getCurrentDateTime();

    const addedTime = addMinutes(matchesVendor.arrivalPlanTime, 15);

    // Compare times
    if (date < matchesVendor.arrivalPlanDate) {
      return "on schedule";
    } else if (date <= matchesVendor.arrivalPlanDate && time <= addedTime) {
      return "on schedule"; // Status if current time is within the range
    } else {
      return "overdue"; // Status if current time is outside the range
    }
  };

  const handleChangeInputDN = async (e) => {
    const inputValue = e.target.value;

    // Allow only numeric input and respect maxLength
    if (/^\d*$/.test(inputValue) && inputValue.length <= 10) {
      setFormInput({ ...formInput, dn_no: e.target.value });
      if (inputValue.length === 10) {
        await getMaterialByDN(inputValue);
      }
    }

    if (inputValue.length === 0) {
      handleClearInputDN();
    }
  };

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
    });
    setSelectedRit(0);
    setDataMaterialsByDN([]);
    setDataVendorByDN([]);
    setQtyEachMaterials({});
    setRemainQty({});
    setStateVendorArrived(false);
    setSelectedRows([]);
    setDisableInputDN(false);
  };

  const handleOnEnterInputDN = async (e) => {
    if (e.key === "Enter") {
      if (formInput.dn_no === "") {
        addToast("Please insert the DN number!", "error", "error");
      } else {
        await getMaterialByDN(formInput.dn_no);
      }
    }
    if (e.key === "-") {
      setFormInput({ ...formInput, dn_no: 2100203724 });
      await getMaterialByDN(2100203724);
    }
  };

  const handleChangeSelectRit = (e) => {
    if (e) {
      setSelectedRit(e.value);
    } else {
      setSelectedRit(0);
    }
  };

  const getMaterialByDN = async (dnNumber) => {
    try {
      setLoading(true);
      const response = await getMaterialByDNData(dnNumber);
      // console.log("RESPONSE DN :", response)

      if (response.data.data.length !== 0) {
        const responseDN = response.data.data[0].deliveryNotes;
        const responseVendor = response.data.data[0].vendorSchedules;
        const responseStateArrived = response.data.viewOnly;

        if (responseVendor.length === 0) {
          addToast("Vendor schedule not found", "danger", "error");
          setTimeout(()=>{
            handleClearInputDN();
          }, 100)
          return;
        }
        setDataMaterialsByDN(responseDN);
        setDataVendorByDN(responseVendor);
        setQtyEachMaterials({
          incomingId: responseDN.map((data) => Number(data.incomingId)),
          qty: responseDN.map((data) =>
            data.receivedQuantity === null
              ? data.reqQuantity
              : data.receivedQuantity
          ),
        });
        setRemainQty({
          qty: responseDN.map((data) => ""),
          status: responseDN.map((data) => data.status),
        });
        setStateVendorArrived(responseStateArrived);

        if (responseStateArrived) {
          setSelectedRit(1);
          setConfirmedRemaining(`${responseDN.length}/${responseDN.length}`);
        } else {
          setConfirmedRemaining(`0/${responseDN.length}`);
        }
      } else {
        addToast("Invalid DN Number!", "danger", "error");
      }
    } catch (error) {
      console.error("error :", error);
      if (dataMaterialsByDN.length !== 0) {
        handleClearInputDN();
      }
    } finally {
      setLoading(false);
    }
  };

  const getArrivalNow = (rit) => {
    setLoading(true);
    const { date, time } = getCurrentDateTime();
    const matchesVendor = dataVendorByDN.find((data) => data.rit === rit);
    const statusSchedule = getStatusBasedOnTime(matchesVendor);
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
    });
    addToast("Vendor arrival submitted!", 'success')
    setLoading(false);
  };

  const [enabledRows, setEnabledRows] = React.useState([]); // Array of enabled row IDs

  const handleDisableInput = (rowData) => {
    setTimeout(() => {
      setEnabledRows((prev) => prev.filter((id) => id !== rowData.description)); // Remove row ID from enabled rows
    }, 100);
  };


  const handleSubmitChangeQty = (rowIndex, rowData) => {
    handleDisableInput(rowData);

    const remainInData = rowData.remain;
    const reqQty = rowData.reqQuantity;
    const inputAct = Number(qtyEachMaterials.qty[rowIndex.rowIndex]);
    const newRemainQty = inputAct - reqQty;

    setRemainQty((prevState) => ({
      ...prevState,
      qty: prevState.qty.map((value, index) =>
        index === rowIndex.rowIndex ? Number(newRemainQty) : value
      ),
      status: prevState.status.map((value, index) =>
        index === rowIndex.rowIndex && newRemainQty === 0
          ? "completed"
          : index === rowIndex.rowIndex && rowData.remain === null
            ? "not complete"
            : index === rowIndex.rowIndex && newRemainQty === rowData.remain
              ? "partial"
              : index === rowIndex.rowIndex &&
                  newRemainQty !== rowData.remain &&
                  newRemainQty < 0
                ? "partial"
                : index === rowIndex.rowIndex &&
                    newRemainQty !== rowData.remain &&
                    newRemainQty > 0
                  ? "completed"
                  : value
      ),
    }));

    const alreadySelected = selectedRows.find(
      (rows) => rows.incomingId === rowData.incomingId
    );
    if (!alreadySelected) {
      setSelectedRows([...selectedRows, rowData]);
    }
  };



  const createFormBody = (formInput, qtyEachMaterials) => {
    const { date, time } = getCurrentDateTime();
    const filteredQty = qtyEachMaterials.qty.filter(
      (data, index) =>
        Number(data) !== Number(dataMaterialsByDN[index].receivedQuantity)
    );

    return {
      dnNumber: Number(formInput.dn_no),
      arrivalActualDate: formInput.arrival_date_actual,
      arrivalActualTime: formInput.arrival_time_actual,
      departureActualDate: date,
      departureActualTime: time,
      rit: formInput.rit,

      // incomingIds: qtyEachMaterials.incomingId.filter((data,index)=>Number(qtyEachMaterials.qty[index]) !== Number(dataMaterialsByDN[index].receivedQuantity) && Number(data)),
      // receivedQuantities: filteredQty.map(Number),

      incomingIds: qtyEachMaterials.incomingId,
      receivedQuantities: qtyEachMaterials.qty.map(Number),
    };
  };

 

  


  const renderTruckStation = () => {
    const arrivedVendor = dataVendorByDN.find(
      (data) => data.status !== "scheduled"
    );
    return arrivedVendor
      ? arrivedVendor.truckStation
      : formInput.truckStation !== ""
        ? formInput?.truckStation
        : "-";
  };
  const renderRit = () => {
    const arrivedVendor = dataVendorByDN.find(
      (data) => data.status !== "scheduled"
    );
    return arrivedVendor
      ? arrivedVendor.rit
      : formInput.rit !== 0
        ? formInput?.rit
        : "-";
  };

  const renderArrivalDatePlan = () => {
    const arrivedVendor = dataVendorByDN.find(
      (data) => data.status !== "scheduled"
    );
    return arrivedVendor
      ? arrivedVendor.arrivalPlanDate
      : formInput.arrival_date_plan !== ""
        ? formInput?.arrival_date_plan
        : " -";
  };

  const renderArrivalTimePlan = () => {
    const arrivedVendor = dataVendorByDN.find(
      (data) => data.status !== "scheduled"
    );
    return arrivedVendor
      ? `${arrivedVendor.arrivalPlanTime} - ${arrivedVendor.departurePlanTime}`
      : formInput.arrival_time_plan !== ""
        ? `${formInput?.arrival_time_plan} - ${formInput?.departure_time_plan}`
        : " -";
  };

  const renderArrivalDateAct = () => {
    const arrivedVendor = dataVendorByDN.find(
      (data) => data.status !== "scheduled"
    );
    return arrivedVendor
      ? arrivedVendor.arrivalActualDate
      : formInput.arrival_date_actual
        ? formInput.arrival_date_actual
        : " -";
  };

  const renderArrivalTimeAct = () => {
    const arrivedVendor = dataVendorByDN.find(
      (data) => data.status !== "scheduled"
    );
    return arrivedVendor
      ? arrivedVendor.arrivalActualTime
      : formInput.arrival_time_actual
        ? formInput.arrival_time_actual
        : " -";
  };

  const renderDepartureDateAct = () => {
    const arrivedVendor = dataVendorByDN.find(
      (data) => data.status !== "scheduled"
    );
    return arrivedVendor
      ? arrivedVendor.departureActualDate
      : formInput.departure_date_actual
        ? formInput.departure_date_actual
        : " -";
  };

  const renderDepartureTimeAct = () => {
    const arrivedVendor = dataVendorByDN.find(
      (data) => data.status !== "scheduled"
    );
    return arrivedVendor
      ? arrivedVendor.departureActualTime
      : formInput.departure_time_actual
        ? formInput.departure_time_actual
        : " -";
  };

  const renderStatusVendor = () => {
    const arrivedVendor = dataVendorByDN.find(
      (data) => data.status !== "scheduled"
    );
    return arrivedVendor
      ? arrivedVendor.status.toUpperCase()
      : formInput.status
        ? formInput.status.toUpperCase()
        : " -";
  };

 

  useEffect(() => {
    if (!stateVendorArrived) {
      setConfirmedRemaining(
        `${selectedRows.length}/${dataMaterialsByDN.length}`
      );
    }
  }, [selectedRows]);

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
                          disabled={formInput.rit !== 0 || disableInputDN}
                          className=""
                          style={{
                            borderColor: "maroon",
                          }}
                          type="text"
                          inputMode="numeric"
                          placeholder="Insert Vendor Code"
                          value={formInput.dn_no}
                          onChange={handleChangeInputDN}
                          onKeyDown={handleOnEnterInputDN}
                        />
                        {formInput.dn_no.length !== 0 && (
                          <CButton
                            onClick={handleClearInputDN}
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
                          optionsSelectRit.length === 0 ||
                          stateVendorArrived ||
                          formInput.rit !== 0
                        }
                        isClearable
                        className="px-2"
                        placeholder="Select Rit and Truck Station"
                        value={
                          optionsSelectRit.find(
                            (opt) => opt.value === selectedRit
                          ) || 0
                        }
                        options={optionsSelectRit}
                        onChange={handleChangeSelectRit}
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
                          formInput.rit === 0
                            ? getArrivalNow(selectedRit)
                            : handleClearInputDN()
                        }
                        className=""
                        style={{
                          color: "white",
                          backgroundColor:
                            formInput.arrival_date_actual === ""
                              ? "#7FA1C3"
                              : "#758694",
                        }}
                      >
                        {formInput.arrival_date_actual === ""
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
                      DELIVERY INFORMATION
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
                          {dataVendorByDN.length !== 0
                            ? dataVendorByDN[0]?.supplierName
                            : "-"}
                        </CFormLabel>
                      </CCol>
                    </CRow>
                    <CRow className="mt-1 w-100">
                      <CCol xs={3}>
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

                      <CCol>
                        <p
                          style={{
                            fontWeight: "bold",
                            fontSize: "10px",
                            color: "#6482AD",
                          }}
                        >
                          RECEIVE PLAN{" "}
                        </p>
                        <CFormLabel
                          className="col-12"
                          style={{ fontWeight: "light" }}
                        >
                          Date :{" "}
                          <span style={{ fontWeight: "normal" }}>
                            {renderArrivalDatePlan()}
                          </span>
                        </CFormLabel>
                        <p
                          style={{
                            fontWeight: "bold",
                            fontSize: "10px",
                            color: "transparent",
                            userSelect: "none",
                          }}
                        >
                          Divider{" "}
                        </p>
                        <CFormLabel
                          className="col-12"
                          style={{ fontWeight: "light" }}
                        >
                          Time :{" "}
                          <span style={{ fontWeight: "normal" }}>
                            {renderArrivalTimePlan()}
                          </span>
                        </CFormLabel>
                      </CCol>
                      <CCol>
                        <p
                          style={{
                            fontWeight: "bold",
                            fontSize: "10px",
                            color: "#6482AD",
                          }}
                        >
                          ARRIVAL{" "}
                        </p>
                        <CFormLabel
                          className="col-12"
                          style={{ fontWeight: "light" }}
                        >
                          Date :{" "}
                          <span style={{ fontWeight: "normal" }}>
                            {renderArrivalDateAct()}
                          </span>
                        </CFormLabel>
                        <p
                          style={{
                            fontWeight: "bold",
                            fontSize: "10px",
                            color: "transparent",
                            userSelect: "none",
                          }}
                        >
                          Divider{" "}
                        </p>
                        <CFormLabel
                          className="col-12"
                          style={{ fontWeight: "light" }}
                        >
                          Time :{" "}
                          <span style={{ fontWeight: "normal" }}>
                            {renderArrivalTimeAct()}
                          </span>
                        </CFormLabel>
                      </CCol>
                      {/* <CCol>
                        <p
                          style={{
                            fontWeight: "bold",
                            fontSize: "10px",
                            color: "#6482AD",
                          }}
                        >
                          DEPARTURE{" "}
                        </p>
                        <CFormLabel
                          className="col-12"
                          style={{ fontWeight: "light" }}
                        >
                          Date :{" "}
                          <span style={{ fontWeight: "normal" }}>
                            {renderDepartureDateAct()}
                          </span>
                        </CFormLabel>
                        <p
                          style={{
                            fontWeight: "bold",
                            fontSize: "10px",
                            color: "transparent",
                            userSelect: "none",
                          }}
                        >
                          Divider{" "}
                        </p>
                        <CFormLabel
                          className="col-12"
                          style={{ fontWeight: "lighter" }}
                        >
                          Time :{" "}
                          <span style={{ fontWeight: "normal" }}>
                            {renderDepartureTimeAct()}
                          </span>
                        </CFormLabel>
                      </CCol> */}
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
                    <p style={{ fontWeight: "bold" }}>DELIVERY STATUS</p>
                  </CCardHeader>
                  <CCardBody
                    style={{
                      backgroundColor:
                        stateVendorArrived &&
                        dataVendorByDN[0]?.status === "on schedule"
                          ? "#00DB42"
                          : formInput.status === "on schedule"
                            ? "#00DB42"
                            : stateVendorArrived &&
                                dataVendorByDN[0]?.status === "overdue"
                              ? "#FBC550"
                              : formInput.status === "overdue"
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
