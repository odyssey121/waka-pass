export const loginRequest = values =>
  fetch("/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(values)
  }).then(response => response);

export const profileRequest = (token) =>
  fetch("/retrieve", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `${token}`
    }
  }).then(response => response);
