declare global {
  var proactiveResearchIntervals: Record<string, NodeJS.Timeout> | undefined;
  var proactiveMessages: Record<string, any[]> | undefined;
}

export {};