export const defaultPicture = "https://img.qimuu.icu/typory/teamImg1.jpg"

export const jsonParseTag = (usersList) => {
    usersList.forEach(user => {
        if (user.tags) {
            user.tags = user.tags ? JSON.parse(user.tags) : '该用户暂未设置';
        }
    })
}