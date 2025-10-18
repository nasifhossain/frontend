# Social Media Platform - Frontend

A modern, feature-rich social media platform built with Next.js 15, React 19, and TypeScript. This application provides a complete social networking experience with posts, comments, user management, and real-time interactions.

![Next.js](https://img.shields.io/badge/Next.js-15.5.5-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38bdf8)

##  Live Site Link
https://bloggerlyyy.netlify.app/

### Admin Account
- **Username:** `superadmin`
- **Password:** `Superadmin@123`

## 🔐 Demo Credentials

### Admin Account
- **Username:** `superadmin`
- **Password:** `Superadmin@123`

### env file
#NEXT_PUBLIC_BACKEND_URI= https://interiit-backend.azurewebsites.net
#NEXT_PUBLIC_BACKEND_URI:https://interiit-backend-ba42.onrender.com
NEXT_PUBLIC_BACKEND_URI= http://localhost
NEXT_PUBLIC_CLAUDINARY_CLOUD_NAME=dxzegx3gu
NEXT_PUBLIC_CLAUDINARY_API_KEY=732579846374981
NEXT_PUBLIC_CLAUDINARY_API_SECRET=BdJhUyxn18Hp2zL-Hls-PkXlvCI

## 🌟 Features

### User Management
- **Authentication System**
  - User registration with email and username
  - Secure login with JWT tokens
  - Profile management (edit name, email, avatar, password)
  - Role-based access control (Admin/Regular User)
  - Avatar upload with Cloudinary integration

### Posts & Content
- **Create & Share Posts**
  - Create posts with titles, captions, and multiple images
  - Edit and delete your own posts
  - Image gallery with Cloudinary integration
  - View posts from all users or filter by specific users
  - Responsive post cards with list and grid views

### Comments & Engagement
- **Interactive Comment System**
  - Add comments to posts
  - Nested replies (threaded conversations)
  - Edit and delete your own comments
  - Real-time comment counts
  - Vote on comments (upvote/downvote)
  - View voters for each comment

### Admin Features
- **User Management Dashboard** (Admin-only)
  - View all registered users
  - Create new users with custom roles
  - User statistics (total users, admins, regular users)
  - User profile cards with detailed information
  - Direct access to user profiles

### UI/UX Features
- **Modern Design**
  - Clean, responsive interface with TailwindCSS
  - Gradient backgrounds and glassmorphism effects
  - Loading states and skeleton screens
  - Toast notifications for user feedback
  - Modal dialogs for forms and confirmations
  - Dropdown menus for user actions
  - Avatar display with fallback UI

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager
- A running backend API server

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_BACKEND_URI=
   NEXT_PUBLIC_CLAUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

Use these credentials to access admin features like user management and full platform control.

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page (posts feed)
│   ├── login/                   # Login page
│   ├── register/                # Registration page
│   ├── my-posts/                # User's own posts
│   ├── posts/
│   │   └── [id]/                # Individual post page
│   ├── user/
│   │   └── [id]/                # User profile page
│   └── users/                   # Admin user management
│
├── components/                   # React components
│   ├── change-password-dialog.tsx
│   ├── profile-edit-dialog.tsx
│   ├── user-dropdown.tsx
│   ├── post/                    # Post-related components
│   │   ├── comment-card.tsx
│   │   ├── comment-form.tsx
│   │   ├── comments-dialog.tsx
│   │   ├── comments-list.tsx
│   │   ├── create-post-dialog.tsx
│   │   ├── post-card.tsx
│   │   ├── post-card-list-view.tsx
│   │   ├── post-list.tsx
│   │   ├── posts-section.tsx
│   │   └── voters-dialog.tsx
│   └── ui/                      # UI primitives
│       ├── avatar-upload.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── image-upload.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── post-image-gallery.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       └── toaster.tsx
│
├── lib/                         # Library code
│   ├── auth.tsx                 # Authentication context
│   ├── api/                     # API client
│   │   ├── index.ts             # API base configuration
│   │   ├── auth.ts              # Auth endpoints
│   │   ├── posts.ts             # Posts endpoints
│   │   ├── comments.ts          # Comments endpoints
│   │   └── users.ts             # Users endpoints
│   └── utils/
│       ├── cloudinary.ts        # Cloudinary integration
│       └── utils.ts             # Utility functions
│
├── hooks/                       # Custom React hooks
│   ├── use-posts.ts             # Posts data fetching
│   └── use-toast.ts             # Toast notifications
│
├── public/                      # Static assets
│   └── _redirects               # Netlify redirects
│
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # TailwindCSS configuration
├── tsconfig.json                # TypeScript configuration
├── eslint.config.mjs            # ESLint configuration
└── package.json                 # Dependencies
```

## 🛠️ Technology Stack

### Core Framework
- **Next.js 15.5.5** - React framework with App Router and Turbopack
- **React 19.1.0** - UI library
- **TypeScript 5.x** - Type safety

### Styling
- **TailwindCSS 4.x** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Modern icon library
- **class-variance-authority** - CSS class management
- **tailwind-merge** - Utility class merging

### Form Management
- **React Hook Form 7.65.0** - Form state management
- **Zod 4.1.12** - Schema validation
- **@hookform/resolvers** - Form validation integration

### State & Data
- **React Context API** - Global authentication state
- **Custom Hooks** - Reusable data fetching logic

### Image Management
- **Cloudinary** - Image upload and optimization

## 🔌 API Integration

The frontend communicates with a RESTful backend API. Key endpoints include:

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users` - User registration
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/logout` - User logout

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts/user/:userId` - Get user's posts

### Comments
- `GET /api/comments/post/:postId` - Get post comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/upvotes/vote` - Vote on comment
- `GET /api/upvotes/:commentId/users` - Get comment voters

### Users (Admin)
- `GET /api/users` - Get all users
- `POST /api/users/admin` - Create user (admin)

## 🎨 Key Components

### Authentication
- **AuthProvider** (`lib/auth.tsx`) - Provides global authentication state
- **Login Page** (`app/login/page.tsx`) - User login with validation
- **Register Page** (`app/register/page.tsx`) - New user registration

### Posts
- **PostsSection** - Main posts feed with create button
- **PostCard** - Individual post display with interactions
- **CreatePostDialog** - Modal for creating new posts
- **PostImageGallery** - Image carousel for post images

### Comments
- **CommentsDialog** - Modal for viewing post comments
- **CommentCard** - Individual comment with voting
- **CommentForm** - Form for adding comments/replies
- **CommentsList** - Threaded comment display
- **VotersDialog** - View users who voted on comments

### User Management
- **UserDropdown** - User menu with profile options
- **ProfileEditDialog** - Edit user profile
- **ChangePasswordDialog** - Change password form
- **UsersPage** - Admin dashboard for user management

## 🔒 Authentication & Authorization

### JWT Token Management
- Tokens stored in localStorage
- Automatic token injection in API requests
- Token refresh on page load
- Redirect to login on unauthorized access

### Role-Based Access
- **User (type 0)**: Create posts, comment, vote
- **Admin (type 1)**: All user permissions + user management

### Protected Routes
- Home page requires authentication
- Admin pages check for admin role
- Automatic redirect to login if not authenticated

## 🎯 Features in Detail

### Post Creation
1. Click "Create Post" button
2. Enter title, caption, and upload images
3. Images uploaded to Cloudinary
4. Post created and added to feed

### Commenting System
1. Click comment icon on post
2. View all comments in modal
3. Reply to specific comments (nested replies)
4. Vote on comments with upvote/downvote
5. View list of users who voted

### Profile Management
1. Click on user avatar/dropdown
2. Edit profile information
3. Update avatar with image upload
4. Change password securely

### Admin Operations
1. Navigate to Users page (admin-only)
2. View all users and statistics
3. Create new users with specific roles
4. Click on user cards to view profiles

## 🚧 Error Handling

- **Network Errors**: Toast notifications for failed requests
- **Validation Errors**: Form-level error messages
- **Authentication Errors**: Automatic redirect to login
- **Loading States**: Skeleton screens and spinners
- **Empty States**: Helpful messages when no data

## ⚡ Performance Optimizations

- **Image Optimization**: Cloudinary CDN with transformations
- **Code Splitting**: Automatic with Next.js App Router
- **Turbopack**: Fast development with Next.js Turbopack
- **Lazy Loading**: Images and components loaded on demand
- **Optimistic Updates**: Instant UI updates before API response

## 🔧 Configuration

### Next.js Config (`next.config.ts`)
```typescript
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // Skip ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: true,    // Skip TypeScript errors
  },
  images: {
    unoptimized: true,          // Use unoptimized images
  },
};
```

### Environment Variables
- `NEXT_PUBLIC_BACKEND_URI` -
- `NEXT_PUBLIC_CLAUDINARY_CLOUD_NAME` -

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

All components adapt to screen size with mobile-first design.

## 🧪 Development Tips

### Running in Development
```bash
npm run dev --turbopack
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npx tsc --noEmit
```

## 🐛 Common Issues

### Token Expired
- Solution: Logout and login again

### Images Not Uploading
- Check Cloudinary configuration
- Verify file size (max 5MB)
- Ensure file type is image

### API Connection Failed
- Verify `NEXT_PUBLIC_BACKEND_URI` is correct
- Check backend server is running
- Check network connectivity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the InterIIT competition.

## 👥 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team

## 🎉 Acknowledgments

- Built with Next.js and React
- UI components inspired by Radix UI
- Icons by Lucide
- Image hosting by Cloudinary

---

**Made with ❤️ for InterIIT Competition**
