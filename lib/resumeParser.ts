export async function extractTextFromFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  const type = file.type;

  if (name.endsWith(".pdf") || type === "application/pdf") {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    try {
      const parsed = await parser.getText();
      return normalizeText(parsed.text);
    } finally {
      await parser.destroy();
    }
  }

  if (
    name.endsWith(".docx") ||
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const mammoth = await import("mammoth");
    const parsed = await mammoth.extractRawText({ buffer });
    return normalizeText(parsed.value);
  }

  if (
    name.endsWith(".txt") ||
    name.endsWith(".md") ||
    type.startsWith("text/") ||
    type === "application/octet-stream"
  ) {
    return normalizeText(buffer.toString("utf8"));
  }

  throw new Error("Unsupported resume file type. Upload PDF, DOCX, TXT, or MD.");
}

export function normalizeText(text: string) {
  return text.replace(/\u0000/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

export function assertUsableResumeText(text: string) {
  if (text.length < 300) {
    throw new Error(
      "The resume text is too short to analyze reliably. Upload a text-readable resume with education, skills, projects, or experience."
    );
  }

  if (text.length > 45000) {
    return text.slice(0, 45000);
  }

  return text;
}
