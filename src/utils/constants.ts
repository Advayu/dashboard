export const daysOfWeek = [
  { display: "S", value: "Sunday" },
  { display: "M", value: "Monday" },
  { display: "T", value: "Tuesday" },
  { display: "W", value: "Wednesday" },
  { display: "T", value: "Thursday" },
  { display: "F", value: "Friday" },
  { display: "S", value: "Saturday" },
];

// Customer Capacities
export const customerCapacities = [
  "1 to 10",
  "11 to 20",
  "21 to 50",
  "51 to 100",
  "101 to 200",
  "200+",
];

// Payment Methods Options
export const paymentMethodsOptions = [
  "Cash",
  "Credit card",
  "Debit card",
  "Mobile wallets",
  "UPI",
  "Gift cards",
];

export const URLREGEX =
  /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g;

export const LAMBDA_URL =
  "https://mgr89ujp5i.execute-api.ap-south-1.amazonaws.com/dashboard";
// export const LAMBDA_URL = "http://localhost:4200";

export const AWS_IMAGE_UPLOAD_URL =
  "https://mgr89ujp5i.execute-api.ap-south-1.amazonaws.com/dashboard/upload/image";

export const AWS_IMAGE_GET_URL =
  "https://mgr89ujp5i.execute-api.ap-south-1.amazonaws.com/dashboard/upload/url";

// export const AWS_IMAGE_GET_URL = "http://localhost:4200/dashboard/upload/url"

export const OUTLET_BUCKET_NAME = "advayu-brands-assets/outlet-assets";
