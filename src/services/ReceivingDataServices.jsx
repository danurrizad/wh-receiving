import useVerify from '../hooks/UseVerify'

const useReceivingDataService = () => {
    const { token, axiosJWT } = useVerify()

    const handleError = (error, message) => {
        console.error(message, error)
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

    // const getReceivingData = async() => {
    //     try {
    //         const response = await axiosJWT.get(`${BACKEND_URL}/`)
    //         return response
    //     } catch (error) {
    //         throw error
    //     }
    // }

    // const uploadExcelReceivingData = async() => {
    //     try {
    //         const response = await axiosJWT.post(`${BACKEND_URL}/`)
    //         return response
    //     } catch (error) {
    //         throw error
    //     }
    // }

    return{
        getMaterialByDNData
        // getReceivingData,
        // uploadExcelReceivingData
    }
}

export default useReceivingDataService