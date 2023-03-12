export enum UserEnum {
    Male = 1,
    Female = 2,
}

export enum UserRoleEnum {
    Not_ADMIN,
    ADMIN,
    VIP
}

export enum UserStatus {
    Normal,// 正常
    Seal, // 封号
}


const gender = [
    {text: '男', value: 1},
    {text: '女', value: 2},
];

const role = [
    {text: '普通用户', value: 0},
    {text: '管理员', value: 1},
    {text: 'VIP用户', value: 2},
];


const roleId = {
    "普通用户": 0,
    "管理员": 1,
    "VIP用户": 2
}

const genderId = {
    "男": 1,
    "女": 2
}
export {
    gender, genderId, roleId, role
}