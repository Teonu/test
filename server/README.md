# Chatbot Widget Backend - Multi-Assistant System

This backend server supports multiple chatbots with different OpenAI Assistant IDs using a single deployment. The Assistant IDs are configured in the embed code, while the OpenAI API key is securely stored on the server.

## 🚀 Quick Deploy to Render.com

### Step 1: Prepare Your Repository

1. **Push to GitHub**: Make sure your project is in a GitHub repository
2. **Verify Structure**: Ensure the `server/` folder contains all backend files
3. **Check Files**: Verify `package.json`, `index.js`, and `render.yaml` are present

### Step 2: Deploy to Render

1. **Go to Render.com**: Visit [render.com](https://render.com) and sign up/login
2. **Create Web Service**: Click "New +" → "Web Service"
3. **Connect GitHub**: Connect your GitHub account and select your repository
4. **Configure Service**:
   - **Name**: `chatbot-widget-backend` (or your preferred name)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 3: Set Environment Variables

In the Render dashboard, add these environment variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
ALLOWED_ORIGINS=*
```

**Important:** You no longer need to set `ASSISTANT_ID` as an environment variable. Assistant IDs are now configured in the embed code!

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (usually 2-3 minutes)
3. Your backend will be available at: `https://your-app-name.onrender.com`

### Step 5: Test Your Deployment

Test these endpoints:
- **Health Check**: `https://your-app-name.onrender.com/health`
- **Widget Script**: `https://your-app-name.onrender.com/widget.js`

## 🎯 Multi-Assistant System

### Key Features

- **One Server, Multiple Chatbots**: Use different Assistant IDs for different purposes
- **Secure API Key**: Only stored on the server, never exposed to frontend
- **Dynamic Configuration**: Assistant IDs configured in embed code, not server
- **No Restart Required**: Add new chatbots without server changes

### How It Works

1. **Server**: Stores OpenAI API key securely
2. **Embed Code**: Contains Assistant ID and customization
3. **Widget Script**: Dynamically generated with configuration
4. **Chat API**: Uses Assistant ID from frontend request

### Example Embed Codes

#### Simple Chatbot
```html
<script 
  src="https://your-app.onrender.com/widget.js"
  data-assistant-id="asst_customer_support_123"
  data-title="Customer Support"
  data-color="#3B82F6"
  async>
</script>
```

#### Sales Assistant
```html
<script 
  src="https://your-app.onrender.com/widget.js"
  data-assistant-id="asst_sales_assistant_456"
  data-title="Sales Assistant"
  data-color="#10B981"
  data-position="bottom-left"
  data-welcome="Hi! Looking for product information?"
  async>
</script>
```

## 🔧 Configuration Options

### Embed Code Attributes

| Attribute | Description | Required | Example |
|-----------|-------------|----------|---------|
| `data-assistant-id` | OpenAI Assistant ID | ✅ | `asst_abc123...` |
| `data-title` | Widget title | ❌ | `Customer Support` |
| `data-color` | Primary color | ❌ | `#3B82F6` |
| `data-position` | Widget position | ❌ | `bottom-right` or `bottom-left` |
| `data-welcome` | Welcome message | ❌ | `Hello! How can I help?` |

### Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | ✅ | `sk-proj-...` |
| `JWT_SECRET` | Secret for admin authentication | ✅ | `your-secret-key` |
| `PORT` | Server port (auto-set by Render) | ❌ | `3001` |
| `ALLOWED_ORIGINS` | CORS allowed origins | ❌ | `*` or `https://yoursite.com` |
| `ADMIN_PASSWORD_HASH` | Custom admin password hash | ❌ | `$2a$10$...` |

## 🔄 Widget Script Features

### Dynamic Generation
- Widget script reflects current configuration
- Assistant ID passed from embed code
- Customization applied per widget instance
- Unique widget instances for multiple chatbots

### Multiple Widgets Support
- Each widget has unique DOM IDs
- Separate state management
- Individual customization
- No conflicts between instances

### API Integration
- Assistant ID sent with each chat request
- Secure API key handling on server
- Thread management per assistant
- Error handling and validation

## 📊 Use Cases

### Different Departments
```html
<!-- Customer Support -->
<script src="https://your-app.onrender.com/widget.js"
        data-assistant-id="asst_support_123"
        data-title="Customer Support"
        data-color="#3B82F6"></script>

<!-- Sales Team -->
<script src="https://your-app.onrender.com/widget.js"
        data-assistant-id="asst_sales_456"
        data-title="Sales Assistant"
        data-color="#10B981"
        data-position="bottom-left"></script>

<!-- Technical Support -->
<script src="https://your-app.onrender.com/widget.js"
        data-assistant-id="asst_tech_789"
        data-title="Technical Support"
        data-color="#F59E0B"></script>
```

### Different Pages
```html
<!-- Product Page -->
<script src="https://your-app.onrender.com/widget.js"
        data-assistant-id="asst_product_guide"
        data-title="Product Guide"
        data-welcome="Need help with this product?"></script>

<!-- Pricing Page -->
<script src="https://your-app.onrender.com/widget.js"
        data-assistant-id="asst_pricing_help"
        data-title="Pricing Questions"
        data-welcome="Questions about pricing?"></script>
```

## 🛠️ Local Development

For local development:

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env`** with your OpenAI API key

3. **Install and run**:
   ```bash
   npm install
   npm start
   ```

4. **Test locally**: http://localhost:3001

5. **Test widget script**: http://localhost:3001/widget.js

## 📈 Monitoring & Logs

### Health Check
Monitor your service: `https://your-app-name.onrender.com/health`

### Widget Script
Test widget generation: `https://your-app-name.onrender.com/widget.js`

### Logs
- View deployment logs in Render dashboard
- Monitor chat requests and errors
- Check Assistant ID validation

## 🔧 Troubleshooting

### Common Issues

1. **Widget Not Loading**
   - Check if Assistant ID is provided in embed code
   - Verify backend URL is correct
   - Test widget script URL directly

2. **Chat Not Working**
   - Verify OpenAI API key is set on server
   - Check if Assistant ID exists in OpenAI
   - Monitor server logs for errors

3. **Multiple Widgets Conflict**
   - Each widget should have unique Assistant ID
   - Avoid same position for multiple widgets
   - Check browser console for errors

### Validation

The system validates:
- Assistant ID is provided in embed code
- OpenAI API key is configured on server
- Assistant exists in OpenAI account
- Chat requests include required parameters

## 🚀 Production Best Practices

### Security
- Keep OpenAI API key secure on server only
- Use specific domains in `ALLOWED_ORIGINS` for production
- Generate strong `JWT_SECRET`
- Monitor API usage and costs

### Performance
- Widget script is cached for performance
- Gzip compression enabled
- Optimized for fast loading
- Minimal DOM impact

### Scaling
- One server supports unlimited chatbots
- Each Assistant ID can have different knowledge
- Easy to add new chatbots without server changes
- Monitor OpenAI API rate limits

## 📝 API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `GET /widget.js` - Dynamic widget script
- `POST /api/chat` - Chat with assistant (requires Assistant ID)

### Admin Endpoints (require JWT)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/config` - Get default configuration
- `POST /api/admin/config` - Update default settings

## 🔄 Updates & Maintenance

### Adding New Chatbots
1. Create new Assistant in OpenAI
2. Copy Assistant ID
3. Create embed code with new Assistant ID
4. No server restart needed!

### Updating Existing Chatbots
1. Modify embed code attributes
2. Changes apply immediately
3. No server configuration needed

### Server Updates
1. Push changes to GitHub
2. Render auto-deploys
3. Zero downtime deployment
4. All widgets continue working