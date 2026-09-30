import api from "../axios";

export const sendCareerMessage = async ({
  conversationId,
  message,
  actionType,
  context,
  history,
  cvFile,
  resetCvContext,
}) => {
  const request = {
    conversationId,
    message,
    actionType,
    context,
    history,
    resetCvContext,
  };
  const payload = cvFile ? new FormData() : request;
  if (cvFile) {
    payload.append(
      "request",
      new Blob([JSON.stringify(request)], { type: "application/json" }),
    );
    payload.append("cv", cvFile);
  }
  const response = await api.post("/api/user/career-assistant/chat", payload);
  return response.data;
};
