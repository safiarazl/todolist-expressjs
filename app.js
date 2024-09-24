import {web} from "./config/web.js";
import {logger} from "./config/logging.js";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT;

web.listen(port, () => {
    logger.info("App start");
    logger.info(`Server is running on port ${port}`);
});
