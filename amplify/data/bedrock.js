export function request(ctx) {
    const { city, startPoint, durationHours } = ctx.args;

    // Construct the prompt with the provided ingredients
    const prompt = `
Jesteś profesjonalnym przewodnikiem, ekspertem od pieszych wycieczek. Zaplanuj ${durationHours}-godzinny spacer po ${city}, startując od „${startPoint}” przy zachowaniu:

- Tryb: tylko pieszo.
- Całkowity czas (zwiedzanie + dojście) ≤ ${durationHours} godziny.
- Pomijaj miejsca oddalone >2 km od poprzedniego punktu.
- Uwzględnij możliwy dojazd na alternatywne miejsce startu jeśli wskazane miejsce startu jest oddalone od ciekawych miejsc.
- Między przystankami dodaj: „Spacer X min (Y km) ulicą [nazwa lub dzielnica]”.
- Na końcu podaj link do Google Maps z kierunkami pieszymi.

Wyjście:
1. Przystanek 1…
   Spacer …
…
**Link do mapy (pieszo):** https://www.google.com/maps/dir/?api=1&origin=…&travelmode=walking&waypoints=…
`;
  
    // Return the request configuration
    return {
      resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke`,
      method: "POST",
      params: {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 2000,
          temperature: 0.5,
          top_p: 0.9,
          top_k: 250,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `\n\nHuman: ${prompt}\n\nAssistant:`,
                },
              ],
            },
          ],
        }),
      },
    };
  }
  
  export function response(ctx) {
    // Parse the response body
    const parsedBody = JSON.parse(ctx.result.body);
    // Extract the text content from the response
    const res = {
      body: parsedBody.content[0].text,
    };
    // Return the response
    return res;
  }