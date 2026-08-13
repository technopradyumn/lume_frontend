import axios from "axios";

const getResourceId = (resource, label = "resource") => {
  const candidate = typeof resource === "object" ? resource?._id || resource?.id || resource?.$oid : resource;
  const id = typeof candidate === "object" ? candidate?.$oid || candidate?.id : candidate;
  if (!id || typeof id !== "string" || id === "[object Object]") {
    throw new Error(`A valid ${label} id is required`);
  }
  return id;
};

const API_BASE_URL = "/api/v1";
const responseCache = new Map();

const cached = async (key, request) => {
  if (responseCache.has(key)) return responseCache.get(key);
  const pending = request().catch((error) => {
    responseCache.delete(key);
    throw error;
  });
  responseCache.set(key, pending);
  return pending;
};

export const clearApiCache = () => responseCache.clear();
const UPLOAD_API_BASE_URL =
  import.meta.env.VITE_UPLOAD_API_BASE_URL ||
  "https://lume-backend-cggh.onrender.com/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const uploadApiClient = axios.create({
  baseURL: UPLOAD_API_BASE_URL,
  withCredentials: false,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("lume_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

uploadApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("lume_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const friendlyError = (error) => {
  const status = error?.response?.status;
  const message = status === 401 ? "Please sign in to continue." : status === 403 ? "You do not have permission to do that." : status === 404 ? "That item is no longer available." : status >= 500 ? "Something went wrong. Please try again." : error?.response?.data?.message || "Unable to complete that action. Please try again.";
  if (error?.response?.data) error.response.data.message = message;
  return Promise.reject(error);
};

apiClient.interceptors.response.use((response) => response, friendlyError);
uploadApiClient.interceptors.response.use((response) => response, friendlyError);

export const loginUser = async (credentials) => {
  const res = await apiClient.post("/users/login", credentials);
  return res.data?.data;
};

export const registerUser = async (formData) => {
  const res = await uploadApiClient.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data?.data;
};

export const logoutUser = async () => {
  const res = await apiClient.post("/users/logout");
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await apiClient.get("/users/current-user");
  return res.data?.data;
};

export const getVideos = async (query = "", category = "", userId = "") => {
  const params = {};
  if (query) params.query = query;
  if (category) params.category = category;
  if (userId) params.userId = getResourceId(userId, "user");
  return cached(`videos:${JSON.stringify(params)}`, async () => {
    const res = await apiClient.get("/videos", { params });
    return res.data?.data || [];
  });
};

export const getVideoById = async (id) => {
  const res = await apiClient.get(`/videos/${getResourceId(id, "video")}`);
  return res.data?.data;
};

export const incrementVideoViews = async (id) => {
  const res = await apiClient.patch(`/videos/views/${getResourceId(id, "video")}`);
  return res.data?.data;
};

export const createVideo = async (videoData) => {
  const fd = new FormData();
  fd.append("title", videoData.title);
  fd.append("description", videoData.description);
  fd.append("category", videoData.category || "Coding");
  if (videoData.videoFile) fd.append("videoFile", videoData.videoFile);
  if (videoData.thumbnailFile) fd.append("thumbnail", videoData.thumbnailFile);

  const res = await uploadApiClient.post("/videos", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data?.data;
};

export const deleteVideo = async (videoId) => {
  const res = await apiClient.delete(`/videos/${getResourceId(videoId, "video")}`);
  return res.data;
};

export const toggleVideoLike = async (videoId) => {
  const res = await apiClient.post(`/likes/toggle/v/${getResourceId(videoId, "video")}`);
  return res.data?.data;
};

export const toggleCommentLike = async (commentId) => {
  const res = await apiClient.post(`/likes/toggle/c/${getResourceId(commentId, "comment")}`);
  return res.data?.data;
};

export const getLikedVideos = async () => {
  const res = await apiClient.get("/likes/videos");
  return res.data?.data || [];
};

export const toggleTweetLike = async (tweetId) => {
  const res = await apiClient.post(`/likes/toggle/t/${getResourceId(tweetId, "post")}`);
  return res.data?.data;
};

export const getTweets = async (userId) => {
  const url = userId ? `/tweets/user/${getResourceId(userId, "user")}` : "/tweets";
  return cached(`tweets:${url}`, async () => {
    const res = await apiClient.get(url);
    return res.data?.data || [];
  });
};

export const createTweet = async (content, imageFile) => {
  const fd = new FormData();
  fd.append("content", content);
  if (imageFile) fd.append("image", imageFile);

  const res = await uploadApiClient.post("/tweets", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  clearApiCache();
  return res.data?.data;
};

export const deleteTweet = async (tweetId) => {
  const res = await apiClient.delete(`/tweets/${getResourceId(tweetId, "post")}`);
  return res.data;
};

export const addTweetReply = async (tweetId, content) => {
  const res = await apiClient.post(`/tweets/reply/${getResourceId(tweetId, "post")}`, { content });
  clearApiCache();
  return res.data?.data;
};

export const getComments = async (videoId) => {
  const res = await apiClient.get(`/comments/${getResourceId(videoId, "video")}`);
  return res.data?.data || [];
};

export const addComment = async (videoId, content) => {
  const res = await apiClient.post(`/comments/${getResourceId(videoId, "video")}`, { content });
  return res.data?.data;
};

export const getSubscribedChannels = async (subscriberId) => {
  const res = await apiClient.get(`/subscriptions/c/${getResourceId(subscriberId, "user")}`);
  return res.data?.data || [];
};

export const toggleSubscription = async (channelId) => {
  const res = await apiClient.post(`/subscriptions/toggle/${getResourceId(channelId, "channel")}`);
  clearApiCache();
  return res.data?.data;
};

export const getSavedVideos = async () => {
  const res = await apiClient.get("/users/saved-videos");
  return res.data?.data || [];
};

export const toggleSavedVideo = async (videoId) => {
  const res = await apiClient.patch(
    `/users/saved-videos/${getResourceId(videoId, "video")}`,
  );
  return res.data?.data;
};

export const getNotifications = async () => {
  const res = await apiClient.get("/notifications");
  return res.data?.data || [];
};

export const markNotificationsAsRead = async () => {
  const res = await apiClient.post("/notifications/read");
  return res.data?.data;
};

export const getUserChannelProfile = async (username) => {
  const res = await apiClient.get(`/users/c/${username}`);
  return res.data?.data;
};

export const updateUserAvatar = async (avatarFile) => {
  const fd = new FormData();
  fd.append("avatar", avatarFile);
  const res = await uploadApiClient.patch("/users/avatar", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data?.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  const res = await apiClient.post("/users/change-password", {
    oldPassword,
    newPassword,
  });
  return res.data?.data;
};

export const updateAccountDetails = async ({ fullName, email }) => {
  const res = await apiClient.patch("/users/update-account", {
    fullName,
    email,
  });
  return res.data?.data;
};

export const getWatchHistory = async () => {
  const res = await apiClient.get("/users/history");
  return res.data?.data || [];
};

export const getChannelStats = async () => {
  const res = await apiClient.get("/dashboard/stats");
  return res.data?.data;
};

export const getChannelVideos = async () => {
  const res = await apiClient.get("/dashboard/videos");
  return res.data?.data || [];
};

export const getTweetById = async (tweetId) => {
  const res = await apiClient.get(`/tweets/post/${getResourceId(tweetId, "post")}`);
  return res.data?.data;
};

export default apiClient;
