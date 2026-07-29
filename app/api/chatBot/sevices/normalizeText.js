export default function normalizeText(text) {

    if (!text) return "";

    return text
        .toLowerCase()
        .replace(/[ي]/g, "ی")
        .replace(/[ك]/g, "ک")
        .replace(/‌/g, " ")
        .replace(/[^\w\s\u0600-\u06FF]/g, "")
        .replace(/\s+/g, " ")
        .trim();

}