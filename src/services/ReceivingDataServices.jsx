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
            const response = await axiosJWT.get(`/delivery-note?dn=${dnNumber}`)
            return response
        } catch (error) {
            handleError(error, "Error fetching file:")
        }
    }

    const getDNByDateData = async(importDate) => {
        try {
            const response = await axiosJWT.get(`/delivery-note-date?importDate=${importDate}`)
            return response
        } catch (error) {
            handleError(error, "Error fetching file:")
        }
    }

    const submitMaterialByDNData = async(warehouseId, bodyForm) => {
        try {
            const response = await axiosJWT.post(`/delivery-note-submit/${warehouseId}`, bodyForm)
            return response
        } catch (error) {
            handleError(error, "Error submitting:")
        }
    }

    return{
        getMaterialByDNData,
        getDNByDateData,
        submitMaterialByDNData
        // getReceivingData,
        // uploadExcelReceivingData
    }
}

export default useReceivingDataService