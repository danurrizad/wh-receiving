import useVerify from '../hooks/UseVerify'
import { useToast } from '../App'

const useReceivingDataService = () => {
    const { token, axiosJWT } = useVerify()
    const addToast = useToast()

    const handleError = (error, message) => {
        console.error(message, error)
        addToast(error.response.data.message, 'danger', 'error')
        throw new Error(message + error.message)
      }

    const getMaterialByDNData = async(dnNumber) => {
        try {
            const response = await axiosJWT.get(`/delivery-note?dn=${dnNumber}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response
        } catch (error) {
            handleError(error, "Error fetching file:")
        }
    }

    const getDNByDateData = async(importDate) => {
        try {
            const response = await axiosJWT.get(`/delivery-note-date?importDate=${importDate}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response
        } catch (error) {
            handleError(error, "Error fetching file:")
        }
    }

    const getDNInqueryData = async(plantId, startDate, endDate) => {
        try {
            const response = await axiosJWT.get(`/delivery-note-inquiry?plantId=${plantId}&startDate=${startDate}&endDate=${endDate}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response
        } catch (error) {
            handleError(error, "Error fetching file:")
        }
    }

    const submitMaterialByDNData = async(warehouseId, bodyForm) => {
        try {
            const response = await axiosJWT.post(`/delivery-note-submit/${warehouseId}`, bodyForm, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response
        } catch (error) {
            if(error.response.data.error){
                throw error.response.data.error
            } else if(error.response.data.message){
                throw error.response.data.message
            } else {
                throw error
            }
            // handleError(error, "Error submitting:")
        }
    }

    const submitUpdateMaterialByDNData = async(warehouseId, bodyForm) => {
        try {
            const response = await axiosJWT.post(`/delivery-note-inquiry/${warehouseId}`, bodyForm, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response
        } catch (error) {
            // handleError(error, 'Error updating:')
            throw error.response.data.message
        }
    }

    return{
        getMaterialByDNData,
        getDNByDateData,
        getDNInqueryData,
        submitMaterialByDNData,
        submitUpdateMaterialByDNData
        // getReceivingData,
        // uploadExcelReceivingData
    }
}

export default useReceivingDataService