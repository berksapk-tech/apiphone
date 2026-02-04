// ⚠️ BURAYA KENDİ OPENAI KEY'İNİ KOY
const OPENAI_API_KEY = "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";

// Telefon datasetini yükle
let phones = [];
fetch("data/phones.json")
  .then(res=>res.json())
  .then(data=>phones=data);

// AI Prompt
const SYSTEM_PROMPT = `
You are a professional smartphone expert AI.
Compare phones honestly.
Never exaggerate.
Explain strengths and weaknesses clearly.
Choose the better phone based on performance, camera, battery and daily usage.
Speak Turkish.
`;

// Telefon adını datasetten bul
function findPhone(name){
  return phones.find(p => p.name.toLowerCase() === name.toLowerCase());
}

async function comparePhones(){
  const p1Name = document.getElementById("phone1").value;
  const p2Name = document.getElementById("phone2").value;
  const mode = document.getElementById("mode").value;
  const resultDiv = document.getElementById("result");

  if(!p1Name || !p2Name){
    resultDiv.innerHTML = "❌ Lütfen iki telefonu da girin";
    return;
  }

  const phone1 = findPhone(p1Name);
  const phone2 = findPhone(p2Name);

  if(!phone1 || !phone2){
    resultDiv.innerHTML = "❌ Telefon datasetinde bulunamadı";
    return;
  }

  resultDiv.innerHTML = "🤖 AI düşünüyor...";

  const userPrompt = `
Compare these two smartphones:
Phone 1: ${phone1.name} (CPU:${phone1.cpuScore}, GPU:${phone1.gpuScore}, Camera:${phone1.cameraMP}MP, Battery:${phone1.battery}mAh, Refresh:${phone1.refreshRate}Hz)
Phone 2: ${phone2.name} (CPU:${phone2.cpuScore}, GPU:${phone2.gpuScore}, Camera:${phone2.cameraMP}MP, Battery:${phone2.battery}mAh, Refresh:${phone2.refreshRate}Hz)

Explain:
- Which one is better for ${mode}
- Which one has better overall performance
- Give clear strengths and weaknesses
- Final recommendation
`;

  try{
    const res = await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+OPENAI_API_KEY
      },
      body:JSON.stringify({
        model:"gpt-4o-mini",
        messages:[
          {role:"system", content: SYSTEM_PROMPT},
          {role:"user", content: userPrompt}
        ],
        temperature:0.4
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
