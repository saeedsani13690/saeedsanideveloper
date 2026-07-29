const OLLAMA_URL =
process.env.OLLAMA_URL || "http://localhost:11434";


// پاسخ چت
export async function askOllama(cleanMessage) {
    const response = await fetch(
        `${OLLAMA_URL}/api/generate`,
        {
            method:"POST",
            headers:{  "Content-Type":"application/json"},
body:JSON.stringify({   model:"llama3.2:1b",  prompt:cleanMessage,stream:false }) 
        }
    );
    if(!response.ok){throw new Error("Ollama Error");}
    const data = await response.json();
    return data.response.trim();
}


// الاما یک سرور است که مدل هوش مصنوعی  زیر را اجرا میکند
// Embedding
export async function getEmbedding(text) {
    const response = await fetch(
        `${OLLAMA_URL}/api/embeddings`,
        {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ model:"nomic-embed-text",prompt:text   })
    });
    if(!response.ok){  throw new Error("Embedding Error");   }
    const data =await response.json();
    return data.embedding;

}