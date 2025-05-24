import type { PreSignUpTriggerHandler } from "aws-lambda";

export const handler: PreSignUpTriggerHandler = async (event) => {
  const email = event.request.userAttributes.email || "";
  const allowedDomains = ["lotcabincrew.pl", "lotteam.pl", "lot.pl", "crewlot.pl"];
  const domain = email.split("@").pop()?.toLowerCase() ?? "";

  if (!allowedDomains.includes(domain)) {
    // Zgłoszenie błędu spowoduje przerwanie procesu rejestracji w Cognito
    throw new Error("Invalid email domain - only corporate emails are allowed");
  }

  // Jeśli domena prawidłowa, kontynuujemy tworzenie użytkownika
  return event;
};