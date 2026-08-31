import { PDFParse } from "pdf-parse";

const extractResumeText = async (buffer) => {
    try {
        const parser = new PDFParse({
            data: buffer,
        });

        const result = await parser.getText();

        await parser.destroy();

        if (!result.text?.trim()) {
            throw new Error("No readable text found in resume");
        }

        return result.text.trim();
    } catch (error) {
        console.error("Resume Parser Error:", error.message);
        throw new Error("Failed to extract text from resume");
    }
};

export default extractResumeText;