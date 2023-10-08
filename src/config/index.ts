import merge from "lodash.merge";

import ProdConfig from "./prod";
import StagingConfig from "./staging";
import DevConfig from "./dev";

// make sure NODE_ENV is set
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const stage = process.env.STAGE || "dev";

let envConfig;

// dynamically require each config depending on the stage we're in
if (stage === "production") {
  envConfig = ProdConfig;
} else if (stage === "staging") {
  envConfig = StagingConfig;
} else {
  envConfig = DevConfig;
}

const defaultConfig = {
  stage,
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  port: 3001,
  logging: false,
};

export default merge(defaultConfig, envConfig);
