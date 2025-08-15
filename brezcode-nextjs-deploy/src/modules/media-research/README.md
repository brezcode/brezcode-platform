# Media Research Module

A modular, AI-powered media research centre that can be integrated into any web application. Generate research insights, discover resources, and manage content strategy with ease.

## Features

- 🧠 **AI-Powered Research** - Generate comprehensive research using Claude Sonnet-4
- 📚 **Resource Discovery** - Find YouTube videos, articles, podcasts, and research papers
- 🎯 **Content Strategy** - Get recommendations and content suggestions
- 📋 **Resource Library** - Collect and manage research resources
- ⏰ **Distribution Scheduling** - Schedule content distribution to users
- 🎨 **Customizable UI** - Multiple themes and layout options
- 🔧 **Framework Agnostic** - Works with React, Next.js, Vue, vanilla JS, and more

## Installation

```bash
npm install @brezcode/media-research-module
```

## Quick Start

### Basic React Integration

```tsx
import { MediaResearchModule, defaultConfigs } from '@brezcode/media-research-module';

function App() {
  const module = new MediaResearchModule({
    ...defaultConfigs.development,
    apiBaseUrl: 'https://your-api.com',
  });
  
  const MediaResearchWidget = module.createWidget();
  
  return <MediaResearchWidget />;
}
```

### Configuration Builder

```tsx
import { ConfigurationBuilder, MediaResearchModule } from '@brezcode/media-research-module';

const config = ConfigurationBuilder
  .create()
  .apiUrl('https://your-api.com')
  .theme('dark')
  .enableFeatures(true, true) // resourceLibrary, scheduling
  .resourceSettings(10, 5) // defaultCount, batchSize
  .callbacks(
    (results) => console.log('Research complete:', results),
    (resources) => console.log('Resources selected:', resources)
  )
  .build();

const module = new MediaResearchModule(config);
const Widget = module.createWidget({ compact: true });
```

### Next.js Integration

```tsx
import { NextJSMediaResearch } from '@brezcode/media-research-module/integrations';

// Using environment variables
export default function ResearchPage() {
  const module = NextJSMediaResearch.createWithEnvironment();
  const Widget = module.createWidget();
  
  return <Widget />;
}

// Environment variables in .env.local:
// NEXT_PUBLIC_API_URL=https://your-api.com
// NEXT_PUBLIC_MEDIA_RESEARCH_API_KEY=your-api-key
// NEXT_PUBLIC_THEME=dark
```

## Widget Props

The MediaResearchWidget accepts these props:

```tsx
interface MediaResearchWidgetProps {
  className?: string;           // Additional CSS classes
  showTitle?: boolean;          // Show/hide widget title (default: true)
  compact?: boolean;           // Compact layout (default: false)
  hideResourceLibrary?: boolean; // Hide resource library features
  customTheme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
  };
}
```

## Configuration Options

```tsx
interface MediaResearchConfig {
  apiBaseUrl: string;                    // Required: Your API endpoint
  apiKey?: string;                      // Optional: API authentication key
  theme?: 'light' | 'dark' | 'auto';   // UI theme
  enableResourceLibrary?: boolean;      // Enable resource selection features
  enableScheduling?: boolean;           // Enable distribution scheduling
  defaultResourceCount?: number;        // Initial number of resources to show
  resourcesPerBatch?: number;          // Resources to add when "Generate More" is clicked
  
  // Custom API endpoints (optional)
  customEndpoints?: {
    research?: string;                  // Custom research endpoint
    resources?: string;                 // Custom resource generation endpoint
    library?: string;                   // Custom library management endpoint
    schedule?: string;                  // Custom scheduling endpoint
  };
  
  // Callback functions
  onResourceSelected?: (resources: SuggestedResource[]) => void;
  onResearchComplete?: (results: MediaResearchResponse) => void;
  onError?: (error: Error) => void;
}
```

## Framework Integrations

### React Hook

```tsx
import { useMediaResearchModule } from '@brezcode/media-research-module/integrations';

function MyComponent() {
  const module = useMediaResearchModule({
    apiBaseUrl: 'https://your-api.com'
  });
  
  const Widget = module.createWidget();
  return <Widget />;
}
```

### Vue.js

```vue
<template>
  <div id="media-research-widget"></div>
</template>

<script>
import { createMediaResearchComposable } from '@brezcode/media-research-module/integrations';

const useMediaResearch = createMediaResearchComposable();

export default {
  setup() {
    const module = useMediaResearch({
      apiBaseUrl: 'https://your-api.com'
    });
    
    // Mount widget to DOM
    onMounted(() => {
      const widget = module.createWidget();
      // Render to #media-research-widget
    });
  }
}
</script>
```

### WordPress

```php
// Using the shortcode generator
$config = [
    'apiBaseUrl' => 'https://your-api.com',
    'theme' => 'light'
];

echo WordPressMediaResearch::createShortcode($config);
```

### Vanilla JavaScript

```html
<div id="media-research-container"></div>

<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@brezcode/media-research-module"></script>

<script>
  const module = new MediaResearchModule({
    apiBaseUrl: 'https://your-api.com',
    theme: 'light'
  });
  
  const widget = module.createWidget();
  ReactDOM.render(React.createElement(widget), document.getElementById('media-research-container'));
</script>
```

## API Requirements

Your backend API should implement these endpoints:

### Research Endpoint
```
POST /api/media-research
Content-Type: application/json

{
  "prompt": "Social media trends 2025",
  "researchType": "trend-research",
  "contentType": "social-media",
  "targetAudience": "Small businesses",
  "urgency": "medium"
}

Response:
{
  "id": "research_123",
  "results": {
    "summary": "Executive summary...",
    "keyFindings": ["Finding 1", "Finding 2"],
    "recommendations": ["Rec 1", "Rec 2"],
    "contentSuggestions": ["Suggestion 1"],
    "suggestedResources": [
      {
        "type": "youtube",
        "url": "https://youtube.com/watch?v=123",
        "title": "Video Title",
        "description": "Video description",
        "duration": "10:30"
      }
    ]
  },
  "status": "completed"
}
```

### Resource Library Endpoint
```
POST /api/media-research/{researchId}/select-resources
Content-Type: application/json

{
  "selectedResourceIds": ["url1", "url2"]
}

Response:
{
  "success": true,
  "addedToLibrary": 2
}
```

## Styling

The module uses CSS variables for easy theming:

```css
.media-research-widget {
  --mr-primary-color: #3b82f6;
  --mr-background-color: #ffffff;
  --mr-text-color: #1f2937;
  --mr-border-color: #e5e7eb;
}
```

## Examples

Check out the `/examples` directory for complete integration examples:

- [Basic React App](./examples/react-basic)
- [Next.js App](./examples/nextjs-app)
- [Vue.js Integration](./examples/vue-integration)
- [WordPress Plugin](./examples/wordpress-plugin)
- [Vanilla JS](./examples/vanilla-js)

## License

MIT License - see [LICENSE.md](./LICENSE.md) for details.

## Support

- 📧 Email: support@brezcode.com
- 💬 Discord: [BrezCode Community](https://discord.gg/brezcode)
- 📚 Documentation: [docs.brezcode.com](https://docs.brezcode.com/media-research)
- 🐛 Issues: [GitHub Issues](https://github.com/brezcode/media-research-module/issues)

## Changelog

### v1.0.0
- Initial release
- AI-powered research generation
- Resource discovery and management
- Multiple framework integrations
- Customizable themes and layouts