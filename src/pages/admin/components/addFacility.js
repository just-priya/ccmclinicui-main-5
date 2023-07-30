import { useState, useEffect } from "react";
import styles from "../../../styles/Admin.module.css";
import ENDPOINTS from "@/utils/enpoints";
import axios from "axios";
import AlertDismissable from "./alertDismissable";
import Select, { components }  from 'react-select'

export default function AddFacility({ podDomainStatus, podLeaderStatus, careCoordinatorStatus }) {
  const [facilityName, setFacilityName] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [podDomainID, setPodDomainID] = useState("");
  const [podLeaderID, setPodLeaderID] = useState("");
  const [careCoordinatorId, setCareCoordinatorId] = useState("");
  const [podDomains, setPodDomains] = useState([]);
  const [podLeaders, setPodLeaders] = useState([]);
  const [emailID, setEmailID] = useState("");
  const [state, setState] = useState("");
  const [careCoordinators, setCareCoordinators] = useState([]);
  const [alert, setAlert] = useState({
    alertMsg: "",
    varient: "success",
    alertIcon: "info-circle",
  });
  const [showAlert, setShowAlert] = useState(false);

  const getTimeStamp = () => {
    return new Date(effectiveDate).getTime();
  };

  const isValid = () => {
    return (
      facilityName.length > 0 &&
      effectiveDate.length > 0 &&
      podDomainID.length > 0 &&
      podLeaderID.length > 0 &&
      state.length>0 && emailID.length>0
    );
  };

  const persistFacility = async (payload) => {
    const response = await axios.post(
      ENDPOINTS.apiEndoint + "ccm/createfacility",
      payload
    );
    return response?.data;
  };

  const clear = () => {
    setEffectiveDate("");
    setFacilityName("");
    setState("")
    setEmailID("");
  };

  const showWarningMsg = (msg, alertVarient) => {
    let alertObj = alert;
    alertObj["alertMsg"] = msg;
    alertObj["varient"] = alertVarient;
    setAlert(alertObj);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };

  const handleSubmit = () => {
  

    let isPayloadValid = isValid();
    if (!isPayloadValid) {
      showWarningMsg("Please Enter Valid data", "warning");
      return;
    }

    const payload = {
      name: facilityName,
      onboardDate: getTimeStamp(),
      podDomain:podDomainID,
      podLeader:podLeaderID,
      careCoordinator:careCoordinatorId,
      email: emailID,
      effectiveDate,
      state:state
    };

    const response = persistFacility(payload);
    response
      .then((data) => {
        if (data.status == "SUCCESS") {
          // console.log(data);
          showWarningMsg("Added New Facility Successfully", "success");
          clear();
        } else {
          showWarningMsg("Something went wrong, plese try again", "warning");
        }
      })
      .catch((err) => {
        showWarningMsg("Something went wrong, plese try again", "warning");
      });
  };

  const getPodDomains = async () => {
    // single select
    const response = await axios.get(
      ENDPOINTS.apiEndoint + "ccm/getpoddomains"
    );
    return response?.data;
  };

  const getPodLeaders = async () => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint + "ccm/getpodleaders"
    );
    return response?.data;
  };

  const getCareCoordinator = async () => {
    const response = await axios.get(
      ENDPOINTS.apiEndoint + "ccm/getcarecoordinators"
    );
    return response?.data;
  };

  useEffect(() => {
    //Runs on the first render
    //And any time any dependency value changes
    let podDomainDetails = getPodDomains();
    podDomainDetails.then((data) => {
      if (data.status === "SUCCESS") {
        const podDetails = data.responseDetails.map(({ name, id }) => ({
          value: id,
          label: name,
        }));
        setPodDomains(podDetails);
        if (podDetails.length > 0) {
          setPodDomainID(podDetails[0].value);
        }
      }
    });
  }, [podDomainStatus]);

  useEffect(() => {
    //Runs on the first render
    //And any time any dependency value changes
    let podLeaderDetails = getPodLeaders();
    podLeaderDetails.then((data) => {
      if (data.status === "SUCCESS") {
        const leaders = data.responseDetails.map(({ name, id }) => ({
          value: id,
          label: name,
        }));
        setPodLeaders(leaders);
        if (leaders.length > 0) {
          setPodLeaderID(leaders[0].value);
        }
      }
    });
  }, [podLeaderStatus]);

  useEffect(() => {
    //Runs on the first render
    //And any time any dependency value changes
    let careCoordinators = getCareCoordinator();
    careCoordinators.then((data) => {
      if (data.status === "SUCCESS") {
        const leaders = data.responseDetails.map(({ name, id }) => ({
          value: id,
          label: name,
        }));
        setCareCoordinators(leaders);
        if (leaders.length > 0) {
          setCareCoordinatorId(leaders[0].value);
        }
      }
    });
  }, [careCoordinatorStatus]);

  return (
    <>
      <form className="col-lg-3" onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}>
        <div
          className={`white_card card_height_100 mb_30 ${styles.formBorder}`}
        >
          <div className="white_card_header">
            <div className="box_header m-0">
              <div className="main-title">
                <h3 className="m-0">New Facility</h3>
              </div>
            </div>
          </div>
          <div className="white_card_body">
          <div className="mb-3">
              <label className="form-label" for="exampleInputPassword1">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Facility Name"
                required
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
              />
            </div>
           
              {/* <div className="mb-3">
                <label className="form-label" for="exampleInputEmail1">
                  Email address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  aria-describedby="name"
                  placeholder="Enter name"
                />
              </div> */}
              <div className="mb-3">
                <label className="form-label" for="exampleInputPassword1">
                  Care Coordinator
                </label>
                <Select
                value={careCoordinators.find((e) => e.value == careCoordinatorId)}
                onChange={(nVal) => {
                  setCareCoordinatorId(nVal.value);
                }}
                required
                options={careCoordinators}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" for="exampleInputPassword1">
                  Pod Leader
                </label>
                
                <Select
                value={podLeaders.find((e) => e.value == podLeaderID)}
                onChange={(nVal) => {
                  setPodLeaderID(nVal.value);
                }}
                required
                options={podLeaders}
                />
              </div>
              <div className="mb-3">
              <label className="form-label" for="exampleInputPassword1">
               On board
              </label>
              <input
                type="date"
                required
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Effective Date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
              />
            </div>
              <div className="mb-3">
                <label className="form-label" for="exampleInputPassword1">
                  Email Id
                </label>
                <input
                required
                  type="email"
                  value={emailID}
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Email"
                  onChange={(e) => setEmailID(e.target.value)}
                />
              </div>
              <div className="mb-3">
              <label className="form-label" for="exampleInputPassword1">
                Pod Domain
              </label>

                
                <Select
                value={podDomains.find((e) => e.value == podDomainID)}
                onChange={(nVal) => {
                  setPodDomainID(nVal.value);
                }}
                required
                options={podDomains}
                />

            </div>
              <div className="mb-3">
                <label className="form-label" for="exampleInputPassword1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  className="form-control"
                required
                  id="exampleInputPassword1"
                  placeholder="state"
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" for="exampleInputPassword1">
                  Effective date
                </label>

                <input
                  type="date"
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Effective Date"
                required
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                />
              </div>
              <button
                className={`btn btn-primary float-right ${styles.btnColor}`}
                type="submit"
              >
                save
              </button>
              <AlertDismissable
              show={showAlert}
              msg={alert.alertMsg}
              varient={alert.varient}
              icon={alert.icon}
              onClose={() => {
                setShowAlert(false);
              }}
              />
          </div>
        </div>
      </form>
    </>
  );
}
