export function isPushAccepted(response, data) {
  return response.ok && typeof data?.id === "string" && data.id.length > 0;
}
