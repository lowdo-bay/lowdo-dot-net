# GitHub Web Editor Guide

Complete guide to editing the site using only GitHub.com—no software installation required.

---

## Overview

You can edit this entire website using just your web browser on GitHub.com. This guide shows you how.

**What you'll learn:**
- How to edit existing files
- How to create new files and folders
- How to upload images
- Tips and limitations

---

## Opening the Editor

### For Existing Files

1. Go to https://github.com/lowdo-bay/lowdo-dot-net
2. Navigate to the file you want to edit
3. Click the **pencil icon** (✏️) in the top right corner
4. The editor opens in your browser

### For New Files

1. Navigate to the folder where you want to add a file
2. Click "Add file" → "Create new file"
3. Type the full path including folders: `entries/news/my-news/my-news.md`
4. GitHub creates folders automatically as you type

---

## Editing Markdown

The GitHub editor has two tabs:

### Edit Tab
- Type markdown text directly
- No syntax highlighting or autocomplete
- Use markdown formatting:
  - `**bold**` for **bold text**
  - `*italic*` for *italic text*
  - `## Heading` for headings

### Preview Tab
- Click "Preview" to see how markdown will render
- Shows formatted text
- **Note:** Frontmatter (YAML between `---`) won't preview correctly—that's normal

---

## Adding Images

### Step 1: Navigate to the Entry Folder

Go to the folder where the image belongs:
```
entries/projects/my-project/
```

### Step 2: Upload Image Files

1. Click "Add file" → "Upload files"
2. Drag and drop image(s) from your computer
3. Or click "choose your files" to browse

### Step 3: Name Images Correctly

**IMPORTANT:** Rename images on your computer **before** uploading:
- Main thumbnail: `header.jpg` or `thumb.jpg`
- Gallery images: `01-exterior.jpg`, `02-interior.jpg`, etc.

### Step 4: Commit the Upload

1. Scroll down to "Commit changes"
2. Write a commit message: "Add images for My Project"
3. Choose:
   - "Commit directly to main" (⚠️ goes live immediately)
   - "Create a new branch" (✅ recommended - creates preview first)
4. Click "Commit changes"

---

## Creating Folder Structures

GitHub doesn't allow empty folders. To create a complete entry structure:

**Option 1: Create File with Full Path**

When creating a new file, type the full path:
```
entries/projects/new-project/new-project.md
```

GitHub automatically creates:
- `entries/projects/` (if doesn't exist)
- `new-project/` folder
- `new-project.md` file

**Option 2: Upload Image to Create Folder**

When uploading an image, type the folder path in the filename box:
```
entries/projects/new-project/header.jpg
```

This creates the folder structure and adds the image.

---

## Committing Changes

Every time you save a file, GitHub creates a "commit" (a saved snapshot).

### Writing Good Commit Messages

✅ **Good examples:**
- "Add Casa Marianella project"
- "Update contact email in settings"
- "Fix typo in About page"

❌ **Bad examples:**
- "Update file.md" (auto-generated, not descriptive)
- "changes" (too vague)
- "asdf" (meaningless)

### Choosing Where to Commit

**Option A: Commit directly to the main branch**
- ⚠️ Changes build and go live immediately (after 3-5 min)
- No preview or testing
- Use ONLY for tiny fixes (typos, etc.)

**Option B: Create a new branch for this commit and start a pull request** (Recommended)
- ✅ Creates a safe workspace
- ✅ Netlify generates a preview URL
- ✅ Test before going live
- ✅ Can ask others to review
- ✅ Can make more changes before merging

**We strongly recommend Option B for all content changes.**

---

## Pull Request Workflow

When you choose "Create a new branch," GitHub guides you through creating a pull request (PR).

### Step 1: Create the Branch

1. GitHub suggests a branch name (e.g., `username-patch-1`)
2. You can change it to something descriptive (e.g., `add-new-project`)
3. Click "Propose changes"

### Step 2: Create Pull Request

1. GitHub shows "Open a pull request" page
2. Add a title: "Add Casa Marianella project"
3. Add description (optional but helpful):
   ```
   - Added new housing project
   - Uploaded 3 gallery images
   - Set categories: HOUSING, COMMUNITY
   ```
4. Click "Create pull request"

### Step 3: Wait for Preview

Netlify automatically:
1. Detects the PR
2. Builds a preview (takes 3-5 minutes)
3. Comments on the PR with preview URL

Look for:
- ✅ Green checkmark = build succeeded
- ❌ Red X = build failed (check logs)
- Click "Details" next to "netlify/deploy-preview" to see your preview

### Step 4: Test on Preview

1. Click the preview URL
2. Navigate to your new content
3. Check that everything looks correct
4. If you find issues, make more commits to the same branch (they update the PR)

### Step 5: Merge When Ready

If everything looks good:
1. Click "Merge pull request"
2. Click "Confirm merge"
3. Optionally delete the branch (GitHub prompts you)

Your changes go live in 3-5 minutes!

---

## Tips for Effective Web Editing

### Do's ✅

- **Use branches for all content changes** - Get previews before going live
- **Write clear commit messages** - Future you will thank you
- **One logical change per commit** - Don't mix unrelated edits
- **Test on preview URLs** - Catch mistakes before they go live
- **Ask AI for help** - See [Using AI Assistants](using-ai-assistants.md)

### Don'ts ❌

- **Don't commit directly to main** for anything except tiny fixes
- **Don't use auto-generated commit messages** like "Update file.md"
- **Don't mix multiple changes** in one commit (e.g., don't add a project AND change colors in the same commit)
- **Don't skip testing** - Always check the preview

---

## Limitations of Web Editing

**What you CAN'T do easily:**

❌ **Rename files** - Must delete and recreate with new name
❌ **Move files between folders** - Must delete and recreate in new location
❌ **Batch upload to multiple folders** - Can only upload to one folder at a time
❌ **Real-time YAML validation** - Won't know if frontmatter is wrong until build
❌ **Local preview** - Must wait 3-5 minutes for Netlify preview
❌ **Batch operations** - Can't edit multiple files in one commit easily

### Workarounds

- **For file management:** Ask an AI assistant to help you understand what needs to change, or consider installing VS Code for complex operations
- **For validation:** Use an online YAML validator before committing: https://www.yamllint.com/
- **For preview:** Use PR workflow to get Netlify preview URLs
- **For batch edits:** Edit one file at a time on the same branch—they all update the same PR

---

## Common Scenarios

### Scenario 1: Fix a Typo

1. Navigate to the file on GitHub
2. Click pencil icon ✏️
3. Fix the typo
4. Commit directly to main (it's just a typo)
5. Done!

### Scenario 2: Add a New Project

1. Create `entries/projects/my-project/my-project.md`
2. Add frontmatter and content
3. Choose "Create a new branch"
4. Create pull request
5. Upload images to the same branch:
   - Navigate to `entries/projects/my-project/`
   - Upload files
   - Choose the SAME branch you created
6. Wait for preview
7. Test
8. Merge when ready

### Scenario 3: Update Site Colors

1. Navigate to `_data/settings.yaml`
2. Click pencil icon ✏️
3. Change color values
4. Create a new branch + PR
5. Wait for preview
6. Check colors on preview site
7. Merge when satisfied

---

## Keyboard Shortcuts

- `Cmd+F` / `Ctrl+F` - Find in file
- `Cmd+S` / `Ctrl+S` - (Doesn't work—must click "Commit changes")
- `Tab` - Indent (useful for YAML)
- `Shift+Tab` - Outdent

---

## Troubleshooting

**"I can't find the pencil icon"**
- Make sure you're logged into GitHub
- Make sure you have write access to the repository
- You can't edit files directly in pull requests from others

**"My commit went to the wrong branch"**
- Check which branch you're viewing (top left, branch dropdown)
- When creating a file, GitHub commits to the branch you're currently on

**"I made a mistake in my commit"**
- If committed to a branch (not main): make another commit to fix it
- If committed to main: you can revert (ask AI for help or see git documentation)

**"Preview build failed"**
- Click "Details" to see error logs
- Common issues:
  - Frontmatter YAML syntax error
  - Date in wrong format
  - Missing required fields
- Fix the issue and commit again to the same branch

---

## Next Steps

- **[Making Commits](making-commits.md)** - More details on git workflow
- **[Using AI Assistants](using-ai-assistants.md)** - Get help when stuck
- **[Viewing Changes Live](viewing-changes-live.md)** - Understanding Netlify deploys
- **[Adding a Project](../02-adding-content/adding-a-project.md)** - Try adding content

---

## Questions?

- **Can I edit on mobile?** - Yes, but it's easier on a computer (small screen makes it harder to navigate)
- **Do changes save automatically?** - No, you must click "Commit changes"
- **Can I undo a commit?** - Yes, but it's complex—ask AI for help with git revert
- **Can multiple people edit at once?** - Yes, use separate branches and merge via PRs

See [FAQ](../06-troubleshooting/faq.md) for more questions.
