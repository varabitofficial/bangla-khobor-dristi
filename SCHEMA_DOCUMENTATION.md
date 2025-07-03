
# NewsViewBD Database Schema Documentation

This document provides a comprehensive overview of the NewsViewBD application database schema.

## 📋 Overview

The NewsViewBD schema supports a full-featured news platform with user management, content creation, commenting, and administration capabilities. It uses PostgreSQL with Supabase's authentication and storage features.

## 🗂️ Schema Structure

### User Management

#### `profiles` Table
- **Purpose**: Extended user information linked to Supabase Auth
- **Key Features**: Role-based access control (admin, editor, reader)
- **Relationships**: Links to auth.users, referenced by posts, videos, comments

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | References auth.users(id) |
| full_name | TEXT | User's display name |
| avatar_url | TEXT | Profile picture URL |
| role | user_role | User permission level |
| created_at | TIMESTAMPTZ | Account creation time |
| updated_at | TIMESTAMPTZ | Last profile update |

### Content Organization

#### `categories` Table
- **Purpose**: Main content categories (রাজনীতি, অর্থনীতি, etc.)
- **Features**: URL-friendly slugs, hierarchical structure support

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| name | TEXT | Category display name |
| slug | TEXT (UNIQUE) | URL-friendly identifier |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last modification |

#### `subcategories` Table
- **Purpose**: Subcategories under main categories
- **Relationships**: Belongs to categories

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| parent_category_id | UUID (FK) | References categories(id) |
| name | TEXT | Subcategory name |
| slug | TEXT (UNIQUE) | URL-friendly identifier |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last modification |

#### `tags` Table
- **Purpose**: Flexible content labeling system
- **Usage**: Many-to-many relationship with posts

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| name | TEXT | Tag display name |
| slug | TEXT (UNIQUE) | URL-friendly identifier |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last modification |

### Content Types

#### `posts` Table
- **Purpose**: Main news articles and content
- **Features**: Draft/published status, view tracking, SEO optimization

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| title | TEXT | Article headline |
| content | TEXT | Full article content |
| excerpt | TEXT | Brief summary |
| featured_image | TEXT | Main article image URL |
| category_id | UUID (FK) | References categories(id) |
| subcategory_id | UUID (FK) | References subcategories(id) |
| author_id | UUID (FK) | References profiles(id) |
| status | TEXT | 'published' or 'draft' |
| is_featured | BOOLEAN | Homepage feature flag |
| view_count | INTEGER | Page view counter |
| read_time | INTEGER | Estimated read time (minutes) |
| published_at | TIMESTAMPTZ | Publication timestamp |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last modification |

#### `post_tags` Table
- **Purpose**: Many-to-many relationship between posts and tags
- **Features**: Junction table with timestamps

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| post_id | UUID (FK) | References posts(id) |
| tag_id | UUID (FK) | References tags(id) |
| created_at | TIMESTAMPTZ | Relationship creation |

#### `videos` Table
- **Purpose**: Video content management
- **Features**: YouTube integration, view tracking

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| title | TEXT | Video title |
| description | TEXT | Video description |
| video_url | TEXT | YouTube or video URL |
| thumbnail | TEXT | Video preview image |
| author_id | UUID (FK) | References profiles(id) |
| view_count | INTEGER | View counter |
| published_at | TIMESTAMPTZ | Publication timestamp |
| created_at | TIMESTAMPTZ | Creation timestamp |

#### `opinions` Table
- **Purpose**: Editorial and opinion pieces
- **Features**: External author support, flexible attribution

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| title | TEXT | Opinion piece title |
| excerpt | TEXT | Brief summary |
| content | TEXT | Full opinion content |
| author_name | TEXT | Author's name |
| author_role | TEXT | Author's title/position |
| author_image | TEXT | Author's photo URL |
| created_by | UUID (FK) | References profiles(id) |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last modification |

### Engagement Features

#### `comments` Table
- **Purpose**: User comments on posts and videos
- **Features**: Nested replies, moderation system

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| post_id | UUID (FK) | References posts(id) |
| user_id | UUID (FK) | References profiles(id) |
| parent_id | UUID (FK) | References comments(id) for replies |
| content | TEXT | Comment text |
| is_approved | BOOLEAN | Moderation status |
| created_at | TIMESTAMPTZ | Comment timestamp |
| updated_at | TIMESTAMPTZ | Last modification |

### Marketing & Monetization

#### `newsletter_subscribers` Table
- **Purpose**: Email newsletter subscription management
- **Features**: Simple email collection, GDPR compliant

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| email | TEXT (UNIQUE) | Subscriber email |
| created_at | TIMESTAMPTZ | Subscription timestamp |

#### `advertisements` Table
- **Purpose**: Ad placement and management
- **Features**: Location-based targeting, activation controls

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| title | TEXT | Ad campaign name |
| image_url | TEXT | Ad creative URL |
| link_url | TEXT | Destination URL |
| location | TEXT | Placement location |
| is_active | BOOLEAN | Activation status |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last modification |

## 🔐 Security Features

### Row Level Security (RLS)

All tables have RLS enabled with comprehensive policies:

#### Permission Levels
- **Public**: Categories, tags, published content
- **Authenticated**: Comment creation, profile updates
- **Role-based**: Content management, user administration

#### Key Security Functions

```sql
-- Get current user's role
public.get_current_user_role()

-- Auto-create profile on signup
public.handle_new_user()

-- Safely increment view counters
public.increment_post_view_count(uuid)
public.increment_video_view_count(uuid)
```

### User Roles

| Role | Permissions |
|------|-------------|
| **reader** | View content, create comments, manage own profile |
| **editor** | All reader permissions + create/edit content |
| **admin** | All permissions + user management, system settings |

## 📊 Performance Optimizations

### Indexes

Strategic indexes for common queries:
- Post lookups by category, author, status
- Comment lookups by post and approval status
- Time-based ordering for feeds
- Video author relationships

### Functions

Secure functions for:
- View count incrementation
- Role checking
- User profile creation

## 🗃️ Storage Integration

### Buckets

- **post-images**: Public bucket for article images
- Policies support user-specific upload management
- Automatic cleanup capabilities

## 🔄 Data Relationships

### Primary Relationships

```
users (auth) -> profiles -> posts/videos/comments
categories -> subcategories
categories -> posts
posts -> post_tags -> tags
posts -> comments (with threading)
```

### Cascade Behaviors

- User deletion: Cascades to all user content
- Category deletion: Restricted if posts exist
- Post deletion: Cascades to comments and tags

## 🚀 Extensibility

The schema supports easy extension:

### Adding Content Types
- Follow the same pattern as posts/videos
- Include author_id reference
- Add appropriate RLS policies

### Custom Fields
- Use JSON columns for flexible metadata
- Maintain backward compatibility

### Integration Points
- Storage buckets for media
- Auth hooks for user lifecycle
- Function hooks for business logic

## 📝 Sample Queries

### Get Featured Posts with Categories
```sql
SELECT p.*, c.name as category_name, pr.full_name as author_name
FROM posts p
JOIN categories c ON p.category_id = c.id
JOIN profiles pr ON p.author_id = pr.id
WHERE p.is_featured = true
ORDER BY p.published_at DESC;
```

### Get Comments with Replies
```sql
WITH RECURSIVE comment_tree AS (
  SELECT *, 0 as level FROM comments WHERE parent_id IS NULL
  UNION ALL
  SELECT c.*, ct.level + 1 FROM comments c
  JOIN comment_tree ct ON c.parent_id = ct.id
)
SELECT * FROM comment_tree ORDER BY created_at;
```

This schema provides a robust foundation for a modern news platform with room for growth and customization.
