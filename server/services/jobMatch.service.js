import ai from "../config/gemini.js";

const matchResumeToJob = async (resumeAnalysis, job) => {
    try {
        console.log("🤖 Starting AI job matching...");

        const prompt = `
You are an expert technical recruiter.

Compare the candidate's resume with the job description.

Analyze:
1. Skills
2. Experience
3. Projects
4. Job requirements
5. Required skills

Calculate a realistic match score from 0 to 100.

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations outside the JSON.

Use exactly this structure:

{
    "matchScore": 0,
    "matchedSkills": [],
    "missingSkills": [],
    "recommendations": []
}

CANDIDATE RESUME:
${JSON.stringify(resumeAnalysis)}

JOB:
${JSON.stringify({
    title: job.title,
    description: job.description,
    skills: job.skills,
    experience: job.experience,
    requirements: job.requirements,
    responsibilities: job.responsibilities
})}
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
        });

        console.log("✅ AI job matching response received");

        const text = response.text.trim();

        let result;

        try {
            result = JSON.parse(text);
        } catch (error) {
            console.error("❌ Invalid AI JSON:", text);

            throw new Error("AI returned invalid matching data");
        }

        return result;

    } catch (error) {
        console.error(
            "❌ Job Match AI Error:",
            error.message
        );

        throw new Error("Failed to match resume with job");
    }
};

export default matchResumeToJob;