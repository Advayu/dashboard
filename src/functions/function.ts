import { v4 as uuidv4 } from 'uuid';

export const generateUniqueUUID = (): string => {
  return uuidv4();
};




// Function to navigate to the previous page
export const navigateToPreviousPage = () => {
  history.back();
};

export function checkAuthCookie() {
  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];

  if (!accessToken) {
    window.location.href = "/auth";
    return false;
  }

  return accessToken;
}