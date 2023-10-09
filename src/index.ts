import app from "./server";

import Config from "./config";

// PORT
const PORT = Config.port;

app.get("/", (req, res) => {
  res.send(
    `<div style="height: 100vh; width: fit-content; margin: 0 auto; display: flex; align-items: center; justify-content: center; flex-direction: column">
      <h1 style="margin-bottom: 8rem; font-size: 4vh;">- <u>Changelog API</u> -</h1>    
      <label style="font-weight: bold; font-size: 3vh; opacity: 0.66; margin-bottom: 1rem;" for="file"><i>Documentation in progress:</i></label>
      <progress id="file" max="100" value="70" style="width: 88%">70%</progress>
    </div>`,
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} ... 🚀`);
});
