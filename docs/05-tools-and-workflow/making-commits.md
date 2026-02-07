# Making Commits

How to save and publish your changes to the live site.

---

## Overview

"Making a commit" means saving a snapshot of your changes and publishing them to the website.

---

## The Workflow

### 1. Make Your Changes

Edit files, add content, upload images - whatever you need to do.

### 2. Check What Changed

```bash
git status
```

Shows which files you've modified.

### 3. Stage Your Changes

```bash
git add .
```

Selects all changes to include in the commit.

### 4. Create a Commit

```bash
git commit -m "Add Casa Marianella project"
```

Saves a snapshot with a message describing what you did.

### 5. Push to GitHub

```bash
git push
```

Uploads your changes to GitHub.

### 6. Wait for Deploy

Netlify automatically rebuilds the site (3-5 minutes).

---

## Good Commit Messages

✅ **Good:**
- "Add Casa Marianella project"
- "Update studio contact information"
- "Fix typo in Wolf Creek description"

❌ **Bad:**
- "stuff"
- "changes"
- "final final FINAL version"

---

## Using VS Code's Git UI

VS Code has a visual git interface:

1. Click the Source Control icon (sidebar)
2. Review changed files
3. Click "+" to stage files
4. Type commit message
5. Click checkmark to commit
6. Click "..." → Push

---

## Troubleshooting

**"Nothing to commit"**
- You haven't made any changes
- Files aren't saved

**"Push rejected"**
- Pull first: `git pull`
- Then push again: `git push`

---

## Next Steps

- [Viewing Changes Live](viewing-changes-live.md)
- [Git for Beginners](git-for-beginners.md)

