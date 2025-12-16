const axios = require("axios");
const Projects = require("../models/projects");
const RawData = require("../models/rawData");
const Category = require("../models/category");
const Builders = require("../models/builders");
const Blogs = require("../models/blogs");
const cheerio = require("cheerio");

// Helper function to call Perplexity AI
const callPerplexityAI = async (prompt, systemMessage = "You are a helpful real estate data assistant. Output valid JSON only.") => {
    try {
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

        let parsedData;
        if (jsonMatch) {
            parsedData = JSON.parse(jsonMatch[0]);
        } else {
            parsedData = JSON.parse(aiContent);
        }
        return cleanAIOutput(parsedData);
    } catch (error) {
        console.error("Perplexity API Error:", error.response?.data || error.message);
        throw error;
    }
};

// Helper: Recursive cleaning function
const cleanAIOutput = (data, keyName = null) => {
    if (typeof data === 'string') {
        let text = data
            .replace(/\*\*\*/g, '')      // Remove triple asterisks
            .replace(/\*\*/g, '')        // Remove double asterisks (bolds)
            .replace(/\[\d+(?:,\s*\d+)*\]/g, '') // Remove citations like [1], [1, 2]
            .replace(/\[\d+\]/g, '')     // Remove single citations like [1] just in case
            .replace(/^\s*-\s*/, '')     // Remove leading hyphens
            .replace(/^:\s*/, '')        // Remove leading colons
            .replace(/^"|"$/g, '')       // Remove leading/trailing quotes
            .trim();

        // Specific cleaning for Expert Opinions: Remove HTML tags like <strong>
        if (keyName === 'expertOpinions') {
            text = text.replace(/<\/?[^>]+(>|$)/g, ""); // Strip all HTML tags
        }

        return text;
    } else if (Array.isArray(data)) {
        return data.map(item => cleanAIOutput(item, keyName)); // Pass parent key (e.g. 'expertOpinions')
    } else if (typeof data === 'object' && data !== null) {
        const cleaned = {};
        for (const key in data) {
            cleaned[key] = cleanAIOutput(data[key], key); // Pass current key
        }
        return cleaned;
    }
    return data;
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

// Helper: Auto-Generate Blog for New Project
const generateAndSaveProjectBlog = async (project, builder, location) => {
    const builderName = builder?.title || "Reputed Builder";
    const projectName = project.title;

    const prompt = `
Act as a Senior Real Estate Investment Analyst.
Write a comprehensive "Review & Investment Analysis" blog post for the new Launch: "${projectName}" by ${builderName} in ${location}.

Requirements:
1. **Length**: MINIMUM 1000 words.
2. **Focus**: Investment potential, location analysis, builder reputation, and lifestyle.
3. **Format**: HTML content with <h2>, <h3>headers.
4. **CTAs**: Include 3 embedded CTAs to "Schedule a Site Visit" or "Download Brochure".
5. **SEO**: High-volume keywords for "${location} real estate" and "${projectName} review".

Return ONLY a valid JSON object:
{
    "title": "High-Impact Blog Title",
    "subtitle": "Engaging subtitle (20 words)",
    "content": "Full HTML content...",
    "tags": ["tag1", "tag2"]
}
`;

    const aiData = await callPerplexityAI(prompt, "You are a real estate expert. Output valid JSON.");

    // Determine Image (Use Project View or Master Plan)
    const blogImage = project.imageGallery?.[0]?.src || project.masterPlan?.src || "https://placehold.co/800x600?text=Project+Review";

    // Create Blog
    const newBlog = await Blogs.create({
        title: aiData.title,
        subtitle: aiData.subtitle,
        description: aiData.content, // 'description' field holds the html content in schema
        image: blogImage,
        url: aiData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(), // Unique URL
        status: true, // Auto-publish as requested
        type: "1", // Default type
        isImportant: true // Highlight new launch reviews
    });

    console.log("Auto-Blog Created:", aiData.title);
    return newBlog;
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
- DO NOT USE MARKDOWN like **text**. Use HTML <strong>text</strong> if needed.
`;

        // Stage 2 cleaning handled by callPerplexityAI now
        // let stage2Data = await callPerplexityAI(...) 
        // No manual sanitation needed if callPerplexityAI does it.

        let stage2Data = await callPerplexityAI(
            stage2Prompt,
            "You are a professional real estate content writer. Create detailed, SEO-optimized content. Output valid JSON only."
        );

        // Ensure bold tags for HTML if needed, handled by Prompt instruction 
        // (Prompt says: Use <strong> tags. Cleaner removes **).

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

        // --- Auto Generate Blog ---
        try {
            console.log("\n========== AUTO-GENERATING BLOG ==========");
            await generateAndSaveProjectBlog(newProject, builderFullData, mergedData.location);
        } catch (blogErr) {
            console.error("Auto-Blog Generation Failed:", blogErr.message);
            // Non-blocking error, project is already created
        }

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

const generateBlog = async (req, res) => {
    try {
        const { topic, tone = "professional", keywords } = req.body;

        if (!topic) {
            return res.status(400).json({ message: "Topic is required" });
        }

        if (!process.env.PERPLEXITY_API_KEY) {
            return res.status(500).json({
                message: "Server configuration error: PERPLEXITY_API_KEY is missing."
            });
        }

        console.log(`Generating blog for topic: ${topic}`);

        const prompt = `
Act as a Senior Real Estate Content Strategist & SEO Specialist.
Write a highly optimized, long-form blog post on the topic: "${topic}".

Requirements:
1. **Length**: MINIMUM 1000 words. Depth and value are critical.
2. **SEO**: Use high-volume keywords naturally. Structure with clear <h2> and <h3> headers.
3. **Tone**: ${tone}. Professional yet accessible.
4. **CTAs**: Insert 2-3 strategic Call-to-Actions (CTAs) encouraging readers to "Explore properties", "Contact for consultation", or "View latest listings".
5. **Format**: Return HTML content. Use bullet points. Use <strong> tags for bold text. DO NOT use markdown like ** text **.

Keywords to include: ${keywords || "Real Estate, Property, Investment, ROI, Market Trends"}

Return ONLY a valid JSON object with these fields:
{
    "title": "Catchy, High-CTR Title (60 chars max)",
    "subtitle": "Compelling meta-description style subtitle (150-160 chars)",
    "content": "Full HTML blog content. Start with an engaging hook. Body should have at least 4-5 key sections. End with a strong conclusion and final CTA.",
    "metaTitle": "SEO Title",
    "metaDescription": "SEO Description",
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}
`;

        let aiResponse = await callPerplexityAI(
            prompt,
            "You are an expert real estate content writer. Return ONLY valid JSON."
        );

        // Sanitization is now built into callPerplexityAI

        console.log("Blog Generated:", aiResponse.title);

        console.log("Blog Generated:", aiResponse.title);

        res.status(200).json({
            message: "Blog generated successfully!",
            data: aiResponse
        });

    } catch (error) {
        console.error("AI Blog Gen Error:", error.message);
        res.status(500).json({ message: "Failed to generate blog. " + error.message });
    }
};

const generateProjectBlog = async (req, res) => {
    try {
        const { projectId } = req.body;
        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }

        const project = await Projects.findById(projectId).populate('blog');
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.blog) {
            return res.status(200).json({ message: "Blog already exists", data: project.blog });
        }

        if (!process.env.PERPLEXITY_API_KEY) {
            return res.status(500).json({
                message: "Server configuration error: PERPLEXITY_API_KEY is missing."
            });
        }

        // Fetch Builder for more context
        const builder = await Builders.findById(project.builder);

        // Generate Blog
        console.log(`Generating blog for Project: ${project.title}`);
        const newBlog = await generateAndSaveProjectBlog(project, builder, project.location);

        if (newBlog) {
            // Link to Project
            project.blog = newBlog._id;
            await project.save();

            return res.status(200).json({
                message: "Blog generated and linked successfully",
                data: newBlog
            });
        } else {
            return res.status(500).json({ message: "Failed to generate blog content." });
        }

    } catch (error) {
        console.error("Generate Project Blog Error:", error);
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
};

module.exports = { generateProject, generateBlog, generateProjectBlog };
