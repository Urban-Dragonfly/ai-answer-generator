export function request(ctx) {
    const { city, startPoint, durationHours } = ctx.args;

    // Construct the prompt with the provided ingredients
    const prompt = `
Jesteś profesjonalnym przewodnikiem, ekspertem od pieszych wycieczek. Zaplanuj ${durationHours}-godzinny spacer po ${city}, startując od „${startPoint}” przy zachowaniu:

- Tryb: tylko pieszo.
- Całkowity czas (zwiedzanie + dojście) ≤ ${durationHours} godziny.
- Pomijaj miejsca oddalone >2 km od poprzedniego punktu.
- Uwzględnij możliwy dojazd na alternatywne miejsce startu jeśli wskazane miejsce startu jest oddalone od ciekawych miejsc, zaproponuj najbardziej optymalny środek transportu, uwzględnij czas dojazdu i powrotu w wyliczeniach całkowitego czasu.
- Między przystankami dodaj: „Spacer X min (Y km) ulicą [nazwa lub dzielnica]”.
- Opowiedz w skrócie o każdym przystanku (2-3 zdania).
- Na końcu podaj link do Google Maps (pieszo) w formacie https://www.google.com/maps/dir/?api=1&origin=Nazwa miejsca, Miasto&destination=Ostatni punkt, Miasto&waypoints=Punkt 1, Miasto|Punkt 2, Miasto|…&travelmode=walking Każda nazwa musi zawierać po przecinku miasto, a spacje zamieniamy na „+”.
- Bądź entuzjastyczny z odrobiną czarnego humoru.
Wyjście:
1. Przystanek 1 (czas zwiedzania: X min) …
Spacer (czas spaceru: X min) …
…
Link do mapy (pieszo): https://www.google.com/maps/dir/?api=1&origin=Początek, Miasto&destination=Koniec, Miasto&waypoints=Punkt1, Miasto|Punkt2, Miasto|…&travelmode=walking
…
`;
  
    // Return the request configuration
    return {
      resourcePath: `/model/us.anthropic.claude-3-5-haiku-20241022-v1:0/invoke`,
      method: "POST",
      params: {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 2000,
          temperature: 0.7,
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
    const status = ctx.result.statusCode;
    const body = ctx.result.body;

    if (status !== 200) {
      return {
        body: "",
        error: `Błąd z Bedrock: ${status} - ${body}`,
      };
    }

    const parsedBody = JSON.parse(body);
    return {
      body: parsedBody.content[0].text,
      error: "",
    };
  }
