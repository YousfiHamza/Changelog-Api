import app from "./server";

import Config from "./config";

// PORT
const PORT = Config.port;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} ... 🚀`);
});
