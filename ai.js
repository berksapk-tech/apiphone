// ⚠️ Kendi OpenAI Key'inizi buraya koyun
const OPENAI_API_KEY = "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";

const SYSTEM_PROMPT = `
You are a professional smartphone expert AI.
Compare phones honestly.
Never exaggerate.
Explain strengths and weaknesses clearly.
Choose the better phone based on performance, camera, battery and daily usage.
Speak Turkish.
`;

async function comparePhones(){
    const phone1 = document.getElementById("phone1").value.trim();
    const phone2 = document.getElementById("phone2").value.trim();
    const mode = document.getElementById("mode").value;
    const resultDiv = document.getElementById("result");

    if(!phone1 || !phone2){
        resultDiv.innerHTML = "❌ Lütfen iki telefonu da yazın";
        return;
    }

    resultDiv.innerHTML = "🤖 AI düşünüyor...";

    const userPrompt = `
Karşılaştır bu iki telefonu:

Telefon 1: ${phone1}
Telefon 2: ${phone2}

Aşağıya göre değerlendir:
- ${mode} için hangisi daha iyi
- Genel performans
- Güçlü ve zayıf yönlerini açıkla
- Son öneri ver
`;

    try{
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + OPENAI_API_KEY
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.4
            })
        });

        const data = await res.json();
        const aiText = data.choices[0].message.content;

        resultDiv.innerHTML = `
<h3>📊 AI Sonucu</h3>
<p>${aiText.replace(/\n/g,"<br>")}</p>
<hr>
<small>⚠️ Sonuçlar AI yorumudur, reklam yoktur.</small>
`;
    }catch(e){
        console.error(e);
        resultDiv.innerHTML = "❌ OpenAI bağlantı hatası veya API key eksik";
    }
}
