import {
  postContactUsController,
  postSubscribeToNewsletterController,
} from "../controller/contactUs.js";
import {
  optionalUserToken,
  postContactUsValidator,
  postSubscribeToNewsletterValidator,
} from "../middleware/contactUs.js";

export default (app) => {
  app.post(
    "/apis/user/contact",
    optionalUserToken,
    postContactUsValidator,
    postContactUsController
  );
  app.post(
    "/apis/user/subscribeToNewsletter",
    optionalUserToken,
    postSubscribeToNewsletterValidator,
    postSubscribeToNewsletterController
  );
};
