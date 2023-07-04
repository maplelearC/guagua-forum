import request from '@/utils/http'

export const loginAPI = (data) => {
    return request({
        url: '/login',
        method: 'POST',
        data
    })
}


export const registerAPI = (data) => {
    return request(
        {
            url: '/register',
            method: 'POST',
            data
        }
    )
}


export const activationAPI = (id, activationCode) => {
    return request(
        {
            url: '/activation?userId=' + id + '&code=' + activationCode,
            method: 'GET'
        }
    )
}


export const userInfoAPI = (ticket) => {
    return request(
        {
            url: '/user/info',
            method: 'GET',
            headers: {
                "ticket": ticket
            }
        }
    )
}

export const getUserInfoByIdAPI = (ticket, userId) => {
    return request(
        {
            url: '/user/profile/' + userId,
            method: 'GET',
            headers: {
                "ticket": ticket
            }
        }
    )
}

export const loginOutAPI = (ticket) => {
    return request(
        {
            url: '/logout',
            method: 'GET',
            headers: {
                "ticket": ticket
            }
        }
    )
}


export const followAPI = (ticket, data) => {
    return request(
        {
            url: '/follow',
            method: 'POST',
            data,
            headers: {
                "ticket": ticket
            }
        }
    )
}

export const unfollowAPI = (ticket, data) => {
    return request(
        {
            url: '/unfollow',
            method: 'POST',
            data,
            headers: {
                "ticket": ticket
            }
        }
    )
}


export const followeesAPI = (ticket, current, limit, userId) => {
    return request(
        {
            url: '/followees/' + userId + '?current=' + current + '&limit=' + limit,
            method: 'GET',
            headers: {
                "ticket": ticket
            }
        }
    )
}

export const followersAPI = (ticket, current, limit, userId) => {
    return request(
        {
            url: '/followers/' + userId + '?current=' + current + '&limit=' + limit,
            method: 'GET',
            headers: {
                "ticket": ticket
            }
        }
    )
}


export const updateavatarAPI = (ticket,data) => {
  return request(
      {
          url:'/user/upload',
          method: 'POST',
          headers: {
            "ticket": ticket,
           " Content-Type":"multipart/form-data"
        },
        data
      }
  )
}

export const updatepasswordAPI = (ticket,data) => {
  return request(
      {
          url:'/user/password',
          method: 'POST',
          headers: {
            "ticket": ticket
        },
          data
      }
  )
}

