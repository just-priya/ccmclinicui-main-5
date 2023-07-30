import axios from "axios";
import Toast from "./toast";

let axiosConfig = {
    headers: { "Authorization": `Bearer ${localStorage.getItem('token')}`, "Content-Type": "application/json" } 
  };


  axios.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    return config;
  }, (error) => {
        console.log(error)
  })
  
  axios.interceptors.response.use(function (response) {    
    return response;
  }, function (error) {
    const statusCode = error?.code == 'ERR_NETWORK' ? '401' : error?.response?.status;
    if(statusCode == 401) {
        window.location = "/"
    }
    return Promise.reject(error);
  });

const API_METHODS = {

    saveCategory: async (payload, url) => {
        try {
            const response = await axios.post(url, payload, axiosConfig)
            const data = await response.data
            return data;
        } catch (e) {
            Toast.showError("Something went Wrong");
        }
    },

    getCategory : async(url) => {
        try {
            const response = await axios.get(url, axiosConfig)
            const data = await response.data
            return data;
        } catch (e) {
            Toast.showError("Something went Wrong");
        }
    },



}

export default API_METHODS;