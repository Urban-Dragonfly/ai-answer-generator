import { defineFunction } from "@aws-amplify/backend";

export const customMessage = defineFunction({
  runtime: 18,
  name: "custom-message",
  entry: "./handler.ts"
});