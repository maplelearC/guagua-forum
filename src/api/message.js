import request from "@/utils/http";

export const letterListAPI = (ticket, current, limit) => {
  return request({
    url: "/letter/list?current=" + current + "&limit=" + limit,
    method: "GET",
    headers: {
      "ticket": ticket,
    },
  });
};

export const sendLetterAPI = (ticket, data) => {
  return request({
    url: "/letter/send",
    method: "POST",
    headers: {
      "ticket": ticket,
    },
    data,
  });
};

export const noticeListAPI = (ticket) => {
  return request({
    url: "/notice/list",
    method: "GET",
    headers: {
      "ticket": ticket,
    },
  });
};

export const letterDetailAPI= (ticket,conversationId,current,limit) => {
  return request({
    url: "/letter/detail/"+conversationId+"?current=" + current + "&limit=" + limit,
    method: "GET",
    headers: {
      "ticket": ticket,
    },
  });
};

export const commentDetailAPI= (ticket,current,limit) => {
  return request({
    url: "/notice/detail/comment?current=" + current + "&limit=" + limit,
    method: "GET",
    headers: {
      "ticket": ticket,
    },
  });
};

export const likeDetailAPI= (ticket,current,limit) => {
  return request({
    url: "/notice/detail/like?current=" + current + "&limit=" + limit,
    method: "GET",
    headers: {
      "ticket": ticket,
    },
  });
};

export const followDetailAPI= (ticket,current,limit) => {
  return request({
    url: "/notice/detail/follow?current=" + current + "&limit=" + limit,
    method: "GET",
    headers: {
      "ticket": ticket,
    },
  });
};



