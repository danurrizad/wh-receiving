import useVerify from '../hooks/UseVerify'

const useReceivingDataService = () => {
    const { token, axiosJWT } = useVerify()

    const handleError = (error, message) => {
        console.error(message, error)
        throw new Error(message + error.message)
      }

    const getReceivingData = async() => {
        try {
            const response = await axiosJWT.get(`${BACKEND_URL}/`)
            return response
        } catch (error) {
            throw error
        }
    }

    const uploadExcelReceivingData = async() => {
        try {
            const response = await axiosJWT.post(`${BACKEND_URL}/`)
            return response
        } catch (error) {
            throw error
        }
    }

    return{
        getReceivingData,
        uploadExcelReceivingData
    }
}

export default useReceivingDataService