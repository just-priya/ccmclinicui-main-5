import Head from 'next/head'
import { useRouter } from 'next/router';

import Image from 'next/image'
import Select, { components } from 'react-select'
import { useState, useEffect, useRef } from "react";
import axios from '../../utils/axiosConfig';
import Multiselect from 'multiselect-react-dropdown';
import { CSVLink, CSVDownload } from "react-csv";
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import AddForm from './components/addform';
import Master from './components/master';

import { Inter } from 'next/font/google'
import styles from '../../styles/Admin.module.css';
import ENDPOINTS from '../../utils/enpoints';
import NavBar from '../navbar';
import style from './index.module.css'
import { useUserRoles } from '@/hooks/access';
import csvDownload from 'json-to-csv-export'


const inter = Inter({ subsets: ['latin'] })

export default function Admin() {

  const router = useRouter();
  const masterRef = useRef();

  const menuList = [{ id: 1, name: 'Admin Operation' }, { id: 2, name: 'Master File' }]
  const [activeId, setActiveId] = useState(1);
  const [username, setUsername] = useState("");
  const [disabled, setDisabled] = useState(false)
  const [group, setGroup] = useState([])
  const [saveDataTable, setsaveDataTable] = useState(false)
  const [ccmDataExport, setCCMDataExport] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [currentItemsID, setCurrentItemsID] = useState([]);


  const loadUserInfo = () => {
    const group = localStorage.getItem("_MEDUSER_GR")
    if (group == null) {
      localStorage.removeItem("_MEDUSER_USERNAME")
      localStorage.removeItem("_MEDUSER_GR")
      localStorage.removeItem("_MEDUSER")
      router.push('/login')
    } else {
      const userData = JSON.parse(localStorage.getItem("_MEDUSER"))
      setUsername(userData?.username)
      setGroup(group)
      group.includes('read') ? setDisabled(true) : setDisabled(false);
    }

  }

  const saveTable = () => {
    // console.log(masterRef.current);
    setsaveDataTable(true)
    setTimeout(() => {
      setsaveDataTable(false)
    }, 4000)
    
  }

  // const exportCcmData = async () => {
  //   const response = await axios.get(ENDPOINTS.apiEndoint + "ccm/export")
  //   setCCMDataExport(response?.data?.responseDetails)
  //   //console.log("Exported")
  // }
 

  const exportCcmData = async (e, done) => {
    await axios.post(ENDPOINTS.apiEndoint + "ccm/export?time_period=" + "2023-06-01%2000:00:01.000000", currentItemsID).then(async response => {
      setCCMDataExport(response?.data?.responseDetails)
      let filename= 'ExportBy_'+username+"_"+ moment(new Date()).format("DD-MM-YYYY")+".CSV" 
      let headers = [];
      if (!!response?.data?.responseDetails?.length) {
        let obj = response.data.responseDetails[0]
        for (const key in obj) {
          headers.push(key)
        }
        const dataToConvert = {
          data:filterData?filterData:response.data.responseDetails,
          filename: filename,
          delimiter: ',',
          headers: headers
        }
        console.log(dataToConvert, "dataToConvert");
        csvDownload(dataToConvert)
      }
    })
  }

  useEffect(() => {
    //Runs on the first render
    //And any time any dependency value changes
    loadUserInfo();
  }, []);

  const { getAccess, canEdit } = useUserRoles()

  useEffect(() => {
    if (!!window) {
      getAccess()
    }
  }, [])

  return (
    <>
      <NavBar />

      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid float-end">
          <a className="navbar-brand" href="#">Admin <span className={styles.welcome}>Hello, {username} !</span></a>
          {activeId === 2 ? 
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item px-2">
                {/* <CSVLink className="btn btn-sm btn-outline-secondary" filename={'ExportBy_'+username+"_"+ moment(new Date()).format("DD-MM-YYYY")+".CSV" }
                  onClick={exportCcmData}
                  asyncOnClick={true}
                  data={ccmDataExport}>Export
                </CSVLink> */}
                <button className="btn btn-sm btn-outline-secondary"
                onClick={exportCcmData}
              >Export</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-sm btn-success saveBtn" type="button" disabled={disabled} onClick={() => saveTable()}>Save</button>
              </li>
            </ul>
            :
            <></>
          }
        </div>
      </nav>

      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid float-end">
          <ul className="navbar-nav ">
            {
              menuList.map((item, index) => {
                return (
                  <li className="nav-item px-2" key={index} onClick={() => setActiveId(item.id)}>
                    <a className={`nav-link ${style.navLink} ${index + 1 === activeId ? styles.activeMenu : ''}`} key={index} aria-current="page">{item.name}</a>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </nav>


      <div className={`${!canEdit ? 'disable-input' : ''}`} >
        {
          activeId === 1 ? <AddForm /> : <Master saveTable={saveDataTable} setFilterData={setFilterData} />
        }
      </div>

    </>
  )
}
