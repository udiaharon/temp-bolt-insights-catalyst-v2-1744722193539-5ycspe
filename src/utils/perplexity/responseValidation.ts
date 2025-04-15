
export const validateAnalysisStructure = (data: any): boolean => {
  console.log('Validating analysis structure with categories:', Object.keys(data));

  if (!data || typeof data !== 'object') {
    console.error('Invalid data structure: not an object', data);
    return false;
  }

  const requiredSections = [
    'consumer', 
    'cost', 
    'convenience', 
    'communication', 
    'competitive', 
    'media',
    'product',
    'industry',
    'technology'
  ];
  
  const hasAllSections = requiredSections.every(section => {
    if (!data[section]) {
      console.error(`Missing section: ${section}`);
      return false;
    }

    if (typeof data[section].title !== 'string') {
      console.error(`Invalid title in section ${section}:`, data[section].title);
      return false;
    }

    if (!Array.isArray(data[section].topics)) {
      console.error(`Invalid topics in section ${section}:`, data[section].topics);
      return false;
    }

    return true;
  });

  if (!hasAllSections) return false;

  return requiredSections.every(section => {
    const topics = data[section].topics;
    return topics.every((topic: any) => {
      if (!topic || typeof topic !== 'object') {
        console.error(`Invalid topic in section ${section}:`, topic);
        return false;
      }

      if (typeof topic.headline !== 'string') {
        console.error(`Invalid headline in section ${section}:`, topic.headline);
        return false;
      }

      if (!Array.isArray(topic.insights)) {
        console.error(`Invalid insights array in section ${section}:`, topic.insights);
        return false;
      }

      if (!topic.insights.every((insight: any) => typeof insight === 'string')) {
        console.error(`Invalid insight type in section ${section}:`, topic.insights);
        return false;
      }

      return true;
    });
  });
};

export const extractJSONFromResponse = (response: string): string => {
  console.log('Attempting to extract JSON from response of length:', response.length);

  if (!response) {
    console.error('Empty response received');
    return '';
  }

  try {
    // First try to parse the entire response as JSON
    JSON.parse(response);
    return response;
  } catch (e) {
    console.log('Response is not direct JSON, attempting to extract JSON content');
    
    // Try to extract JSON from code blocks
    const jsonMatch = response.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
    if (jsonMatch && jsonMatch[1]) {
      const extracted = jsonMatch[1].trim();
      try {
        JSON.parse(extracted);
        console.log('Successfully extracted JSON from code block');
        return extracted;
      } catch (e) {
        console.error('Failed to parse JSON from code block:', e);
      }
    }
    
    // Try to find JSON object between curly braces
    const start = response.indexOf('{');
    const end = response.lastIndexOf('}');
    if (start !== -1 && end !== -1 && start < end) {
      const extracted = response.slice(start, end + 1);
      try {
        JSON.parse(extracted);
        console.log('Successfully extracted JSON from curly braces');
        return extracted;
      } catch (e) {
        console.error('Failed to parse JSON from curly braces:', e);
      }
    }
    
    console.error('No valid JSON found in response');
    throw new Error('No valid JSON found in response');
  }
};
