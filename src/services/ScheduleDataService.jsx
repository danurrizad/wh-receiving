import useVerify from '../hooks/UseVerify'
import { useToast } from '../App'

const useScheduleDataService = () => {
    const { token, axiosJWT } = useVerify()
    const addToast = useToast()

    const handleError = (error, message) => {
        console.error(message, error)
        addToast(error.response.data.message, 'danger', 'error')
        throw new Error(message + error.message)
      }
    
      const getScheduleAllData = async(plantId, day) =>{
        try {
            const response = await axiosJWT.get(`/delivery-schedule?limit=15&page=1&plantId=${plantId}&day=${day}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response
        } catch (error) {
            handleError(error, "Error fetching files:")
        }
      }

      const uploadFileScheduleData = async(formData) => {
        try {
            const response = await axiosJWT.post('/upload-delivery-schedule/1', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response
        } catch (error) {
            handleError(error, "Error uploading file:")
        }
      }


    return{
        getScheduleAllData,
        uploadFileScheduleData,
    }
}

export default useScheduleDataService