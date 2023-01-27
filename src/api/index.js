export const ServiceApi = {
    getChatHistory: () => fetch(`${process.env.REACT_APP_HOST}/api/updates`).then(res => res.json())
}
