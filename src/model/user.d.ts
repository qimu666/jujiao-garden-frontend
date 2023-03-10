import {genderMap, roleMap, userStatus} from "./userMap";

export type UserType = {
    "id": number,
    "username": string
    "userAccount": string
    "userAvatarUrl": string
    "gender": genderMap
    "email": string
    "contactInfo": string
    "userDesc": string
    "userStatus": userStatus
    "userRole": roleMap
    "tags": string[]
    "teamIds": string[]
    "userIds": string[]
}

