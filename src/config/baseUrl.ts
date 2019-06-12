export default process.env.NODE_ENV === "production"
  ? "https://api.eesast.com"
  : "http://localhost:28888";
