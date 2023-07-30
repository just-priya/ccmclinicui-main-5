import Head from 'next/head'
import { useRouter } from 'next/router';

import Image from 'next/image'
import Select, { components }  from 'react-select'
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import axios from 'axios';
import Multiselect from 'multiselect-react-dropdown';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faCalendar, faMagnifyingGlass, faXmark, faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import DatePicker from "react-datepicker";
import Dropdown from 'react-dropdown';
import { Tooltip } from 'react-tooltip';
import "react-datepicker/dist/react-datepicker.css";
import 'react-dropdown/style.css';
import 'react-tooltip/dist/react-tooltip.css'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { CircleSpinnerOverlay } from 'react-spinner-overlay'
import AlertDismissable from "./alertDismissable";

import { Inter } from 'next/font/google'
import styles from '../../../styles/Dashboard.module.css';
import adminStyles from '../../../styles/Admin.module.css';
import ENDPOINTS from '../../../utils/enpoints';
const _ = require('lodash');

const inter = Inter({ subsets: ['latin'] })

export default function Master ({setFilterData},props){ 

  const [podDomains, setPodDomains] = useState([]);
  const [careCoordinator, setCareCoordinator] = useState([]);
  const [podLeaders, setPodLeaders] = useState([]);
  const [navMonths, setNavMonths] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [group, setGroup] = useState([])
  const [username, setUsername] = useState("");
  const [disabled, setDisabled] = useState(false)
  const [masterCcm, setMasterCcm] = useState([])
  const [filteredMasterccm, setFilteredMasterccm] = useState([])

  const [selectedPodDomain, setSelectedPodDomain] = useState([]);
  const [selectedCareCoordinators, setSelectedCareCoordinators] = useState([]);
  const [selectedLeaders, setSelectedLeaders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([])
  const [rejectIndex, setRejectIndex] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [facilitySearch, setFacilitySearch] = useState(false);

  const [statusSearch, setStatusSearch] = useState(false);
  const [coordinSearch, setCoordinSearch] = useState(false);
  const [podSearch, setPodSearch] = useState(false);
  const [podLeaderSearch, setPodLeaderSearch] = useState(false);

  const defaultQuery = "facilityname=null&carecoordinatorsname=null&podleadername=null&poddomainname=null&sendreportstatusid=null&terminationDate='ASC'"

  const [masterPodDomain, setMasterPodDomain] = useState([]);
  const [masterCoordinator, setMasterCoordinator] = useState([]);
  const [masterpodLeaders, setMasterPodLeaders] = useState([]);
  const [masterStatus, setMasterStatus] = useState([])
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({
    alertMsg: "",
    varient: "success",
    alertIcon: "info-circle",
  });
  const [showAlert, setShowAlert] = useState(false);

  // pick only dirty rows
  const [dirtyRows, setDirtyRows] = useState([]);

  const [open, setOpen] = useState(false);
  const [totalPages, settotalPages] = useState(0);
  const [currentPage, setcurrentPage] = useState(0);
  const [itemsPerPage, setitemsPerPage] = useState(50);

  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(10);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);
  const [searchQuery, setSearchQuery] = useState(defaultQuery);
  const [searchVal, setSearchVal] = useState({
    name: '',
    val: ''
  });
  

  const router = useRouter();

  const closeModal = () => {
    setOpen(false);
    // setIsfileUpload(false)
  }
  
  const options = [
    { value: 'reescalated', label: 'Re-esclated', className: 'cls_reesclated', comments: "" },
    { value: 'rejected', label: 'Rejected', className: 'cls_rejected', comments: "" },
    { value: 'approved', label: 'Approved', className: 'cls_approved', comments: "" },
    { value: 'completed', label: 'Completed', className: 'cls_completed', comments: "" },
    { value: 'inprocess', label: 'Inprocess', className: 'cls_inprocess', comments: "" },
    { value: 'hold', label: 'Hold', className: 'cls_hold', comments: "" }
  ];

  const handleClick = (event) => {
    
    setcurrentPage(Number(event.target.id) - 1);
    // setCurrentItem()
  };
  
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // let currentItems = ccmData.slice(indexOfFirstItem, indexOfLastItem);

  const renderPageNumbers = pages.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <li
          key={number}
          id={number}
          onClick={handleClick}
          className={(currentPage + 1) == number ? "active" : null}
        >
          {number}
        </li>
      );
    } else {
      return null;
    }
  });

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
  }

  const handleNextbtn = () => {
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
    const current = currentPage - 1
    setcurrentPage(current);
  

    if ((currentPage - 1) % pageNumberLimit == 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
    // loadPaginatedData()
    // setCurrentData(ccmData)
  };

  const loadUserInfo = () => {
    const group = localStorage.getItem("_MEDUSER_GR")
    if(group == null) {
      localStorage.removeItem("_MEDUSER_USERNAME")
      localStorage.removeItem("_MEDUSER_GR")
      localStorage.removeItem("_MEDUSER")
      router.push('/login')
    }else {
      const userData = JSON.parse(localStorage.getItem("_MEDUSER"))
      setUsername(userData?.username)
      setGroup(group)
      group.includes('read') ? setDisabled(true) : setDisabled(false);
    }
   
  }


  const getCurrentMonth = () => {
    const currentDay =  moment(new Date(), 'YYYY/MM/DD');
    const currentMonth  = currentDay.format('MMMM');
    const currentMonth_1 = moment(currentDay).subtract(1, 'months').format('MMMM');
    const currentMonth_2 = moment(currentDay).subtract(2, 'months').format('MMMM');
    // console.log(currentMonth, currentMonth_1, currentMonth_2)
    setNavMonths([currentMonth_2, currentMonth_1, currentMonth])

  }

  const MoreSelectedBadge = ({ items }) => {
    const style = {
      marginLeft: "auto",
      background: "#d4eefa",
      borderRadius: "4px",
      fontFamily: "Open Sans",
      fontSize: "11px",
      padding: "3px",
      order: 99
    };
  
    const title = items.join(", ");
    const length = items.length;
    const label = `+ ${length}`;
  
    return (
      <div style={style} title={title}>
        {label}
      </div>
    );
  };

  const handleDateChange = (date, index, dateType, rowId) => {
    // console.log(date, index)
    const modDate = moment(date).format()
    const tempData = [...filteredMasterccm]
    tempData[index][dateType] = modDate

    const tempMaterData = [...masterCcm]
    const temp = _.filter(tempMaterData, (o) => o.id === tempData[index]['id'])[0]
    setFilterData(tempData)
    setFilteredMasterccm(tempData)
    tempMaterData[tempMaterData.indexOf(temp)][dateType] = modDate
    setMasterCcm(tempMaterData)
    addToDirtyRow(rowId)
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
      .slice(maxToShow)
      .map((x) => x.label);

    return index < maxToShow ? (
      <components.MultiValue {...props} />
    ) : index === maxToShow ? (
      <MoreSelectedBadge items={overflow} />
    ) : null;
  };


  const addToDirtyRow = (rowId) => {
    if (dirtyRows.indexOf(rowId) == -1) {
      const tempDirtyRows = dirtyRows;
      tempDirtyRows.push(rowId)
      setDirtyRows(tempDirtyRows)
    } else {
      // console.log("row id " + rowId + " is already in dirtylist")
    }
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
    }
}

const handleCareCoordinatorChange = (index, option, rowId) => {
  // const i = index + indexOfFirstItem
  var temp = [...selectedCareCoordinators] //[[1,2], [1]]
  //console.log(temp[index]['selected'])
  temp[index] = option;
  setSelectedCareCoordinators(temp);
  setMasterCoordinator(temp)
  addToDirtyRow(rowId)
}


const handlePodDomainChange = (index, option, rowId) => {
  // index = index + indexOfFirstItem
  var temp = [selectedPodDomain]
  temp[index]['value'] = option['value']
  temp[index]['label'] = option['label']
  setSelectedPodDomain(temp)
  setMasterPodDomain(temp)
  addToDirtyRow(rowId)
  console.log( temp[index], "temp");
}

const handleLeaderChange = (index, option, rowId) => {
  // index = index+indexOfFirstItem
  var temp = [...selectedLeaders] //[[1,2], [1]]
  //console.log(temp[index]['selected'])
  temp[index] = option;
  setSelectedLeaders(temp);
  setMasterPodLeaders(temp)
  addToDirtyRow(rowId)
}

const handleEmailChange = (event, index, rowId) => {
  const tempData = [...masterCcm]
  tempData[index]['emailId'] = event.target.value
  setMasterCcm(tempData)
  addToDirtyRow(rowId)
}

const helper = (ccmData, pods, care, leaders) => {
  const selectedCareOrdin = [];
  const selectedPodLeaders = [];
  let tempPods = [];
  let status = []
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
    if (element.status === 'reescalated') {
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
    var temp = { index: ccmIndex, value: element.comments, show: false }
    // setComments(oldvalue => [...oldvalue, temp])

    //pod domain 
    var tempSelectedPod = pods.filter((el, i) => {
      if (el.value === element.podDomainId)
        return el
    })
    const tempPodSelection = tempSelectedPod[0] ? tempSelectedPod[0] : [];
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
        // console.log(foundCareCorordinator)
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
  setSelectedPodDomain(tempPods)
  setMasterStatus(status)
  setMasterCoordinator(selectedCareOrdin)
  setMasterPodDomain(tempPods)
  setMasterPodLeaders(selectedPodLeaders)
  //)
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

  const getmasterccmDetails = async () => {
    const response = await axios.get(ENDPOINTS.apiEndoint + `ccm/getmasterccmdetails?${searchQuery}&limit=${itemsPerPage}&offset=${currentPage}`)
    return response?.data
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

  const saveCCMTable = async () => {

    for (var i = 0; i < masterCcm.length; i++) {
      console.log("selectedStatus", selectedStatus)
      console.log("i:", i)
      if (selectedStatus[i] && selectedStatus[i]['value'] !== null) {
        masterCcm[i]['status'] = selectedStatus[i]['value']
      } else {
        masterCcm[i]['status'] = null
      }
      // masterCcm[i]['comments'] = comments[i]['value']

      console.log("selectedPodDomain:" , selectedPodDomain)
      // pod domians
      masterCcm[i]['podDomainId'] = selectedPodDomain[i]['value']

      // pod leaders
      let item = selectedLeaders[i]
      let newArray = item.flatMap(i => {
        if (i != undefined) {
          return i?.value
        }
      })
      var tempLeaders = _.compact(newArray)

      if (tempLeaders.length > 0) {
        masterCcm[i]['podLeaders'] = tempLeaders
      } else {
        masterCcm[i]['podLeaders'] = tempLeaders
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
        masterCcm[i]['careCoordinators'] = tempCare
      } else {
        masterCcm[i]['careCoordinators'] = tempCare
      }

    }
    setLoading(true)
    setTimeout(async () => {

      // remove other rows with respect to dirty rows
      const dirtyRowsTobePatched = [];
      dirtyRows.map((item, index) => {
        const temp = masterCcm.find(obj => {
          return obj.id === item
        })
        dirtyRowsTobePatched.push(temp);
      })
      //console.log(dirtyRowsTobePatched)
      const response = await axios.put(ENDPOINTS.apiEndoint + "ccm/updatemasterccmdetails", dirtyRowsTobePatched)
      //console.log(response?.data)
      setLoading(false)
      showWarningMsg("Updated !", "success");
    }, 4000)
  }

  useEffect(() => {
    //Runs on the first render
    //And any time any dependency value changes
    loadUserInfo();
    getCurrentMonth();
    const promises =  [getPodDomains(), getCareCoordinator(), getPodLeaders(), getmasterccmDetails()];
    Promise.all(promises).then(([podDomains,careCoordinator, podLeaders, masterCcm])=> {
      let pod = podDomains?.responseDetails.map(({ name, id }) => ({ value: id, label: name }));
      pod = _.sortBy(pod, ['label'])
      setPodDomains(pod);
      let care = careCoordinator?.responseDetails.map(({ name, id }) => ({ value: id, label: name }));
      care = _.sortBy(care, ['label'])
      setCareCoordinator(care);
      let leaders = podLeaders?.responseDetails.map(({ name, id }) => ({ value: id, label: name }));
      leaders = _.sortBy(leaders, ['label'])
      setPodLeaders(leaders);

      const ccmData = masterCcm?.responseDetails;
      helper(ccmData?.ccmTransactions, pod, care, leaders)
      // console.log(ccmData)
      settotalPages(ccmData?.totalPages)
      setMasterCcm(ccmData?.ccmTransactions)
      setFilterData(ccmData?.ccmTransactions)
      setFilteredMasterccm(ccmData?.ccmTransactions)
      console.log("data fetch completed")
    });
  }, []);


  const loadPaginatedData = () => {
    const promises = [getmasterccmDetails()]
    Promise.all(promises).then(([masterCcm]) => {
      const ccmData = masterCcm?.responseDetails;
      // console.log(ccmData);
      helper(ccmData?.ccmTransactions, podDomains, careCoordinator, podLeaders)
      setMasterCcm(ccmData?.ccmTransactions)
      setFilterData(ccmData?.ccmTransactions)
      setFilteredMasterccm(ccmData?.ccmTransactions)
      // if(searchQuery !== defaultQuery) {
      settotalPages(ccmData?.totalPages)
      // }
    });
  }

  useEffect(() => {
    if(navMonths.length > 0) {
      setSelectedStatus([])
      loadPaginatedData()
    }
  }, [currentPage, searchQuery])

  useEffect ( () => {
    // console.log(props.saveTable);
    if(props.saveTable)
      saveCCMTable();

  }, [props.saveTable])

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
    if(!val) 
      // setFilteredMasterccm(masterCcm)
      // setSelectedCareCoordinators(masterCoordinator)
      // setSelectedStatus(masterStatus)
      // setSelectedPodDomain(masterPodDomain)
      // setSelectedLeaders(masterpodLeaders)
      setSearchQuery(defaultQuery)
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
          query = `facilityname=${search.val}&carecoordinatorsname=null&podleadername=null&poddomainname=null&sendreportstatusid=null&terminationDate='ASC'`
          setcurrentPage(0)
          setSearchQuery(query)
          break;
        case 'status':
          query = `facilityname=null&carecoordinatorsname=null&podleadername=null&poddomainname=null&sendreportstatusid=${search.val}&terminationDate='ASC'`
          setcurrentPage(0)
          setSearchQuery(query)
          break;
        case 'coordinator':
          query = `facilityname=null&carecoordinatorsname=${search.val}&podleadername=null&poddomainname=null&sendreportstatusid=null&terminationDate='ASC'`
          setcurrentPage(0)
          setSearchQuery(query)
          break;
        case 'podDomain':
          query = `facilityname=null&carecoordinatorsname=null&podleadername=null&poddomainname=${search.val}&sendreportstatusid=null&terminationDate='ASC'`
          setcurrentPage(0)
          setSearchQuery(query)
          break;
        case 'podLeader':
          query = `facilityname=null&carecoordinatorsname=null&podleadername=${search.val}&poddomainname=null&sendreportstatusid=null&terminationDate='ASC'`
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
    console.log("status filter is ", statusFilter)
    setSelectedStatus(statusFilter)
  }

  const sortColumns = (field, order) => {
    // const tempCcm = [...filteredMasterccm]
    // const sortedData = _.orderBy(tempCcm, [field], [order])
    const query = `facilityname=null&carecoordinatorsname=null&podleadername=null&poddomainname=null&sendreportstatusid=null&terminationDate=${order}`
    setcurrentPage(0)
    setSearchQuery(query)
    // setFilteredMasterccm(tempCcm)
    // console.log(sortedData);
    // // setCurrentData(sortedData)
    // if(field === "status") {
    //   const tempStatus = [...selectedStatus]
    //   const sortedStatus = _.orderBy(tempStatus, ['value'], [order])
    //   setSelectedStatus(sortedStatus)
    // } 
  }

  const commentRejectValue = (event) => {
    // if (event.target.value.length > 0) {
      setRejectReason(event.target.value)
    // }
  }

  const saveRejectReason = () => {
    if (rejectReason.length > 0) {
      masterCcm[rejectIndex]['rejectedReason'] = rejectReason
      masterCcm[rejectIndex]['status'] = 'rejected'
      closeModal()
    } else {
      alert("Status needs to be rolled back - no reason provided for reject")
      closeModal()
    }

  }

  return (
    <>
      <Head>
        <title>Medlite</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="tableWrapper table-responsive master-table">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">
                {!facilitySearch ? 
                  <span>
                    Facilty Name
                    <span className={`${styles.facilitySearchIcon}`}>
                      <FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => searchToogle(true, 'facility')}></FontAwesomeIcon>
                    </span>
                  </span>
                  :
                  <span className={`${styles.facilitySearch}`}>
                    <input autoFocus className={`${styles.facilitySearchInput} form-control`} type="input" placeholder="Search" aria-label="Search"
                      onChange={(event) => facilityNameSearch(event)}
                      onKeyDown={(event) => onEnter(event)}
                    ></input>
                    <FontAwesomeIcon icon={faXmark} size="lg" className={`${styles.facilityfaXmark}`} onClick={() => searchToogle(false, 'facility')}></FontAwesomeIcon>
                  </span>
                }

              </th>
              <th scope="col">
                {!coordinSearch ? 
                  <span>
                    Care Co-Ordinator
                    <span className={`${styles.facilitySearchIcon}`}>
                      <FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => searchToogle(true, "coordinator")}></FontAwesomeIcon>
                    </span>
                  </span>
                  :
                  <span className={`${styles.facilitySearch}`}>
                    <input autoFocus className={`${styles.facilitySearchInput} form-control`} type="input" placeholder="Search" aria-label="Search"
                      onChange={(event) => coordinatorSearch(event)}
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
                      <FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => searchToogle(true, "podDomain")}></FontAwesomeIcon>
                    </span>
                  </span>
                  :
                  <span className={`${styles.facilitySearch}`}>
                    <input autoFocus className={`${styles.facilitySearchInput} form-control`} type="input" placeholder="Search" aria-label="Search"
                      onChange={(event) => podDomainSearch(event)}
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
                      <FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => searchToogle(true, "podLeaders")}></FontAwesomeIcon>
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
              <th scope="col">
                {!statusSearch ? 
                  <span >
                    Status
                    <span className={`${styles.facilitySearchIcon}`}>
                      <FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => searchToogle(true, "status")}></FontAwesomeIcon>
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
              </th>
              <th scope="col">Email ID</th>
              <th scope="col">Onboard Date</th>
              <th scope="col">Effective Date</th>
              <th scope="col">
              <span className={`${styles.statusSort}`}>
                  Termination Date
                  <span className={`${styles.statusSortIcon}`}>
                    <FontAwesomeIcon icon={faAngleUp} onClick={() => sortColumns('terminationDate', 'ASC')}/>
                    <FontAwesomeIcon icon={faAngleDown} onClick={() => sortColumns('terminationDate', 'DESC')}/>
                  </span>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMasterccm.map((item, index) => {
              console.log(index + ": item printing is and is index is " , item)
              return (
                <tr key={`ccm_master_${index}`}>
                  <th scope="row">{item.iid}</th>
                  <td><span className={`${styles.tdFacility}`}>{item.facilityName}</span></td>
                  <td>
                  <div data-tooltip-id="tooltip-master" 
                            data-tooltip-content={(!!selectedCareCoordinators[index] && !!selectedCareCoordinators[index].length) ? selectedCareCoordinators[index].map((e) => e?.label).join(", ") : ""}
                            >
                    <Select options={careCoordinator}
                      className={`react-select-container ${disabled ? 'customDisabled' : ''}`}
                      classNamePrefix="react-select" 
                      isSearchable isClearable={false} 
                      isMulti 
                      closeMenuOnSelect={false} 
                      components={{ MultiValue, Option: InputOption }}
                      hideSelectedOptions={false}
                      id={`idCare_${index}`}
                      key={`idCareKey_${index}`}
                      onChange={(option) => handleCareCoordinatorChange(index, option, item?.id)}
                      value={selectedCareCoordinators[index] ? selectedCareCoordinators[index] : selectedCareCoordinators[0]}  
                    />
                  </div> 
                  </td>
                  
                  <td>
                    <div 
                      data-tooltip-id="tooltip-master" 
                      data-tooltip-content={!!selectedPodDomain[index] ? selectedPodDomain[index].label : ""}>
                      <Select 
                        className={`react-select-container ${disabled ? 'customDisabled' : ''}`}
                        classNamePrefix="react-select"
                        options={podDomains} 
                        isSearchable isClearable 
                        isDisabled={disabled} 
              
                        id={`idpoddomian_${index}`}
                        onChange={(option) => handlePodDomainChange(index, option, item?.id)}
                        value={selectedPodDomain[index] ? selectedPodDomain[index] : selectedPodDomain[0]}
                      /> 
                  
                    </div>
                  </td>
                  <td>
                    <div data-tooltip-id="tooltip-master" 
                              data-tooltip-content={!!selectedLeaders[index].length ? selectedLeaders[index].map((e) => e.label).join(", ") : ""}>
                        <Select 
                          className={`react-select-container ${disabled ? 'customDisabled' : ''}`}
                          classNamePrefix="react-select"
                          options={podLeaders} 
                          isSearchable isClearable={false} 
                          isMulti 
                          closeMenuOnSelect={false} 
                          components={{ MultiValue, Option: InputOption }}
                          onChange={(option) => handleLeaderChange(index, option, item?.id)}
                          id={`idLeaders_${index}`}
                          key={`idLeaderKey_${index + '_' + item?.id}`} 
                          value={selectedLeaders[index] ? selectedLeaders[index] : selectedLeaders[0]}
                        /> 
                    </div>
                  </td>
                  <td>
                    <div className={`${styles.statusDropdown}`}>
                      <Dropdown
                        key={selectedStatus[index] ? selectedStatus[index]['className'] : !!selectedStatus[index] ? selectedStatus[index]['className'] : ""}
                        options={options}
                        onChange={(option) => statusChange(index, option, item?.id)}
                        className={`${styles.dropdownCustom}`}
                        arrowClassName={`${styles.dropdownArrow}`}
                        placeholderClassName={selectedStatus[index] ? selectedStatus[index]['className'] : !!selectedStatus[index] ? selectedStatus[index]['className'] : ""}
                        menuClassName={selectedStatus[index] ? selectedStatus[index]['className'] : !!selectedStatus[index] ? selectedStatus[index]['className'] : ""}
                        controlClassName={selectedStatus[index] ? selectedStatus[index]['className'] : !!selectedStatus[index] ? selectedStatus[index]['className'] : ""}
                        value={selectedStatus[index] ? selectedStatus[index] : null}
                        placeholder="Select an option" />
                        {item?.status === 'rejected' ? 
                          <span >
                            <FontAwesomeIcon icon={faFile} data-tooltip-id="tooltip-master" data-tooltip-content={item?.rejectedReason} />
                          </span> : null
                        }
                    </div>
                  </td>
                  <td className={`${adminStyles.greyFont}`}>
                    {/* {item.emailId} */}
                    <span className={`${styles.commentMsg}`}>
                      <input type="text"
                        className={`${adminStyles.emailInput}`}
                        data-tooltip-id="tooltip-master"
                        data-tooltip-content={item.emailId}
                        onChange={(event) => handleEmailChange(event, index, item.id)} 
                        value={item.emailId}
                      />
                      {/* <textarea rows="1" cols="10" 
                        data-tooltip-id="tooltip-master"
                        data-tooltip-content={item.emailId}
                        defaultValue={item.emailId} /> */}
                    </span>
                    
                  </td>
                  <td className={`${adminStyles.dateColumn}`}>
                    <div className={`${adminStyles.dateCalendarIcon}`}>
                      <FontAwesomeIcon icon={faCalendar} />
                      <DatePicker
                        className={`${adminStyles.dateInput}`}
                        selected={item?.onBoardingDate == null ? new Date() : new Date(item.onBoardingDate)}
                        onChange={(date) => handleDateChange(date, index, "onBoardingDate", item?.id)}
                      />
                    </div>
                    
        
                  </td>
                  <td className={`${adminStyles.dateColumn}`}>
                    <div className={`${adminStyles.dateCalendarIcon}`}>
                      <FontAwesomeIcon icon={faCalendar} />
                      <DatePicker
                        className={`${adminStyles.dateInput}`}
                        selected={item?.effectiveDate == null ? new Date() : new Date(item.effectiveDate)}
                        onChange={(date) => handleDateChange(date, index, "effectiveDate", item?.id)}
                      
                      />
                    </div>
                    
                  </td>
                  <td>
                    <div className={`${adminStyles.dateCalendarIcon}`}>
                      <FontAwesomeIcon icon={faCalendar} />
                      <DatePicker
                        className={`${adminStyles.dateInput}`}
                        selected={item?.terminationDate == null ? new Date() : new Date(item.terminationDate)}
                        onChange={(date) => handleDateChange(date, index, "terminationDate", item?.id)}
                      />
                    </div>
                    
                  </td>
                </tr>
              )}
            )}
          </tbody>
        </table>
        <div className='rightAligin'>
          {filteredMasterccm.length > 0 ? <div>
            <ul className="pageNumbers">
              <li>
                <button className='btn btn-sm btn-outline-secondary saveBtn'
                  onClick={handlePrevbtn}
                  disabled={(currentPage+1) == pages[0] ? true : false}
                >
                  {'<'}
                </button>
              </li>
              {pageDecrementBtn}
              {renderPageNumbers}
              {pageIncrementBtn}

              <li>
                <button className='btn btn-sm btn-outline-secondary saveBtn'
                  onClick={handleNextbtn}
                  disabled={(currentPage+1) == pages[pages.length - 1] ? true : false}
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
        </div>
        <Popup open={open} closeOnDocumentClick onClose={closeModal}>
          <div className="card">
            <div className="card-body">
              <button className='btn btn-xs btn-danger float-right float-end mt-2' onClick={closeModal}>X</button>
              <div>
                <span>Please provide reject reason</span>
                <textarea cols="50" rows="4" className='mt-2' value={rejectReason} onChange={(event) => commentRejectValue(event)} />
                <div>
                  <button className='btn btn-xs btn-success saveBtn' onClick={saveRejectReason}>Save</button>
                </div>
              </div>
            </div>
          </div>

        </Popup>
        <Tooltip id="tooltip-master" />
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
};
