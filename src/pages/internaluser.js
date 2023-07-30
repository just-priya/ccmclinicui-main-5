import React, { useEffect } from "react"

import { useRouter } from 'next/router';
import { useState } from "react";

import axios from '../utils/axiosConfig';
import moment from "moment";
import Select, { components } from 'react-select'
import { CircleSpinnerOverlay } from 'react-spinner-overlay'
import Form from 'react-bootstrap/Form';
const _ = require('lodash');
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCircleInfo} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2'

import NavBar from "./navbar";
import styles from '../styles/Dashboard.module.css';
import userStyles from '../styles/UserAndRoles.module.css';
import ENDPOINTS from '../utils/enpoints';
import AlertDismissable from "../pages/admin/components/alertDismissable";


export default function InternalUser() {
    const userRoles = [
        {
            label: "PHYSICIANCMO",
            value : "PHYSICIANCMO"
        },
        {
            label : "NPNURSE",
            value : "NPNURSE"
        },
        {
            label : "OFFICEMANAGER",
            value : "OFFICEMANAGER"
        },
        {
            label : "PHYSICIAN",
            value : "PHYSICIAN"
        },
        {
            label : "PROGRAMMANAGER",
            value : "PROGRAMMANAGER"
        }
    ];

    const [activeId, setActiveId] = useState("users");
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [roleOptions, setRoleOptions] = useState([])
    const [user, setUser] = useState({
        name: "",
        email: "",
        position: "",
        roles: [],
        notes: "",
        password: "",
        confirmPassword: ""
    })

    const [alert, setAlert] = useState({
        alertMsg: "",
        varient: "success",
        alertIcon: "info-circle",
      });
    const [showAlert, setShowAlert] = useState(false)
    const [loading, setLoading] = useState(false)
    

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

    const handleRoleChange = (index, role, rowId) => {
        const tempUser = [...users]
        tempUser[index].selectedRole = role
        const roles = tempUser[index].selectedRole.map((role) => role.value)
        tempUser[index].role = roles
        console.log(tempUser);
        setUsers(tempUser)
    }

    const handleRolePermission = (event, index, column) => {
        const tempRole = [...roles]
        tempRole[index][column] = event.target.checked ? 'yes' : 'no'
        console.log(tempRole);
        setRoles(tempRole)
    }

    const getUsers = async () => {
        try{
            const response = await axios.get(ENDPOINTS.apiEndoint + "auth/listusers")
            return response?.data
        }catch(e) {
            console.log(e)
        }
    }

    const getRoles = async () => {
        try{
            const response = await axios.get(ENDPOINTS.apiEndoint + "ccm/roles")
            return response?.data
        }catch(e) {
            console.log(e)
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

    const saveRoles = async () => {
        setLoading(true)
        const payload = roles.map(role => {
            const obj = {
                id : role.id,
                read : role.read,
                insert : role.insert,
                update : role.update  
            }
            return obj;
        })
        const response = await axios.post(ENDPOINTS.apiEndoint + "ccm/updaterolepermssions", payload)
        setLoading(false)
        showWarningMsg("Updated !", "success");
    }
    
    const saveUsers = async () => {
        setLoading(true)
        const payload = users.map(user => {
            const obj = {
                userName: user.userId,
                groupNames: user.role
            }
            return obj
        })
        const response = await axios.post(ENDPOINTS.apiEndoint + "auth/addusertogroup", payload)
        setLoading(false)
        showWarningMsg("Updated !", "success");
    }
    
    const isValid = () => {
        let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let passRegex = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&]).{8,16}$');
        if(!user.email.match(regex)) {
            showWarningMsg("Please Enter Valid email", "danger");
            return false;
        }

        if (user.password !== user.confirmPassword) {
            showWarningMsg("Password does not match", "danger");
            return false;
        }

        if (!user.password.match(passRegex)) {
            showWarningMsg("Password constrains does not match", "danger");
            return false;
        }

        return true
    }

    const saveUser = async () => {

        if(!isValid()){
            return;
        }

        setLoading(true)
        const payload = user
        if(user.roles.length === 0) {
            user.roles = roles[0].roles
        }
        payload.roles = [payload.roles]
        const response = await axios.post(ENDPOINTS.apiEndoint + "auth/signup", payload)
        .then(res=> {
            console.log(res);
            setActiveId("users")
            initialLoad()
            showWarningMsg("Updated !", "success");
        })
        .catch(err => {
            console.log(err);
            Swal.fire({
                title: 'Error!',
                text: err?.response?.data?.message,
                icon: 'error',
                confirmButtonText: 'Close',
                confirmButtonColor: "#DD6B55",
                closeOnConfirm: false
              }).then((result) => { 
                if (result.isConfirmed) {
                  //  window.location = "/login"
                   Swal.close
                  } 
              })
        })
        setLoading(false)

    }

    const saveAction = () => {
        activeId === 'users' ?  saveUsers() : saveRoles()
    }

    const setUserDetails = (event) => {
        const tempUser = _.cloneDeep(user)
        tempUser[event.target.name] = event.target.value
        setUser(tempUser)
    }

    
    const initialLoad = () => {
        const promises = [getUsers(), getRoles()];
        Promise.all(promises).then(([users, roles]) => {
            // console.log(users?.data);
            let allUsers = users?.data
            allUsers?.map((user) => {
                const selectedRole = user.role.map(role => {
                    const obj = {label : role, value : role}
                    return obj
                })
                user['selectedRole'] = selectedRole
            })
            console.log(allUsers);
            const rolesOptions = roles?.map((role) => {
                                    const roleObj = {label : role.roles, value : role.roles}
                                    return roleObj
                                })
            setRoleOptions(rolesOptions)
            setRoles(roles)
            setUsers(allUsers)
            setFilteredUsers(allUsers)
        })
    }

    useEffect(() => {
        initialLoad()
    }, [])

    useEffect(() => {
        const userClear = {
            name: "",
            email: "",
            position: "",
            roles: [],
            notes: "",
            password: ""
        } 
        setUser(userClear)
    }, [activeId])
    
    return (
        <>
            <NavBar />
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid float-end">
                <a className="navbar-brand" href="#"> <b> User & Roles </b>  </a>
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    {activeId !== "add-users" ?
                        <li className="nav-item">
                            <button className="btn btn-sm btn-outline-secondary saveBtn" type="button" onClick={saveAction}>Save</button>
                        </li>
                        :
                        <></>
                    }
                </ul>
                </div>
            </nav>
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid float-end">
                    <ul className="navbar-nav">
                        <li className="nav-item px-2">
                            <a  onClick={() => {setActiveId('users')}} 
                                className={`nav-link ${activeId === 'users' ? styles.activeMonth : ''}`} 
                                aria-current="page" href="#">
                                Users
                            </a>
                        </li>
                        <li className="nav-item px-2" >
                            <a  onClick={() => {setActiveId('Roles')}} 
                                className={`nav-link ${activeId === 'Roles' ? styles.activeMonth : ''}`} 
                                aria-current="page" href="#">
                                Roles
                            </a>
                        </li>
                        <li className="nav-item px-2" >
                            <a  onClick={() => {setActiveId('add-users')}} 
                                className={`nav-link ${activeId === 'add-users' ? styles.activeMonth : ''}`} 
                                aria-current="page" href="#">
                                Add Users
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
            {activeId === 'users' ?
                <div>
                    <div className={`container-fluid ${userStyles.tableDesc}`}>
                        <h4>CCM Internal</h4>
                        <p>This user should have access, even to remove other owners and operators</p>
                    </div>
                    <div className="tableWrapper table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col" >Name</th>
                                    <th scope="col" >Email</th>
                                    <th scope="col" >Position</th>
                                    <th scope="col" >Role</th>
                                    <th scope="col" >Notes</th>
                                    <th scope="col" >Last Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers?.map((item, index) => {
                                    return (
                                        <tr key={`CCM_USER_${index}`}>
                                            <td>{item.user}</td>
                                            <td>{item.email}</td>
                                            <td>{item.position}</td>
                                            <td>
                                                <Select options={roleOptions}
                                                    className={`react-select-container-user`}
                                                    classNamePrefix="react-select"
                                                    isSearchable isClearable={false}
                                                    id={`idRole_${index}`}
                                                    key={`idRoleKey_${index}`}
                                                    components={{ MultiValue, Option: InputOption }}
                                                    hideSelectedOptions={false}
                                                    isMulti
                                                    onChange={(option) => handleRoleChange(index, option, item?.id)}
                                                    value={item.selectedRole}
                                                /> 
                                            </td>
                                            <td>{item.notes}</td>
                                            <td>{moment(item?.lastUpdatedUTC).format("YYYY-MM-DD HH:mm")}</td>
                                        </tr>
                                    )  
                                })}
                            </tbody>
                        </table>
                        
                    </div>
                </div>
            :
            activeId === "Roles" ? 
                <div>
                    <div className={`container-fluid ${userStyles.tableDesc}`}>
                        <h4>CCM Internal</h4>
                        <p>This user should have access, even to remove other owners and operators</p>
                    </div>
                    <div className="tableWrapper table-responsive ccm-roles">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Roles</th>
                                    <th scope="col" >Read</th>
                                    <th scope="col" >Insert</th>
                                    <th scope="col" >Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map((role, index) => 
                                    <tr key={`CCM_ROLE_${index}`}>
                                        <td>{role.roles}</td>
                                        <td>
                                            <Form.Check
                                                inline
                                                name="group1"
                                                type={'checkbox'}
                                                id={`inline-${index}`}
                                                checked={role?.read === 'yes'}
                                                onChange={(event) => handleRolePermission(event, index, 'read')}
                                            />
                                        </td>
                                        <td>
                                            <Form.Check
                                                inline
                                                name="group1"
                                                type={'checkbox'}
                                                id={`inline-${index}`}
                                                checked={role?.insert === 'yes'}
                                                onChange={(event) => handleRolePermission(event, index, 'insert')}
                                            />
                                        </td>
                                        <td>
                                            <Form.Check
                                                inline
                                                name="group1"
                                                type={'checkbox'}
                                                id={`inline-${index}`}
                                                checked={role?.update === 'yes'}
                                                onChange={(event) => handleRolePermission(event, index, 'update')}
                                            />
                                        </td>
                                    </tr>
                                )
                                }
                                
                            </tbody>
                        </table>
                    </div>
                </div>
                :
                <div className="col-lg-3">
                    <div
                        className={`white_card card_height_100 mb_30 ${styles.formBorder}`}
                        >
                        <div className="white_card_header">
                            <div className="box_header m-0">
                                <div className="main-title">
                                    <h4 className="m-0">Add User</h4>
                                </div>
                            </div>
                        </div>
                        <div className="white_card_body">
                            <div className="mb-3">
                                <label className="form-label" for="exampleInputPassword1">
                                    Name*
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Name"
                                    name="name"
                                    value={user.name}
                                    onChange={(event) => setUserDetails(event)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" for="exampleInputPassword1">
                                    Email*
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="email"
                                    placeholder="Email"
                                    name="email"
                                    value={user.email}
                                    onChange={(event) => setUserDetails(event)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" for="exampleInputPassword1">
                                    Password* <FontAwesomeIcon icon={faCircleInfo} data-tooltip-id="my-tooltip" data-tooltip-content="password should contain atleast 8 characters with one capital letter, small letter, .!@$%^& any of this special character and a number"/>
                                
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="password"
                                    placeholder="Password"
                                    name="password"
                                    value={user.password}
                                    onChange={(event) => setUserDetails(event)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" for="exampleInputPassword1">
                                    Confirm Password* 
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirm-password"
                                    placeholder="Password"
                                    name="confirmPassword"
                                    value={user.confirmPassword}
                                    onChange={(event) => setUserDetails(event)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" for="exampleInputPassword1">
                                    Postion*
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="exampleInputPassword1"
                                    placeholder="Position"
                                    name="position"
                                    value={user.position}
                                    onChange={(event) => setUserDetails(event)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" for="exampleInputPassword1">
                                    Role*
                                </label>
                                <select
                                    id="podDomain"
                                    name="roles"
                                    className="form-control"
                                    placeholder="Select Role"
                                    onChange={(event) => setUserDetails(event)}
                                >
                                    {roleOptions.map((role) => (
                                        <option value={role.value}>{role.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" for="exampleInputPassword1">
                                    Notes*
                                </label>
                                <textarea 
                                    rows="3"
                                    className="form-control"
                                    id="exampleInputPassword1"
                                    placeholder="Notes"
                                    name="notes"
                                    value={user.notes}
                                    onChange={(event) => setUserDetails(event)}
                                />
                                
                            </div>
                            <button
                                onClick={saveUser}
                                className={`btn btn-primary float-  right ${userStyles.btnColor}`}
                                disabled={user.name === '' || user.email === '' || user.password === '' || user.position === '' || user.notes === '' || user.roles === []}
                            >
                                save
                            </button>
                            <br />
                            <br />
                            <p>* Mandatory fields</p>
                        </div>
                    </div>
                </div>
            }
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
        </>
    )
}