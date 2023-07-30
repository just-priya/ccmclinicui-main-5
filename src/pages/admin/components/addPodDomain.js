import { useState, useEffect } from "react";
import styles from "../../../styles/Admin.module.css";
import ENDPOINTS from "@/utils/enpoints";
import axios from "axios";
import AlertDismissable from "./alertDismissable";

export default function AddPodDomain(props) {
  const [podDomainName, setPodDomainName] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
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
    return podDomainName.length > 0 && effectiveDate.length > 0;
  };

  const persistPodDomain = async (payload) => {
    const response = await axios.post(
      ENDPOINTS.apiEndoint + "ccm/createpoddomain",
      payload
    );
    return response?.data;
  };

  const clear = () => {
    setEffectiveDate("");
    setPodDomainName("");
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
      name: podDomainName,
      effectiveDate: getTimeStamp(),
    };

    const promise = persistPodDomain(payload);
    promise
      .then((data) => {
        if (data.status == "SUCCESS") {
          showWarningMsg("POD Domain Peristed Successfully", "success");
          clear();
          let currentStatus = props.podDomainStatus;
          props.setPodDomainStatus(!currentStatus);
        } else {
          showWarningMsg("Something went wrong, plese try again", "warning");
        }
      })
      .catch((err) => {
        showWarningMsg("Something went wrong, plese try again", "warning");
      });
  };

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
                <h3 className="m-0">Pod Domain</h3>
              </div>
            </div>
          </div>
          <div className="white_card_body">
            <div className="mb-3">
              <label className="form-label" for="exampleInputPassword1">
                Pod Domain
              </label>
              <input
              required
                type="text"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Pod domain"
                value={podDomainName}
                onChange={(e) => setPodDomainName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" for="exampleInputPassword1">
                Effective Date
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
