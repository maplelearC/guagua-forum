import request from '@/utils/http'


export const homeAPI = (page, limit, order) => {
    return request(
        {
            url: '/index?current=' + page + '&limit=' + limit + '&orderMode=' + order,
            method: 'GET',
        }
    )
}


export const publishAPI = (data, ticket) => {
    return request(
        {
            url: '/discuss/add',
            method: 'POST',
            data,
            headers: {
                "ticket": ticket
            }
        }
    )
}