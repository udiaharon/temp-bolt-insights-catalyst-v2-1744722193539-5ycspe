
export const formatCapitalizedColons = (text: string) => {
  return text.split('\n').map(line => {
    // Skip lines that are already completely bold
    if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
      return line;
    }
    
    // First check for headers at the start of paragraphs (capitalized phrases)
    // Must start with a capital letter and contain at least one more word
    const headerPattern = /^([A-Z][A-Za-z\s-]+(?:\s+(?:and|&|\+|,)?\s+[A-Z][A-Za-z\s-]+)+)(?:\s*:|$)/;
    const headerMatch = line.trim().match(headerPattern);
    
    if (headerMatch) {
      const [_, header] = headerMatch;
      const restOfLine = line.slice(header.length).trim();
      if (restOfLine.startsWith(':')) {
        return `**${header}:**${restOfLine.slice(1)}`;
      }
      return `**${header}**${restOfLine}`;
    }
    
    // Then check for phrases with colons
    const colonPattern = /([A-Z][A-Za-z\s]*(?:\s+[A-Z][A-Za-z\s]*)*?):\s*(.+)/;
    const colonMatch = line.match(colonPattern);
    
    if (colonMatch) {
      const [_, prefix, rest] = colonMatch;
      if (!prefix.includes('**')) {
        return `**${prefix}:** ${rest}`;
      }
    }
    
    return line;
  }).join('\n');
};
