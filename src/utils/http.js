import axios from 'axios'
import { ElLoading } from "element-plus";

const httpInstance = axios.create({
    baseURL: 'http://localhost:8081/community',
    //baseURL: 'http://114.55.254.24:8081/community',
    timeout: 10000,
})
let loading = (() => {
    let loading;
    return {
        open: () => {
            if (!loading)
                loading = ElLoading.service({ fullscreen: true })
        },
        close: () => {
            loading?.close();
            loading = undefined;
        }
    }
})();

httpInstance.interceptors.request.use((config) => {
    loading.open();
    return config;
}, (err) => {
    loading.close()
    return Promise.reject(err)
})
httpInstance.interceptors.response.use((response) => {
    loading.close()
    return Promise.resolve(response)
}, (err) => {
    loading.close()
    return Promise.reject(err)
})
export default httpInstance