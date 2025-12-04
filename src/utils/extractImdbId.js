export function extractImdbId(urlOrId) {
    // Ako je već id
    if (/^tt\d+$/.test(urlOrId)) return urlOrId;

    // Ako je URL
    const match = urlOrId.match(/tt\d+/);
    return match ? match[0] : null;
}
