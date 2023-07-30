import { useMemo, useState } from "react"

export const useUserRoles = () => {

    const [roles, setRoles] = useState([])

    const getAccess = () => {
        if (!!window) {
            try {
            let role = localStorage.getItem("_MEDUSER_GR")
            if (!!role) {
                setRoles(JSON.parse(role))
            }
            } catch (err) {
            console.error(err);    
            }
        }
    }

    const canEdit = useMemo(() => {
        if (!!!roles.length) return false
        if (roles.length == 1) {
            return roles.includes("NPNURSE") ? false : true
        } else {
            return true
        }
    }, [roles])

    return {
        roles, getAccess, canEdit
    }
}