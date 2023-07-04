import request from "@/utils/http";

export const detailAPI = (ticket, id, page, limit) => {
    return request(
        {
            url: '/discuss/detail/' + id + '?current=' + page + '&limit=' + limit,
            method: 'GET',
            headers: {
                "ticket": ticket
            }
        }
    )
}

export const lickAPI = (ticket, data) => {
    return request(
        {
            url: '/like',
            method: 'POST',
            data,
            headers: {
                "ticket": ticket
            }
        }
    )
}

export const commentAPI = (ticket, id, data) => {
    return request(
        {
            url: '/comment/add/' + id,
            method: 'POST',
            data,
            headers: {
                "ticket": ticket
            }
        }
    )
}

export const topAPI = (ticket, id, type) => {
    return request(
        {
            url: '/discuss/top?id=' + id + '&type=' + type,
            method: 'POST',
            headers: {
                "ticket": ticket
            }
        }
    )
}

export const wonderfulAPI = (ticket, id, status) => {
    return request(
        {
            url: '/discuss/wonderful?id=' + id + '&status=' + status,
            method: 'POST',
            headers: {
                "ticket": ticket
            }
        }
    )
}

export const deleteAPI = (ticket, id) => {
    return request(
        {
            url: '/discuss/delete?id=' + id,
            method: 'POST',
            headers: {
                "ticket": ticket
            }
        }
    )
}