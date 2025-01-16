import React, { useState, useEffect, useRef} from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CFormInput, CFormLabel, CFormText, CInputGroup, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToaster } from '@coreui/react'
import { dataReceivingDummy } from '../../utils/DummyData'
import Select, {components} from 'react-select'
import Pagination from '../../components/Pagination'
import TemplateToast from '../../components/TemplateToast'
import { handleExport } from '../../utils/ExportToExcel'

const Receiving = () => {
  const [ dataReceiving, setDataReceiving ] = useState(dataReceivingDummy)
  const [ showModalUpdate, setShowModalUpdate] = useState(false)
  const [ materialByDN, setMaterialByDN ] = useState({
    dn_no: "",
    material_desc: "",
    rack_address: "",
    list: {
      material_desc: [],
      rack_address: [],
    },
    actual_qty: "",
  })
  const [errMsg, setErrMsg] = useState('')
  const [toast, addToast] = useState()
  const toaster = useRef(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems =
    dataReceiving.length > 0
          ? dataReceiving.slice(indexOfFirstItem, indexOfLastItem)
          : dataReceiving.slice(indexOfFirstItem, indexOfLastItem)

  useEffect(()=>{
     const currentItems = dataReceiving.length > 0
        ? dataReceiving.slice(indexOfFirstItem, indexOfLastItem)
        : dataReceiving.slice(indexOfFirstItem, indexOfLastItem)
  }, [currentPage])


  const getDataReceiving = () => {
    setDataReceiving(dataReceivingDummy)
  }


  
  
  const handleSubmitReceiving = (data) => {
    console.log("data to be submitted :", data)
    setDataReceiving(dataReceivingDummy)
    setMaterialByDN({
      dn_no: "",
      material_desc: "",
      rack_address: "",
      list: {
        material_desc: [],
        rack_address: [],
      },
      actual_qty: "",
    })
    addToast(TemplateToast("success", "success", "Data receiving has been submitted!"))
  }
  
  // const optionsSelectDN = Array.from(
  //   new Set(dataReceivingDummy.map((data) => data.dn_no))
  // ).map((uniqueValue) => {
  //   return {
  //     value: uniqueValue,
  //     label: uniqueValue,
  //   };
  // });
  
  const optionsSelectMaterial = dataReceivingDummy.filter((data)=>data.dn_no === materialByDN.dn_no).map(
    (data)=>{
      return{
        label: `${data.material_desc} - ${data.rack_address}`, 
        value: {
          material: data.material_desc,
          rack: data.rack_address,
        }
      } 
  })


    // const optionsSelectRack = dataReceivingDummy.flatMap((data) => {
    //   if (data.material_desc === materialByDN.material_desc) {
    //     if (data.rack_address !== "") {
    //       // If the material has a rack_address, use it
    //       return {
    //         label: data.rack_address,
    //         value: data.rack_address,
    //       };
    //     } else {
    //       // If rack_address is empty, return all unique rack_address from dataReceivingDummy
    //       return Array.from(
    //         new Set(
    //           dataReceivingDummy
    //             .map((item) => item.rack_address)
    //             .filter((rack) => rack !== "") // Filter out empty rack addresses
    //         )
    //       ).map((uniqueRack) => ({
    //         label: uniqueRack,
    //         value: uniqueRack,
    //       }));
    //     }
    //   }
    //   return []; // No match, return an empty array
    // });
    
    
    const handleEnterInputDN = (e) => {
      if(e){
        const listSelectedData = dataReceivingDummy.filter((data)=>data.dn_no === e.target.value)
        if(listSelectedData.length !== 0){
          setErrMsg('')
          console.log("list selected data :", listSelectedData)
          // setMaterialByDN({ ...materialByDN, dn_no: e.value, list_material_desc: listSelectedData.map((data)=>data.material_desc), list_rack_address: listSelectedData.map((data)=>data.rack_address)})
          if(listSelectedData.length === 1){
            setMaterialByDN({ ...materialByDN, dn_no: e.target.value, material_desc: listSelectedData[0].material_desc, rack_address: listSelectedData[0].rack_address, list: {material_desc: listSelectedData.map((data)=>data.material_desc), rack_address: listSelectedData.map((data)=>data.rack_address)} })
          }else{
            setMaterialByDN({ ...materialByDN, dn_no: e.target.value, rack_address: listSelectedData[0].rack_address, list: {material_desc: listSelectedData.map((data)=>data.material_desc), rack_address: listSelectedData.map((data)=>data.rack_address)} })
          }
        } else{
          // setErrMsg('DN No is invalid. Material not found!')
          setMaterialByDN({ ...materialByDN, list: { material_desc: [], rack_address: []}, material_desc: "", rack_address: ""})
        }
      } else{
        setMaterialByDN({ ...materialByDN, dn_no: "", list: { material_desc: [], rack_address: []}, material_desc: "", rack_address: ""})
        
      }
    }

  const handleChangeInputDN = (e) => {
    const listSelectedData = dataReceivingDummy.filter((data)=>data.dn_no === e.target.value)
    console.log("found material :", listSelectedData)

    if(listSelectedData.length !== 0){
      // if there is no duplicate material in a same DN
      setErrMsg('')
      if(listSelectedData.length === 1){
        setMaterialByDN({ ...materialByDN, dn_no: e.target.value, material_desc: listSelectedData[0].material_desc, rack_address: listSelectedData[0].rack_address , list: { material_desc: listSelectedData.map((data)=>data.material_desc), rack_address: listSelectedData.map((data)=>data.rack_address)}})
      } 
      // if there is duplicate
      else{
        setMaterialByDN({ ...materialByDN, dn_no: e.target.value, list: { material_desc: listSelectedData.map((data)=>data.material_desc), rack_address: listSelectedData.map((data)=>data.rack_address)}, material_desc: "", rack_address: ""})
      }
    } 
    // if material not found
    else{
      setErrMsg('DN No is invalid. Material not found!')
      setMaterialByDN({ ...materialByDN, dn_no: e.target.value, list: { material_desc: [], rack_address: []}, material_desc: "", rack_address: ""})
    }

    if(e.target.value === ""){
      setErrMsg('')
    }
  }

  const handleClearInputDN = () => {
    setErrMsg('')
    setMaterialByDN({ ...materialByDN, dn_no: '', list: { material_desc: [], rack_address: []}, material_desc: "", rack_address: ""})
  }

  const handleChangeInputMaterial = (e) => {
    if(e){
      setMaterialByDN({ ...materialByDN, material_desc: e.value.material, rack_address: e.value.rack})
    } else{
      setMaterialByDN({ ...materialByDN, material_desc: "", rack_address: ""})
    }
  }

  // const handleChangeInputRack = (e) => {
  //   if(e){
  //     setMaterialByDN({ ...materialByDN, rack_address: e.value.rack, material_desc: e.value.material})
  //   } else{
  //     setMaterialByDN({ ...materialByDN, rack_address: "", material_desc: ""})
  //   }
  // }

  
  useEffect(()=>{
    getDataReceiving()
    // console.log("materialDN :", materialByDN)
  }, [])

  return (
    <CContainer fluid>
        <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
        <CRow>
            <CCard className='p-0'>
                <CCardHeader>
                    <CCardTitle>INPUT</CCardTitle>
                </CCardHeader>
                <CCardBody>
                  <CRow className='mb-3'>
                    <CCol md={4} style={{ position: "relative"}}>
                        <CFormText>DN No</CFormText>
                        <div style={{ position: "relative"}}>
                          <CFormInput 
                            placeholder='Insert DN Number'
                            value={materialByDN.dn_no}
                            onKeyDown={
                              (e)=>{
                                if(e.key === 'Enter'){
                                  console.log('here')
                                  handleEnterInputDN(e)
                                }
                              }
                            }
                            // value={materialByDN.dn_no} 
                            onChange={handleChangeInputDN}
                            />
                            { materialByDN.dn_no !== '' && 
                              <CButton onClick={()=>handleClearInputDN()} className='p-0 px-1' style={{border: "0", position: "absolute", top: '50%', right: '10px', translate: "0 -50%"}}>
                                <CIcon icon={icon.cilX}/> 
                              </CButton>
                            }
                        </div>
                          <CFormText style={{ color: "red", opacity: '75%'}}>{errMsg}</CFormText>
                        {/* <Select 
                          //  menuIsOpen={false}
                          //  onMenuOpen={null}
                          //  pageSize={2}
                           openMenuOnFocus={false}
                           openMenuOnClick={false}
                           isClearable value={optionsSelectDN.find(option => option.value === materialByDN.dn_no) || null} options={optionsSelectDN} onChange={handleChangeInputDN} className='w-100' placeholder='Search DN No'/> */}
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={4}>
                        <CFormText>Material</CFormText>
                        <Select isClearable isDisabled={materialByDN.list.material_desc.length === 0 } value={optionsSelectMaterial.find(option => option.value.material === materialByDN.material_desc) || null} options={optionsSelectMaterial} onChange={handleChangeInputMaterial} className='w-100' placeholder='Select material'/>
                    </CCol>
                    <CCol md={4} className='pt-md-0 pt-3'>
                      <CFormText>Rack Address</CFormText>
                      <CFormInput disabled value={materialByDN.rack_address} className='w-100' placeholder='Rack address material'/>
                      {/* <Select isClearable isDisabled value={optionsSelectRack.find(option => option.value.rack === materialByDN.rack_address) || null} options={optionsSelectRack} onChange={handleChangeInputRack} className='w-100' placeholder='Select rack address'/> */}
                    </CCol>
                    <CCol md={2} xs={6} className='pt-md-0 pt-3'>
                      <CFormText>Quantity</CFormText>
                        <CInputGroup>
                          <CFormInput type='number' inputMode='numeric' disabled={materialByDN.dn_no === '' || materialByDN.material_desc === ''} value={materialByDN.actual_qty} onChange={(e)=>setMaterialByDN({...materialByDN, actual_qty: e.target.value})}/>
                        </CInputGroup>
                    </CCol>
                    <CCol md={2} xs={6} className='d-flex justify-content-end align-items-end'>
                      <CButton 
                        disabled={materialByDN.dn_no === "" || materialByDN.material_desc === "" || materialByDN.rack_address === ""} 
                        onClick={()=>handleSubmitReceiving(materialByDN)} 
                        // color={`${materialByDN.dn_no === "" || materialByDN.material_desc === "" || materialByDN.rack_address === "" ? "warning" : "success"}`} 
                        color='success'
                        style={{color: 'white'}} 
                        className='flex-grow-0 d-flex align-items-center gap-2'
                        >
                          { materialByDN.dn_no === "" || materialByDN.material_desc === "" || materialByDN.rack_address === "" ? <CIcon icon={icon.cilX}/> : <CIcon icon={icon.cilCheckAlt}/>}
                          <div style={{border: "0.5px solid white", height: "10px", width: "2px"}}></div>
                          <span>Submit</span>
                      </CButton>
                    </CCol>
                  </CRow>
                </CCardBody>
            </CCard>
        </CRow>
        <CRow className='pt-4'>
          <CCard className='p-0'>
            <CCardHeader>
              <CCardTitle>RECEIVING DATA</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs='auto'>
                  <CButton color='info' style={{color: 'white'}} onClick={()=>setShowModalUpdate(true)} className='flex-grow-0 d-flex align-items-center gap-2'>
                    <CIcon icon={icon.cilCloudUpload}/>
                    <div style={{border: "0.5px solid white", height: "10px", width: "1px"}}></div>
                    <span>Upload a File</span>
                  </CButton>
                </CCol>
                <CCol>
                  <CButton onClick={()=>handleExport(dataReceiving, 'receiving')} color='success' style={{color: 'white'}} className='flex-grow-0 d-flex align-items-center gap-2'>
                    <CIcon icon={icon.cilCloudDownload}/>
                    <div style={{border: "0.5px solid white", height: "10px", width: "1px"}}></div>
                    <span>Export to File</span>
                  </CButton>
                </CCol>
              </CRow>
              <CRow className='p-2 pt-3'>
                <CTable bordered>
                  <CTableHead color='light'>
                    <CTableRow>
                      <CTableHeaderCell>DN No</CTableHeaderCell>
                      <CTableHeaderCell>Material No</CTableHeaderCell>
                      <CTableHeaderCell>Material Description</CTableHeaderCell>
                      <CTableHeaderCell>Rack Address</CTableHeaderCell>
                      <CTableHeaderCell>Planning Quantity</CTableHeaderCell>
                      <CTableHeaderCell>Actual Quantity</CTableHeaderCell>
                      <CTableHeaderCell>Difference</CTableHeaderCell>
                      <CTableHeaderCell>Date</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    { dataReceiving.map((data, index)=>{
                      return(
                        <CTableRow key={index} color={`${data.difference !== 0 ? "danger" : ""}`}>
                        {/* <CTableRow key={index} style={{ backgroundColor: `${data.difference !== 0 ? "red" : ""}`}}> */}
                          <CTableDataCell>{data.dn_no}</CTableDataCell>
                          <CTableDataCell>{data.material_no}</CTableDataCell>
                          <CTableDataCell>{data.material_desc}</CTableDataCell>
                          <CTableDataCell>{data.rack_address}</CTableDataCell>
                          <CTableDataCell>{data.req_qty}</CTableDataCell>
                          <CTableDataCell>{data.actual_qty}</CTableDataCell>
                          <CTableDataCell className='text-center' style={{ borderLeft: '2px solid red', borderRight: '2px solid red', borderTop: index===0 && "2px solid red", borderBottom: index === 10 + 2 && "2px solid red", fontWeight: data.difference !== 0 && 'bold'}}>{data.difference === 0 ? "-" : data.difference}</CTableDataCell>
                          <CTableDataCell>{data.date}</CTableDataCell>
                        </CTableRow>
                      )
                    })}
                    { dataReceiving.length === 0 && (
                      <CTableRow>
                        <CTableDataCell colSpan={10} style={{ opacity: "50%"}}>
                          <div className='d-flex flex-column align-items-center justify-content-center py-4'>
                            <CIcon icon={icon.cilInbox} size='4xl'/>
                            <span>Data not found</span>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </CRow>
            </CCardBody>
          </CCard>
        </CRow>

        {/* Modal Upload File */}
        <CModal 
          visible={showModalUpdate}
          onClose={() => setShowModalUpdate(false)}
        >
          <CModalHeader>
            <CModalTitle>Upload Receiving Data</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className=''>
              <CInputGroup className='d-flex flex-column'>
                <CFormLabel>File Excel (.xlsx)</CFormLabel>
                <CFormInput className='w-100' type='file'/>
              </CInputGroup>
            </CRow>

          </CModalBody>
          <CModalFooter>
            <CButton onClick={()=>setShowModalUpdate(false)} color="secondary">Close</CButton>
            <CButton color="success" style={{color: "white"}}>Upload</CButton>
          </CModalFooter>
        </CModal>
    </CContainer>
  )
}

export default Receiving