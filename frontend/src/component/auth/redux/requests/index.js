export const loginRequest = values =>
  fetch("/identity", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(values)
  }).then(response => response);

export const profileRequest = token =>
  fetch("/identity", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`
    }
  }).then(response => response);
