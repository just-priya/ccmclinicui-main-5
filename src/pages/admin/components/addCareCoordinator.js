import { useState, useEffect } from "react";
import styles from "../../../styles/Admin.module.css";
import ENDPOINTS from "@/utils/enpoints";
import axios from "axios";
import AlertDismissable from "./alertDismissable";
import Select from "react-select";

export default function AddCareCoordinator({
  podDomainStatus,
  podLeaderStatus,
  careCoordinatorStatus,
  setCareCoordinatorStatus
}) {
  const [careCoordinatorName, setCareCoordinatorName] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [podDomainID, setPodDomainID] = useState("");
  const [podLeaderID, setPodLeaderID] = useState("");
  const [podDomains, setPodDomains] = useState([]);
  const [podLeaders, setPodLeaders] = useState([]);
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
      careCoordinatorName.length > 0 &&
      effectiveDate.length > 0 &&
      podDomainID.length > 0 &&
      podLeaderID.length > 0
    );
  };

  const persistCareCoordinator = async (payload) => {
    const response = await axios.post(
      ENDPOINTS.apiEndoint + "ccm/createcarecoordinator",
      payload
    );
    return response?.data;
  };

  const clear = () => {
    setEffectiveDate("");
    setCareCoordinatorName("");
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
    debugger;

    let isPayloadValid = isValid();
    if (!isPayloadValid) {
      showWarningMsg("Please Enter Valid data", "warning");
      return;
    }

    const payload = {
      name: careCoordinatorName,
      effectiveDate: getTimeStamp(),
      podDomainID,
      podLeaderID,
    };

    const response = persistCareCoordinator(payload);
    response
      .then((data) => {
        if (data.status == "SUCCESS") {
          // console.log(data);
          showWarningMsg("Care Coordinator Peristed Successfully", "success");
          clear();
          setCareCoordinatorStatus(!careCoordinatorStatus);
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

  return (
    <>
      <form className="col-lg-3" onSubmit={(e) => {
        e.preventDefault();
        handleSubmit()
      }}>
        <div
          className={`white_card card_height_100 mb_30 ${styles.formBorder}`}
        >
          <div className="white_card_header">
            <div className="box_header m-0">
              <div className="main-title">
                <h3 className="m-0">Care co-ordinator</h3>
              </div>
            </div>
          </div>
          <div className="white_card_body">
        
              <div className="mb-3">
                <label className="form-label" for="exampleInputPassword1">
                  Care Co-ordinator
                </label>
                <input
                required
                  type="text"
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Care Co-ordinator"
                  value={careCoordinatorName}
                  onChange={(e) => setCareCoordinatorName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" for="exampleInputPassword1">
                  Pod Leader
                </label>
                <Select
                value={podLeaders.find((e) => e.value == podLeaderID)}
                onChange={(nVal) => {
                  setPodDomainID(nVal.value);
                }}
                required
                options={podLeaders}
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
                  Effective date
                </label>

                <input
                required
                  type="date"
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Effective Date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                />
              </div>
              <button
              type="submit"
                className={`btn btn-primary float-right ${styles.btnColor}`}
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
