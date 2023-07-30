import { useState, useEffect } from "react";
import styles from "../../../styles/Admin.module.css";
import ENDPOINTS from "@/utils/enpoints";
import axios from "axios";
import Alert from 'react-bootstrap/Alert'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function AlertDismissable(props) {
  

  return (
    <>
      <Alert style={{position:"fixed", top:"120px", right:"20px", zIndex:"100001"}}
      dismissible={true}
      onClose={props.onClose}
      show={props.show}
      varient ={props.varient || "success"}>

        <h6 style={{marginTop:"3px"}}>
            <FontAwesomeIcon icon={props.icon || "check-circle"}/>
            {props.msg}
        </h6>

      </Alert>
    </>
  );
}
