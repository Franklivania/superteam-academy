# CMS Guide

## Content Management

Superteam Academy uses a **database-driven CMS**. All course content is managed through the admin panel and stored in PostgreSQL.

## Course Structure

```
Course
├── title, slug, description, image_url, published
├── Module 1 (order: 1)
│   ├── Lesson 1.1 (order: 1, content: Markdown)
│   └── Lesson 1.2 (order: 2, content: Markdown, challenge_id: optional)
└── Module 2 (order: 2)
    └── Lesson 2.1 (order: 1, content: Markdown)
```

## Creating a Course

1. Navigate to the **Admin Panel** → Courses
2. Click **Create Course**
3. Fill in:
   - **Title** — display name
   - **Slug** — URL-safe identifier (e.g., `intro-to-solana`)
   - **Description** — short course summary
   - **Image URL** — cover image (optional)
   - **Published** — toggle visibility
4. Add **Modules** with ordering
5. Add **Lessons** to each module:
   - **Content** — Markdown format (supports headings, code blocks, lists)
   - **Challenge ID** — Link to an existing challenge (optional)

## Lesson Content Format

Lessons use Markdown:

```markdown
# Introduction to Solana

Solana is a high-performance blockchain...

## Key Concepts

- **Accounts** — Solana stores data in accounts
- **Programs** — Smart contracts on Solana

### Code Example

\`\`\`typescript
import { Connection } from "@solana/web3.js";
const connection = new Connection("https://api.devnet.solana.com");
\`\`\`
```

## Managing Challenges

1. Admin Panel → **Challenges**
2. Create with: title, difficulty (easy/medium/hard/hell), language, XP reward, metadata JSON
3. Challenges can be linked to lessons as hands-on exercises

## Managing Achievements

1. Admin Panel → **Achievements**
2. Define: name, image, XP reward, criteria type/value, supply cap
3. Achievements are automatically evaluated when criteria are met
4. Awards are recorded with optional on-chain minting

## Publishing Flow

1. Create course as **unpublished**
2. Add all modules and lessons
3. Review content
4. Toggle **published** to make it visible to learners
