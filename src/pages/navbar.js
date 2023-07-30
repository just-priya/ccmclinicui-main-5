import Head from 'next/head'

import styles from "../styles/Admin.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';
import { useUserRoles } from '@/hooks/access';

export default function NavBar() {
    const router = useRouter();

    const logout = () => {
        localStorage.removeItem("_MEDUSER_USERNAME")
        localStorage.removeItem("_MEDUSER_GR")
        localStorage.removeItem("_MEDUSER")
        router.push('/login')
    }


  const { getAccess, canEdit } = useUserRoles()

  useEffect(() => {
    if (!!window) {
      getAccess()
    }
  }, [])

    return (
        <> 
            <Head>
                <title>Medlite</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

                <nav className={`navbar-custom navbar navbar-expand-lg sticky-top common-nav ${styles.navbarCustom}`}>
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">
                            {/* <img src="/img/home/logo.jpeg" alt="logo" height="40"/> */}
                            <span> 
                                <span className="infinite-logo">
                                    <img src="/img/home/infinte-logo.png" alt="logo" height="25"/>
                                    <img src="/img/home/infinite-white.png" alt="logo" height="20" className="infinite-white"/>
                                </span>
                                <span className="logo-seperator"> | </span>
                                <span className="med-logo">
                                    <img src="/img/home/med-white.png" alt="logo" height="25"/>
                                    <img src="/img/home/med-white-txt.png" alt="logo" height="15" className="med-white"/>
                                </span>
                                
                            </span>
                        </a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        {router.pathname !== '/login' ?
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                                
                                <li className="nav-item">
                                    <a className={['/home','/dashboard'].includes(router.pathname)?"nav-link active":"nav-link"} aria-current="page" href="/home">Categories</a>
                                </li>
                                {canEdit ? <li className="nav-item">
                                    <a className={router.pathname === '/internaluser'?"nav-link active":"nav-link"} href="/internaluser">Roles</a>
                                </li> : ""}
                                 {canEdit ?       <li className="nav-item">
                                            <a className={router.pathname === '/admin'?"nav-link active":"nav-link"} href="/admin">Admin</a>
                                        </li> : ""}
                                <li className="nav-item">
                                    <a className="nav-link" href="#" tabIndex="-1" onClick={() => logout()}>Logout</a>
                                </li>
                                </ul>
                            </div>
                            : <></>
                        }   
                    </div>
                </nav>
            
        </>
    );
}
