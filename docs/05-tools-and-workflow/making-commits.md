# Making Commits and Publishing Changes

How to save and publish your changes to the live site.

---

## Overview

"Making a commit" means saving a snapshot of your changes and publishing them to the website. You can do this entirely in your web browser or using command-line tools.

---

## Method 1: GitHub Web Editor (Recommended for Beginners)

You can commit changes directly on GitHub.com without any software installation.

### Step 1: Make Your Changes

Edit files directly on GitHub.com using the web editor:
- Click the pencil icon (✏️) to edit existing files
- Use "Add file" → "Create new file" for new content
- Use "Add file" → "Upload files" for images

See [GitHub Web Editor Guide](github-web-editor.md) for detailed instructions.

### Step 2: Write a Commit Message

When you save a file, GitHub prompts you to describe your changes.

✅ **Good messages:**
- "Add Casa Marianella project"
- "Update studio contact information"
- "Fix typo in About page"

❌ **Bad messages:**
- "Update file" (auto-generated, not descriptive)
- "changes" (too vague)
- "asdf" (meaningless)

**Tip:** Be specific about what you changed and why. Future you will appreciate it!

### Step 3: Choose Where to Commit

GitHub gives you two options:

#### Option A: Commit directly to the main branch

```
○ Commit directly to the main branch
```

- ⚠️ Changes build and go live immediately (after 3-5 min)
- No preview or testing
- Use ONLY for tiny fixes (typos, small text changes)

#### Option B: Create a new branch for this commit and start a pull request (Recommended)

```
● Create a new branch for this commit and start a pull request
```

- ✅ Creates a safe workspace to test changes
- ✅ Netlify generates a preview URL automatically
- ✅ You can review before going live
- ✅ You can ask others to review
- ✅ You can make more changes before merging

**We strongly recommend Option B for all content changes.**

### Step 4: Create a Pull Request (If Using Option B)

After choosing "Create a new branch," GitHub guides you through creating a pull request (PR):

1. **Name your branch** (optional)
   - GitHub suggests a name like `username-patch-1`
   - You can change it to something descriptive: `add-casa-marianella`
   - Click "Propose changes"

2. **Create the PR**
   - GitHub shows "Open a pull request" page
   - Add a title: "Add Casa Marianella project"
   - Add description (optional but helpful):
     ```
     - Added new housing project
     - Uploaded 3 gallery images
     - Set categories: HOUSING, COMMUNITY
     ```
   - Click "Create pull request"

### Step 5: Wait for Preview

Netlify automatically builds a preview of your changes (takes 3-5 minutes):

1. Look for checks at the bottom of your PR
2. Wait for "netlify/deploy-preview" to show ✅ green checkmark
3. Click "Details" next to "netlify/deploy-preview"
4. Your preview site opens in a new tab

If you see ❌ red X instead:
- The build failed (something is wrong)
- Click "Details" to see error logs
- Common issues: YAML syntax error, missing required field, wrong date format
- Fix the issue and commit again to the same branch

### Step 6: Test on Preview

1. Navigate to your new content on the preview site
2. Check that everything looks correct:
   - Text displays properly
   - Images appear
   - Links work
   - Categories are correct
   - Entry appears in index

3. If you find issues:
   - Make more edits on GitHub
   - Commit to the **same branch** you created
   - The PR automatically updates
   - Netlify builds a new preview

### Step 7: Merge When Ready

Once everything looks good:

1. Go back to your PR on GitHub
2. Click "Merge pull request" (green button)
3. Click "Confirm merge"
4. Optionally delete the branch (GitHub prompts you)

**Your changes go live in 3-5 minutes!**

---

## Method 2: Command Line (Advanced Users)

If you have git and a code editor installed locally, you can use command-line tools.

### The Workflow

#### 1. Make Your Changes

Edit files locally in your code editor (VS Code, etc.).

#### 2. Check What Changed

```bash
git status
```

Shows which files you've modified.

#### 3. Stage Your Changes

```bash
git add .
```

Selects all changes to include in the commit.

Or stage specific files:
```bash
git add entries/projects/casa-marianella/
```

#### 4. Create a Commit

```bash
git commit -m "Add Casa Marianella project"
```

Saves a snapshot with a message describing what you did.

#### 5. Push to GitHub

```bash
git push
```

Uploads your changes to GitHub.

If this is a new branch:
```bash
git push -u origin branch-name
```

#### 6. Create Pull Request

If you pushed to a branch (not main):
1. Go to GitHub.com
2. Click "Compare & pull request"
3. Add description
4. Click "Create pull request"

#### 7. Wait for Deploy

Netlify automatically rebuilds the site (3-5 minutes).

### Using VS Code's Git UI

VS Code has a visual git interface if you prefer not to use commands:

1. Click the Source Control icon (sidebar, third icon)
2. Review changed files in the list
3. Click "+" next to files to stage them
4. Type commit message in the text box
5. Click checkmark ✓ to commit
6. Click "..." → "Push" to upload to GitHub

---

## Comparing the Two Methods

| Feature | Web Editor | Command Line |
|---------|-----------|--------------|
| **Installation** | None required | Requires git + code editor |
| **Speed** | Slower (page reloads) | Faster (local editing) |
| **Preview** | Netlify preview (3-5 min) | Local dev server (instant) |
| **Best for** | Simple edits, beginners | Complex changes, batch edits |
| **Works offline** | No | Yes |
| **Learning curve** | Easy | Moderate |

**For most content editing, the web editor is perfectly fine!**

---

## Pull Request Best Practices

### When to Create a PR

✅ **Always use PRs for:**
- Adding new projects or entries
- Uploading multiple images
- Changing site colors or settings
- Editing CSS or layouts
- Anything you want to preview first

❌ **Direct to main is okay for:**
- Fixing a typo in one file
- Updating a single date or small detail
- Emergency fixes on live site

### Making Changes to an Existing PR

If you need to update your PR after creating it:

**Web Editor:**
1. Switch to your branch using the branch dropdown (top left)
2. Make your edits
3. Commit to the same branch
4. PR updates automatically

**Command Line:**
```bash
git add .
git commit -m "Update project description"
git push
```

PR updates automatically with new commits.

### Multiple People Working Together

If someone else needs to help with your PR:

1. Share the branch name with them
2. They can checkout your branch locally:
   ```bash
   git fetch
   git checkout branch-name
   ```
3. They make changes and push to the same branch
4. PR updates with their commits

---

## Common Issues

### "Nothing to commit"

**Problem:** Git says there's nothing to commit.

**Solutions:**
- Make sure you saved your files
- Check `git status` to see if changes are detected
- Verify you're in the right directory

### "Push rejected" or "Updates were rejected"

**Problem:** Someone else pushed changes before you.

**Solution:**
```bash
git pull    # Download latest changes
git push    # Try pushing again
```

If you get a merge conflict, see [Git for Beginners](git-for-beginners.md).

### "Build failed" on Netlify

**Problem:** Netlify can't build your site.

**Common causes:**
- YAML syntax error in frontmatter
- Missing required field (draft, title, date)
- Date in wrong format (must be YYYY-MM-DD)
- Folder name doesn't match file name

**Solution:**
1. Click "Details" on the failed check
2. Read the error message
3. Fix the issue
4. Commit again to the same branch

See [Common Issues](../06-troubleshooting/common-issues.md) for more help.

### "I committed to the wrong branch"

**Problem:** You meant to create a new branch but committed to main.

**Solutions:**

**If you haven't pushed yet:**
```bash
git reset HEAD~1    # Undo the commit (keeps your changes)
git checkout -b new-branch-name
git add .
git commit -m "Your message"
git push -u origin new-branch-name
```

**If you already pushed to main:**
- It's already building/live - you may need to wait for it
- For critical issues, you can revert (ask an AI assistant for help)

---

## Understanding Commits

### What is a Commit?

A commit is a snapshot of your work at a specific point in time. Think of it like:
- A save point in a video game
- A version in "Track Changes"
- A backup you can return to

Each commit has:
- **Changes:** What files were modified, added, or deleted
- **Message:** Description of what changed
- **Author:** Who made the change
- **Timestamp:** When it was made
- **Hash:** Unique ID (like `a3f5b7c`)

### Commit History

All commits are saved permanently. You can:
- See history: `git log`
- Compare versions: `git diff`
- Revert to old versions (advanced)

This is why good commit messages matter - they help you understand what happened and when.

### Commits vs. Saves

- **Saving a file** only saves it on your computer
- **Committing** creates a permanent snapshot in git history
- **Pushing** uploads commits to GitHub so others can see them

You can save many times before making a commit.

---

## Tips for Good Commits

### One Logical Change Per Commit

✅ **Good:**
- Commit 1: "Add Casa Marianella project"
- Commit 2: "Update studio contact email"

❌ **Bad:**
- Commit 1: "Add Casa Marianella project and update contact email and fix typo in about page"

**Why?** If you need to undo the contact email change later, you don't want to also undo the project.

### Commit Often

Don't wait until everything is perfect. Commit frequently:
- After adding a project (even if images aren't ready)
- After fixing a bug
- After completing a logical chunk of work

You can always make more commits!

### Write Helpful Messages

Future you (and your teammates) will thank you:

✅ **Good:**
- "Add Casa Marianella project"
- "Fix broken image link in Wolf Creek"
- "Update studio address and phone number"

❌ **Bad:**
- "stuff"
- "more changes"
- "final" (there's always another final)

**Format:** Start with a verb (Add, Fix, Update, Remove)

---

## Next Steps

- **[GitHub Web Editor](github-web-editor.md)** - Complete guide to editing online
- **[Viewing Changes Live](viewing-changes-live.md)** - Understanding Netlify deploys
- **[Git for Beginners](git-for-beginners.md)** - More about version control
- **[Common Issues](../06-troubleshooting/common-issues.md)** - Troubleshooting help

---

## Quick Reference

### Web Editor Workflow

1. Edit file on GitHub.com
2. Write commit message
3. Choose "Create a new branch"
4. Create pull request
5. Wait for preview (3-5 min)
6. Test on preview URL
7. Merge when ready

### Command Line Workflow

```bash
git status              # Check what changed
git add .               # Stage all changes
git commit -m "message" # Create commit
git push                # Upload to GitHub
```

### Good Commit Messages

- Start with verb (Add, Fix, Update, Remove)
- Be specific about what changed
- Keep under 50 characters if possible
- Use present tense ("Add project" not "Added project")
