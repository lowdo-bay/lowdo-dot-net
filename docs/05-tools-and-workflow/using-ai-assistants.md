# Using AI Assistants to Edit the Site

How to use Claude, ChatGPT, or other AI tools to help edit this website.

---

## Why Use AI Assistants?

Since **no one at LowDO may be available to help with technical issues**, AI assistants become your primary support system for editing this website.

✅ **They can help with:**
- Writing proper markdown syntax
- Formatting frontmatter (YAML)
- Generating commit messages
- Troubleshooting build errors
- Understanding file structure
- Creating content from descriptions
- Validating your work before committing

❌ **They can't:**
- Access your GitHub account directly
- Upload files for you
- See what's on the live site (unless you share URLs)
- Test changes locally
- Make commits on your behalf

**Think of AI as your expert consultant—you still do the actual editing on GitHub.**

---

## What to Share with AI

When asking for help, provide context:

1. **The documentation:** Link to docs folder or paste relevant guides
2. **Example files:** Share existing entry frontmatter as templates
3. **Error messages:** Copy exact error text from Netlify build logs
4. **What you're trying to do:** Be specific about your goal
5. **What you've tried:** Mention what you've already attempted

**The more context you give, the better help you'll get.**

---

## Consolidating Categories

This is a perfect use case for AI assistants. If you want to reorganize or consolidate categories across multiple projects:

### Example Scenario

> "I have several LowDO projects tagged with both RESIDENTIAL and HOUSING, which are too similar. I also have some tagged with DESIGN that should probably be combined with project types. Help me consolidate these categories and tell me which entries need to be updated."

**AI can help by:**
1. Analyzing your current category usage
2. Suggesting a cleaner system
3. Listing exactly which entries need updates
4. Providing the updated frontmatter

You then update each entry and commit the changes.

### Example Prompts for Category Work

**Reviewing category consistency:**
> "Can you tell me which categories are used most and suggest a simplified system?"

**Finding entries to update:**
> "Which of my projects use the PRESS category? Give me their filenames so I can update them."

**Consolidating similar categories:**
> "I want to combine COMMERCIAL and BUSINESS into one category. Which entries have each one and what should the new unified category be?"

**Bulk category updates:**
> "Can you create updated versions where RESIDENTIAL becomes HOUSING and DESIGN is removed if it's the only category?"

---

## Example Prompts

### Adding a Project

> "I need to add a new architecture project called 'Community Center' to the LowDO website. It was completed in June 2024, is a housing and community project, and we worked with ABC Engineering as structural engineers and XYZ Consultants for sustainability. Help me write the frontmatter. Here's an example of an existing project: [paste casa-marianella.md frontmatter]"

### Formatting Frontmatter

> "I'm getting a Netlify build error. Here's my frontmatter: [paste]. What's wrong with the YAML syntax?"

### Creating Commit Messages

> "I just added a new award entry for the Emerging Voices program and uploaded two images (header.jpg and a thumbnail). What should my commit message be?"

### Understanding Structure

> "I want to add a news item about our studio expansion. Where should the file go, what should it be named, and what frontmatter fields does it need? Here's a link to the documentation: [paste link or relevant doc content]"

### Troubleshooting Errors

> "My Netlify build failed with this error: [paste error]. What does it mean and how do I fix it?"

---

## AI Workflow Example

### Scenario: Adding a News Entry

**Step 1: Ask AI to Generate Template**

**You:** "I need to announce that our studio is expanding to a second office in East Austin. Help me create a news entry with proper frontmatter."

**AI:** "Sure! Here's a template for your news entry:

\`\`\`yaml
---
draft: false
title: "Studio Expansion"
subtitle: "New Office in East Austin"
date: 2024-06-15
categories:
  - NEWS
  - STUDIO
description: "LowDO opens second office location to better serve East Austin community"
---

LowDO is excited to announce the opening of our second office location in East Austin. This expansion allows us to better serve our clients and engage more deeply with the local community.

The new office is located at [address] and will focus on [services/projects].
\`\`\`"

**Step 2: Customize the Content**

**You:** Add specific details like exact address, opening date, services offered, etc.

**Step 3: Ask AI to Review**

**You:** "Does this frontmatter look correct? [paste your version]"

**AI:** Reviews and points out any syntax errors or suggests improvements.

**Step 4: Create File on GitHub**

**You:** 
1. Go to GitHub.com
2. Navigate to `entries/news/`
3. Click "Add file" → "Create new file"
4. Name it: `studio-expansion/studio-expansion.md`
5. Paste the content
6. Commit to a new branch

**Step 5: Ask AI for Commit Message**

**You:** "I just added a news entry about our office expansion to East Austin. What commit message should I use?"

**AI:** "Add news entry: Studio expansion to East Austin office"

**Step 6: Create PR and Test**

**You:** Follow GitHub web editor workflow to create PR, wait for preview, test, and merge.

---

## Important Warnings

### ⚠️ Don't Blindly Trust AI

Always review AI suggestions:
- **Check frontmatter syntax** - Look for proper indentation, quotes, colons
- **Verify field names** match documentation
- **Confirm dates** are in YYYY-MM-DD format
- **Ensure file/folder names** use kebab-case (lowercase-with-hyphens)
- **Test on preview** before merging to main

AI can make mistakes, especially with:
- YAML indentation (must be exactly 2 spaces)
- File naming conventions
- Field names (might suggest fields that don't exist)
- Date formats

### ⚠️ Don't Ask AI To:

- **Edit complex build files** (`.eleventy.js`, `netlify.toml`, `package.json`)
- **Change security settings** or CSP headers
- **Modify JavaScript** or advanced CSS without understanding
- **Access external systems** on your behalf
- **Commit directly to main** without testing

### ⚠️ Privacy Considerations:

- **Don't share sensitive info** (passwords, API keys, private emails)
- **Assume conversations may be stored** and reviewed by AI companies
- **Redact private data** before sharing (use placeholders like "email@example.com")
- **Don't share** client-confidential project details publicly

---

## Getting the Most from AI

### Best Practices

1. **Be specific**
   - ❌ Bad: "help me add stuff"
   - ✅ Good: "Help me add a housing project completed in June 2024"

2. **Share context**
   - Paste documentation links
   - Include example files
   - Mention what you've already tried

3. **Ask for explanations**
   - "Why does this field need quotes?"
   - "What does this error mean?"
   - Understanding helps you learn

4. **Iterate**
   - If first response isn't right, clarify and ask again
   - Provide feedback: "That's close, but..."

5. **Verify everything**
   - Cross-check AI suggestions against documentation
   - Test on preview URLs before going live
   - Use YAML validators for complex frontmatter

### Common AI Mistakes to Watch For

- **Underscores instead of hyphens** in file names (should be `my-project` not `my_project`)
- **Wrong date format** (should be `2024-06-15` not `06/15/2024` or `June 15, 2024`)
- **Invalid field names** (suggesting fields that don't exist in the system)
- **Local-only workflows** (suggesting `npm start` when you're editing online)
- **Incorrect indentation** in YAML (must be exactly 2 spaces)
- **Missing quotes** around text values in frontmatter

Always double-check!

---

## Recommended AI Tools

### Claude (by Anthropic) ⭐ Recommended

- **Best for:** Understanding documentation, YAML formatting
- **Strengths:** Can handle long context (paste entire docs)
- **Use when:** You need to share lots of documentation or examples

### ChatGPT (by OpenAI)

- **Best for:** Quick questions, generating templates
- **Strengths:** Fast responses, good general knowledge
- **Use when:** You need a quick answer or template

### Perplexity AI

- **Best for:** Researching best practices
- **Strengths:** Searches web for current information
- **Use when:** You want to compare approaches or find examples

### GitHub Copilot

- **Best for:** Autocomplete in VS Code
- **Strengths:** Suggests code as you type
- **Use when:** You're editing locally (not useful for web-only editing)

**For web-only editing, Claude or ChatGPT work best.**

---

## Example: Full Conversation

**You:** I'm adding a project called Wolf Creek Ranch. It's a residential development completed in November 2022. We worked with two partners: Structural Innovations (structural engineer) and EcoDesign Consultants (sustainability consultant). The project focuses on sustainable design in the Texas Hill Country. Can you write the frontmatter for this?

**AI:** Sure! Here's the frontmatter for Wolf Creek Ranch:

\`\`\`yaml
---
draft: false
title: "Wolf Creek Ranch"
subtitle: "Sustainable Residential Development"
date: 2022-11-20
year: 2022
categories:
  - RESIDENTIAL
  - SUSTAINABLE
  - HOUSING
collaborators:
  - name: "Structural Innovations"
    role: "Structural Engineer"
  - name: "EcoDesign Consultants"
    role: "Sustainability Consultant"
description: "A sustainable residential development in the Texas Hill Country"
---
\`\`\`

You can add your project description below the frontmatter.

**You:** Perfect! Now I need to upload images. I have "ranch_exterior.jpg" and "ranch_interior.jpg". What should I rename them to before uploading?

**AI:** For the images to work correctly with the system:

1. **Rename "ranch_exterior.jpg"** to `header.jpg` (this becomes the main thumbnail in the index)
2. **Rename "ranch_interior.jpg"** to `01-interior.jpg` (gallery image)

Or, for better organization:
- Main thumbnail: `header.jpg`
- Gallery images: `01-exterior-view.jpg`, `02-interior-space.jpg`

Remember to use hyphens (not underscores) and lowercase letters!

**You:** Got it! What commit message should I use after uploading these files?

**AI:** "Add Wolf Creek Ranch project with images"

Or if you want to be more specific:
"Add Wolf Creek Ranch residential project"

**You:** One more thing—where exactly do I create the file on GitHub?

**AI:** Create the file at this path:
```
entries/projects/wolf-creek-ranch/wolf-creek-ranch.md
```

Steps:
1. Navigate to `entries/projects/` on GitHub
2. Click "Add file" → "Create new file"
3. Type `wolf-creek-ranch/wolf-creek-ranch.md` (GitHub creates the folder automatically)
4. Paste the frontmatter and your content
5. Commit to a new branch
6. Create pull request

Then upload images to the same `entries/projects/wolf-creek-ranch/` folder.

---

## When You're Stuck

If AI can't help or you're still confused:

1. **Check the docs thoroughly** - This documentation has most answers
2. **Look at examples** - Browse `entries/` folder for similar content
3. **Test on preview** - Use PR workflow to catch mistakes safely
4. **Try another AI** - Different AIs might explain things differently
5. **Search online** - Look for "YAML syntax tutorial" or "markdown guide"

**Remember:** AI assistants and this documentation are your lifeline. Take time to:
- Read the relevant docs before asking
- Share complete context with AI
- Learn patterns so you become more independent
- Save successful examples for future reference

---

## Quick Reference: What to Ask AI

**Before creating content:**
- "Help me write frontmatter for [type of entry]"
- "What fields do I need for a [project/news/award]?"
- "Can you review this frontmatter for errors?"

**During creation:**
- "What should I name this file?"
- "Where should this file go?"
- "How do I format this in markdown?"

**When stuck:**
- "What does this error mean: [error message]?"
- "Why isn't my entry showing up?"
- "Did I format this YAML correctly?"

**After creation:**
- "What commit message should I use?"
- "How do I create a pull request?"
- "How can I test this before going live?"

---

## Next Steps

- **[GitHub Web Editor](github-web-editor.md)** - Learn to edit files online
- **[Making Commits](making-commits.md)** - Save and publish changes
- **[Common Issues](../06-troubleshooting/common-issues.md)** - Fix problems
- **[Adding a Project](../02-adding-content/adding-a-project.md)** - Try it yourself with AI help

---

## Final Advice

**Use AI as your assistant, not your autopilot.**

- Always review what AI suggests
- Understand why something works
- Test before going live
- Learn from each interaction

Over time, you'll need less help and become more confident editing the site yourself!
