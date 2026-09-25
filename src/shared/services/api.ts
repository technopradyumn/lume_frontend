import axios, { AxiosRequestConfig } from "axios";

export interface UserSummary {
  _id: string;
  id?: string;
  fullName: string;
  username: string;
  avatar?: string;
  coverImage?: string;
  email?: string;
  subscribersCount?: number;
  channelsSubscribedToCount?: number;
  isSubscribed?: boolean;
  totalViews?: number;
}

export interface VideoItem {
  _id: string;
  id?: string;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  views: number;
  isPublished: boolean;
  owner?: UserSummary;
  likesCount?: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CommentItem {
  _id: string;
  id?: string;
  content: string;
  video?: string;
  owner: UserSummary;
  likesCount?: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface TweetReply {
  _id?: string;
  id?: string;
  content: string;
  owner: UserSummary;
  createdAt: string;
}

export interface TweetItem {
  _id: string;
  id?: string;
  content: string;
  owner: UserSummary;
  image?: string;
  replies: TweetReply[];
  likesCount?: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationItem {
  _id: string;
  id?: string;
  recipient: string;
  sender?: UserSummary;
  type: "VIDEO" | "COMMENT" | "LIKE" | "REPLY";
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ChannelStats {
  totalSubscribers: number;
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
}

export interface SearchResults {
  query?: string;
  type?: string;
  people: UserSummary[];
  videos: VideoItem[];
  posts: TweetItem[];
  counts: {
    all: number;
    people: number;
    videos: number;
    posts: number;
  };
}

const getResourceId = (resource: any, label = "resource"): string => {
  const candidate =
    typeof resource === "object"
      ? resource?._id || resource?.id || resource?.$oid
      : resource;
  const id =
    typeof candidate === "object" ? candidate?.$oid || candidate?.id : candidate;
  if (!id || typeof id !== "string" || id === "[object Object]") {
    throw new Error(`A valid ${label} id is required`);
  }
  return id;
};

const API_BASE_URL = "/api/v1";
const responseCache = new Map<string, Promise<any>>();

const cached = async <T>(key: string, request: () => Promise<T>): Promise<T> => {
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
  process.env.NEXT_PUBLIC_UPLOAD_API_BASE_URL ||
  (process.env.NODE_ENV === "development"
    ? API_BASE_URL
    : "https://lume-backend-cggh.onrender.com/api/v1");

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const uploadApiClient = axios.create({
  baseURL: UPLOAD_API_BASE_URL,
  withCredentials: false,
});

let refreshRequest: Promise<string | undefined> | null = null;

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("lume_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

uploadApiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("lume_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

const friendlyError = (error: any) => {
  const status = error?.response?.status;
  const message =
    status === 401
      ? "Please sign in to continue."
      : status === 403
        ? "You do not have permission to do that."
        : status === 404
          ? "That item is no longer available."
          : status >= 500
            ? "Something went wrong. Please try again."
            : error?.response?.data?.message ||
              "Unable to complete that action. Please try again.";
  if (error?.response?.data) error.response.data.message = message;
  return Promise.reject(error);
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const isAuthRequest = [
      "/users/login",
      "/users/register",
      "/users/refresh-token",
    ].some((path) => originalRequest?.url?.includes(path));

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;
      try {
        if (!refreshRequest) {
          refreshRequest = axios
            .post(
              `${API_BASE_URL}/users/refresh-token`,
              {},
              { withCredentials: true }
            )
            .then((response) => response.data?.data?.accessToken)
            .finally(() => {
              refreshRequest = null;
            });
        }
        const accessToken = await refreshRequest;
        if (!accessToken) throw error;
        if (typeof window !== "undefined") {
          localStorage.setItem("lume_token", accessToken);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          window.dispatchEvent(new Event("lume:token-refreshed"));
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("lume_token");
          window.dispatchEvent(new Event("lume:session-expired"));
        }
        return friendlyError(refreshError);
      }
    }

    return friendlyError(error);
  }
);

uploadApiClient.interceptors.response.use((response) => response, friendlyError);

export const loginUser = async (credentials: any): Promise<any> => {
  const res = await apiClient.post("/users/login", credentials);
  return res.data?.data;
};

export const registerUser = async (formData: FormData): Promise<any> => {
  const res = await uploadApiClient.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data?.data;
};

export const logoutUser = async (): Promise<any> => {
  const res = await apiClient.post("/users/logout");
  return res.data;
};

export const getCurrentUser = async (): Promise<UserSummary | null> => {
  const res = await apiClient.get("/users/current-user");
  return res.data?.data;
};

export const getVideos = async (
  query = "",
  category = "",
  userId = ""
): Promise<VideoItem[]> => {
  const params: Record<string, string> = {};
  if (query) params.query = query;
  if (category) params.category = category;
  if (userId) params.userId = getResourceId(userId, "user");
  return cached(`videos:${JSON.stringify(params)}`, async () => {
    const res = await apiClient.get("/videos", { params });
    return res.data?.data || [];
  });
};

export const searchContent = async (
  query: string,
  type = "all"
): Promise<SearchResults> => {
  const res = await apiClient.get("/search", { params: { q: query, type } });
  return (
    res.data?.data || {
      people: [],
      videos: [],
      posts: [],
      counts: { all: 0, people: 0, videos: 0, posts: 0 },
    }
  );
};

export const getVideoById = async (id: any): Promise<VideoItem> => {
  const res = await apiClient.get(`/videos/${getResourceId(id, "video")}`);
  return res.data?.data;
};

export const incrementVideoViews = async (id: any): Promise<any> => {
  const res = await apiClient.patch(
    `/videos/views/${getResourceId(id, "video")}`
  );
  return res.data?.data;
};

export const createVideo = async (videoData: {
  title: string;
  description: string;
  category?: string;
  videoFile?: File | Blob | null;
  thumbnailFile?: File | Blob | null;
}): Promise<VideoItem> => {
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

export const deleteVideo = async (videoId: any): Promise<any> => {
  const res = await apiClient.delete(`/videos/${getResourceId(videoId, "video")}`);
  return res.data;
};

export const toggleVideoLike = async (videoId: any): Promise<{ isLiked: boolean; likesCount: number }> => {
  const res = await apiClient.post(
    `/likes/toggle/v/${getResourceId(videoId, "video")}`
  );
  return res.data?.data;
};

export const toggleCommentLike = async (commentId: any): Promise<{ isLiked: boolean; likesCount: number }> => {
  const res = await apiClient.post(
    `/likes/toggle/c/${getResourceId(commentId, "comment")}`
  );
  return res.data?.data;
};

export const getLikedVideos = async (): Promise<VideoItem[]> => {
  const res = await apiClient.get("/likes/videos");
  return res.data?.data || [];
};

export const toggleTweetLike = async (tweetId: any): Promise<{ isLiked: boolean }> => {
  const res = await apiClient.post(
    `/likes/toggle/t/${getResourceId(tweetId, "post")}`
  );
  return res.data?.data;
};

export const getTweets = async (userId?: any): Promise<TweetItem[]> => {
  const url = userId
    ? `/tweets/user/${getResourceId(userId, "user")}`
    : "/tweets";
  return cached(`tweets:${url}`, async () => {
    const res = await apiClient.get(url);
    return res.data?.data || [];
  });
};

export const createTweet = async (
  content: string,
  imageFile?: File | Blob | null
): Promise<TweetItem> => {
  const fd = new FormData();
  fd.append("content", content);
  if (imageFile) fd.append("image", imageFile);

  const res = await uploadApiClient.post("/tweets", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  clearApiCache();
  return res.data?.data;
};

export const deleteTweet = async (tweetId: any): Promise<any> => {
  const res = await apiClient.delete(`/tweets/${getResourceId(tweetId, "post")}`);
  return res.data;
};

export const addTweetReply = async (
  tweetId: any,
  content: string
): Promise<TweetItem> => {
  const res = await apiClient.post(
    `/tweets/reply/${getResourceId(tweetId, "post")}`,
    { content }
  );
  clearApiCache();
  return res.data?.data;
};

export const getComments = async (videoId: any): Promise<CommentItem[]> => {
  const res = await apiClient.get(`/comments/${getResourceId(videoId, "video")}`);
  return res.data?.data || [];
};

export const addComment = async (
  videoId: any,
  content: string
): Promise<CommentItem> => {
  const res = await apiClient.post(
    `/comments/${getResourceId(videoId, "video")}`,
    { content }
  );
  return res.data?.data;
};

export const getSubscribedChannels = async (
  subscriberId: any
): Promise<UserSummary[]> => {
  const res = await apiClient.get(
    `/subscriptions/c/${getResourceId(subscriberId, "user")}`
  );
  return res.data?.data || [];
};

export const toggleSubscription = async (channelId: any): Promise<{ isSubscribed: boolean }> => {
  const res = await apiClient.post(
    `/subscriptions/toggle/${getResourceId(channelId, "channel")}`
  );
  clearApiCache();
  return res.data?.data;
};

export const getSavedVideos = async (): Promise<VideoItem[]> => {
  const res = await apiClient.get("/users/saved-videos");
  return res.data?.data || [];
};

export const toggleSavedVideo = async (videoId: any): Promise<{ isSaved: boolean; videos: VideoItem[] }> => {
  const res = await apiClient.patch(
    `/users/saved-videos/${getResourceId(videoId, "video")}`
  );
  return res.data?.data;
};

export const getNotifications = async (): Promise<NotificationItem[]> => {
  return cached("notifications", async () => {
    const res = await apiClient.get("/notifications");
    return res.data?.data || [];
  });
};

export const markNotificationsAsRead = async (): Promise<any> => {
  const res = await apiClient.post("/notifications/read");
  return res.data?.data;
};

export const getUserChannelProfile = async (
  username: string
): Promise<UserSummary> => {
  const res = await apiClient.get(`/users/c/${username}`);
  return res.data?.data;
};

export const updateUserAvatar = async (avatarFile: File | Blob): Promise<UserSummary> => {
  const fd = new FormData();
  fd.append("avatar", avatarFile);
  const res = await uploadApiClient.patch("/users/avatar", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data?.data;
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<any> => {
  const res = await apiClient.post("/users/change-password", {
    oldPassword,
    newPassword,
  });
  return res.data?.data;
};

export const updateAccountDetails = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}): Promise<UserSummary> => {
  const res = await apiClient.patch("/users/update-account", {
    fullName,
    email,
  });
  return res.data?.data;
};

export const getWatchHistory = async (): Promise<VideoItem[]> => {
  const res = await apiClient.get("/users/history");
  return res.data?.data || [];
};

export const getChannelStats = async (): Promise<ChannelStats> => {
  const res = await apiClient.get("/dashboard/stats");
  return res.data?.data;
};

export const getChannelVideos = async (): Promise<VideoItem[]> => {
  const res = await apiClient.get("/dashboard/videos");
  return res.data?.data || [];
};

export const getTweetById = async (tweetId: any): Promise<TweetItem> => {
  const res = await apiClient.get(
    `/tweets/post/${getResourceId(tweetId, "post")}`
  );
  return res.data?.data;
};

export const requestForgotPassword = async (email: string): Promise<{
  email: string;
  emailSent: boolean;
  previewOtp?: string;
  previewUrl?: string;
}> => {
  const res = await apiClient.post("/users/forgot-password", { email });
  return res.data?.data;
};

export const resetPasswordWithOTP = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<{ success: boolean }> => {
  const res = await apiClient.post("/users/reset-password", {
    email,
    otp,
    newPassword,
  });
  return res.data?.data;
};

export default apiClient;
