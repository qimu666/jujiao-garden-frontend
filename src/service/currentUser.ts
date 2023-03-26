import request from "./myAxios";
import {UserType} from "../model/user";

export const getCurrent = async () => {
    const getCurrentUser: UserType = await request.get("/user/current")
    // @ts-ignore
    sessionStorage.setItem("longUser", getCurrentUser ? JSON.stringify(getCurrentUser) : JSON.stringify({}))
    return getCurrentUser
}

export default getCurrent