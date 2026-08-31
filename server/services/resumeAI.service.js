
import ai from "../config/gemini.js";

const analyzeResume = async (resumeText) => {

    const prompt = `
You are an expert technical recruiter and resume evaluator.

Analyze the following resume carefully.

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations.
Do not wrap the JSON in \`\`\`.

Calculate a resume score from 0 to 100 based on:
- Technical skills
- Relevant experience
- Education
- Projects
- Certifications
- Resume quality and completeness
- Relevance for a software/IT job

Use exactly this structure:

{
    "score": 0,
    "name": "",
    "summary": "",
    "skills": [],
    "experience": [
        {
            "company": "",
            "role": "",
            "description": ""
        }
    ],
    "education": [
        {
            "degree": "",
            "institution": "",
            "year": ""
        }
    ],
    "projects": [
        {
            "name": "",
            "technologies": [],
            "description": ""
        }
    ],
    "certifications": []
}

Important:
- "score" must be a number between 0 and 100.
- Extract information only from the resume.
- Do not invent companies, skills, education, projects, or certifications.
- If information is missing, use an empty string or empty array.
- Return valid JSON only.

Resume:

${resumeText}
`;

    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {

        try {

            console.log(
                `🤖 Gemini attempt ${attempt}/${maxRetries}`
            );

            const response = await ai.models.generateContent({
                model: "gemini-3.5-flash-lite",
                contents: prompt,
            });

            console.log("✅ Gemini response received");

            return response.text.trim();

        } catch (error) {

            console.error(
                `❌ Gemini attempt ${attempt} failed:`,
                error.message
            );

            if (attempt === maxRetries) {

                throw new Error(
                    "Gemini is temporarily unavailable. Please try again later."
                );
            }

            await new Promise((resolve) =>
                setTimeout(resolve, 2000)
            );
        }
    }
};

export default analyzeResume;

