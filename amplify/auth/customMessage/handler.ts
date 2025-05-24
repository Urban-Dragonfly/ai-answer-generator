import type { CustomMessageTriggerHandler } from "aws-lambda";

export const handler: CustomMessageTriggerHandler = async (event) => {
  const verificationCode = event.request.codeParameter;

  event.response.emailSubject = "Witaj w Crew AI Project!";
  
  event.response.emailMessage = `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>Crew AI Project – Weryfikacja Konta</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f8fc; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
    h1 { font-size: 3rem; color: #004aad; text-align: center; }
    p { text-align: justify; line-height: 1.5; }
    .code { font-size: 1.5rem; font-weight: bold; background-color: #eaf4ff; padding: 10px; border-radius: 6px; text-align: center; margin: 30px 0; letter-spacing: 2px; }
    .image { width: 100%; height: auto; margin: 20px 0; }
    .footer { font-size: 0.85rem; color: #555; margin-top: 50px; padding-top: 10px; border-top: 1px solid #ddd; }
  </style>
</head>
<body>
  <div class="container">
    <h1><strong>Cześć!</strong></h1>
    <p>Tutaj jest Twój kod weryfikacyjny do Crew AI Project:</p>
    <div class="code">${verificationCode}</div>
    <img src="https://i.imgur.com/t6Qcb6H.png" alt="Crew AI" class="image">
    <p>
      Latanie to moja największa pasja – ale równie mocno fascynują mnie nowoczesne technologie.
      Mam nadzieję, że dzięki moim projektom opartym na AI uda mi się choć trochę uprościć Twoje życie
      i sprawić, że codzienność stanie się przyjemniejsza i bardziej efektywna. Dziś mogę zaprezentować Ci pierwszy z nich – <strong>AI Layover Guide</strong>.
      To całkowicie oddolna inicjatywa, więc jeśli masz pytania, sugestie albo po prostu chcesz się przywitać – śmiało!
      Jestem zwykłym stewardem, który, ucząc się nowych rzeczy, chce dzielić się nimi ze swoją społecznością. W końcu to właśnie Wy jesteście moją największą inspiracją.
      Bo przecież to ważne, z kim podróżujesz!
    </p>
    <p><a href="https://www.linkedin.com/in/michal-a-k">Michał</a></p>
    <div class="footer">
      <strong>A teraz kilka obowiązkowych (ale istotnych!) informacji:</strong>
      <p>
        Twoje dane osobowe są bezpieczne i przetwarzane wyłącznie w zakresie niezbędnym
        do działania aplikacji. Są chronione przez zaawansowaną infrastrukturę Amazon Web Services –
        więc jesteś w bardzo dobrych rękach.
      </p>
      <p>
        Jeśli jednak się z tym nie zgadzasz, po prostu zignoruj ten e-mail i udawajmy, że tego kontaktu
        nigdy nie było. 😄
      </p>
    </div>
  </div>
</body>
</html>
  `;

  return event;
};