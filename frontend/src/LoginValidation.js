function Validation(values) {
  let error = {};
  const userID_pattern = /^(SU|AD|CW|GW)\d{3}$/; 
  const password_pattern = /^[a-z0-9]+$/;

  if (values.UserID === "") {
    error.UserID = "UserID should not be empty";
  } else if (!userID_pattern.test(values.UserID)) {
    error.UserID = "UserID format: SU or AD or CW or GW + 3 digits (e.g., AD001)";
  } else {
    error.UserID = "";
  }

  if (values.Password === "") {
    error.Password = "Password should not be empty";
  } else if (!password_pattern.test(values.Password)) {
    error.Password = "Only lowercase letters and numbers allowed";
  } else {
    error.Password = "";
  }

  return error;
}
export default Validation;
