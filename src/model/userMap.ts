import {UserEnum, UserRoleEnum, UserStatus} from "../enum/userEnum";

export const genderMap = {
    [UserEnum.Male]: "男",
    [UserEnum.Female]: "女",
};

export const roleMap = {
    [UserRoleEnum.Not_ADMIN]: "普通用户",
    [UserRoleEnum.ADMIN]: "管理员",
    [UserRoleEnum.VIP]: "VIP用户",
};

export const userStatus = {
    [UserStatus.Normal]: "正常",
    [UserStatus.Seal]: "已封号",
};