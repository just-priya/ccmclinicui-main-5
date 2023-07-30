import React, { useRef } from "react"
import { useRouter } from 'next/router';
import Select, { components } from 'react-select'
import { useState, useEffect, useMemo } from "react";
import moment from 'moment';
import DatePicker from "react-datepicker";
import { CSVLink, CSVDownload } from "react-csv";
import "react-datepicker/dist/react-datepicker.css";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import csvDownload from 'json-to-csv-export'


// use this axios config !!! important
import axios from '../utils/axiosConfig';
   

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFileLines, faMessage, faCalendar, faFileUpload, 
        faCloudDownload, faMagnifyingGlass, faXmark, faAngleUp, faAngleDown, faCheck , faCheckDouble} from "@fortawesome/free-solid-svg-icons";
import { CircleSpinnerOverlay, FerrisWheelSpinner, RingSpinner } from 'react-spinner-overlay'


import { Inter } from 'next/font/google'
import styles from '../styles/Dashboard.module.css';
import ENDPOINTS from '../utils/enpoints';
const _ = require('lodash');
import AlertDismissable from "../pages/admin/components/alertDismissable";
import NavBar from './navbar';
import { useUserRoles } from "@/hooks/access";
// import { Once } from "react-lodash";


const inter = Inter({ subsets: ['latin'] })

export default function Dashboard() {

  const [podDomains, setPodDomains] = useState([]);
  const [careCoordinator, setCareCoordinator] = useState([]);
  const [podLeaders, setPodLeaders] = useState([]);
  const [navMonths, setNavMonths] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [group, setGroup] = useState([])
  const [username, setUsername] = useState("");
  const [disabled, setDisabled] = useState(false)
  const [selectedDropDownClass, setSelectedDropDownClass] = useState("DropreEsclated");
  const [selectedStatus, setSelectedStatus] = useState([])
  const [masterStatus, setMasterStatus] = useState([])
  const [ccmData, setCCMData] = useState([]);
  const [ccmDataExport, setCCMDataExport] = useState([]);

  const [open, setOpen] = useState(false);
  
  const defaultQuery = "facilityname=null&carecoordinatorsname=null&podleadername=null&poddomainname=null&transactioncomments=null&sendreportstatusid=null&completedDate='ASC'"

  const [rejectIndex, setRejectIndex] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const hiddenSelect = React.createRef()
  const [loading, setLoading] = useState(false)
  const [activeId, setActiveId] = useState(moment(new Date(), 'YYYY-MM').format('YYYY-MM'));
  const [facilitySearch, setFacilitySearch] = useState(false);
  const [statusSearch, setStatusSearch] = useState(false);
  const [coordinSearch, setCoordinSearch] = useState(false);
  const [podSearch, setPodSearch] = useState(false);
  const [podLeaderSearch, setPodLeaderSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState(defaultQuery);

  // file upload 
  const [rowId, setRowId] = useState(0);
  const [isfileUpload, setIsfileUpload] = useState(false);
  const [fileType, setFileType] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  // pick only dirty rows
  const [dirtyRows, setDirtyRows] = useState([]);

  // pagination 

  const [currentPage, setcurrentPage] = useState(0);
  const [itemsPerPage, setitemsPerPage] = useState(50);

  const [pageNumberLimit, setpageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(10);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [totalPages, settotalPages] = useState(0);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);

  const rowJump = 50;

  const [pageRender, setPageRender] = useState(false);

  const handleClick = (event) => {
    if(event.target.id-1 != currentPage){
    setLoading(true);
    setPageRender(false);
    }
    console.log("++++");
    console.log(event.target.id);
  
      setcurrentPage(Number(event.target.id-1));
    
    
    // setCurrentItem()
  };
  
  // const setCurrentItem = () => {
  //   let start = indexOfFirstItem + rowJump;
  //   let end = indexOfLastItem + rowJump;
  //   const tempCurrentItems = ccmData.slice(start , end);
  //   setCurrentItems(tempCurrentItems);
  // }

  // const setCurrentData = (data) => {
  //   const tempCurrentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  //   setCurrentItems(tempCurrentItems);
  // }

  const closeModal = () => {
    setOpen(false);
    setIsfileUpload(false)
  }

  const [pages, setPages] = useState([]);

  useEffect(() => {
    let pa = []
    for (let i = 1; i <= totalPages; i++) {
      pa.push(i);
    }
    setPages(pa);
  }, [totalPages])

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // let currentItems = ccmData.slice(indexOfFirstItem, indexOfLastItem);

  const renderPageNumbers = pages.map((number) => {
    // if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <li
          key={number}
          id={number}
          onClick={handleClick}
          className={(currentPage+1) == number ? "active" : null}
        >
          {number}
        </li>
      );
    // } else {
    //   return null;
    // }
  });

  const handleNextbtn = () => {
    setLoading(true);
    setPageRender(false);
    const current = currentPage + 1
    setcurrentPage(current)
    
    if (currentPage + 1 > maxPageNumberLimit) {
      setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
    // loadPaginatedData()
    // setCurrentData(ccmData)
  };

  const handlePrevbtn = () => {
    setLoading(true);
    setPageRender(false);
    const current = currentPage - 1
    setcurrentPage(current);
  

    if ((currentPage - 1) % pageNumberLimit == 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
    // loadPaginatedData()
    // setCurrentData(ccmData)
  };

  let pageIncrementBtn = null;
  if (pages.length > maxPageNumberLimit) {
    pageIncrementBtn = <li onClick={handleNextbtn}> &hellip; </li>;
  }

  let pageDecrementBtn = null;
  if (minPageNumberLimit >= 1) {
    pageDecrementBtn = <li onClick={handlePrevbtn}> &hellip; </li>;
  }

  const handleLoadMore = () => {
    setitemsPerPage(itemsPerPage + 5);
    setCurrentData(ccmData)
  };

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const handleSubmission = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    const headers = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
    setLoading(true)
    const response = await axios.post(ENDPOINTS.apiEndoint + `fileupload/${rowId}/`+fileType, formData, headers)
    if (response?.status == 200) {
      setLoading(false)
      setOpen(o => !o)
      loadInitialData()
      showWarningMsg("Uploaded !", "success");
    } else {
      showWarningMsg("Something went wrong !", "danger");
    }
  };


  const [selectedPodDomain, setSelectedPodDomain] = useState([]);
  const [masterPodDomain, setMasterPodDomain] = useState([]);
  const [selectedCareCoordinators, setSelectedCareCoordinators] = useState([]);
  const [masterCoordinator, setMasterCoordinator] = useState([]);
  const [selectedLeaders, setSelectedLeaders] = useState([]);
  const [masterpodLeaders, setMasterPodLeaders] = useState([]);
  const [comments, setComments] = useState([])
  const [searchVal, setSearchVal] = useState({
    name: '',
    val: ''
  });
 
  const [alert, setAlert] = useState({
    alertMsg: "",
    varient: "success",
    alertIcon: "info-circle",
  });
  const [showAlert, setShowAlert] = useState(false);


  const router = useRouter();

  const options = [
    { value: 'reescalated', label: 'Re-esclated', className: 'cls_reesclated', comments: ""},
    { value: 'rejected', label: 'Rejected', className: 'cls_rejected', comments: "" },
    { value: 'approved', label: 'Approved', className: 'cls_approved', comments: ""},
    { value: 'completed', label: 'Completed', className: 'cls_completed', comments: ""},
    { value: 'inprocess', label: 'Inprocess', className: 'cls_inprocess', comments: ""},
    { value: 'hold', label: 'Hold', className: 'cls_hold', comments: ""}
  ];



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

  const showWarningMsg = (msg, alertVarient) => {
    let alertObj = alert;
    alertObj["alertMsg"] = msg;
    alertObj["varient"] = alertVarient;
    setAlert(alertObj);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      //setLoading(false)
    }, 2000);
  };

  const setStartDateChosen = (option) => {
    //console.log(option)
    const userOption = moment(option, 'YYYY-MM');
    const choosenMonth = userOption.format('YYYY-MM');
    //console.log(choosenMonth)
    const currentMonthList = navMonths;
   if(currentMonthList.indexOf(choosenMonth) <= -1 ) {
    currentMonthList.push(choosenMonth);
    setNavMonths(currentMonthList)
    setActiveId(choosenMonth)
   }else {
    setActiveId(choosenMonth)
   }

  }

  const getCurrentMonth = () => {
    const currentDay = moment(new Date(), 'YYYY-MM').format('YYYY-MM');
    const currentMonth = currentDay
    const currentMonth_1 = moment(currentDay).subtract(1, 'months').format('YYYY-MM');
    const currentMonth_2 = moment(currentDay).subtract(2, 'months').format('YYYY-MM');
    setNavMonths([currentMonth_2, currentMonth_1, currentMonth])
    setActiveId(currentMonth)
  }

  const MoreSelectedBadge = ({ items }) => {
    const style = {
      marginLeft: "auto",
      background: "#4DB0A6",
      borderRadius: "4px",
      fontFamily: "Open Sans",
      fontSize: "11px",
      padding: "3px",
      order: 99
    };

    const title = items.join(", ");
    const length = items.length;
    const label = `+ ${length} ${length >= 1 ? "" : ""}`;

    return (
      <div style={style} title={title} data-tooltip-id="my-tooltip" data-tooltip-content={items[0]?.label}>
        {label}
      </div>
    );
  };

  const [currentItemsID, setCurrentItemsID] = useState([]);
  useEffect(() => {
    const data = currentItems.map(item => item.id)
    setCurrentItemsID(data)
  }, [facilitySearch, statusSearch, podLeaderSearch, podSearch, podSearch, currentItems])
  
  const exportCcmData = async (e, done) => {
    await axios.post(ENDPOINTS.apiEndoint + "ccm/export?time_period=" + activeId + "-01 00:00:01.000000", currentItemsID).then(async response => {
      setCCMDataExport(response?.data?.responseDetails)
      let filename= 'ExportBy_'+username+"_"+ moment(new Date()).format("DD-MM-YYYY")+".CSV" 
      let headers = [];
      if (!!response?.data?.responseDetails?.length) {
        let obj = response.data.responseDetails[0]
        for (const key in obj) {
          headers.push(key)
        }
        const dataToConvert = {
          data: response.data.responseDetails,
          filename: filename,
          delimiter: ',',
          headers: headers
        }
        csvDownload(dataToConvert)
      }
    })
  }

  


const InputOption = ({
  getStyles,
  Icon,
  isDisabled,
  isFocused,
  isSelected,
  children,
  innerProps,
  ...rest
}) => {
  const [isActive, setIsActive] = useState(false);
  const onMouseDown = () => setIsActive(true);
  const onMouseUp = () => setIsActive(false);
  const onMouseLeave = () => setIsActive(false);

  // styles
  let bg = "transparent";
  if (isFocused) bg = "#eee";
  if (isActive) bg = "#B2D4FF";

  const style = {
    alignItems: "center",
    backgroundColor: bg,
    color: "inherit",
    display: "flex "
  };

  // prop assignment
  const props = {
    ...innerProps,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    style
  };

  return (
    <components.Option
      {...rest}
      isDisabled={isDisabled}
      isFocused={isFocused}
      isSelected={isSelected}
      getStyles={getStyles}
      innerProps={props}
    >
      <input type="checkbox" checked={isSelected} />
      {children}
    </components.Option>
  );
};

  const MultiValue = ({ index, getValue, ...props }) => {
    const maxToShow = 1;
    const overflow = getValue()
      .map((x) => x.label);

    return index < maxToShow ? (
      <components.MultiValue {...props} />
    ) : index === maxToShow ? (
      <MoreSelectedBadge items={overflow} />
    ) : null;
  };


  const saveRejectReason = () => {
    if (rejectReason.length > 0) {
      ccmData[rejectIndex]['rejectedReason'] = rejectReason
      ccmData[rejectIndex]['status'] = 'rejected'
      closeModal()
    } else {
      alert("Status needs to be rolled back - no reason provided for reject")
      closeModal()
    }

  }

  const getCareCoordinator = async () => {
    const response = await axios.get(ENDPOINTS.apiEndoint + "ccm/getcarecoordinators")
    return response?.data
  }

  const getPodDomains = async () => { // single select 
    const response = await axios.get(ENDPOINTS.apiEndoint + "ccm/getpoddomains")
    return response?.data
  }

  const getPodLeaders = async () => {
    const response = await axios.get(ENDPOINTS.apiEndoint + "ccm/getpodleaders")
    return response?.data
  }

  const getCCMTransactionData = async () => {
    
    const response = await axios.get(ENDPOINTS.apiEndoint + `ccm/getccmdetails?time_period=${activeId}-01 00:00:01.000000&${searchQuery}&limit=${itemsPerPage}&offset=${currentPage}`)
    return response?.data
  }

  const saveCCMTable = async () => {
    // console.log(selectedStatus, selectedPodDomain);
    for (var i = 0; i < ccmData.length; i++) {
      // console.log(i, selectedStatus[i]);
      if (selectedStatus[i] && selectedStatus[i]['value'] !== null) {
        ccmData[i]['status'] = selectedStatus[i]['value']
      } else {
        ccmData[i]['status'] = null
      }
      console.log(i + "->selected status", selectedStatus)
      ccmData[i]['comments'] = comments[i]['value']

      // pod domians
      ccmData[i]['podDomainId'] = selectedPodDomain[i]['value']

      // pod leaders
      let item = selectedLeaders[i]
      let newArray = item.flatMap(i => {
        if (i != undefined) {
          return i?.value
        }
      })
      var tempLeaders = _.compact(newArray)

      if (tempLeaders.length > 0) {
        ccmData[i]['podLeaders'] = tempLeaders
      } else {
        ccmData[i]['podLeaders'] = tempLeaders
      }

      // pod care cood

      let poditem = selectedCareCoordinators[i];
      let newPodArray = poditem.flatMap(i => {
        if (i != undefined) {
          return i?.value
        }
      })
      var tempCare = _.compact(newPodArray)

      if (tempCare.length > 0) {
        ccmData[i]['careCoordinators'] = tempCare
      } else {
        ccmData[i]['careCoordinators'] = tempCare
      }

    }
    setLoading(true)
    setTimeout(async () => {

      // remove other rows with respect to dirty rows
      const dirtyRowsTobePatched = [];
      dirtyRows.map((item, index) => {
        const temp = ccmData.find(obj => {
          return obj.id === item
        })
        dirtyRowsTobePatched.push(temp);
      })
      // console.log(dirtyRowsTobePatched)
      const response = await axios.put(ENDPOINTS.apiEndoint + "ccm/updateccmdetails", dirtyRowsTobePatched)
      console.log(response?.data)
      setLoading(false)
      showWarningMsg("Updated !", "success");
    }, 4000)
  }


  const handlePodDomainChange = (index, option, rowId) => { 
    var temp = selectedPodDomain
    temp[index]['value'] = option['value']
    temp[index]['label'] = option['label']
    setSelectedPodDomain(temp)
    setMasterPodDomain(temp)
    addToDirtyRow(rowId)
  }

  const handleLeaderChange = (index, option, rowId) => {
    var temp = [...selectedLeaders] //[[1,2], [1]]
    //console.log(temp[index]['selected'])
    temp[index] = option;
    setSelectedLeaders(temp);
    setMasterPodLeaders(temp);
    addToDirtyRow(rowId)
  }

  const addToDirtyRow = (rowId) => {
    // console.log(rowId);
    if (dirtyRows.indexOf(rowId) == -1) {
      const tempDirtyRows = dirtyRows;
      tempDirtyRows.push(rowId)
      setDirtyRows(tempDirtyRows)
    } else {
      // console.log("row id " + rowId + " is already in dirtylist")
    }
  }

  const handleCareCoordinatorChange = (index, option, rowId) => {
    const i = index 
    var temp = [...selectedCareCoordinators] //[[1,2], [1]]
    //console.log(temp[index]['selected'])
    temp[i] = option;
    setSelectedCareCoordinators(temp);
    setMasterCoordinator(temp)
    addToDirtyRow(rowId)
  }

  const statusChange = (index, option, rowId) => {
    setRejectIndex(index)

    var selectedOption = options.filter((element, index) => {
      return element.value === option.value;
    })
    const _selection = selectedOption[0];
    const status = [...selectedStatus];
    status[index] = _selection
    setSelectedStatus(status)
    setMasterStatus(status)
    addToDirtyRow(rowId)

    if (option.value === 'rejected') {
      setOpen(o => !o)
    } else {
      // loadInitialData()
    }
  }

  const changeColor = (value) => {
    setTimeout(() => {
      setSelectedDropDownClass(`${'cls_' + value}`)
    }, 100)
  }

  const commentRejectValue = (event) => {
    if (event.target.value.length > 0) {
      setRejectReason(event.target.value)
    }
  }

  const uploadCompletedFile = (item, fileType) => {
    if(item?.writeAccess === 1) {
      setIsfileUpload(true);
      setRowId(item?.id);
      setOpen(o => !o)
      setFileType(fileType)
    } 
    else {
      alert("you dont have the access to upload the file....")
    }
  }

  const commentValue = (event, index, rowId) => {
    index = index 
    const tempCcmData = [...comments];
    tempCcmData[index]['value'] = event.target.value;
    setComments(tempCcmData)
    addToDirtyRow(rowId)
  }

  const handleCommentClick = (index, preVal, rowId) => {
    index = index 
    const tempCcmData = [...comments];
    tempCcmData[index]['show'] = !preVal
    // console.log(index, preVal, comments)
    setComments(tempCcmData)
    addToDirtyRow(rowId)
  }

  const helper = (ccmData, pods, care, leaders) => {
    setPageRender(false);
    const selectedCareOrdin = [];
    const selectedPodLeaders = [];
    let tempPods = [];
    let status = [];
    let tmpComments = []
    ccmData.map((element, ccmIndex) => {
      if (element.status === 'hold') {
        const option = _.cloneDeep(options[5])
        option.id = element.id
        status = [...status, option]
        setSelectedStatus(oldArray => [...oldArray, options[5]])
      }
      if (element.status === 'inprocess') {
        const option = _.cloneDeep(options[4])
        option.id = element.id
        status = [...status, option]
        setSelectedStatus(oldArray => [...oldArray, options[4]])
      }
      if (element.status === 'completed') {
        const option = _.cloneDeep(options[3])
        option.id = element.id
        status = [...status, option]
        setSelectedStatus(oldArray => [...oldArray, options[3]])
      }
      if (element.status === 'approved') {
        const option = _.cloneDeep(options[2])
        option.id = element.id
        status = [...status, option]
        setSelectedStatus(oldArray => [...oldArray, options[2]])
      }
      if (element.status === 'rejected') {
        const option = _.cloneDeep(options[1])
        option.id = element.id
        status = [...status, option]
        setSelectedStatus(oldArray => [...oldArray, options[1]])
      }
      if (element.status === 'reesclated') {
        const option = _.cloneDeep(options[0])
        option.id = element.id
        status = [...status, option]
        setSelectedStatus(oldArray => [...oldArray, options[0]])
      }
      if (element.status == null) {
        const option = null
        status = [...status, option]
        setSelectedStatus(oldArray => [...oldArray, null])
      }

      // comments
      var temp = { index: ccmIndex, value: element.comments, show: element.comments == null ? true : false }
      tmpComments.push({
        index: ccmIndex, value: element.comments, show: element.comments == null ? true : false
      })
      // setComments(oldvalue => [...oldvalue, temp])

      //pod domain 
      var tempSelectedPod = pods.filter((el, i) => {
        if (el.value === element.podDomainId)
          return el
      })
      // console.log(tempSelectedPod)
      const tempPodSelection = tempSelectedPod[0] ? tempSelectedPod[0] : {label: "", value: ""}
      tempPodSelection['index'] = ccmIndex;

      // tempPods = selectedPodDomain
      tempPods.push(tempPodSelection);
      

      //console.log("****care*****")
      //setSelectedCareCoordinators
      var tempCare = []
      if (element.careCoordinators.length > 0) {
        element.careCoordinators.map((careco, careIndex) => {
          const foundCareCorordinator = care.find(obj => {
            // console.log(obj)
            return obj.value === careco
          })
          tempCare.push(foundCareCorordinator);
        })
        // var tempCareData = tempCare//{index: ccmIndex, selected : tempCare}
        //var tempp = JSON.parse(JSON.stringify(selectedCareCoordinators))

        //tempp.push(tempCareData)
        selectedCareOrdin.push(tempCare)
        //setSelectedCareCoordinators(tempp)        
        setTimeout(() => {
          //console.log('setSelectedCareCoordinators', selectedCareCoordinators)
        }, 2000)
      } else {
        selectedCareOrdin.push([])
      }
      //console.log("****leaders*****")
      var tempLeader = []
      if (element.podLeaders.length > 0) {
        element.podLeaders.map((careco, careIndex) => {
          const foundLeader = leaders.find(obj => {
            //console.log(obj)
            return obj.value === careco
          })
          tempLeader.push(foundLeader);
        })
        //var tempCareData = tempLeader//{index: ccmIndex, selected : tempCare}
        //var tempp = JSON.parse(JSON.stringify(selectedLeaders))

        //tempp.push(tempCareData)
        selectedPodLeaders.push(tempLeader)
        //setSelectedCareCoordinators(tempp)
        setTimeout(() => {
          //console.log('setLeaders', selectedLeaders)
        }, 2000)
      } else {
        selectedPodLeaders.push([])
      }
      element.showComments = false
      //console.log("END ----")
      // console.log(ccmData, status)     
      setSelectedCareCoordinators(selectedCareOrdin)
      setSelectedLeaders(selectedPodLeaders)
    });
    setComments(tmpComments)
    setSelectedPodDomain(tempPods)
    setMasterStatus(status)
    setMasterCoordinator(selectedCareOrdin)
    setMasterPodDomain(tempPods)
    setMasterPodLeaders(selectedPodLeaders)
  }

  const sendMail = async (id) => {
    const response = await axios.post(ENDPOINTS.apiEndoint + "sendemail/" + id)
    if (response?.data) {
      showWarningMsg("Email sent !", "success");
      // loadInitialData()
      loadPaginatedData()
    }
  }

  const setCurrentMonthData = (item) => {
    if(item != activeId){
      setLoading(true);
      setPageRender(false);
    }   
    setActiveId(item);
  }

  const loadInitialData = () => {
    const promises = [getPodDomains(), getCareCoordinator(), getPodLeaders(), getCCMTransactionData()];
    Promise.all(promises).then(([podDomains, careCoordinator, podLeaders, ccm]) => {
      let pod = podDomains?.responseDetails.map(({ name, id }) => ({ value: id, label: name }));
      pod = _.sortBy(pod, ['label'])
      setPodDomains(pod);
      let care = careCoordinator?.responseDetails.map(({ name, id }) => ({ value: id, label: name }));
      care = _.sortBy(care, ['label']);
      setCareCoordinator(care);
      let leaders = podLeaders?.responseDetails.map(({ name, id }) => ({ value: id, label: name }));
      leaders = _.sortBy(leaders, ['label'])
      setPodLeaders(leaders);
      console.log(care);
      console.log("data fetch completed")
      const ccmData = ccm?.responseDetails;
      settotalPages(ccmData?.totalPages )
      helper(ccmData?.ccmTransactions, pod, care, leaders)
      setCCMData(ccmData?.ccmTransactions);
      // const tempCurrentItems = ccmData?.ccmTransactions.slice(indexOfFirstItem, indexOfLastItem);
      setCurrentItems(ccmData?.ccmTransactions);
      setLoading(false);
      setPageRender(true);
    });
  }

  const loadPaginatedData = () => {
    const promises = [getCCMTransactionData()]
    Promise.all(promises).then(([ccm]) => {
      const ccmData = ccm?.responseDetails;
      console.log(ccmData);
      helper(ccmData?.ccmTransactions, podDomains, careCoordinator, podLeaders)
      setCCMData(ccmData?.ccmTransactions);
      setCurrentItems(ccmData?.ccmTransactions);
      // if(searchQuery !== defaultQuery) {
        settotalPages(ccmData?.totalPages)
        setLoading(false);
        setPageRender(true);
      // }
    });
  }

  useEffect(() => {
    console.log("Current page useeffect");
    if(navMonths.length > 0) {
      console.log("Current page useeffect --> inside if");
      setSelectedStatus([])
      loadPaginatedData()
    }
  }, [currentPage, searchQuery])
  
  useEffect(() => {
    // setCurrentItems([]);
    console.log("activeId useeffect");
    setSelectedStatus([])
    loadPaginatedData()
    setcurrentPage(0)
  }, [activeId])

  useEffect(() => {
    console.log("Initial useeffect");
    //Runs on the first render
    //And any time any dependency value changes
    loadUserInfo();
    getCurrentMonth();
    loadInitialData()
    // exportCcmData();
   
  }, []);


  const searchToogle = (val, column) => {
    setFacilitySearch(false);
    setStatusSearch(false);
    setCoordinSearch(false);
    setPodSearch(false);
    setPodLeaderSearch(false);

    switch (column) {
      case 'facility':
        setFacilitySearch(val);
        break;
      case 'status':
        setStatusSearch(val);
        break;
      case 'coordinator':
        setCoordinSearch(val)
        break;
      case 'podDomain':
        setPodSearch(val)
        break;
      case 'podLeaders':
        setPodLeaderSearch(val)
        break;
      default:

    }
    
    if(!val) {
      // console.log(masterStatus);
      // setCurrentItem()
      // setSelectedCareCoordinators(masterCoordinator)
      // setSelectedStatus(masterStatus)
      // setSelectedPodDomain(masterPodDomain)
      // setSelectedLeaders(masterpodLeaders)
      setSearchQuery(defaultQuery)
    }
      
  }


  const facilityNameSearch = (event) => {
    // const tempCcm = [...ccmData]
    const val = event.target.value
    const search = searchVal
    search.name = "facility"
    search.val = val
    setSearchVal(search)
    
  }

  const statusesSearch = (event) => {
    // const tempCcm = [...ccmData]
    const val = event.target.value
    const search = searchVal
    search.name = "status"
    search.val = val
    setSearchVal(search)
    
  }

  const coordinatorSearch = (event) => {
    // const tempCcm = [...ccmData]
    const val = event.target.value
    const search = searchVal
    search.name = "coordinator"
    search.val = val
    setSearchVal(search)
    
  }

  const podDomainSearch = (event) => {    
    // const tempCcm = [...ccmData]
    const val = event.target.value
    const search = searchVal
    search.name = "podDomain"
    search.val = val
    setSearchVal(search)
    
  }

  const podLeadersSearch = (event) => {    
    // const tempCcm = [...ccmData]
    const val = event.target.value
    const search = searchVal
    search.name = "podLeader"
    search.val = val
    setSearchVal(search)
    
  }

  const onEnter = (event) => {
    if (event.keyCode == 13) {
      const search = searchVal
      let query = ""
      switch (search.name) {
        case 'facility':
          query = `facilityname=${search.val}&carecoordinatorsname=null&podleadername=null&poddomainname=null&transactioncomments=null&sendreportstatusid=null&completedDate='ASC'`
          setcurrentPage(0)
          setSearchQuery(query)
          break;
        case 'status':
          query = `facilityname=null&carecoordinatorsname=null&podleadername=null&poddomainname=null&transactioncomments=null&sendreportstatusid=${search.val}&completedDate='ASC'`
          setcurrentPage(0)
          setSearchQuery(query)
          break;
        case 'coordinator':
          query = `facilityname=null&carecoordinatorsname=${search.val}&podleadername=null&poddomainname=null&transactioncomments=null&sendreportstatusid=null&completedDate='ASC'`
          setcurrentPage(0)
          setSearchQuery(query)
          break;
        case 'podDomain':
          query = `facilityname=null&carecoordinatorsname=null&podleadername=null&poddomainname=${search.val}&transactioncomments=null&sendreportstatusid=null&completedDate='ASC'`
          setcurrentPage(0)
          setSearchQuery(query)
          break;
        case 'podLeader':
          query = `facilityname=null&carecoordinatorsname=null&podleadername=${search.val}&poddomainname=null&transactioncomments=null&sendreportstatusid=null&completedDate='ASC'`
          setcurrentPage(0)
          setSearchQuery(query)
          break;
        default :

      }
    }
  }

  const statusFilter = (rowIds) => {
    const statusFilter = _.filter(masterStatus, (o) => {
      return rowIds.includes(o?.id)
    })
    setSelectedStatus(statusFilter)
  }


  const sortColumns = (field, order) => {
    // const tempCcm = [...ccmData]
    // const sortedData = _.orderBy(tempCcm, [field], [order])
    const query = `facilityname=null&carecoordinatorsname=null&podleadername=null&poddomainname=null&transactioncomments=null&sendreportstatusid=null&completedDate=${order}`
    setcurrentPage(0)
    setSearchQuery(query)
    // setCCMData(sortedData)
    // // console.log(sortedData);
    // setCurrentData(sortedData)
    // if(field === "status") {
    //   const tempStatus = [...selectedStatus]
    //   const sortedStatus = _.orderBy(tempStatus, ['value'], [order])
    //   setSelectedStatus(sortedStatus)
    // }
    
  }

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
          <a className="navbar-brand" href="#">CCM Console  <span className={styles.welcome}>Hello, {username} !</span></a>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item px-2">
              <button className="btn btn-sm btn-outline-secondary"
                onClick={exportCcmData}
              >Export</button>
            </li>
	            {canEdit ? 
                <li className="nav-item">
                  <button className="btn btn-sm btn-outline-secondary saveBtn" type="button" disabled={disabled} onClick={saveCCMTable}>Save</button>
                </li> : 
              ""}
          </ul>
        </div>
      </nav>

      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid float-end">
          <ul className="navbar-nav">
            {
              navMonths.map((item, index) => {
                return (
                  <li className="nav-item px-2" key={index}>
                    <a onClick={() => setCurrentMonthData(item)} 
                      className={`nav-link ${item === activeId ? styles.activeMonth : ''}`} 
                      key={index} aria-current="page" href="#">
                        {moment(item).format('MMMM')}
                    </a>
                  </li>
                )
              })
            }
          </ul>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDateChosen(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            customInput={<FontAwesomeIcon icon={faCalendar} />}
            className="datepickerPlacement"
            popperClassName="datepickerPop"
            maxDate={startDate}
            selectsDisabledDaysInRange
          />
        </div>
      </nav>


      <div className="tableWrapper table-responsive ">
        <table className={`table ${!canEdit ? 'disable-input' : ''}`}>
          <thead className="enable-input ">
            <tr>
              <th scope="col">ID</th>
              <th scope="col" >
                <span className={`${styles.exportedHeader}`}>
                  <FontAwesomeIcon icon={faFileUpload}></FontAwesomeIcon>
                  <FontAwesomeIcon icon={faCloudDownload}></FontAwesomeIcon>
                </span>
              </th>
              <th scope="col">
                {!facilitySearch ? 
                  <span>
                    Facilty Name
                    <span className={`${styles.facilitySearchIcon}`}>
                      <FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => {
                        searchToogle(true, "facility")
                        setCurrentItems([...ccmData])
                        
                      }}></FontAwesomeIcon>
                    </span>
                  </span>
                  :
                  <span className={`${styles.facilitySearch}`}>
                    <input autoFocus className={`${styles.facilitySearchInput} form-control`} type="input" placeholder="Search" aria-label="Search"
                      onChange={(event) => facilityNameSearch(event)} autofocus
                      onKeyDown={(event) => onEnter(event)}
                    ></input>
                    <FontAwesomeIcon icon={faXmark} size="lg" className={`${styles.facilityfaXmark}`} onClick={() => searchToogle(false, "facility")}></FontAwesomeIcon>
                  </span>
                }
                
              </th>
              <th scope="col">
                {!coordinSearch ? 
                  <span>
                    Care Co-Ordinator
                    <span className={`${styles.facilitySearchIcon}`}>
                      <FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => {
                        searchToogle(true, "coordinator")
                        setCurrentItems([...ccmData])
                        }}></FontAwesomeIcon>
                    </span>
                  </span>
                  :
                  <span className={`${styles.facilitySearch}`}>
                    <input autoFocus className={`${styles.facilitySearchInput} form-control`} type="input" placeholder="Search" aria-label="Search"
                      onChange={(event) => coordinatorSearch(event)} autofocus
                      onKeyDown={(event) => onEnter(event)}
                    ></input>
                    <FontAwesomeIcon icon={faXmark} size="lg" className={`${styles.facilityfaXmark}`} onClick={() => searchToogle(false, "coordinator")}></FontAwesomeIcon>
                  </span>
                }
              </th>
              <th scope="col">
                
                {!podSearch ? 
                  <span>
                    POD Domain
                    <span className={`${styles.facilitySearchIcon}`}>
                      <FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => {
                        searchToogle(true, "podDomain")
                        setCurrentItems([...ccmData])
                        }}></FontAwesomeIcon>
                    </span>
                  </span>
                  :
                  <span className={`${styles.facilitySearch}`}>
                    <input autoFocus className={`${styles.facilitySearchInput} form-control`} type="input" placeholder="Search" aria-label="Search"
                      onChange={(event) => podDomainSearch(event)} autofocus
                      onKeyDown={(event) => onEnter(event)}
                    ></input>
                    <FontAwesomeIcon icon={faXmark} size="lg" className={`${styles.facilityfaXmark}`} onClick={() => searchToogle(false, "podDomain")}></FontAwesomeIcon>
                  </span>
                }
              </th>
              <th scope="col">
                {!podLeaderSearch ? 
                  <span>
                    POD Leaders
                    <span className={`${styles.facilitySearchIcon}`}>
                      <FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => {
                        searchToogle(true, "podLeaders")
                        setCurrentItems([...ccmData])
                        }}></FontAwesomeIcon>
                    </span>
                  </span>
                  :
                  <span className={`${styles.facilitySearch}`}>
                    <input autoFocus className={`${styles.facilitySearchInput} form-control`} type="input" placeholder="Search" aria-label="Search"
                      onChange={(event) => podLeadersSearch(event)} 
                      onKeyDown={(event) => onEnter(event)}
                    ></input>
                    <FontAwesomeIcon icon={faXmark} size="lg" className={`${styles.facilityfaXmark}`} onClick={() => searchToogle(false, "podLeaders")}></FontAwesomeIcon>
                  </span>
                }

              </th>
              <th scope="col">Comments</th>
              <th scope="col">
                {!statusSearch ? 
                  <span >
                    Status
                    <span className={`${styles.facilitySearchIcon}`}>
                      <FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => {
                        searchToogle(true, "status")
                        setCurrentItems([...ccmData])
                        }}></FontAwesomeIcon>
                    </span>
                  </span>
                  : 
                  <span className={`${styles.facilitySearch}`}>
                    <input autoFocus className={`${styles.facilitySearchInput} form-control`} type="input" placeholder="Search" aria-label="Search"
                      onChange={(event) => statusesSearch(event)}
                      onKeyDown={(event) => onEnter(event)}
                    ></input>
                    <FontAwesomeIcon icon={faXmark} size="lg" className={`${styles.facilityfaXmark}`} onClick={() => searchToogle(false, "status")}></FontAwesomeIcon>
                  </span>
                }
                
                {/* <span className={`${styles.statusSortIcon}`}>
                    <FontAwesomeIcon icon={faAngleUp} onClick={() => sortColumns('status', 'asc')}/>
                    <FontAwesomeIcon icon={faAngleDown} onClick={() => sortColumns('status', 'desc')}/>
                </span> */}
              </th>
              <th scope="col">Completed File</th>
              <th scope="col">
                
                <span className={`${styles.statusSort}`}>
                  Completed date
                  <span className={`${styles.statusSortIcon}`}>
                    <FontAwesomeIcon icon={faAngleUp} onClick={() => sortColumns('completedDate', 'ASC')}/>
                    <FontAwesomeIcon icon={faAngleDown} onClick={() => sortColumns('completedDate', 'DESC')}/>
                  </span>
                </span>
              </th>
              <th scope="col">eMail</th>
            </tr>
          </thead>
          {pageRender == true ?
          <tbody >
            {
              currentItems.map((item, index) => {
                return (
                  <tr key={`CCM_${index}`}>
                    <th scope="row">{item?.iid}</th>

                    <td>
                      <div className='exportedFileWrapper'>
                        <div className='exportedFileSection'>
                          
                          <span className={``}>
                            {/* <a className={`${item.exportedFilePath == "s3path" ? "disabled" : "expertedFileTooltip"} ${styles.exportedFileLink}`} 
                              target="_blank" > 
                            </a> */}
                            <span onClick={() => uploadCompletedFile(item, 'importedFile')}>
                                <FontAwesomeIcon icon={faFileUpload}></FontAwesomeIcon> 
                                {/* Upload  */}
                            </span>
                            {item.exportedFilePath != "s3path" ? 
                                // <span className={``} data-tooltip-id="my-tooltip" data-tooltip-content={item?.exportedFilePath.split("/")[1]}>
                                //   <FontAwesomeIcon icon={faFileLines} /> 
                                //   {item.exportedFilePath.split("/")[1]} 
                                // </span> 
                                <></>
                                : 
                                <></>
                                // <span onClick={() => uploadCompletedFile(item?.id, 'importedFile')}>
                                //     <FontAwesomeIcon icon={faFileUpload}></FontAwesomeIcon> 
                                //     {/* Upload  */}
                                // </span>
                                
                            }
                          </span>
                        </div>
                        <div className='exportedFileRsection'>
                          { (item.exportedFilePath != null && item?.exportedFilePath != "") ? 
                            <a target="_blank" href={`${ENDPOINTS.apiEndoint + 'filedownload?filepath=' + item?.exportedFilePath}`} style={{pointerEvents: "all"}} >
                              <FontAwesomeIcon icon={faCloudDownload}></FontAwesomeIcon>
                            </a> : null 
                          }
                        </div>   
                        <span className='clear'></span>
                      </div>
                    </td>
                    <td><span className={`${styles.tdFacility}`}>{item.facilityName}</span></td>
                    <td>
                      <div
                      className="enable-input"
                      data-tooltip-id="my-tooltip" 
                            data-tooltip-content={(!!selectedCareCoordinators[index] && !!selectedCareCoordinators[index].length) ?
                                                  selectedCareCoordinators[index].filter(e => !!e).map(e => e.label).join(", ") : ""}>
                        <Select options={careCoordinator}
                          className={`react-select-container ${disabled ? 'customDisabled' : ''} ${canEdit ? 'enable-input' : 'disable-input'}`}
                          classNamePrefix="react-select"
                          isSearchable isClearable={false}
                          id={`idCare_${index}`}
                          key={`idCareKey_${index}`}
                          components={{ MultiValue, Option: InputOption }}
                          hideSelectedOptions={false}
                          isDisabled={item?.writeAccess === 0}
                          isMulti
                          onChange={(option) => handleCareCoordinatorChange(index, option, item?.id)}
                          value={selectedCareCoordinators[index] ? selectedCareCoordinators[index] : selectedCareCoordinators[index]}
                        /> 
                      </div>
                    
                    </td>

                    <td>
                      {/* {JSON.stringify({d: selectedPodDomain[index]})} */}
                      <div
                        className="enable-input"
                        data-tooltip-id="my-tooltip" 
                              data-tooltip-content={!!selectedPodDomain[index] ? selectedPodDomain[index]?.label : ""}>
                      <Select options={podDomains}
                        placeholder={"Select..."}
                        className={`react-select-container ${disabled ? 'customDisabled' : ''} ${canEdit ? 'enable-input' : 'disable-input'}`}
                        classNamePrefix="react-select"
                        id={`idpoddomian_${index}`}
                        isSearchable isClearable={false}
                        isDisabled={item?.writeAccess === 0}
                        onChange={(option) => handlePodDomainChange(index, option, item?.id)}
                        value={selectedPodDomain[index] && selectedPodDomain.label ? selectedPodDomain[index] : []} /> 
                      </div>
                       {console.log(item.facilityName, "facility",selectedPodDomain[index] )}
                     
                      
                    </td>

                    <td>
                      <div 
                      className="enable-input"
                      data-tooltip-id="my-tooltip" 
                            data-tooltip-content={(!!selectedLeaders[index] && !!selectedLeaders[index].length) ? selectedLeaders[index].filter(e => !!e).map(e => e.label).join(", ") : ""}>
                        <Select options={podLeaders}
  
                          className={`react-select-container ${disabled ? 'customDisabled' : ''} ${canEdit ? 'enable-input' : 'disable-input'}`}
                          classNamePrefix="react-select"
                          isSearchable isClearable={false}
                          id={`idLeaders_${index}`}
                          key={`idLeaderKey_${index + '_' + item?.id}`}
                          isMulti
                          components={{ MultiValue, Option: InputOption }}
                          hideSelectedOptions={false}
                          isDisabled={item?.writeAccess === 0}
                          onChange={(option) => handleLeaderChange(index, option, item?.id)}
                          value={selectedLeaders[index] ? selectedLeaders[index] : selectedLeaders[index]} />
                      </div>
                    </td>

                    <td 
                    >
                      {(comments[index]?.value == null || comments[index]?.value == '') ? 
                        <div>
                          <span className={`${styles.commentMsg}`}>
                            <textarea rows="1" cols="10" id={`id_${index}`} data-tooltip-id="my-tooltip"
                              data-tooltip-content={comments[index]?.value ? comments[index]?.value : ""}
                              onChange={(event) => commentValue(event, index, item?.id)}
                              onBlur={() => handleCommentClick(index, comments[index].show, item?.id)}
                              defaultValue={comments[index]?.value ? comments[index]?.value : ""} 
                              disabled={item?.writeAccess === 0}
                              />
                          </span>
                          <span className={`${styles.clear}`}></span>
                        </div> 
                        : 
                        <>
                          {comments[index] && comments[index]['show'] ? 
                            <div>
                                <span className={`${styles.commentMsg}`}>
                                  <textarea rows="1" cols="10" id={`id_${index}`} data-tooltip-id="my-tooltip"
                                    data-tooltip-content={comments[index].value ? comments[index].value : ""}
                                    onChange={(event) => commentValue(event, index, item?.id)}
                                    onBlur={() => handleCommentClick(index, comments[index].show, item?.id)}
                                    defaultValue={comments[index].value ? comments[index].value : ""} 
                                    disabled={item?.writeAccess === 0}
                                    />
                                </span>
                                <span className={`${styles.clear}`}></span>
                            </div>
                            :
                            <div className={`${styles.commentWrapper} enable-input`} 
                              data-tooltip-id="my-tooltip"
                              data-tooltip-content={(comments[index] && comments[index].value) ? item.comments : ""}
                            >
                              {comments[index] && comments[index].value != null ? 
                                <span className={`${styles.commentIcon}`} 
                                  >
                                  <FontAwesomeIcon onClick={()=> handleCommentClick(
                                    index,
                                    comments[index].show,
                                    item?.id
                                  )}
                                  icon={faMessage}
                                ></FontAwesomeIcon>
                                </span>  : null}
                            </div>
                          }
                        </>
                      }
                      
                    </td>

                    <td
                    >
                      <div className={`${styles.statusDropdown}`}>
                        <Dropdown
                        key={selectedStatus[index] ? selectedStatus[index]['className'] : !!selectedStatus[index] ? selectedStatus[index]['className'] : ""}
                        options={options}
                        onChange={(option) => statusChange(index, option, item?.id)}
                        className={`${styles.dropdownCustom}`}
                        arrowClassName={`${styles.dropdownArrow}`}
                        placeholderClassName={selectedStatus[index] ? selectedStatus[index]['className'] : !!selectedStatus[index] ? selectedStatus[index]['className'] : ""}
                        disabled={item?.writeAccess === 0}
                        menuClassName={selectedStatus[index] ? selectedStatus[index]['className'] : !!selectedStatus[index] ? selectedStatus[index]['className'] : ""}
                        controlClassName={selectedStatus[index] ? selectedStatus[index]['className'] : !!selectedStatus[index] ? selectedStatus[index]['className'] : ""}
                        value={selectedStatus[index] ? selectedStatus[index] : selectedStatus[index]}
                        placeholder="Select an option" />
                        {String(item?.status).toLowerCase() === 'rejected' ? <span
                    className="enable-input"
                        ><FontAwesomeIcon icon={faFile} data-tooltip-id="my-tooltip" data-tooltip-content={item?.rejectedReason} /></span> : null}
                      </div>
                    </td>

                    <td >
                      <div className={`${styles.completedFileWrapper}`}>
                        {item?.completedFile != null ? <span className={`${styles.completedFileIcon}`}><FontAwesomeIcon icon={faFileLines} /></span> : ""}
                        {item?.completedFile == null ? 
                          <span onClick={() => uploadCompletedFile(item, 'completedFile')}>
                            <FontAwesomeIcon icon={faFileUpload}></FontAwesomeIcon> Upload 
                          </span> 
                            : 
                          <span onClick={() => uploadCompletedFile(item, 'completedFile')} className={`${styles.completedFileName}`} data-tooltip-id="my-tooltip" data-tooltip-content={item?.completedFile.split("/")[1]}> {item?.completedFile.split("/")[1]} </span>}
                        <div className='exportedFileRsection'>
                          { item?.completedFile != null ? <a target="_blank" style={{pointerEvents: "all"}} href={`${ENDPOINTS.apiEndoint + 'filedownload?filepath=' + item?.completedFile}`}><FontAwesomeIcon icon={faCloudDownload}></FontAwesomeIcon></a> : null }
                        </div>
                      </div>
                    </td>

                    <td><span className={`${styles.completedDate}`}>{item?.completedDate == null ? "-" : moment(item?.completedDate).format("YYYY-MM-DD HH:mm")}</span></td>
                    <td>
                        <button onClick={() => sendMail(item?.id)} 
                          className={`btn btn-xs btn-outline ${styles.sendMail} ${item?.completedFile == null ? 'disabled customDisabled' : ''}`}
                          disabled={item?.writeAccess === 0}
                        >
                          Send Mail
                          {item.sendReport === "SENT" ? 
                            <span className="" > <FontAwesomeIcon icon={faCheck} /></span>
                            : < ></>
                          }
                          {item.sendReport ==="READRECEIPT"?
                           <span className="" > <FontAwesomeIcon icon={faCheckDouble} /></span>
                           : < ></>}
                           
                        </button>
                      
                    </td>
                  </tr>
                )
              })
            }

          </tbody>
            :null}
         
        </table>
        {pageRender == true ?
        <div className='rightAligin'>
          {ccmData.length > 0 ? <div>
            <ul className="pageNumbers">
              <li>
                <button className='btn btn-sm btn-outline-secondary saveBtn'
                  onClick={handlePrevbtn}
                  disabled={(currentPage+1) == pages[0] ? true : false}
                >
                  {'<'}
                </button>
              </li>
              {/* {pageDecrementBtn} */}
              {renderPageNumbers}
              {/* {pageIncrementBtn} */}
              <li>
                
                <button className='btn btn-sm btn-outline-secondary saveBtn'
                  onClick={handleNextbtn}
                  disabled={(currentPage+1 ) == pages[pages.length-1] ? true : false}
                >
                  {'>'}
                </button>
              </li>
            </ul>
            {/* <button onClick={handleLoadMore} className="loadmore">
              Load More
            </button> */}
            </div>
            : null }
        </div>:null}
        <Popup open={open} closeOnDocumentClick onClose={closeModal}>
          <div className="card">
            <div className="card-body">
              <button className='btn btn-xs btn-danger float-right float-end mt-2' onClick={closeModal}>X</button>
              <div>
                {isfileUpload ? <div>
                  Upload file
                  <div>
                    <input type="file" name="file" onChange={changeHandler} />
                    <div>
                      <button className='btn btn-xs btn-success saveBtn mt-2' onClick={handleSubmission}>Submit</button>
                    </div>
                  </div>

                </div> :
                  <div>
                    <span>Please provide reject reason</span>
                    <textarea cols="50" rows="4" className='mt-2' onChange={(event) => commentRejectValue(event)} />
                    <div>
                      <button className='btn btn-xs btn-success saveBtn' onClick={saveRejectReason}>Save</button>
                    </div>
                  </div>}

              </div>
            </div>
          </div>

        </Popup>
        <Tooltip id="my-tooltip" />

        <AlertDismissable
          show={showAlert}
          msg={alert.alertMsg}
          varient={alert.varient}
          icon={alert.icon}
          onClose={() => {
            setShowAlert(false);
          }}
        />

        <CircleSpinnerOverlay
          loading={loading}
          overlayColor="rgba(0,153,255,0.2)"
        />

      </div>

    </>
  )
}
