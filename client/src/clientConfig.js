const config = {
  isProduction: process.env.NODE_ENV === "production",
  // Use explicit REACT_APP_SERVER_URI if provided (e.g., production); in development prefer same-origin so CRA proxy can forward to backend
  serverURI:
    process.env.REACT_APP_SERVER_URI || (process.env.NODE_ENV === 'production' ? window.location.origin : ''),
};

export default config;
