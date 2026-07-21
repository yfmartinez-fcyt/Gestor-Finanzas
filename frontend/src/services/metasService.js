import { apiRequest } from "./api";

export const getMetas = () =>
  apiRequest("/api/metas");

export const getMeta = (id) =>
  apiRequest(`/api/metas/${id}`);

export const createMeta = (payload) =>
  apiRequest("/api/metas", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateMeta = (id, payload) =>
  apiRequest(`/api/metas/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteMeta = (id) =>
  apiRequest(`/api/metas/${id}`, {
    method: "DELETE",
  });