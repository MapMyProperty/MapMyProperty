const axios = require("axios");
const Projects = require("../models/projects");
const RawData = require("../models/rawData");
const Category = require("../models/category");
const Builders = require("../models/builders");
const cheerio = require("cheerio");

// Helper function to call Perplexity AI
const callPerplexityAI = async (prompt, systemMessage = "You are a helpful real estate data assistant. Output valid JSON only.") => {
    const response = await axios.post(
        "https://api.perplexity.ai/chat/completions",
        {
            model: "sonar-pro",
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: prompt },
            ],
        },
        {
            headers: {
                "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                "Content-Type": "application/json"
            }
        }
    );

    const aiContent = response.data.choices[0].message.content;

    // Parse JSON from response
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(aiContent);
};

// Helper function to scrape URL content
const scrapeUrl = async (url) => {
    try {
        console.log(`Scraping URL: ${url}`);
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = response.data;
        const $ = cheerio.load(html);

        // Remove unwanted elements
        $('script').remove();
        $('style').remove();
        $('nav').remove();
        $('footer').remove();
        $('iframe').remove();

        // Extract and clean text
        let scrapedText = $('body').text().replace(/\s\s+/g, ' ').trim();
        // Limit text length to prevent token overflow
        scrapedText = scrapedText.substring(0, 12000);

        console.log("Scraping successful, text length:", scrapedText.length);
        return scrapedText;
    } catch (err) {
        console.error("Scraping failed:", err.message);
        return null;
    }
};

// Get context string based on input type
const getContextString = (inputType, data) => {
    if (inputType === 'url' && data.scrapedText) {
        return `
--- SCRAPED TEXT FROM URL: ${data.url} ---
${data.scrapedText}
--- END OF SCRAPED TEXT ---`;
    } else if (inputType === 'rawText') {
        return `
--- PROJECT INFORMATION ---
${data.rawText}
--- END OF INFORMATION ---`;
    } else {
        return `Project Name: "${data.projectName}"${data.location ? `, Location: "${data.location}"` : ""}`;
    }
};

const generateProject = async (req, res) => {
    try {
        const { projectName, location, rawText, url, preview } = req.body;

        if (!projectName && !rawText && !url) {
            return res.status(400).json({ message: "Project name, raw text, or URL is required" });
        }

        if (!process.env.PERPLEXITY_API_KEY) {
            return res.status(500).json({
                message: "Server configuration error: PERPLEXITY_API_KEY is missing. Please contact admin."
            });
        }

        // Determine input type and prepare context
        let inputType = 'name';
        let contextData = { projectName, location };

        if (url) {
            inputType = 'url';
            const scrapedText = await scrapeUrl(url);
            contextData = { url, scrapedText };
        } else if (rawText) {
            inputType = 'rawText';
            contextData = { rawText };
        }

        const contextString = getContextString(inputType, contextData);

        console.log("\n========== STAGE 1: Basic Info ==========");

        // ==================== STAGE 1: BASIC INFO ====================
        const stage1Prompt = `
Act as a Real Estate Data Specialist.
Analyze the following and extract BASIC project information:

${contextString}

Return ONLY a valid JSON object with these fields:
{
    "title": "Official Project Name",
    "subtitle": "Catchy tagline highlighting key USP (10-15 words)",
    "builder": "Exact Builder/Developer Name - DO NOT GUESS, extract from source only",
    "location": "City, Area (e.g. Whitefield, Bangalore)",
    "category": "Property Type: Villa, Plot, Apartment, Commercial, or Plotted Development",
    "status": "Under Construction, Ready to Move In, Launch, or Pre Launch",
    "minPrice": number (in INR, raw integer, e.g. 5000000),
    "maxPrice": number (in INR, raw integer, e.g. 15000000),
    "href": "seo-friendly-url-slug",
    "metaTitle": "SEO Title (60 chars max) | Builder Name",
    "metaDescription": "SEO Meta Description (160 chars max) with USP and location",
    "metaKeywords": "comma, separated, seo, keywords",
    "bedrooms": ["2 BHK", "3 BHK", "4 BHK"],
    "areas": [1200, 2500]
}

IMPORTANT:
- Extract builder name EXACTLY as shown in source, do NOT hallucinate famous builders
- Prices must be numbers, not strings
- If data is not available, make realistic estimates based on location
`;

        const stage1Data = await callPerplexityAI(
            stage1Prompt,
            "You are a real estate data extractor. Output valid JSON only. EXTRACT BUILDER NAME EXACTLY AS SHOWN - DO NOT GUESS OR HALLUCINATE."
        );
        console.log("Stage 1 Complete:", stage1Data.title);

        console.log("\n========== STAGE 2: Content ==========");

        // ==================== STAGE 2: CONTENT ====================
        const stage2Prompt = `
Act as a Real Estate SEO Content Writer.
Create comprehensive content for this project:

Project: "${stage1Data.title}"
Builder: "${stage1Data.builder || 'Premium Developer'}"
Location: "${stage1Data.location}"
Category: "${stage1Data.category}"
Price Range: ${stage1Data.minPrice} - ${stage1Data.maxPrice} INR

${contextString}

Return ONLY a valid JSON object with these fields:
{
    "description": "Comprehensive SEO-optimized project description. MINIMUM 250 words. Include: project overview, location advantages, lifestyle benefits, investment value, nearby landmarks, connectivity. Write in professional, engaging tone.",
    
    "builderDescription": "Detailed builder profile. MINIMUM 80 words. Include: company history, reputation, past projects, quality standards, awards if any.",
    
    "expertOpinions": [
        "Expert opinion 1 - Focus on location advantage. MINIMUM 40 words.",
        "Expert opinion 2 - Focus on investment potential. MINIMUM 40 words.",
        "Expert opinion 3 - Focus on amenities and lifestyle. MINIMUM 40 words.",
        "Expert opinion 4 - Focus on connectivity and infrastructure. MINIMUM 40 words.",
        "Expert opinion 5 - Focus on builder reputation and quality. MINIMUM 40 words."
    ]
}

IMPORTANT:
- Description must be MINIMUM 250 words, rich with SEO keywords
- Each expert opinion must be MINIMUM 40 words
- Write professionally, avoid fluff
`;

        const stage2Data = await callPerplexityAI(
            stage2Prompt,
            "You are a professional real estate content writer. Create detailed, SEO-optimized content. Output valid JSON only."
        );
        console.log("Stage 2 Complete: Description length:", stage2Data.description?.length);

        console.log("\n========== STAGE 3: Details ==========");

        // ==================== STAGE 3: DETAILS ====================
        const stage3Prompt = `
Act as a Real Estate Details Specialist.
Create detailed features, FAQs, and pricing for this project:

Project: "${stage1Data.title}"
Location: "${stage1Data.location}"
Category: "${stage1Data.category}"
Price Range: ${stage1Data.minPrice} - ${stage1Data.maxPrice} INR
Bedrooms: ${JSON.stringify(stage1Data.bedrooms)}

${contextString}

Return ONLY a valid JSON object with these fields:
{
    "features": {
        "Safety & Security": ["24/7 Security", "CCTV Surveillance", "Gated Community", "Intercom", "Fire Safety Systems"],
        "Sports & Fitness": ["Swimming Pool", "Gymnasium", "Jogging Track", "Tennis Court", "Basketball Court"],
        "Leisure & Recreation": ["Clubhouse", "Party Hall", "Children's Play Area", "Landscaped Gardens", "Amphitheatre"],
        "Convenience": ["Power Backup", "Water Supply", "Covered Parking", "Visitor Parking", "Lift"],
        "Eco-Friendly": ["Rainwater Harvesting", "Solar Lighting", "Sewage Treatment", "Waste Management"]
    },
    
    "faqs": [
        { "questions": "What is the location of ${stage1Data.title}?", "answer": "Detailed answer about location, area, and landmarks (50+ words)" },
        { "questions": "What are the unit types available?", "answer": "Detailed answer about configurations and sizes (50+ words)" },
        { "questions": "What is the price range?", "answer": "Detailed answer about pricing, payment plans, offers (50+ words)" },
        { "questions": "What amenities are offered?", "answer": "Detailed answer about key amenities and facilities (50+ words)" },
        { "questions": "Who is the builder?", "answer": "Answer about builder reputation and past projects (50+ words)" },
        { "questions": "What is the possession date?", "answer": "Answer about project status and expected possession (40+ words)" }
    ],
    
    "accommodation": [
        { "unit": "2 BHK", "area": "1100-1300 Sq. Ft.", "price": "Starting from ₹XX Lacs" },
        { "unit": "3 BHK", "area": "1400-1800 Sq. Ft.", "price": "Starting from ₹XX Lacs" },
        { "unit": "4 BHK", "area": "2000-2500 Sq. Ft.", "price": "Starting from ₹XX Cr" }
    ]
}

IMPORTANT:
- Features should have 4-6 items per category
- Each FAQ answer must be detailed (50+ words)
- Accommodation prices should reflect the minPrice/maxPrice range provided
`;

        const stage3Data = await callPerplexityAI(
            stage3Prompt,
            "You are a real estate details specialist. Create comprehensive features, FAQs with detailed answers, and pricing. Output valid JSON only."
        );
        console.log("Stage 3 Complete: FAQs count:", stage3Data.faqs?.length);

        console.log("\n========== MERGING ALL STAGES ==========");

        // ==================== MERGE ALL DATA ====================
        const mergedData = {
            ...stage1Data,
            ...stage2Data,
            ...stage3Data
        };

        console.log("Merged Data - Builder:", mergedData.builder);

        // Save Raw Data for debugging
        await RawData.create({
            projectName: mergedData.title || projectName || "Unknown",
            aiResponse: mergedData,
            status: "success",
        });

        // --- Builders Logic ---
        let builderId;
        let builderFullData = null;
        if (mergedData.builder) {
            let builderDoc = await Builders.findOne({
                title: { $regex: new RegExp(`^${mergedData.builder}$`, "i") }
            });

            if (!builderDoc) {
                console.log("Builder not found, creating new one:", mergedData.builder);
                builderDoc = await Builders.create({
                    title: mergedData.builder,
                    subtitle: "Premium Developer",
                    description: mergedData.builderDescription || `${mergedData.builder} is a reputed real estate developer known for quality projects.`,
                    vision: "To create sustainable and iconic living spaces.",
                    logo: "https://placehold.co/400x400?text=" + encodeURIComponent(mergedData.builder.substring(0, 2).toUpperCase()),
                    image: "https://placehold.co/800x600?text=Builder+Image",
                    url: mergedData.builder.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
                    isAvailable: true
                });
                console.log("Created new builder:", builderDoc.title);
            } else {
                console.log("Found existing builder:", builderDoc.title);
            }
            builderId = builderDoc._id;
            builderFullData = builderDoc;
        }

        // --- Category Logic ---
        let categoryId;
        let categoryFullData = null;

        if (mergedData.category) {
            const catRegex = new RegExp(mergedData.category, "i");
            let categoryDoc = await Category.findOne({ name: catRegex });

            if (!categoryDoc) {
                if (/plot/i.test(mergedData.category)) {
                    categoryDoc = await Category.findOne({ name: /plot/i });
                } else if (/villa/i.test(mergedData.category)) {
                    categoryDoc = await Category.findOne({ name: /villa/i });
                } else if (/apartment/i.test(mergedData.category)) {
                    categoryDoc = await Category.findOne({ name: /apartment/i });
                }
            }

            if (categoryDoc) {
                categoryId = categoryDoc._id;
                categoryFullData = categoryDoc;
            }
        }

        if (!categoryId) {
            const defaultCat = await Category.findOne();
            if (defaultCat) {
                categoryId = defaultCat._id;
                categoryFullData = defaultCat;
            }
        }

        // Format features for database
        const formattedFeatures = mergedData.features ?
            Object.keys(mergedData.features).map(key => ({
                title: key,
                items: mergedData.features[key].map(f => ({ text: f, helpertext: "", icon: "" }))
            })) : [];

        // Normalize Status
        const validStatuses = ["Pre Launch", "Launch", "Under Construction", "Ready to Move In"];
        let normalizedStatus = mergedData.status;
        if (!validStatuses.includes(normalizedStatus)) {
            if (/ready/i.test(normalizedStatus)) normalizedStatus = "Ready to Move In";
            else if (/construct/i.test(normalizedStatus)) normalizedStatus = "Under Construction";
            else if (/launch/i.test(normalizedStatus)) normalizedStatus = "Launch";
            else normalizedStatus = "Pre Launch";
        }

        const projectData = {
            title: mergedData.title || projectName,
            subtitle: mergedData.subtitle || mergedData.location || "Premium Living",
            category: categoryId,
            builder: builderId,
            description: mergedData.description || "Description pending review.",
            minPrice: mergedData.minPrice || 0,
            maxPrice: mergedData.maxPrice || 0,
            href: mergedData.href || `project-${Date.now()}`,
            status: normalizedStatus,
            location: mergedData.location || "TBD",
            bedrooms: mergedData.bedrooms || [],
            areas: mergedData.areas || [],
            isAvailable: false, // DRAFT MODE

            // SEO Fields
            metaTitle: mergedData.metaTitle,
            metaDescription: mergedData.metaDescription,
            metaKeywords: mergedData.metaKeywords,

            // Content Fields
            expertOpinions: mergedData.expertOpinions || [],

            // Structured Fields
            features: formattedFeatures,
            faqs: mergedData.faqs || [],
            accommodation: mergedData.accommodation || [],

            // Placeholder images
            masterPlan: {
                title: "Master Plan",
                desc: "Master plan layout",
                src: "https://placehold.co/800x600?text=Master+Plan"
            },
            imageGallery: [{
                title: "Project View",
                desc: "Artist's Impression",
                src: "https://placehold.co/800x600?text=Project+Image"
            }],
            plans: [{
                title: "Floor Plan",
                desc: "Typical Floor Plan",
                src: "https://placehold.co/600x600?text=Floor+Plan"
            }]
        };

        console.log("========== GENERATION COMPLETE ==========\n");

        if (preview) {
            return res.status(200).json({
                message: "Project preview generated successfully!",
                data: projectData,
                builderData: builderFullData,
                categoryData: categoryFullData
            });
        }

        // Create Project Draft
        const newProject = await Projects.create(projectData);

        res.status(200).json({
            message: "Project draft created successfully!",
            projectId: newProject._id,
            data: newProject,
            builderData: builderFullData,
            categoryData: categoryFullData
        });

    } catch (error) {
        console.error("AI Generation Error:", error.response?.data || error.message);

        const pName = req.body.projectName || (req.body.url ? "URL: " + req.body.url : (req.body.rawText ? "Raw Text Input" : "Unknown"));
        await RawData.create({
            projectName: pName,
            aiResponse: { error: error.message },
            status: "failed"
        });

        res.status(500).json({ message: "Failed to generate project. " + (error.message || "") });
    }
};

module.exports = { generateProject };
