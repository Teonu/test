# Chatbot Widget System with OpenAI Integration

A complete chatbot widget solution that can be embedded into any website, featuring OpenAI Assistant integration, customizable appearance, and a secure admin panel.

## 🚀 Features

### Frontend Widget
- **Floating chat widget** that appears in the corner of any webpage
- **Customizable appearance** (colors, position, title)
- **Real-time messaging** with OpenAI Assistant
- **Responsive design** that works on desktop and mobile
- **Easy integration** with a simple HTML snippet

### Admin Panel
- **Secure authentication** with JWT tokens
- **OpenAI configuration** (API key and Assistant ID management)
- **Widget customization** (colors, messages, positioning)
- **Real-time preview** of changes

### Backend Server
- **Secure API key storage** (never exposed to frontend)
- **OpenAI Assistant integration** with conversation threading
- **CORS configuration** for cross-domain embedding
- **Environment-based configuration**

## 🏗️ Architecture

```
Frontend (React/TypeScript)
├── Admin Panel (configuration interface)
├── Live Demo (widget preview)
└── Embed Code Generator

Backend (Node.js/Express)
├── Authentication endpoints
├── Configuration management
├── OpenAI API integration
└── Widget API endpoints

Deployment
├── Frontend → Static hosting (Netlify, Vercel, etc.)
└── Backend → Node.js hosting (Railway, Render, Heroku, etc.)
```

## 📦 Quick Start

### 1. Deploy the Backend

The backend needs to be deployed to a Node.js hosting platform. See `server/README.md` for detailed deployment instructions.

**Recommended platforms:**
- [Railway](https://railway.app) (easiest)
- [Render](https://render.com)
- [Heroku](https://heroku.com)

**Required environment variables:**
```env
OPENAI_API_KEY=your_openai_api_key
ASSISTANT_ID=your_assistant_id
JWT_SECRET=your_random_secret
ALLOWED_ORIGINS=https://your-website.com
```

### 2. Configure the Frontend

Update `src/config/api.ts` with your deployed backend URL:

```typescript
production: {
  baseURL: 'https://your-backend-domain.com/api'
}
```

### 3. Set Up OpenAI Assistant

1. Go to [OpenAI Platform](https://platform.openai.com/assistants)
2. Create a new Assistant
3. Copy the Assistant ID (starts with `asst_`)
4. Get your API key from [API Keys page](https://platform.openai.com/api-keys)

### 4. Configure the Widget

1. Access the Admin Panel in your deployed frontend
2. Login with password: `password` (change this in production!)
3. Enter your OpenAI API key and Assistant ID
4. Customize the widget appearance and messages
5. Save the configuration

### 5. Embed in Your Website

1. Go to the "Embed Code" tab
2. Update the backend URL field
3. Copy the generated HTML code
4. Paste it before the `</body>` tag in your website

## 🔧 Development

### Prerequisites
- Node.js 18+
- OpenAI API key
- OpenAI Assistant ID

### Local Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up backend environment:**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your OpenAI credentials
   npm install
   npm start
   ```

3. **Start frontend development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## 🔒 Security Features

- **API keys never exposed** to frontend code
- **JWT-based authentication** for admin access
- **CORS protection** with configurable origins
- **Environment-based secrets** management
- **Secure password hashing** with bcrypt

## 🎨 Customization

### Widget Appearance
- Primary color (hex codes)
- Position (bottom-left or bottom-right)
- Title text
- Welcome message

### Advanced Customization
- Modify `src/components/ChatbotWidget.tsx` for UI changes
- Update `server/index.js` for backend logic
- Customize the embed code in `src/components/EmbedCode.tsx`

## 📚 API Documentation

### Public Endpoints
- `GET /api/widget/config` - Get widget configuration
- `POST /api/chat` - Send chat message

### Admin Endpoints (require authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/config` - Get admin configuration
- `POST /api/admin/config` - Update configuration

## 🚀 Deployment Options

### Frontend Deployment
- **Netlify** (recommended for static sites)
- **Vercel** (great for React apps)
- **GitHub Pages** (free option)

### Backend Deployment
- **Railway** (easiest Node.js deployment)
- **Render** (good free tier)
- **Heroku** (established platform)
- **DigitalOcean App Platform**
- **AWS/Google Cloud/Azure**

## 🐛 Troubleshooting

### Common Issues

1. **Widget not loading:**
   - Check if backend URL is correct
   - Verify CORS settings
   - Check browser console for errors

2. **Chat not responding:**
   - Verify OpenAI API key is valid
   - Check Assistant ID is correct
   - Monitor backend logs for errors

3. **Admin panel login fails:**
   - Ensure backend is running
   - Check JWT_SECRET is set
   - Verify password (default: "password")

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in your backend environment.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support and questions:
1. Check the troubleshooting section above
2. Review the server logs for error messages
3. Ensure all environment variables are properly set
4. Test the backend health endpoint: `/health`