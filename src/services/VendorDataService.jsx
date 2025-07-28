import useVerify from '../hooks/UseVerify'
import { useToast } from '../App'

const useVendorDataService = () => {
    const { token, axiosJWT } = useVerify()
    const addToast = useToast()

    const handleError = (error, message) => {
        console.error(message, error)
        if(error.response.data.message){
            addToast(error.response.data.message, 'danger', 'error')
        }else{
            addToast(error.response.data.error, 'danger', 'error')
        }
        throw new Error(message + error.message)
      }

    
    const getVendorScheduleByCode = async(vendorCode) => {
        try {
            const response = await axiosJWT.get(`/vendor-schedule?vendorCode=${vendorCode}`)
            return response
        } catch (error) {
            handleError(error, "Error fetching vendor schedule: ")
        }
    }

    const submitVendorArrival = async(body) => {
        try {
            const response = await axiosJWT.post('vendor-arrival', body)
            return response
        } catch (error) {
            handleError(error, "Error submitting: ")
        }
    }

    const getArrivedVendor = async() =>{ 
        try{
            const response = await axiosJWT.get('arrived-vendor')
            return response
        } catch{
            handleError(error, "Error fetching arrived vendor: ")
        }
    }
    

    return{
        getVendorScheduleByCode,
        submitVendorArrival,
        getArrivedVendor
    }
}

export default useVendorDataService