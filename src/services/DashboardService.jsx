import useVerify from '../hooks/UseVerify'
import { useToast } from '../App'

const useDashboardReceivingService = () => {
    const { token, axiosJWT } = useVerify()
    const addToast = useToast()

    const handleError = (error, message) => {
        console.error(message, error)
        addToast(error.response.data.message, 'danger', 'error')
        throw new Error(message + error.message)
      }

    const getCardStatusArrival = async(plant,status,vendor,startdate,enddate) => {
        try {
        const response =  await axiosJWT.get
        (`/arrival-monitoring?plantId=${plant}&status=${status}&vendorId=${vendor}&startDate=${startdate}&endDate=${enddate}`) 
            return response
        } catch (error) {
            handleError(error, "Error fetching file:")
        }
    }

    const getChartReceiving = async(plant,status,vendor,startdate,enddate) => {
        try {
        const response =  await axiosJWT.get
        (`/arrival-chart?plantId=${plant}&status=${status}&vendorId=${vendor}&startDate=${startdate}&endDate=${enddate}`) 
            return response.data; 
    } catch (error) {
        handleError(error, "Error fetching chart data:");
        }
    }
    return{
        getCardStatusArrival,
        getChartReceiving
    }
}

export default useDashboardReceivingService