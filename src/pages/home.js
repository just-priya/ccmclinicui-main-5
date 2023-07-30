import { Html, Head, Main, NextScript } from "next/document";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "../styles/Admin.module.css";
import { useRouter } from "next/router";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Col, Row } from "react-bootstrap";
import NavBar from "./navbar";

export default function Home() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("_MEDUSER_USERNAME")
    localStorage.removeItem("_MEDUSER_GR")
    localStorage.removeItem("_MEDUSER")
    router.push('/login')
  }

  return (
    <div>
      {/* Below Code should be created as common component */}

      <NavBar />
      
      <div>
        <div style={{ marginBottom: "20px" }}>
          <div class="text">
            <h2 style={{ marginBottom: "20px" }}>Categories</h2>
          </div>
          <p class="al" style={{ color: "black" }}>
            This user should have access,even to remove other owners and
            operators
          </p>
        </div>
      </div>

      {/* <div className="outer-container">
        <div style={{marginLeft:"6%"}}>

        </div>
        <div className="box" onClick={()=>{
                debugger;
                // router.push("/dashboard");
            }} >
          <div className="boxinner"  >
            <img
           
              src="/img/home/ccm.png"
              style={{ width: "100%", marginTop: "18%", marginLeft: "24%" }}
            ></img>
          </div>
          <div className="name">
            <a>CCM Console</a>
          </div>
        </div>

        <div class="box1">
          <div class="boxinner">
            <img
              src="/img/home/twoSevenOne.png"
              style={{ width: "100%", marginTop: "18%", marginLeft: "24%" }}
            ></img>
          </div>
          <div className="name">271 Eligiblity</div>
        </div>
        <div class="box1">
          <div class="boxinner">
            <img
              src="/img/home/pm.png"
              style={{ width: "100%", marginTop: "18%", marginLeft: "24%" }}
            ></img>
          </div>
          <div className="name"> PHM</div>
        </div>
      </div> */}
      <Row>
        <Col sm={1} />

        <Col sm={6} style={{ display: "inline-flex" }}>
          <Card
            style={{
              width: "14rem",
              marginRight: "20px",
              border: "3px solid #4DB0A6",
              height: "16rem"
            }}
            className="card-border"
            sm={2}
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            <Card.Img variant="top" src="/img/home/ccm.png" height="170" width="200" />
            <Card.Body>
              <Card.Title style={{ textAlign: "center" }}>
                CCM Console
              </Card.Title>
            </Card.Body>
          </Card>

          <Card
            style={{
              width: "14rem",
              marginRight: "20px",
              background: "#dddddd",
              height: "16rem"
            }}
            className="card-border"
            sm={2}
          >
            <Card.Img variant="top" src="/img/home/twoSevenOne.png" height="170" width="200"/>
            <Card.Body>
              <Card.Title style={{ textAlign: "center" }}>
                271 Eligiblity
              </Card.Title>
            </Card.Body>
          </Card>

          <Card
            style={{
              width: "14rem",
              marginRight: "20px",
              background: "#dddddd",
              height: "16rem"
            }}
            className="card-border"
            sm={2}
          >
            <Card.Img variant="top" src="/img/home/pm.png" height="170" width="200"/>
            <Card.Body>
              <Card.Title style={{ textAlign: "center" }}>PHM</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
