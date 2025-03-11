// const ENVIRONMENTS: {
//   DEVELOPMENT: "DEVELOPMENT";
//   PRODUCTION: "PRODUCTION";
// } = {
//   DEVELOPMENT: "DEVELOPMENT",
//   PRODUCTION: "PRODUCTION",
// };

// const currentEnvironment = ENVIRONMENTS.DEVELOPMENT; // Can switch between DEVELOPMENT or PRODUCTION

// const BACKEND_URLS: {
//   DEVELOPMENT: string;
//   PRODUCTION: string;
// } = {
//   DEVELOPMENT: "http://127.0.0.1:8787",
//   PRODUCTION: "https://fair-ticket-honojs.developer-9ce.workers.dev",
// };

// const getBackendUrl = () => {
//   return BACKEND_URLS[currentEnvironment];
// };

let rootPath = process.env.NEXT_PUBLIC_SERVER_URL;

export { rootPath };
