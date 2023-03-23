import {UserType} from "./user";

export type TeamType = {
    "id": number,
    "teamName": string,
    "teamAvatarUrl"?: string,
    "teamPassword"?: string,
    "teamDesc": string,
    "maxNum": number,
    "expireTime"?: Date,
    "teamStatus": number,
    "createTime": Date,
    "announce"?: string,
}


export type TeamListType = {
    "id": number,
    "teamName": string,
    "teamAvatarUrl"?: string,
    "teamPassword"?: string,
    "teamDesc": string,
    "maxNum": number,
    "expireTime": Date,
    "teamStatus": number,
    "createTime": Date,
    "announce"?: string,
    "user"?: UserType,
    "userSet"?: UserType[]
}
