import Head from 'next/head'
import { useRouter } from 'next/router';

import { useState, useEffect } from "react";
import axios from '../utils/axiosConfig';
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';


import { Inter } from 'next/font/google'
import styles from '../styles/Login.module.css';
import ENDPOINTS from '../utils/enpoints';
import NavBar from './navbar';

const inter = Inter({ subsets: ['latin'] })

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [group, setGroup] = useState([])
  const [username, setUsername] = useState("");
  const router = useRouter();


  const login = async () => {
    try {
      const response = await axios.post(ENDPOINTS.apiEndoint + "auth/login", {"username" : email.trim(), "password" : password.trim()})
      
      if(!response?.data?.error) {
        localStorage.setItem("_MEDUSER", JSON.stringify(response?.data?.data))
        localStorage.setItem("token", response?.data.data.accessToken)
        var decoded = jwt_decode(response?.data?.data?.accessToken);
        // console.log(decoded)
        console.log("STUFF", decoded);
        if(decoded != null) {
          setGroup(decoded['cognito:groups'])
          setUsername(decoded?.username)
          localStorage.setItem("_MEDUSER_USERNAME",decoded?.username)
          localStorage.setItem("_MEDUSER_GR",JSON.stringify(decoded['cognito:groups']))
          router.push("/home");
        }
      }else {
        error('Login Failed')
      }
    }catch(e) {
      error('Login Failed')
    }
  }

  const error = (err) => {
    toast.error(err, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  }

  useEffect(() => {
  
    
  }, []);

  return (
    <>
      {/* <Head>
        <title>Login</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className={`navbar-custom navbar navbar-expand-lg sticky-top ${styles.navbarCustom}`}>
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Medlite</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
     
        </div>
      </nav> */}
      {/* <NavBar /> */}

      <div className="main_content_iner ">
            <div className="container-fluid p-0">
                <div className="row justify-content-center">
                  
                    <div className="col-lg-12">
                      <ToastContainer />
                        <div className="white_box mb_30">
                            <div className="row justify-content-center">
                                <div className="col-lg-4">
                                    <div className={`${styles.mainLogo}`}>
                                      <span className="">  
                                        <img src="/img/home/infinite.png" alt="infinte-logo" height="40"/> 
                                      </span>
                                      <br />
                                      <span>
                                        <img src="/img/home/managedby.png" alt="managed-by" height="10" />
                                      </span>
                                      <br />
                                      <span>
                                        <img src="/img/home/med-logo.png" alt="med-logo" height="40" />
                                        <img src="/img/home/med-txt.png" alt="med-txt" height="20" className={`${styles.medLogo}`}/>
                                      </span>
                                    </div>
                                    <div className="modal-content cs_modal">
                                        <div className="modal-header justify-content-center">
                                            <h5 className="modal-title">Sign in to your account</h5>
                                        </div>
                                        <div className="modal-body">
                                            <form>
                                                <div className="">
                                                    <input type="text" className="form-control"
                                                        placeholder="Enter your email" onChange={e => setEmail(e.target.value)}/>
                                                </div>
                                                <div className="">
                                                    <input type="password" className="form-control" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                                                </div>
                                                <a className={`btn_1 full_width text-center ${styles.loginBtn}`} onClick={login}>Sign In and continue</a>
                                             </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </>
  )
}
