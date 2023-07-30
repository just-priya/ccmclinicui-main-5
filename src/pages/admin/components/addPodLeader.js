import { useState, useEffect } from "react";
import styles from "../../../styles/Admin.module.css";
import ENDPOINTS from "@/utils/enpoints";
import axios from "axios";
import AlertDismissable from "./alertDismissable";
import Select from 'react-select'

export default function AddPodLeader({podDomainStatus, podLeaderStatus, setPodLeaderStatus}) {
  const [podLeaderName, setPodLeaderName] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [podDomainID, setPodDomainID] = useState("");
  const [podDomains, setPodDomains] = useState([]);
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
    return podLeaderName.length > 0 && effectiveDate.length > 0 && podDomainID.length>0;
  };

  const persistPodLeader = async (payload) => {
    const response = await axios.post(
      ENDPOINTS.apiEndoint + "ccm/createpodleader",
      payload
    );
    return response?.data;
  };

  const clear = () => {
    setEffectiveDate("");
    setPodLeaderName("");
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
    let isPaloadValid = isValid();
    if (!isPaloadValid) {
      showWarningMsg("Please Enter Valid data", "warning");
      return;
    }

    const payload = {
      name: podLeaderName,
      effectiveDate: getTimeStamp(),
      podDomainID
    };

    const promise = persistPodLeader(payload);
    promise
      .then((data) => {
        if (data.status == "SUCCESS") {
          showWarningMsg("POD Leader Peristed Successfully", "success");
          clear();
          setPodLeaderStatus(!podLeaderStatus);
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
      }
    });
  }, []);

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
      }
    });
  }, [podDomainStatus]);
  
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
                <h3 className="m-0">Pod Leader</h3>
              </div>
            </div>
          </div>
          <div className="white_card_body">
            <div className="mb-3">
              <label className="form-label" for="exampleInputPassword1">
                Pod Leader
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Pod Leader"
                required
                value={podLeaderName}
                onChange={(e) => setPodLeaderName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" for="exampleInputPassword1">
                Effective Date
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
