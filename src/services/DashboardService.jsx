import useVerify from '../hooks/UseVerify'
import { useToast } from '../App'

const useDashboardReceivingService = () => {
    const { token, axiosJWT } = useVerify()
    const addToast = useToast()

    const handleError = (error, message) => {
        console.error(message, error)
        if(error.response.data.error){
            addToast(error.response.data.error, 'danger', 'error')
        }else{
            addToast(error.response.data.message, 'danger', 'error')
        }
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

    // const getChartReceiving = async(plant,status,vendor,startdate,enddate) => {
    //     try {
    //     const response =  await axiosJWT.get
    //     (`/arrival-chart?plantId=${plant}&status=${status}&vendorId=${vendor}&startDate=${startdate}&endDate=${enddate}`) 
    //         return response.data; 
    // } catch (error) {
    //     handleError(error, "Error fetching chart data:");
    //     }
    // }

    const getChartReceiving = async(plant, status, vendor) => {
        try {
        const response =  await axiosJWT.get
        (`/arrival-monitoring?plantId=${plant}&status=${status}&vendorId=${vendor}`) 
            return response.data; 
    } catch (error) {
        handleError(error, "Error fetching chart data:");
        }
    }

    const getChartReceivingDaily = async(plantId, date) => {
        try {
            const response =  await axiosJWT.get(`chart-material-arrive?plantId=${plantId}&date=${date}`) 
            return response.data; 
    } catch (error) {
        handleError(error, "Error fetching chart data:");
        }
    }

    const getChartHistoryReceiving = async(plantId, year, month) => {
        try {
            const response = await axiosJWT.get(`/dn-chart-history?plantId=${plantId}&year=${year}&month=${month}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response
        } catch (error) {
            handleError(error, "Error fetching history chart data")
        }
    }

    return{
        getCardStatusArrival,
        getChartReceiving,
        getChartReceivingDaily,
        getChartHistoryReceiving
    }
}

export default useDashboardReceivingService