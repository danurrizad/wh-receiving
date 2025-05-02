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
import useVendorDataService from "../../services/VendorDataService";

const Input = () => {
  const colorMode = localStorage.getItem('coreui-free-react-admin-template-theme')
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const addToast = useToast();
  const inputRefs = useRef({});

  const { getMaterialByDNData, submitMaterialByDNData } = useReceivingDataService();
  const { getArrivedVendor } = useVendorDataService()

  const [dataArrivedVendor, setDataArrivedVendor] = useState([]);
  const [dataVendorByDN, setDataVendorByDN] = useState([]);
  const [dataMaterialsByDN, setDataMaterialsByDN] = useState([]);
  const [stateVendorArrived, setStateVendorArrived] = useState(false);
  const [selectedArrivedVendor, setSelectedArrivedVendor] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [confirmedRemaining, setConfirmedRemaining] = useState("0/0");
  const [disableInputDN, setDisableInputDN] = useState(false);

  const [selectedRit, setSelectedRit] = useState(0);
  const [selectedTruckStation, setSelectedTruckStation] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
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
  const optionsSelectRit = dataArrivedVendor?.map((data) => {
    const timeArrival = data?.arrivalPlanTime?.split("T")[1].slice(0, 5) || ""
    const timeDeparture = data?.departurePlanTime?.split("T")[1].slice(0, 5) || ""

    return {
      label: timeArrival !== "" ? `${data.rit} (${timeArrival} - ${timeDeparture}) | ${data.truckStation}` : `${data.rit} | ${data.truckStation}`,
      valueRit: Number(data.rit),
      valueTruckStation: data.truckStation,
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

  const handleChangeInputDN = async (e) => {
    const inputValue = e.target.value;

    // Allow only numeric input and respect maxLength
    if (/^\d*$/.test(inputValue) && inputValue.length <= 10) {
      setFormInput({ ...formInput, dn_no: e.target.value });
      if (inputValue.length === 10) {
        await getMaterialByDN(inputValue);
        if(optionsSelectRit.length === 1){
          setSelectedRit(optionsSelectRit[0].value)
          setSelectedTruckStation(optionsSelectRit[0].valueTruckStation)
        }
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
    setSelectedTruckStation("")
    setDataMaterialsByDN([]);
    setDataVendorByDN([]);
    setDataArrivedVendor([]);
    setSelectedArrivedVendor(null);
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
      setFormInput({ ...formInput, dn_no: 2100206670 });
      await getMaterialByDN(2100206670);
    } else if (e.key === "="){
      setFormInput({ ...formInput, dn_no: 2100207058 });
      await getMaterialByDN(2100207058);
    }
  };

  const handleChangeSelectRitTruckStation = (e) => {
    setLoading(true)
    if (e) {
      setSelectedRit(e.valueRit);
      setSelectedTruckStation(e.valueTruckStation)
      const matchesVendor = dataArrivedVendor.find(data=>data.rit === e.valueRit && data.truckStation === e.valueTruckStation)
      setDataVendorByDN(matchesVendor)
    } else {
      setSelectedRit(0);
      setSelectedTruckStation('')
      setDataVendorByDN([])
    }
    setLoading(false)
  };

  const getMaterialByDN = async (dnNumber) => {
    try {
      setLoading(true);
      const response = await getMaterialByDNData(dnNumber);
      if (response.data.length !== 0) {
        const responseDN = response.data.material;
        const responseVendor = response.data.arrivedVendor;
        const responseSelectedArrivedVendor = response.data.selectedArrivedVendor;
        console.log("response data: ", response.data)
        console.log("response DN: ", responseDN)
        console.log("response Vendor: ", responseVendor)
        console.log("response Selected Arrived Vendor: ", responseSelectedArrivedVendor)
        if (responseVendor?.length === 0) {
          addToast("Please input vendor first", "danger", "error");
          setTimeout(()=>{
            handleClearInputDN();
          }, 100)
          return;
        }
        setDataMaterialsByDN(responseDN);
        setDataArrivedVendor(responseVendor)
        setSelectedArrivedVendor(responseSelectedArrivedVendor)
        setQtyEachMaterials({
          incomingId: responseDN.map((data) => Number(data.incomingId)),
          qty: responseDN.map((data) =>
            data.receivedQuantity === null
              ? data.reqQuantity
              : data.receivedQuantity
          ),
        });
        setRemainQty({
          qty: responseDN.map((data) => data.remain),
          status: responseDN.map((data) => data.status),
        });
        if(responseDN?.find(data=>data.viewOnly)){
          setStateVendorArrived(true);
        }

        let totalConfirmed = 0
        responseDN.map((data)=>{
          if(!data.viewOnly){
            totalConfirmed+=1
          }
        })
        if(totalConfirmed !== 0){
          setConfirmedRemaining(`0/${totalConfirmed}`)
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

  const [enabledRows, setEnabledRows] = React.useState([]); // Array of enabled row IDs
  const handleEnableInput = (rowData) => {
    setEnabledRows((prev) => [...prev, rowData.incomingId]); // Add row ID to the enabled rows

    const refKey = rowData.incomingId; // Use the row's unique identifier
    setTimeout(() => {
      inputRefs.current[refKey]?.focus(); // Focus the specific input field
    }, 0);
  };

  const handleDisableInput = (rowData) => {
    setTimeout(() => {
      setEnabledRows((prev) => prev.filter((id) => id !== rowData.incomingId)); // Remove row ID from enabled rows
    }, 100);
  };

  const handleEnterInputQty = (rowIndex, rowData, e) => {
    if (e.key === "Enter") {
      handleSubmitChangeQty(rowIndex, rowData);
    }
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

  const handleInputChangeQty = (rowIndex, rowData, eValue) => {
    setQtyEachMaterials((prevState) => ({
      ...prevState,
      qty: prevState.qty.map((value, index) =>
        index === rowIndex && Number(eValue) <= rowData.reqQuantity
          ? "" + Number(eValue)
          : value
      ),
    }));
  };

  // Received Quantity body template
  const receivedQuantityBodyTemplate = (rowData, rowIndex) => {
    const isInputEnabled = enabledRows.includes(rowData.incomingId);
    const isViewOnly = rowData.viewOnly
    const indexMaterial = rowIndex.rowIndex;
    return (
      <div className="d-flex align-items-center justify-content-center gap-2">
        {/* Input Field */}
        <InputText
          ref={(el) => (inputRefs.current[rowData.incomingId] = el)}
          id={`inputQty-${rowData.incomingId}`}
          type="text"
          disabled={!isInputEnabled}
          placeholder="-"
          value={qtyEachMaterials.qty[indexMaterial]}
          onChange={(e) =>
            handleInputChangeQty(indexMaterial, rowData, e.target.value)
          }
          onKeyDown={(e) => handleEnterInputQty(rowIndex, rowData, e)}
          onBlur={() => handleSubmitChangeQty(rowIndex, rowData)}
          style={{ width: "50px" }}
        />

        {dataVendorByDN.length !== 0 && isInputEnabled && !isViewOnly ? (
          <CButton
            color=""
            className="p-button-sm p-button-secondary text-white"
            onClick={() => handleSubmitChangeQty(rowIndex, rowData)}
          >
            <CIcon style={{ color: "green" }} icon={icon.cilCheck} />
          </CButton>
        ) : dataVendorByDN.length !== 0 && !isInputEnabled && !isViewOnly ? (
          <CButton
            color=""
            className="p-button-sm p-button-secondary text-white"
            onClick={() => handleEnableInput(rowData)}
          >
            <CIcon style={{ color: "gray" }} icon={icon.cilPen} />
          </CButton>
        ) : (
          ""
        )}
      </div>
    );
  };

  const createFormBody = (materialByDN, vendorByDN, qtyEachMaterials) => {
    return {
      deliveryNoteId: materialByDN[0].deliveryNoteId,
      vendorMovementId: vendorByDN.id,
      incomingIds: qtyEachMaterials.incomingId,
      receivedQuantities: qtyEachMaterials.qty.map(Number),
    };
  };

  const handleSubmitMaterials = async () => {
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
          setLoadingSubmit(true);
          Swal.showLoading();
          const formBody = createFormBody(dataMaterialsByDN, dataVendorByDN, qtyEachMaterials);
          const warehouseId = dataMaterialsByDN[0].warehouseId;
          console.log("formBody: ", formBody)
          await submitMaterialByDNData(warehouseId, formBody);
          handleClearInputDN();
          return "Material quantities received!";
        } catch (error) {
          console.error(error);
          return error;
        } finally {
          setLoadingSubmit(false);
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (result.value === "Material quantities received!") {
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
  };

  const remainBodyTemplate = (rowData, rowIndex) => {
    return (
      <p
        style={{
          color:
            Number(remainQty.qty[rowIndex.rowIndex]) < 0 ? "#FF0000" : 
            Number(remainQty.qty[rowIndex.rowIndex]) === 0 && colorMode === 'light' ? "black" : 
            Number(remainQty.qty[rowIndex.rowIndex]) === 0 && colorMode === 'dark' ? "white" : 'black' ,
        }}
      >
        {rowData.viewOnly === false ? remainQty.qty[rowIndex.rowIndex] : rowData.remain}
      </p>
    );
  };

  const statusBodyTemplate = (rowData, rowIndex) => {
    const indexMaterial = rowIndex.rowIndex;
    return (
      <div className="d-flex justify-content-center">
        <CTooltip
          content={
            remainQty.status[indexMaterial] === "not complete"
              ? "NOT DELIVERED"
              : remainQty.status[indexMaterial] === "partial"
                ? "NOT COMPLETED"
                : remainQty.status[indexMaterial] === "completed"
                  ? "COMPLETED"
                  : remainQty.status[indexMaterial] === ""
                    ? ""
                    : "COMPLETED"
          }
          placement="top"
        >
          <CButton style={{ border: 0 }}>
            {remainQty.status[indexMaterial] === "not complete" ? (
              <FaCircleXmark style={{ color: "#FF0000", fontSize: "24px" }} />
            ) : remainQty.status[indexMaterial] === "partial" ? (
              <FaCircleExclamation
                style={{ color: "#FFD43B", fontSize: "24px" }}
              />
            ) : remainQty.status[indexMaterial] === "completed" ? (
              <FaCircleCheck style={{ color: "#00DB42", fontSize: "24px" }} />
            ) : remainQty.status[indexMaterial] === "" ? (
              "-"
            ) : (
              <FaCircleCheck style={{ color: "#00DB42", fontSize: "24px" }} />
            )}
          </CButton>
        </CTooltip>
      </div>
    );
  };

  const renderTruckStation = () => {
    return selectedArrivedVendor !== null && selectedArrivedVendor[0]?.truckStation || dataVendorByDN.truckStation || "-"
  };
  const renderRit = () => {
    return selectedArrivedVendor !== null && selectedArrivedVendor[0]?.rit || dataVendorByDN.rit || "-"
  };

  const renderPlant = () => {
    return selectedArrivedVendor !== null && selectedArrivedVendor[0]?.Plant?.plantName || dataVendorByDN?.Plant?.plantName || "-"
  }

  const renderArrivalTimePlan = () => {
    const timeArrival = selectedArrivedVendor !== null && selectedArrivedVendor[0]?.arrivalPlanTime?.split("T")[1].slice(0, 5) || dataVendorByDN?.arrivalPlanTime?.split("T")[1].slice(0, 5) || ""
    const timeDeparture = selectedArrivedVendor !== null && selectedArrivedVendor[0]?.arrivalPlanTime?.split("T")[1].slice(0, 5) || dataVendorByDN?.departurePlanTime?.split("T")[1].slice(0, 5) || ""
    return `${timeArrival} - ${timeDeparture}`
  };

  const renderArrivalTimeAct = () => {
    return selectedArrivedVendor !== null && selectedArrivedVendor[0]?.arrivalActualTime?.split("T")[1].slice(0, 5) || dataVendorByDN?.arrivalActualTime?.split("T")[1].slice(0, 5) || "-"
  };

  const renderStatusVendor = () => {
    return selectedArrivedVendor !== null && selectedArrivedVendor[0]?.status?.toUpperCase() || dataVendorByDN?.status?.toUpperCase() || "-"
  };

  const renderCustomEmptyMsg = () => {
    return (
      <div
        className="empty-msg w-100 d-flex flex-column align-items-center justify-content-center py-3"
        style={{ color: "black", opacity: "50%" }}
      >
        <FaInbox size={40} />
        <p>Material Data Not Found!</p>
      </div>
    );
  };

  const handleSelectRow = (e) => {
    const alreadySelected = selectedRows?.find((data)=>data.incomingId === e.value[(e.value.length)-1].incomingId) 
    console.log("alreadySelected: ", alreadySelected)
    const availableRow = dataMaterialsByDN?.filter((data)=>data.viewOnly === false)
    console.log("availableRow: ", availableRow)
    const matchesAvailable = availableRow?.find((data)=>data.incomingId === e.value[(e.value.length)-1].incomingId)
    console.log("matchesAvailable: ", matchesAvailable)
    if (dataVendorByDN.length !== 0 && !alreadySelected && matchesAvailable) {
      setSelectedRows(e.value);
    }
  };

  const onRowSelect = (e) => {
    const indexRow = qtyEachMaterials.incomingId.indexOf(e.data.incomingId);

    //   const remainInData = e.value.remain
    const reqQty = e.data.reqQuantity;
    const inputAct = Number(qtyEachMaterials.qty[indexRow]);
    const newRemainQty = inputAct - reqQty;

    setRemainQty((prevState) => ({
      ...prevState,
      qty: prevState.qty.map((value, index) =>
        index === indexRow ? Number(newRemainQty) : value
      ),
      status: prevState.status.map((value, index) =>
        index === indexRow && newRemainQty === 0
          ? "completed"
          : index === indexRow && e.data.remain === null
            ? "note complete"
            : index === indexRow && newRemainQty === e.data.remain
              ? "partial"
              : index === indexRow &&
                  newRemainQty !== e.data.remain &&
                  newRemainQty < 0
                ? "partial"
                : index === indexRow &&
                    newRemainQty !== e.data.remain &&
                    newRemainQty > 0
                  ? "completed"
                  : value
      ),
    }));
  };

  useEffect(() => {
      setConfirmedRemaining(
        `${selectedRows.length}/${dataMaterialsByDN.filter(data=>data.viewOnly === false).length}`
      );
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
            <CCardTitle>RECEIVING PROCESS</CCardTitle>
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
                      INPUT DN NUMBER
                    </p>
                  </CCardHeader>
                  <CCardBody className="d-flex flex-column gap-1">
                    <CRow className="px-0 d-flex">
                      <CFormText className="px-3">DN Number</CFormText>
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
                          placeholder="Insert DN Number"
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
                        isMulti={false}
                        isDisabled={
                          optionsSelectRit?.length === 0 || selectedArrivedVendor !== null
                          // stateVendorArrived ||
                        }
                        isClearable
                        className="px-2"
                        placeholder="Select Rit and Truck Station"
                        value={
                          selectedArrivedVendor !== null
                            ? optionsSelectRit?.find(
                                (opt) =>
                                  opt.valueRit === selectedArrivedVendor[0]?.rit &&
                                  opt.valueTruckStation === selectedArrivedVendor[0]?.truckStation
                              )
                            : optionsSelectRit?.find(
                                (opt) =>
                                  opt.valueRit === selectedRit &&
                                  opt.valueTruckStation === selectedTruckStation
                              )
                          || null
                        }
                        getOptionValue={(e) => `${e.valueRit}-${e.valueTruckStation}`}
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
                          {dataArrivedVendor[0]?.Supplier?.supplierName || "-"}
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
                      backgroundColor: (() => {
                        const statusFromArrived = selectedArrivedVendor?.[0]?.status;
                        const status = dataVendorByDN?.status || statusFromArrived;
                    
                        if (status === "on schedule") return "#00DB42";
                        if (status === "overdue") return "#FBC550";
                        return "transparent";
                      })(),
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
            <CRow className="mt-4">
              <h5>Confirmed Remaining : {confirmedRemaining}</h5>
            </CRow>
            <CRow className="mt-1 mb-2 px-2">
              <CCard className="p-0 overflow-hidden">
                <CCardBody className="p-0">
                  {/* Table */}
                  <DataTable
                    loading={loading}
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                    loadingIcon={<CustomTableLoading />}
                    className="p-datatable-gridlines p-datatable-sm custom-datatable text-nowrap"
                    style={{ minHeight: "140px" }}
                    size="small"
                    showGridlines
                    stripedRows
                    value={dataMaterialsByDN}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    dataKey="materialNo"
                    emptyMessage={renderCustomEmptyMsg}
                    selectionMode={dataVendorByDN.length !== 0 ? "multiple" : undefined}
                    selection={selectedRows}
                    onSelectionChange={handleSelectRow}
                    onRowSelect={onRowSelect}
                    isDataSelectable={(data) => {
                      if(data.data.viewOnly === false){
                        return true
                      }else return false
                    }}
                    rowClassName={(data) => {
                      if(dataVendorByDN.length === 0){
                        return "p-disabled"
                      }
                      if(data.viewOnly){
                        return "p-disabled cursor-not-allowed"
                      }else return ""
                    }}
                  >
                    <Column
                      className=""
                      field=""
                      header="No"
                      body={(rowData, { rowIndex }) => rowIndex + 1}
                    />
                    <Column
                      className=""
                      field="materialNo"
                      header="Material No"
                    />
                    <Column
                      className=""
                      field="description"
                      header="Material Description"
                    />
                    <Column
                      className=""
                      field="address"
                      header="Rack Address"
                    />
                    <Column
                      className=""
                      field="reqQuantity"
                      header="Req. Qty"
                    />
                    <Column
                      className=""
                      field="receivedQuantity"
                      header="Act. Qty"
                      body={receivedQuantityBodyTemplate}
                    />
                    <Column className="" field="uom" header="UoM" />
                    <Column
                      className=""
                      field="remain"
                      header="Remain"
                      body={remainBodyTemplate}
                    />
                    <Column
                      className=""
                      field=""
                      header="Status Qty"
                      body={statusBodyTemplate}
                    />
                    {/* <Column className='' field="" header="Action" body={actionBodyTemplate} /> */}
                  </DataTable>
                </CCardBody>
              </CCard>
            </CRow>
            <CRow className="d-flex justify-content-end">
              <CCol xs="auto">
                {/* {stateVendorArrived ? (
                  <CButton
                    style={{ backgroundColor: "#758694" }}
                    className="text-white"
                    onClick={handleClearInputDN}
                  >
                    Clear
                  </CButton>
                ) : ( */}
                  <CTooltip 
                    className={ (dataMaterialsByDN?.filter(data=>!data.viewOnly).length === selectedRows.length && dataVendorByDN?.length !== 0) || selectedArrivedVendor !== null || dataMaterialsByDN?.length === 0 && "d-none"} 
                    content={
                      dataVendorByDN?.length === 0 ? "Pilih Rit terlebih dahulu" 
                      : dataMaterialsByDN?.filter(data=>!data.viewOnly).length !== selectedRows.length ? "Lakukan konfirmasi material terlebih dahulu" 
                      : ""
                    }
                    >
                    <span>
                      <CButton
                        disabled={
                          dataVendorByDN.length === 0 ||
                          confirmedRemaining === "0 / 0" ||
                          dataMaterialsByDN?.filter(data=>!data.viewOnly).length !== selectedRows.length
                        }
                        style={{ backgroundColor: "#5B913B" }}
                        className="text-white"
                        onClick={handleSubmitMaterials}
                      >
                        Submit
                      </CButton>
                    </span>
                  </CTooltip>
                {/* )} */}
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CRow>
    </CContainer>
  );
};

export default Input;
