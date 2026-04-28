export interface PromptFormData {
  appType: string;
  audience: string;
  goal: string;
  features: string[];
  designStyle: string;
  techStack: string;
  extraRequirements: string;
}
export function compilePrompt(data: PromptFormData): string {
  const {
    appType,
    audience,
    goal,
    features,
    designStyle,
    techStack,
    extraRequirements,
  } = data;
  const featuresList = features.length > 0 
    ? features.map(f => `- ${f}`).join('\n')
    : "- Standard CRUD operations";
  return `Act as a Senior Software Architect and Product Manager. Generate a comprehensive Technical Specification Document (PRD) for the following application:
# PROJECT OVERVIEW
- **App Type:** ${appType || 'Generic Web Application'}
- **Target Audience:** ${audience || 'General Users'}
- **Core Goal:** ${goal || 'Provide a seamless digital experience'}
# KEY FEATURES
${featuresList}
# TECHNICAL STACK
- **Primary Technologies:** ${techStack || 'Modern Full-Stack (React, Node.js)'}
# DESIGN & UX REQUIREMENTS
- **Style:** ${designStyle || 'Clean, Modern, and Professional'}
- **Approach:** Prioritize accessibility, responsiveness, and intuitive navigation.
${extraRequirements ? `# SPECIAL REQUIREMENTS\n${extraRequirements}` : ''}
# INSTRUCTIONS FOR OUTPUT
Please provide a structured document including:
1. Executive Summary
2. User Stories
3. Information Architecture (Data Schema)
4. Component Breakdown
5. API Endpoints / Data Flow
6. Security & Performance Considerations
Format the output in clean Markdown for easy readability.`;
}