# Start Here

Welcome to the LowDO website! This guide will help you get oriented and start working with the site.

## What is This Website?

LowDO's portfolio website showcases the studio's design and architecture work. It includes:

- **Design projects** with their own detail pages and image galleries
- **Studio news, awards, and updates** in a comprehensive index
- **Filterable content** so visitors can browse by topic or project type

## What Can You Do Without Knowing How to Code?

You can do a lot! This site is designed to be content-first:

✅ **Add new content**
- Add design projects with images and descriptions
- Add news, awards, press features, lectures, exhibitions, and staff updates
- Upload and organize images

✅ **Edit existing content**
- Update project descriptions
- Change dates, categories, and metadata
- Hide or unpublish content

✅ **Customize the site**
- Change site colors and theme
- Update site title, contact information, and social links
- Modify text and basic styling

✅ **Publish changes**
- Save your work and push it to the live website
- Preview changes before they go live

❌ **What you CAN'T do easily** (ask for help with these):
- Change the site's layout or structure
- Add new page types or features
- Modify complex functionality

---

## What You'll Need

To work with the site, you'll need:

1. **A text editor**
   - We recommend [VS Code](https://code.visualstudio.com/) (free, beginner-friendly)
   - See [Code Editor Setup](05-tools-and-workflow/code-editor-setup.md) for installation help

2. **Access to the GitHub repository**
   - This is where all the site files live
   - You'll need GitHub account access (ask your team lead)

3. **This documentation**
   - Bookmark this folder—it's your reference guide

---

## How Content Becomes a Webpage

Here's the simple version of what happens:

### Step 1: You Create Content
You create a folder and a text file (`.md` file) with your content and images.

```
entries/projects/my-project/
├── my-project.md    ← Your content here
└── header.jpg       ← Your image here
```

### Step 2: The System Builds It
The build system (Eleventy) automatically:
- Discovers your new file
- Reads your content and metadata
- Generates a webpage from it
- Adds it to the comprehensive index

### Step 3: It Goes Live
When you save and publish your changes:
- Your changes are uploaded to GitHub
- Netlify automatically rebuilds the website (takes 3-5 minutes)
- The live site updates at https://lowdo.netlify.app

**The key idea:** You don't need to manually tell the system "hey, I added a file" or "update the index." It discovers everything automatically!

---

## Quick Links to Common Tasks

Ready to start? Here are the most common things you'll do:

### Adding Content
- **[How to Add a Project →](02-adding-content/adding-a-project.md)**
- **[How to Add News/Awards →](02-adding-content/adding-news-awards.md)**

### Customizing the Site
- **[How to Change Colors →](04-customizing-the-site/changing-colors.md)**
- **[How to Update Site Info →](04-customizing-the-site/updating-site-info.md)**

### Publishing Changes
- **[How to Make Commits →](05-tools-and-workflow/making-commits.md)**
- **[How to View Changes Live →](05-tools-and-workflow/viewing-changes-live.md)**

### Getting Help
- **[Common Issues →](06-troubleshooting/common-issues.md)**
- **[FAQ →](06-troubleshooting/faq.md)**

---

## Understanding the Workflow

Here's the typical workflow for adding content:

1. **Make your changes** (add/edit files on your computer)
2. **Save your work** (using git to create a "commit")
3. **Push to GitHub** (upload your changes)
4. **Wait for deployment** (Netlify rebuilds the site, 3-5 minutes)
5. **Check the live site** (see your changes at https://lowdo.netlify.app)

Don't worry if this sounds complicated—the guides will walk you through each step!

---

## Next Steps

1. **Read [How the Site Works](01-understanding-the-site/how-the-site-works.md)** to understand the big picture
2. **Read [Folder Structure](01-understanding-the-site/folder-structure.md)** to know where files go
3. **Try adding your first project** with the [Adding a Project](02-adding-content/adding-a-project.md) guide

---

## Still Have Questions?

- Check the **[FAQ](06-troubleshooting/faq.md)**
- Review **[Common Issues](06-troubleshooting/common-issues.md)**
- Ask a team member or email lowdo@lowdo.net
