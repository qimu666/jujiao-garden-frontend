import request from "./myAxios";

export const getCurrent = async () => {
    const getCurrentUser = await request.get("/user/current")
    // @ts-ignore
    sessionStorage.setItem("longUser", getCurrentUser ? JSON.stringify(getCurrentUser) : undefined)
    return getCurrentUser
}

export default getCurrent