import { connectDB, ENV_VAR } from "./config/index.js";
import app from "./index.js";

connectDB()
  .then(() => {
    app.listen(ENV_VAR.PORT, (err) => {
      if (err) {
        console.log("Error while starting the Server: ", err);
        process.exit(1);
      }
      console.log("server running at port:", ENV_VAR.PORT);
    });
  })
  .catch((err) => {
    console.log("Error while connecting with database, ", err);
  });
