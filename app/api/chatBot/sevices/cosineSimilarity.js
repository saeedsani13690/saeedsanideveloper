//====================================================
// شباهت دو Embedding
//====================================================
//این تابع در واقع مغز جستجوی معنایی چت‌بات تو است.
export default   function cosineSimilarity(vectorA, vectorB) {
// بررسی شباهت دو تا متن توسط بردار یک ودو
    if (
        !vectorA ||
        !vectorB ||
        vectorA.length !== vectorB.length // اگر مقدار طولشان یکی نباشد تمام الست 
    ) {
        // اگر شباهت ند اشت بگو صفر
        return 0;
    }
// ساخت متغیرهای محاسباتی
// 
    let dotProduct = 0;// دو تا بردار جقدر همجهت هستند 
    let normA = 0;// اندازه بردار اول
    let normB = 0;// اندازه بردار دوم 

    for (let i = 0; i < vectorA.length; i++) {

        dotProduct += vectorA[i] * vectorB[i];

        normA += vectorA[i] * vectorA[i];

        normB += vectorB[i] * vectorB[i];

    }

    normA = Math.sqrt(normA);// اینجا طول بردار رو مشخص میکینم
    normB = Math.sqrt(normB);// اینجا طول بردار رو مشخص میکینم
// برای جلوگیری از خطا 
    if (normA === 0 || normB === 0) {
        return 0;
    }

    return dotProduct / (normA * normB);

}
