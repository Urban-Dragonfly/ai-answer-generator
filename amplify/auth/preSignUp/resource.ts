import { defineFunction } from "@aws-amplify/backend";

export const preSignUp = defineFunction({
  runtime: 18,
  name: "pre-sign-up",
  entry: "./handler.ts"
});