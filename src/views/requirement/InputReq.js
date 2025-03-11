import React, { useState, useEffect, useRef} from 'react'
import { CButton, CTooltip, CButtonGroup, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CFormInput, CFormLabel, CFormText, CInputGroup, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToaster, CSpinner, CCardText, CBreadcrumb, CBreadcrumbItem, CAccordionButton, CFormCheck, CCardFooter } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench,faOilCan} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'
import { FaCamera, FaGear, FaOilCan, FaWrench } from 'react-icons/fa6';
import { RadioButton } from 'primereact/radiobutton';

const Input = () => {
  const navigate = useNavigate()
  const [ activeItem, setActiveItem ] = useState({
      item1: true,
      item2: false,
      item3: false,
      item4: false,
      item5: false,
    }) 

  return (
    <>
      <CCard className='p-0' style={{ border: "1px solid #6482AD", height: "100%"}}>
        <CCardHeader style={{backgroundColor: "#6482AD", color: "white", textAlign: "center"}}>
          <CCardTitle>VENDOR REQUREMENTS</CCardTitle>
        </CCardHeader>
        <CCardBody className='d-flex flex-column align-items-center'>
          <h3>Jenis Material</h3>
          <CFormLabel>
            Silakan pilih jenis material yang Anda bawa
          </CFormLabel>
          <div className='d-flex flex-column flex-sm-column flex-md-column flex-lg-row h-100 w-100 gap-4 p-md-5 p-0' >
            <div onClick={()=>navigate('/vendor/input/requirement-consumable')} className='card-req consumable d-flex flex-column justify-content-center align-items-center' style={{cursor: "pointer", border: '2px solid black', borderRadius: "20px", height: "100%", width: "100%"}}>
              <FontAwesomeIcon icon={faWrench} style={{ fontSize: "150px", padding: "25px"}}/>
              <h4>Consumable</h4>
              <CFormLabel>Material basic yang digunakan untuk produksi</CFormLabel>
            </div>
            <div onClick={()=>navigate('/vendor/input/requirement-chemical')} className='card-req chemical d-flex flex-column justify-content-center align-items-center' style={{cursor: "pointer", border: '2px solid black', borderRadius: "20px", height: "100%", width: "100%"}}>
              <FontAwesomeIcon icon={faOilCan} style={{ fontSize: "200px"}}/>
              <h4>Chemical</h4>
              <CFormLabel>Material basic yang digunakan untuk produksi</CFormLabel>
            </div>
          </div>
        </CCardBody>
      </CCard>
    </>   
  )
}

export default Input

// import React, { useState, useEffect, useRef} from 'react'
// import { CButton, CTooltip, CButtonGroup, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CFormInput, CFormLabel, CFormText, CInputGroup, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToaster, CSpinner, CCardText, CBreadcrumb, CBreadcrumbItem, CAccordionButton, CFormCheck, CCardFooter } from '@coreui/react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faWrench,faOilCan} from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from 'react-router-dom'
// import { FaCamera, FaGear, FaOilCan, FaWrench } from 'react-icons/fa6';
// import { RadioButton } from 'primereact/radiobutton';

// const Input = () => {
//   const navigate = useNavigate()
//   const [ activeItem, setActiveItem ] = useState({
//       item1: true,
//       item2: false,
//       item3: false,
//       item4: false,
//       item5: false,
//     }) 

//   const [selectedType, setSelectedType] = useState('')

//   const [showCamera, setShowCamera] = useState(false);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [countdown, setCountdown] = useState(null);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   const startCamera = async () => {
//     setShowCamera(true);
//     setCapturedImage(null);
//     setCountdown(5);

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }

//       // Start countdown
//       let counter = 5;
//       const interval = setInterval(() => {
//         counter -= 1;
//         setCountdown(counter);
//         if (counter === 0) {
//           clearInterval(interval);
//           captureImage();
//         }
//       }, 1000);
//     } catch (error) {
//       console.error("Error accessing camera:", error);
//     }
//   };

//   const captureImage = () => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     if (video && canvas) {
//       // Set canvas size to match video size
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;

//       const context = canvas.getContext("2d");
//       context.drawImage(video, 0, 0, canvas.width, canvas.height);
//       setCapturedImage(canvas.toDataURL("image/png"));

//       // Stop the camera
//       const stream = video.srcObject;
//       const tracks = stream.getTracks();
//       tracks.forEach((track) => track.stop());
//       setShowCamera(false);
//     }
//   };

//   return (
//     <>
//       <CCard className='p-0' style={{ border: "1px solid #6482AD", height: "100%"}}>
//         <CCardHeader style={{backgroundColor: "#6482AD", color: "white", textAlign: "center"}}>
//           <CCardTitle>VENDOR REQUREMENTS</CCardTitle>
//         </CCardHeader>
//         <CCardBody className='mt-1 mb-1 d-flex flex-column'>
//           <CBreadcrumb className='mb-4'>
//             <CBreadcrumbItem active={activeItem.item1} onClick={()=>setActiveItem({ item1: true, item2: false, item3: false, item4: false, item5: false})}><span style={{border: "2px solid black", borderRadius: "100%", padding: "10px 15px", cursor: "pointer"}}>1</span></CBreadcrumbItem>
//             <CBreadcrumbItem active={activeItem.item2} onClick={()=>setActiveItem({ item1: true, item2: true, item3: false, item4: false, item5: false})}><span style={{border: "2px solid black", borderRadius: "100%", padding: "10px 15px", cursor: "pointer"}}>2</span></CBreadcrumbItem>
//             <CBreadcrumbItem active={activeItem.item3} onClick={()=>setActiveItem({ item1: true, item2: true, item3: true, item4: false, item5: false})}><span style={{border: "2px solid black", borderRadius: "100%", padding: "10px 15px", cursor: "pointer"}}>3</span></CBreadcrumbItem>
//             <CBreadcrumbItem active={activeItem.item4} onClick={()=>setActiveItem({ item1: true, item2: true, item3: true, item4: true, item5: false})}><span style={{border: "2px solid black", borderRadius: "100%", padding: "10px 15px", cursor: "pointer"}}>4</span></CBreadcrumbItem>
//             <CBreadcrumbItem active={activeItem.item5} onClick={()=>setActiveItem({ item1: true, item2: true, item3: true, item4: true, item5: true})}><span style={{border: "2px solid black", borderRadius: "100%", padding: "10px 15px", cursor: "pointer"}}>5</span></CBreadcrumbItem>
//           </CBreadcrumb>
          
//           {activeItem.item1 && !activeItem.item2 && (
//             <CRow style={{ flex: 1}}>
//               <CCol className='px-4 d-flex flex-column justify-content-between' style={{ flex: 1}}>
//                 <CRow>
//                     <h4>Identitas Vendor</h4>
//                     <CCol sm='auto'>
//                       <CFormText>Kode Vendor</CFormText>
//                       <CFormInput placeholder='Masukkan kode vendor'/>
//                     </CCol>
//                     <CCol>
//                       <CFormText>Nama Vendor</CFormText>
//                       <CFormInput disabled/>
//                     </CCol>
//                 </CRow>

//                 <CRow>
//                   <CRow>
//                     <h4>Identitas Driver</h4>
//                     <CCol>
//                       <CFormText>Nama Driver</CFormText>
//                       <CFormInput placeholder='Masukkan nama'/>
//                     </CCol>
//                     <CCol>
//                       <CFormText>Kondisi Kesehatan</CFormText>
//                       <div className='d-flex gap-3'>
//                         <CFormCheck
//                           button={{ color: 'secondary', variant: 'outline' }}
//                           type="radio"
//                           name="options-outlined"
//                           id="success-outlined"
//                           autoComplete="off"
//                           label="Sehat"
//                         />
//                         <CFormCheck
//                           button={{ color: 'secondary', variant: 'outline' }}
//                           type="radio"
//                           name="options-outlined"
//                           id="danger-outlined"
//                           autoComplete="off"
//                           label="Tidak sehat"
//                         />
//                       </div>
//                     </CCol>
//                   </CRow>
//                   <CRow className='mt-2'>
//                     <CCol>
//                       <CFormText>Kondisi apabila tidak sehat</CFormText>
//                       <CFormInput placeholder='Masukkan kondisi anda'/>
//                     </CCol>
//                   </CRow>
//                 </CRow>

//                 <CRow>
//                   <h4>Identitas Kendaraan</h4>
//                   <CCol>
//                     <CFormText>Tipe Pengiriman</CFormText>
//                     <CFormInput placeholder='Masukkan tipe pengiriman'/>
//                   </CCol>
//                   <CCol>
//                     <CFormText>Tipe Kendaraan</CFormText>
//                     <CFormInput placeholder='Masukkan tipe kendaraan'/>
//                   </CCol>
//                 </CRow>
//               </CCol>
//               <CCol className='d-flex flex-column'>
//                 <CRow>
//                   <h4>Kelengkapan Driver</h4>
//                 </CRow>
//                 <CRow className='px-2' style={{ flex: 1}}>
//                   <CCard style={{ height: "100%"}} className='px-0'>
//                       <CCardBody>
//                         {!showCamera && !capturedImage && (
//                           <div className='d-flex flex-column justify-content-center align-items-center h-100'>
//                             <FaCamera size={100}/>
//                             <h6 className='text-center'>Silakan tekan tombol untuk memulai pengecekan melalui kamera</h6>
//                           </div>
//                         )}

//                         {showCamera && (
//                           <div>
//                             <video ref={videoRef} autoPlay style={{ width: "100%", height: "100%" }} />
//                             <canvas ref={canvasRef} style={{ display: "none" }} />
//                             <h3 style={{ color: "red", textAlign: "center"}}>{countdown}</h3>
//                           </div>
//                         )}

//                         {capturedImage && (
//                           <div>
//                             <img src={capturedImage} alt="Captured" style={{ width: "100%", height: "100%" }} />
//                           </div>
//                         )}
//                       </CCardBody>
//                       <CCardFooter className='d-flex justify-content-center'>
//                         <CButton color='info' style={{ color: 'white'}} disabled={showCamera} onClick={startCamera}>
//                           { capturedImage ? "Ulangi" : "Buka Kamera" }
//                         </CButton>
//                       </CCardFooter>
//                   </CCard>
//                 </CRow>
//               </CCol>
//             </CRow>
//           )}

//           {activeItem.item2 && !activeItem.item3 && (
//             <CRow className='px-2' style={{ flex: 1}}>
//               <h4>Identitas Kelengkapan Kendaraan</h4>
//               <CRow className='mb-3'>
//                 <CCol>
//                   <CFormText>Apakah Anda membawa SIM?</CFormText>
//                   <div className='d-flex gap-3'>
//                       <CFormCheck
//                         button={{ color: 'secondary', variant: 'outline' }}
//                         type="radio"
//                         name="sim"
//                         id="success-sim"
//                         autoComplete="off"
//                         label="Ya"
//                       />
//                       <CFormCheck
//                         button={{ color: 'secondary', variant: 'outline' }}
//                         type="radio"
//                         name="sim"
//                         id="danger-sim"
//                         autoComplete="off"
//                         label="Tidak"
//                       />
//                     </div>
//                 </CCol>
//                 <CCol>
//                   <CFormText>Berapa lama jangka waktu SIM</CFormText>
//                   <CFormInput placeholder='Masukkan jangka lama'/>
//                 </CCol>
//               </CRow>
//               <CRow className='mb-3'>
//                 <CCol>
//                   <CFormText>Apakah Anda membawa STNK?</CFormText>
//                   <div className='d-flex gap-3'>
//                       <CFormCheck
//                         button={{ color: 'secondary', variant: 'outline' }}
//                         type="radio"
//                         name="stnk"
//                         id="success-stnk"
//                         autoComplete="off"
//                         label="Ya"
//                       />
//                       <CFormCheck
//                         button={{ color: 'secondary', variant: 'outline' }}
//                         type="radio"
//                         name="stnk"
//                         id="danger-stnk"
//                         autoComplete="off"
//                         label="Tidak"
//                       />
//                     </div>
//                 </CCol>
//                 <CCol>
//                   <CFormText>Berapa lama jangka waktu STNK</CFormText>
//                   <CFormInput placeholder='Masukkan jangka lama'/>
//                 </CCol>
//               </CRow>
//               <CRow className='mb-3'>
//                 <CCol>
//                   <CFormText>Apakah Anda membawa Plat No Polisi?</CFormText>
//                   <div className='d-flex gap-3'>
//                       <CFormCheck
//                         button={{ color: 'secondary', variant: 'outline' }}
//                         type="radio"
//                         name="nopol"
//                         id="success-nopol"
//                         autoComplete="off"
//                         label="Ya"
//                       />
//                       <CFormCheck
//                         button={{ color: 'secondary', variant: 'outline' }}
//                         type="radio"
//                         name="nopol"
//                         id="danger-nopol"
//                         autoComplete="off"
//                         label="Tidak"
//                       />
//                     </div>
//                 </CCol>
//                 <CCol>
//                   <CFormText>Berapa akhir periode Plat No Polisi</CFormText>
//                   <CFormInput placeholder='Masukkan jangka lama'/>
//                 </CCol>
//               </CRow>
//             </CRow>
//           )}

//           {activeItem.item3 && !activeItem.item4 && (
//             <CRow className='px-2 d-flex align-items-start flex-column' style={{ minHeight: "400px"}}>
//               <CRow>
//                 <h4>Jenis Material</h4>
//                 <CFormText>Silahkan pilih jenis material</CFormText>
//                 <CCol sm='auto'>
//                   <label className="d-flex align-items-center gap-2 p-3" htmlFor="consumable" style={{ border: "1px solid gray", borderRadius: "5px", cursor: "pointer"}}>
//                       <RadioButton inputId="consumable" name="material1" value="Consumable" />
//                       <label htmlFor="consumable" style={{ cursor: "pointer" }}>Consumable</label>
//                   </label>
//                 </CCol>
//                 <CCol sm='auto'>
//                   <label className="d-flex align-items-center gap-2 p-3" htmlFor="chemical" style={{ border: "1px solid gray", borderRadius: "5px", cursor: "pointer"}}>
//                       <RadioButton inputId="chemical" name="material2"  />
//                       <label htmlFor="chemical" style={{ cursor: "pointer" }}>Chemical</label>
//                   </label>
//                 </CCol>
//               </CRow>

//               <CRow className='px-2 d-flex flex-column mt-5'>
//                 <h4>Pertanyaan Material</h4>
//                 <p>Silakan pilih jenis material terlebih dahulu</p>
//               </CRow>
//             </CRow>
//           )}

//           {activeItem.item4 && !activeItem.item5 && (
//             <CRow className='px-2' style={{ minHeight: "400px"}}>
//               <h4>Pertanyaan Material</h4>
//             </CRow>
//           )}

//           {activeItem.item5 && (
//             <CRow className='px-2' style={{ minHeight: "400px"}}>
//               <h4>Ringkasan</h4>
//             </CRow>
//           )}


//           <div className='d-flex justify-content-center gap-3 mt-4'>
//             <CButton 
//               color='info' 
//               style={{ color: "white"}} 
//               onClick={()=>{
//                 if(activeItem.item1 && activeItem.item2 && activeItem.item3 && activeItem.item4 && activeItem.item5){
//                   setActiveItem({item1: true, item2: true, item3: true, item4: true, item5: false})
//                 }else if(activeItem.item1 && activeItem.item2 && activeItem.item3 && activeItem.item4){
//                   setActiveItem({item1: true, item2: true, item3: true, item4: false, item5: false})
//                 }else if(activeItem.item1 && activeItem.item2 && activeItem.item3){
//                   setActiveItem({item1: true, item2: true, item3: false, item4: false, item5: false})
//                 }else if(activeItem.item1 && activeItem.item2){
//                   setActiveItem({item1: true, item2: false, item3: false, item4: false, item5: false})
//                 }else if(activeItem.item1){
//                   setActiveItem({item1: true, item2: false, item3: false, item4: false, item5: false})
//                 }
                
//             }}>Kembali</CButton>
//             <CButton 
//               color='info' 
//               style={{ color: "white"}} 
//               onClick={()=>{
//                 if(activeItem.item1 && activeItem.item2 && activeItem.item3 && activeItem.item4){
//                   setActiveItem({item1: true, item2: true, item3: true, item4: true, item5: true})
//                 }else if(activeItem.item1 && activeItem.item2 && activeItem.item3){
//                   setActiveItem({item1: true, item2: true, item3: true, item4: true, item5: false})
//                 }else if(activeItem.item1 && activeItem.item2){
//                   setActiveItem({item1: true, item2: true, item3: true, item4: false, item5: false})
//                 }
//                 else if(activeItem.item1){
//                   setActiveItem({item1: true, item2: true, item3: false, item4: false, item5: false})
//                 }
//             }}>Selanjutnya</CButton>
//           </div>
//         </CCardBody>
//       </CCard>
//     </>   
//   )
// }

// export default Input