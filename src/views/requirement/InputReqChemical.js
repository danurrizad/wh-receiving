import React, { useState, useEffect, useRef } from "react";
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
  CCardText,
  CBreadcrumb,
  CBreadcrumbItem,
  CCardFooter,
} from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPeopleCarryBox,
  faTruck,
  faHelmetSafety,
  faFill,
  faCheckSquare,
  faXmarkSquare,
} from "@fortawesome/free-solid-svg-icons";
import { SelectButton } from "primereact/selectbutton";
import { FaArrowLeft, FaCamera } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import  Select  from 'react-select';

const InputChemical = () => {
  const navigate = useNavigate()
  const [formQuestions, setFormQuestions] = useState({
        vendorCode: "",
        vendorName: "",
        truckStation: "",
        driverName: "",
        driverCondition: "",
        driverSymptom: "",
        vehicleType: "",
        deliveryType: "",
        driverLicense: "",
        licenseDuration: "",
        vehicleRegistration: "",
        registrationCondition: "",
        registrationDuration: "",
        licensePlate: "",
        licensePlateDuration: "",
        apdReason: "",

      })
  const [isInputPlatDisabled, setIsInputPlatDisabled] = useState(true);
  const [apdStatus, setApdStatus] = useState(null);
  const [reason, setReason] = useState("");
  // const [showCamera, setShowCamera] = useState(false);
  const [isSTNKButtonDisabled, setIsSTNKButtonDisabled] = useState(true);
  const [isInputSTNKDisabled, setIsInputSTNKDisabled] = useState(true);
  // const videoRef = useRef(null);
  const mediaStreamRef = useRef(null); // Reference to store the media stream
  const [activeItem, setActiveItem] = useState({
    item1: true,
    item2: false,
    item3: false,
    item4: false,
  });

  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    setShowCamera(true);
    setCapturing(true);
    setCapturedImage(null);
    setCountdown(5);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Start countdown
      let counter = 5;
      const interval = setInterval(() => {
        counter -= 1;
        setCountdown(counter);
        if (counter === 0) {
          clearInterval(interval);
          captureImage();
          setCapturing(false);
        }
      }, 1000);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      // Set canvas size to match video size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL("image/png"));

      // Stop the camera
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setShowCamera(false);
    }
  };

  useEffect(() => {
    if (apdStatus === "yes" || formQuestions.apdReason !== "") {
      setShowCamera(true);
      // startCamera()
    } else if (apdStatus === "no" && formQuestions.apdReason === "") {
      setShowCamera(false);
      // stopCamera()
    }
  }, [apdStatus, formQuestions.apdReason]);

  const optionsSelectDelivery = [
    { label: "Vendor", value: "vendor"},
    { label: "Kurir", value: "kurir"},
  ]

  const optionsSelectVehicle = [
    { label: "Truk", value: "truk" },
    { label: "Mobil", value: "mobil" },
  ]

  // Handle input submission
  const handleReasonSubmit = (e) => {
    if (e.key === "Enter") {
      // Handle reason submission logic if needed
      console.log("Reason: ", reason);
    }
  };

  useEffect(()=>{
      if(apdStatus === 'yes' || formQuestions.apdReason !== ""){
        setShowCamera(true)
        // startCamera()
      }else if (apdStatus === 'no' && formQuestions.apdReason === ""){
        setShowCamera(false)
        // stopCamera()
      }
    }, [apdStatus, formQuestions.apdReason])
  
    const handleSubmit = () => {
      console.log("form questions :", formQuestions)
      Swal.fire({
        title: "Submit confirmation",
        text: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Submit",
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Submitted!",
            text: result.value,
            icon: "success",
            confirmButtonColor: "#3085d6",
          });
        }
          
    });
    }

  return (
    <>
      <CCard className="h-100">
        <CCardHeader
          style={{
            backgroundColor: "#6482AD",
            color: "white",
            textAlign: "center",
          }}
        >
          <CCardTitle> INPUT VENDOR REQUREMENTS - CHEMICAL</CCardTitle>
        </CCardHeader>
        <CCardBody style={{ padding: "0 30px", paddingBottom: "0" }}>
          {activeItem.item1 &&
            !activeItem.item2 &&
            !activeItem.item3 &&
            !activeItem.item4 && (
              <CCardBody>
                <CRow className="mb-2">
                  <CCol>
                    <CCard className="p-3">
                      <CCol className="d-flex align-items-center">
                        <FontAwesomeIcon
                          icon={faPeopleCarryBox}
                          style={{
                            fontSize: "12px", // Larger icon size
                            border: "1px solid #000", // Circle border
                            borderRadius: "100%", // Make it round
                            padding: "6px", // Space inside the circle
                            marginRight: "7px", // Space between icon and span
                          }}
                        />
                        <span className="fs-4 fw-bold">
                          Identitas Vendor Driver
                        </span>
                      </CCol>
                      <span>Silahkan lengkapi identitas Anda</span>
                      <CRow>
                        <CFormText
                          style={{
                            fontStyle: "italic",
                            fontSize: "13px",
                            fontWeight: "bold",
                            marginTop: "10px",
                          }}
                        >
                          1. Vendor
                        </CFormText>
                        <CCol md="3">
                          <CFormText>Vendor Code</CFormText>
                          <CFormInput
                            type="text"
                            inputMode="numeric"
                            placeholder="Masukkan kode vendor"
                            value={formQuestions.vendorCode}
                            onChange={(e)=>setFormQuestions({ ...formQuestions, vendorCode: e.target.value})}
                          />
                        </CCol>
                        <CCol md="5">
                          <CFormText>Vendor Name</CFormText>
                          <CFormInput
                            type="text"
                            inputMode="numeric"
                            placeholder="Silakan masukkan kode vendor terlebih dahulu"
                            value={formQuestions.vendorName}
                            onChange={(e)=>setFormQuestions({ ...formQuestions, vendorName: e.target.value})}
                          />
                        </CCol>
                        <CCol md="3">
                          <CFormText>Truck Station</CFormText>
                          <CFormInput
                            type="text"
                            inputMode="numeric"
                            placeholder="Masukkan truck station"
                            value={formQuestions.truckStation}
                            onChange={(e)=>setFormQuestions({ ...formQuestions, truckStation: e.target.value})}
                          />
                        </CCol>
                        <CCol md='1' className="d-flex align-items-center justify-content-center">
                          { 
                            formQuestions.vendorCode !== "" && 
                            formQuestions.vendorName !== "" && 
                            formQuestions.truckStation !== "" 
                            ? 
                            <FontAwesomeIcon icon={faCheckSquare} style={{ fontSize: "30px", color: "green"}}/>
                            :
                            <FontAwesomeIcon icon={faXmarkSquare} style={{ fontSize: "30px", color: "red"}}/>
                          }
                        </CCol>
                      </CRow>
                      <hr />
                      <CRow className="mb-2">
                        <CFormText
                          style={{
                            fontStyle: "italic",
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                        >
                          2. Driver
                        </CFormText>
                          <CCol md="5">
                            <CFormText>Nama Driver</CFormText>
                            <CFormInput
                              type="text"
                              inputMode="numeric"
                              placeholder="Masukkan nama Anda"
                              value={formQuestions.driverName}
                              onChange={(e)=>setFormQuestions({ ...formQuestions, driverName: e.target.value})}
                            />
                          </CCol>
                          <CCol md="3">
                            <CFormText>
                              Apakah Anda Dalam Kondisi Sehat?
                            </CFormText>
                            <div>
                              <SelectButton
                                value={formQuestions.driverCondition}
                                onChange={(e)=>{
                                  if(e.value === 'no'){
                                    setFormQuestions({ ...formQuestions, driverCondition: e.value, driverSymptom: ""})
                                  } else {
                                    setFormQuestions({ ...formQuestions, driverCondition: e.value, driverSymptom: "-"})
                                  }
                                }}
                                options={[{ label: 'Ya', value: 'yes'}, { label: 'Tidak', value: 'no'}]}
                              />
                            </div>
                          </CCol>
                          <CCol md="3">
                            <CFormText>
                              Kondisi yang dirasakan apabila Tidak Sehat
                            </CFormText>
                            <CFormInput
                              type="text"
                              disabled={formQuestions.driverCondition === "yes"}
                              placeholder="Masukkan kondisi Anda"
                              value={formQuestions.driverSymptom}
                              onChange={(e)=>setFormQuestions({ ...formQuestions, driverSymptom: e.target.value})}
                            />
                          </CCol>
                          <CCol md='1' className="d-flex align-items-center justify-content-center">
                            { 
                              (formQuestions.driverName !== "" && 
                              formQuestions.driverCondition !== "" &&  
                              formQuestions.driverSymptom !== "") || (formQuestions.driverName !== "" && formQuestions.driverCondition === "yes") 
                              ? 
                              <FontAwesomeIcon icon={faCheckSquare} style={{ fontSize: "30px", color: "green"}}/>
                              :
                              <FontAwesomeIcon icon={faXmarkSquare} style={{ fontSize: "30px", color: "red"}}/>
                            }
                          </CCol>
                      </CRow>
                      <hr />
                      <CRow className="mb-2">
                        <CFormText
                          style={{
                            fontStyle: "italic",
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                        >
                          3. Vehicle
                        </CFormText>
                          <CCol md="6">
                            <CFormText>Tipe Pengiriman</CFormText>
                            <Select 
                              placeholder='Pilih pengiriman'
                              onChange={(e)=>setFormQuestions({ ...formQuestions, deliveryType: e !== null ? e.value : ""})}
                              value={optionsSelectDelivery.find((opt)=>opt.value === formQuestions.deliveryType) || ""}
                              options={optionsSelectDelivery}
                              />
                          </CCol>
                          <CCol md="5">
                            <CFormText>Jenis Kendaraan</CFormText>
                            <Select 
                              placeholder='Pilih kendaraan'
                              onChange={(e)=>setFormQuestions({ ...formQuestions, vehicleType: e !== null ? e.value : ""})}
                              value={optionsSelectVehicle.find((opt)=>opt.value === formQuestions.vehicleType) || ""}
                              options={optionsSelectVehicle}
                              />
                          </CCol>
                          <CCol md='1' className="d-flex align-items-center justify-content-center">
                            { 
                              formQuestions.deliveryType !== "" && 
                              formQuestions.vehicleType !== ""
                              ? 
                              <FontAwesomeIcon icon={faCheckSquare} style={{ fontSize: "30px", color: "green"}}/>
                              :
                              <FontAwesomeIcon icon={faXmarkSquare} style={{ fontSize: "30px", color: "red"}}/>
                            }
                          </CCol>
                        </CRow>
                      <hr />
                      <CCol className="d-flex justify-content-center gap-3 mb-2">
                        <CButton
                          color="secondary"
                          variant="outline"
                          className="mx-2"
                          onClick={() =>
                            setActiveItem({
                              item1: true,
                              item2: false,
                              item3: false,
                            })
                          }
                        >
                          Kembali
                        </CButton>
                        <CButton
                          
                          className="mx-2 btn-selanjutnya"
                          onClick={() =>
                            setActiveItem({
                              item1: true,
                              item2: true,
                              item3: false,
                            })
                          }
                        >
                          Selanjutnya
                        </CButton>
                      </CCol>
                    </CCard>
                  </CCol>
                </CRow>
              </CCardBody>
            )}

          {activeItem.item1 &&
            activeItem.item2 &&
            !activeItem.item3 &&
            !activeItem.item4 && (
              <CCardBody>
                <CRow className="mb-3">
                  <CCol>
                    <CCard className="p-3">
                      <CCol className="d-flex align-items-center">
                        <FontAwesomeIcon
                          icon={faTruck}
                          style={{
                            fontSize: "12px", // Larger icon size
                            border: "1px solid #000", // Circle border
                            borderRadius: "100%", // Make it round
                            padding: "6px", // Space inside the circle
                            marginRight: "7px", // Space between icon and span
                          }}
                        />
                        <span className="fs-4 fw-bold">
                          Identitas Kelengkapan Kendaraan
                        </span>
                      </CCol>
                      <span>Silahkan lengkapi identitas Anda</span>
                      <CRow>
                        <CFormText
                          style={{
                            fontStyle: "italic",
                            fontSize: "13px",
                            fontWeight: "bold",
                            marginTop: "10px",
                          }}
                        >
                          1. SIM
                        </CFormText>
                        <CCol md="5">
                          <CFormText>Apakah Anda Membawa SIM?</CFormText>
                          <div>
                            <SelectButton
                                value={formQuestions.driverLicense}
                                onChange={(e)=>{
                                  if(e.value === 'yes'){
                                    setFormQuestions({ ...formQuestions, driverLicense: e.value, licenseDuration: ""})
                                  }else{
                                    setFormQuestions({ ...formQuestions, driverLicense: e.value, licenseDuration: "-"}) 
                                  }
                                }}
                                options={[{ label: 'Ya', value: 'yes'}, { label: 'Tidak', value: 'no'}]}
                              />
                          </div>
                        </CCol>
                        <CCol md="6">
                          <CFormText>Berapa Jangka Waktu SIM Anda?</CFormText>
                          <CFormInput
                            type="text"
                            inputMode="numeric"
                            placeholder="Silahkan isi"
                            disabled={formQuestions.driverLicense !== 'yes'}
                            value={formQuestions.licenseDuration}
                            onChange={(e)=>setFormQuestions({ ...formQuestions, licenseDuration: e.target.value})}
                          />
                        </CCol>
                        <CCol md='1' className="d-flex align-items-center justify-content-center">
                          { 
                            formQuestions.driverLicense !== "" && 
                            formQuestions.licenseDuration !== "" 
                            ? 
                            <FontAwesomeIcon icon={faCheckSquare} style={{ fontSize: "30px", color: "green"}}/>
                            :
                            <FontAwesomeIcon icon={faXmarkSquare} style={{ fontSize: "30px", color: "red"}}/>
                          }
                        </CCol>
                      </CRow>
                      <hr />
                      <CRow className="">
                        <CFormText
                          style={{
                            fontStyle: "italic",
                            fontSize: "13px",
                            fontWeight: "bold",
                            marginTop: "10px",
                          }}
                        >
                          2. STNK
                        </CFormText>
                        <CCol md="5">
                          <CFormText>Apakah Anda Membawa STNK</CFormText>
                          <div>
                            <SelectButton
                              value={formQuestions.vehicleRegistration}
                              onChange={(e)=>{
                                if(e.value === 'yes'){
                                  setFormQuestions({ ...formQuestions, vehicleRegistration: e.value, registrationDuration: ""})
                                }else{
                                  setFormQuestions({ ...formQuestions, vehicleRegistration: e.value, registrationDuration: "-"})

                                }
                              }}
                              options={[{ label: 'Ya', value: 'yes'}, { label: 'Tidak', value: 'no'}]}
                            />
                          </div>
                        </CCol>

                        <CCol md="3">
                          <CFormText>
                            Kondisi STNK Anda
                          </CFormText>
                          <div>
                            <SelectButton
                              value={formQuestions.registrationCondition}
                              disabled={formQuestions.vehicleRegistration !== 'yes'}
                              onChange={(e)=>{
                                if(e.value === 'valid'){
                                  setFormQuestions({ ...formQuestions, registrationCondition: e.value, registrationDuration: ""})
                                } else {
                                  setFormQuestions({ ...formQuestions, registrationCondition: e.value, registrationDuration: '-'})

                                }
                              }}
                              options={[{ label: 'Hidup', value: 'valid'}, { label: 'Mati', value: 'invalid'}]}
                            />
                          </div>
                        </CCol>
                        <CCol md="3">
                          <CFormText>
                            Berapa lama Jangka Pajak STNK anda
                          </CFormText>
                          <CFormInput
                            type="text"
                            inputMode="numeric"
                            placeholder="Masukkan jangka waktu"
                            disabled={formQuestions.registrationCondition !== 'valid'}
                            value={formQuestions.registrationDuration}
                            onChange={(e)=>setFormQuestions({ ...formQuestions, registrationDuration: e.target.value})}
                          />
                        </CCol>
                          <CCol md='1' className="d-flex align-items-center justify-content-center">
                            { 
                              (formQuestions.vehicleRegistration !== "" && 
                              formQuestions.registrationCondition !== "" &&
                              formQuestions.registrationDuration) || (formQuestions.vehicleRegistration === "no") || (formQuestions.registrationCondition === 'invalid')
                              ? 
                              <FontAwesomeIcon icon={faCheckSquare} style={{ fontSize: "30px", color: "green"}}/>
                              :
                              <FontAwesomeIcon icon={faXmarkSquare} style={{ fontSize: "30px", color: "red"}}/>
                            }
                          </CCol>
                      </CRow>
                      <hr />
                      <CRow className="mb-">
                        <CFormText
                          style={{
                            fontStyle: "italic",
                            fontSize: "13px",
                            fontWeight: "bold",
                            marginTop: "10px",
                          }}
                        >
                          2. Plat No
                        </CFormText>
                        <CCol md="5">
                          <CFormText>
                            Apakah Plat No Polisi Anda Terpasang?
                          </CFormText>
                          <div>
                            <SelectButton
                                value={formQuestions.licensePlate}
                                onChange={(e)=>{
                                  if(e.value === 'yes'){
                                    setFormQuestions({ ...formQuestions, licensePlate: e.value, licensePlateDuration: ""})
                                  } else{
                                    setFormQuestions({ ...formQuestions, licensePlate: e.value, licensePlateDuration: "-"})
                                  }
                                }}
                                options={[{ label: 'Ya', value: 'yes'}, { label: 'Tidak', value: 'no'}]}
                              />
                          </div>
                        </CCol>
                        <CCol md="6">
                          <CFormText>
                            Berapakah Akhir Periode Plat No Polisi anda?
                          </CFormText>
                          <CFormInput
                            type="text"
                            inputMode="numeric"
                            placeholder="Silahkan isi"
                            disabled={formQuestions.licensePlate !== 'yes'}
                            value={formQuestions.licensePlateDuration}
                            onChange={(e)=>setFormQuestions({ ...formQuestions, licensePlateDuration: e.target.value})}
                          />
                        </CCol>
                        <CCol md='1' className="d-flex align-items-center justify-content-center">
                            { 
                              formQuestions.licensePlate!== "" && 
                              formQuestions.licensePlateDuration !== ""
                              ? 
                              <FontAwesomeIcon icon={faCheckSquare} style={{ fontSize: "30px", color: "green"}}/>
                              :
                              <FontAwesomeIcon icon={faXmarkSquare} style={{ fontSize: "30px", color: "red"}}/>
                            }
                          </CCol>
                      </CRow>
                      <hr />
                      <CCol className="d-flex justify-content-center gap-3">
                        <CButton
                          color="secondary"
                          variant="outline"
                          className="mx-2"
                          onClick={() =>
                            setActiveItem({
                              item1: true,
                              item2: false,
                              item3: false,
                            })
                          }
                        >
                          Kembali
                        </CButton>
                        <CButton
                          className="mx-2 btn-selanjutnya"
                          onClick={() =>
                            setActiveItem({
                              item1: true,
                              item2: true,
                              item3: true,
                            })
                          }
                        >
                          Selanjutnya
                        </CButton>
                      </CCol>
                    </CCard>
                  </CCol>
                </CRow>
              </CCardBody>
            )}

          {activeItem.item1 &&
            activeItem.item2 &&
            activeItem.item3 &&
            !activeItem.item4 && (
              <CCardBody style={{ height: "90%" }}>
                <CRow className="d-flex justify-content-center h-100">
                  <CCol md="8" className="h-100">
                    <CCard className="p-4 text-center h-100">
                      <CRow>
                        <CCol className="d-flex align-items-center justify-content-center">
                          <FontAwesomeIcon
                            icon={faHelmetSafety}
                            style={{
                              fontSize: "12px", // Larger icon size
                              border: "1px solid #000", // Circle border
                              borderRadius: "100%", // Make it round
                              padding: "6px", // Space inside the circle
                              marginRight: "7px", // Space between icon and span
                            }}
                          />
                          <span className="fs-4 fw-bold d-block">
                            Identitas Kelengkapan APD
                          </span>
                        </CCol>
                      </CRow>

                      {/* Pertanyaan APD */}
                      <CRow className="d-flex justify-content-center align-items-center mb-3 h-100">
                        <CCol md="6">
                          <CFormText className=" fw-bold">
                            Apakah Anda Memakai APD?
                          </CFormText>
                          <SelectButton
                            disabled={capturing}
                            value={apdStatus}
                            onChange={(e) => setApdStatus(e.value)}
                            options={[
                              { label: "Ya", value: "yes" },
                              { label: "Tidak", value: "no" },
                            ]}
                          />

                          {/* Input alasan jika pilih "Tidak" */}
                          {apdStatus === "no" && (
                            <CRow className="d-flex justify-content-center align-items-center mt-3">
                              <CCol md="12">
                                <CFormText>Alasan</CFormText>
                                <CFormInput
                                  type="text"
                                  placeholder="Masukkan alasan..."
                                  disabled={capturing}
                                  value={formQuestions.apdReason}
                                  onChange={(e) =>
                                    setFormQuestions({
                                      ...formQuestions,
                                      apdReason: e.target.value,
                                    })
                                  }
                                  // onChange={(e) => setReason(e.target.value)}
                                  onKeyDown={handleReasonSubmit}
                                />
                              </CCol>
                            </CRow>
                          )}
                        </CCol>
                        
                      </CRow>

                      

                      {(apdStatus === "yes" || formQuestions.apdReason !== "") && (
                        <CRow
                          className="px-2"
                          style={{ flex: 1, justifyContent: "center" }}
                        >
                          <CCard
                            style={{ height: "550px", width: "350px" }}
                            className="px-0"
                          >
                            <CCardBody>
                              {showCamera && !capturedImage && !capturing && (
                                <div className="d-flex flex-column justify-content-center align-items-center h-100">
                                  <FaCamera size={100} />
                                  <h6 className="text-center">
                                    Silakan tekan tombol untuk memulai
                                    pengecekan melalui kamera
                                  </h6>
                                </div>
                              )}

                              {showCamera && capturing && (
                                <div style={{ position: "relative" }}>
                                  <div className="d-flex justify-content-center">
                                    <div
                                      style={{
                                        width: "350px",
                                        height: "450px",
                                        border: "2px solid #1174c0",
                                        display: "flex",
                                        justifyContent: "end",
                                        alignItems: "end",
                                        backgroundColor: "#eee",
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      <video
                                        ref={videoRef}
                                        autoPlay
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </div>
                                    <canvas
                                      ref={canvasRef}
                                      style={{ display: "none" }}
                                    />
                                  </div>
                                  <h3
                                    style={{
                                      color: "red",
                                      textAlign: "center",
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      transform: "translateX(-50%)",
                                      fontSize: "72px",
                                    }}
                                  >
                                    {countdown}
                                  </h3>
                                </div>
                              )}

                              {capturedImage && (
                                <div className="d-flex justify-content-center">
                                  <div
                                    style={{
                                      width: "350px",
                                      height: "450px",
                                      border: "2px solid #1174c0",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      backgroundColor: "#eee",
                                      fontSize: "18px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    <img
                                      src={capturedImage}
                                      alt="Captured"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </CCardBody>
                            <CCardFooter className="d-flex justify-content-center">
                              <CButton
                                color="info"
                                style={{ color: "white" }}
                                disabled={capturing}
                                onClick={startCamera}
                              >
                                {capturedImage ? "Ulangi" : "Buka Kamera"}
                              </CButton>
                            </CCardFooter>
                          </CCard>
                        </CRow>
                      )}

                      {/* <hr /> */}
                      {/* Tombol Navigasi */}
                      <CCol className="d-flex justify-content-center gap-3 align-items-end mt-5 pb-5">
                        <CButton
                          color="secondary"
                          variant="outline"
                          disabled={capturing}
                          onClick={() =>
                            setActiveItem({
                              item1: true,
                              item2: true,
                              item3: false,
                              item4: false
                            })
                          }
                        >
                          Kembali
                        </CButton>
                        <CButton
                          className="btn-selanjutnya"
                          disabled={capturing}
                          onClick={()=>{
                            setActiveItem({
                              item1: true,
                              item2: true,
                              item3: true,
                              item4: true,
                            })
                          }}
                        >
                          Selanjutnya
                        </CButton>
                      </CCol>
                    </CCard>
                  </CCol>
                </CRow>
              </CCardBody>
            )}

          {activeItem.item1 &&
            activeItem.item2 &&
            activeItem.item3 &&
            activeItem.item4 && (
              <CCardBody>
                <CRow className="mb-2">
                  <CCol>
                    <CCard className="p-3">
                      <CCol className="d-flex justify-content-center-start">
                        <FontAwesomeIcon
                          icon={faFill}
                          style={{
                            fontSize: "12px", // Larger icon size
                            border: "1px solid #000", // Circle border
                            borderRadius: "100%", // Make it round
                            padding: "6px", // Space inside the circle
                            marginRight: "7px", // Space between icon and span
                          }}
                        />
                        <span className="fs-5 fw-bold">
                          Identitas Chemical
                        </span>
                      </CCol>
                      <span>Silahkan lengkapi identitas Anda</span>
                      <CRow>
                        <CCol md="5">
                          <CFormText>Apakah Anda Membawa Seal ?</CFormText>
                          <div>
                            <SelectButton
                                value={formQuestions.seal}
                                onChange={(e)=>setFormQuestions({ ...formQuestions, seal: e.value})}
                                options={[{ label: 'Ya', value: 'yes'}, { label: 'Tidak', value: 'no'}]}
                              />
                          </div>
                        </CCol>
                      </CRow>

                      <hr />
                      <CRow>
                        <CCol md="5">
                          <CFormText>
                            Apakah Anda Membawa Barang Tidak Tumpah?
                          </CFormText>
                          <div>
                              <SelectButton
                                value={formQuestions.notSpilled}
                                onChange={(e)=>setFormQuestions({ ...formQuestions, notSpilled: e.value})}
                                options={[{ label: 'Ya', value: 'yes'}, { label: 'Tidak', value: 'no'}]}
                              />
                          </div>
                        </CCol>
                      </CRow>
                      <hr />
                      <CRow>
                        <CCol md="5">
                          <CFormText>
                            Apakah Anda Memastikan tidak memebawa alat/barang
                            yang dapat menyebabkan kebakaran ?
                          </CFormText>
                          <div>
                            <SelectButton
                              value={formQuestions.flammable}
                              onChange={(e)=>setFormQuestions({ ...formQuestions, flammable: e.value})}
                              options={[{ label: 'Ya', value: 'yes'}, { label: 'Tidak', value: 'no'}]}
                              />
                          </div>
                        </CCol>
                      </CRow>
                      <hr />
                      <CRow>
                        <CCol md="5">
                          <CFormText>
                            Apakah Anda Memastikan Barang Chemical yang ada
                            bawa tidak membuang ke saluran air ?
                          </CFormText>
                          <div>
                            <SelectButton
                                value={formQuestions.noWaterways}
                                onChange={(e)=>setFormQuestions({ ...formQuestions, noWaterways: e.value})}
                                options={[{ label: 'Ya', value: 'yes'}, { label: 'Tidak', value: 'no'}]}
                              />
                          </div>
                        </CCol>
                      </CRow>

                      <CCol className="d-flex justify-content-center gap-3 mb-2 mt-4">
                        <CButton
                          color="secondary"
                          variant="outline"
                          className="mx-2"
                          onClick={() =>
                            setActiveItem({
                              item1: true,
                              item2: true,
                              item3: true,
                              item4: false,
                            })
                          }
                        >
                          Kembali
                        </CButton>
                        <CButton
                          color="info"
                          style={{ color: "white" }}
                          className="mx-2"
                          onClick={handleSubmit}
                        >
                          Submit
                        </CButton>
                      </CCol>
                    </CCard>
                  </CCol>
                </CRow>
              </CCardBody>
            )}
          <CRow className={`d-flex justify-content-${activeItem.item1 && !activeItem.item2 && !activeItem.item3 && !activeItem.item4 ? 'between' : 'end'}`}>
            { activeItem.item1 && !activeItem.item2 && !activeItem.item3 && !activeItem.item4 && (
              <CCol>
                <CButton className="d-flex align-items-center gap-3 mb-3" onClick={()=>navigate('/vendor/input/requirement')}>
                  <FaArrowLeft/>
                  Kembali
                </CButton>
              </CCol>
            )}
            <CCol md="auto">
              <CBreadcrumb>
                <CBreadcrumbItem
                  active={activeItem.item1}
                  onClick={() =>
                    setActiveItem({
                      item1: true,
                      item2: false,
                      item3: false,
                      item4: false,
                    })
                  }
                >
                  <span
                    style={{
                      border: "1px solid black",
                      borderRadius: "100%",
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                  >
                    1
                  </span>
                </CBreadcrumbItem>
                <CBreadcrumbItem
                  active={activeItem.item2}
                  onClick={() =>
                    setActiveItem({
                      item1: true,
                      item2: true,
                      item3: false,
                      item4: false,
                    })
                  }
                >
                  <span
                    style={{
                      border: "1px solid black",
                      borderRadius: "100%",
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                  >
                    2
                  </span>
                </CBreadcrumbItem>
                <CBreadcrumbItem
                  active={activeItem.item3}
                  onClick={() =>
                    setActiveItem({
                      item1: true,
                      item2: true,
                      item3: true,
                      item4: false,
                    })
                  }
                >
                  <span
                    style={{
                      border: "1px solid black",
                      borderRadius: "100%",
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                  >
                    3
                  </span>
                </CBreadcrumbItem>
                <CBreadcrumbItem
                  active={activeItem.item4}
                  onClick={() =>
                    setActiveItem({
                      item1: true,
                      item2: true,
                      item3: true,
                      item4: true,
                    })
                  }
                >
                  <span
                    style={{
                      border: "1px solid black",
                      borderRadius: "100%",
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                  >
                    4
                  </span>
                </CBreadcrumbItem>
              </CBreadcrumb>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  );
};

export default InputChemical;
