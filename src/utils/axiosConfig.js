import axios from 'axios'
import Swal from 'sweetalert2'


  axios.interceptors.request.use((config) => {
    
    let _list = ['/v1/auth/login', '/v1/auth/signup', '/v1/auth/change-password','/v1/auth/forget-password']
    const currentUrl = config?.url?.split('/api')[1]
    if(!_list.includes(currentUrl)) {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    }
    return config;
  }, (error) => {
        console.log(error)
  })
  
  axios.interceptors.response.use(function (response) {    
    return response;
  }, function (error) {
    
    const statusCode = error?.response?.status

    if(statusCode == 500) {
        // Swal.fire({
        //     title: 'Error!',
        //     text: error?.response?.data?.message,
        //     icon: 'error',
        //     confirmButtonText: 'Close',
        //     confirmButtonColor: "#DD6B55",
        //     closeOnConfirm: false
        //   }).then((result) => { 
        //     if (result.isConfirmed) {
        //       //  window.location = "/login"
        //        Swal.close
        //       } 
        //   })
    }
    if(statusCode == 401) {
      Swal.fire({
        title: 'Error!',
        text: 'Access Denied',
        icon: 'error',
        confirmButtonText: 'Logout',
        confirmButtonColor: "#DD6B55",
        closeOnConfirm: false
      }).then((result) => { 
        if (result.isConfirmed) {
           window.location = "/login"
          } 
      })
    }
    return Promise.reject(error);
  });

  export default axios;