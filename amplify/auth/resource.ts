import { defineAuth } from "@aws-amplify/backend";
import { preSignUp } from "./preSignUp/resource";
import { customMessage } from "./customMessage/resource";

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
    },
  },
  triggers: {
    preSignUp,
    customMessage,
  },
});
