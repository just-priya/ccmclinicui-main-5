import { useState, useEffect } from "react";

import styles from "../../../styles/Admin.module.css";
import AddPodDomain from "./addPodDomain";
import AddPodLeader from "./addPodLeader";
import AddCareCoordinator from "./addCareCoordinator";
import AddFacility from "./addFacility";

export default function AddForm() {
  const [podDomainStatus, setPodDomainStatus] = useState(false);
  const [podLeaderStatus, setPodLeaderStatus] = useState(false);
  const [careCoordinatorStatus, setCareCoordinatorStatus] = useState(false);

  return (
    <>
      <div className="row">
        <AddFacility
          podLeaderStatus={podLeaderStatus}
          podDomainStatus={podDomainStatus}
          careCoordinatorStatus={careCoordinatorStatus}
        />

        <AddCareCoordinator
          podLeaderStatus={podLeaderStatus}
          podDomainStatus={podDomainStatus}
          careCoordinatorStatus={careCoordinatorStatus}
          setCareCoordinatorStatus={setCareCoordinatorStatus}
        />

        <AddPodLeader
          podDomainStatus={podDomainStatus}
          podLeaderStatus={podLeaderStatus}
          setPodLeaderStatus={setPodLeaderStatus}
        />

        <AddPodDomain
          podDomainStatus={podDomainStatus}
          setPodDomainStatus={setPodDomainStatus}
        />
      </div>
    </>
  );
}
