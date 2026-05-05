import app from "./app";

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`\x1b[32m✔ Server is running on http://localhost:${PORT}\x1b[0m`);
  console.log(`\x1b[36mℹ Press Ctrl+C to stop the server\x1b[0m`);
});
