import request from "./myAxios";

export const getCurrent = async () => {
    return await request.get("/user/current")
}

export default getCurrent