# Chatbot Widget Backend

This is the backend server for the chatbot widget with OpenAI integration, optimized for Render.com deployment with GitHub integration.

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
ASSISTANT_ID=your_assistant_id_here
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
ALLOWED_ORIGINS=*
```

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (usually 2-3 minutes)
3. Your backend will be available at: `https://your-app-name.onrender.com`

### Step 5: Test Your Deployment

Test these endpoints:
- **Health Check**: `https://your-app-name.onrender.com/health`
- **Widget Script**: `https://your-app-name.onrender.com/widget.js`
- **Widget Config**: `https://your-app-name.onrender.com/api/widget/config`

## 🔧 Dynamic Widget Script

### Key Features

- **Auto-updating**: Widget script reflects current admin panel settings
- **No code changes**: Update colors, messages, and settings without touching embed code
- **Real-time**: Changes appear immediately on all websites using the widget
- **Cached**: Optimized for performance while staying current

### Widget Script URL

Your widget script will be available at:
```
https://your-app-name.onrender.com/widget.js
```

### Simple Embed Code

Websites only need this one line:
```html
<script src="https://your-app-name.onrender.com/widget.js" async></script>
```

## 🔄 Automatic Updates from GitHub

Render.com automatically redeploys when you push to your GitHub repository:

1. **Make changes** to your code
2. **Push to GitHub**: `git push origin main`
3. **Auto-deploy**: Render detects changes and redeploys
4. **Zero downtime**: Service stays available during deployment

## 📊 Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | ✅ | `sk-proj-...` |
| `ASSISTANT_ID` | Your OpenAI Assistant ID | ✅ | `asst_...` |
| `JWT_SECRET` | Secret for admin authentication | ✅ | `your-secret-key` |
| `PORT` | Server port (auto-set by Render) | ❌ | `3001` |
| `ALLOWED_ORIGINS` | CORS allowed origins | ❌ | `*` or `https://yoursite.com` |
| `ADMIN_PASSWORD_HASH` | Custom admin password hash | ❌ | `$2a$10$...` |

## 🔐 Security Features

- **Environment Variables**: All secrets stored securely in Render
- **CORS Protection**: Configurable allowed origins
- **JWT Authentication**: Secure admin panel access
- **API Key Protection**: Never exposed to frontend
- **Bcrypt Passwords**: Secure password hashing

## 🛠️ Local Development

For local development:

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env`** with your values

3. **Install and run**:
   ```bash
   npm install
   npm start
   ```

4. **Test locally**: http://localhost:3001

## 📈 Monitoring & Logs

### Render Dashboard
- View deployment logs
- Monitor resource usage
- Check service health
- Manage environment variables

### Health Check
Monitor your service: `https://your-app-name.onrender.com/health`

### Logs
Access logs in Render dashboard under "Logs" tab

## 🔧 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check `package.json` is in `server/` folder
   - Verify Node.js version compatibility
   - Check build logs in Render dashboard

2. **Environment Variables**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify OpenAI API key is valid

3. **CORS Errors**
   - Set `ALLOWED_ORIGINS=*` for testing
   - Add specific domains for production
   - Check browser console for CORS errors

4. **Widget Not Loading**
   - Test widget script URL directly
   - Check network tab in browser dev tools
   - Verify backend is running (health check)

### Getting Help

1. Check Render deployment logs
2. Test individual API endpoints
3. Verify environment variables
4. Check OpenAI API key permissions

## 🚀 Production Considerations

### Performance
- Widget script is cached for performance
- Gzip compression enabled
- Optimized for fast loading

### Security
- Use specific domains in `ALLOWED_ORIGINS` for production
- Generate strong `JWT_SECRET`
- Consider custom admin password hash

### Scaling
- Render automatically handles scaling
- Consider upgrading plan for high traffic
- Monitor usage in Render dashboard

## 📝 API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `GET /widget.js` - Dynamic widget script
- `GET /api/widget/config` - Widget configuration
- `POST /api/chat` - Chat with assistant

### Admin Endpoints (require JWT)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/config` - Get admin config
- `POST /api/admin/config` - Update config

## 🔄 Updates & Maintenance

### Updating the Widget
1. Make changes in admin panel
2. Widget updates automatically on all sites
3. No code deployment needed

### Updating the Backend
1. Push changes to GitHub
2. Render auto-deploys
3. Zero downtime deployment

### Monitoring
- Check health endpoint regularly
- Monitor Render dashboard
- Review logs for errors