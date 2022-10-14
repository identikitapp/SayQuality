function createHeader() {
    let token = window.localStorage("token");

    if(!token) {
        return { "Content-Type": "application/json" }
    };

    return { "Content-Type": "application/json", "Authorization": "Bearer " + token }
};

export default createHeader;