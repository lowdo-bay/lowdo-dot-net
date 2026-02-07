# Code Editor Setup (Optional)

Installing and using VS Code for local editing - completely optional!

---

## Important: This is Optional

**You do NOT need to install a code editor to edit this website.** You can do everything using GitHub's web editor in your browser.

See [GitHub Web Editor Guide](github-web-editor.md) for browser-only editing.

This guide is for users who want a local development environment for faster feedback and advanced editing.

---

## Do You Need a Code Editor?

### You DON'T need a code editor if:

- ✅ You're only editing text and uploading images
- ✅ You're comfortable waiting 3-5 minutes for Netlify previews
- ✅ You use AI assistants to help with formatting
- ✅ You edit the site occasionally (not daily)
- ✅ You don't want to install software

**For most content editors, the web browser is enough!**

### You MIGHT want a code editor if:

- 🔧 You make frequent changes and want instant preview
- 🔧 You need to edit CSS or complex layouts
- 🔧 You want autocomplete and syntax highlighting
- 🔧 You want to work offline
- 🔧 You need to edit multiple files quickly
- 🔧 You're comfortable with technical tools

**Local setup is an optimization, not a requirement.**

---

## What is a Code Editor?

A code editor is a specialized text editor designed for working with code and markdown files. Think of it like Microsoft Word, but for code:

- Syntax highlighting (colors make code easier to read)
- File navigation (quickly jump between files)
- Search and replace across multiple files
- Built-in terminal for running commands
- Extensions for extra features

We recommend **Visual Studio Code** (VS Code) because it's:
- Free and open-source
- Beginner-friendly with a gentle learning curve
- Cross-platform (Mac, Windows, Linux)
- Has excellent markdown and YAML support
- Widely used and well-documented

---

## Installation Guide

### Step 1: Download VS Code

Visit: https://code.visualstudio.com/

Click the big download button for your operating system (Mac, Windows, or Linux).

### Step 2: Install

**Mac:**
1. Open the downloaded `.dmg` file
2. Drag the VS Code icon to your Applications folder
3. Launch VS Code from Applications

**Windows:**
1. Run the downloaded `.exe` installer
2. Follow the installation wizard
3. Leave default options checked
4. Launch VS Code from Start Menu

**Linux:**
Follow the instructions for your distribution at: https://code.visualstudio.com/docs/setup/linux

### Step 3: Open the Project

You need to have the repository cloned to your computer first. See [Git for Beginners](git-for-beginners.md) for cloning instructions.

Once cloned:
1. Launch VS Code
2. **File → Open Folder** (or **File → Open** on Mac)
3. Navigate to your `lowdo-dot-net` folder
4. Click "Open"

VS Code opens with your project in the sidebar.

---

## Navigating VS Code

### The Interface

VS Code has several key areas:

```
┌─────────────────────────────────────────┐
│  Menu Bar                               │
├────┬────────────────────────────────────┤
│    │  Editor                            │
│ S  │  (Your file content appears here)  │
│ i  │                                    │
│ d  │                                    │
│ e  │                                    │
│ b  │                                    │
│ a  │                                    │
│ r  ├────────────────────────────────────┤
│    │  Terminal (optional)               │
└────┴────────────────────────────────────┘
```

### Sidebar Icons (Left Side)

1. **Explorer** (📁) - Browse files and folders
2. **Search** (🔍) - Find text across all files
3. **Source Control** (🌿) - Git integration
4. **Extensions** (🧩) - Install add-ons

### File Explorer

Click the Explorer icon (📁) to see your files:
- Click folders to expand/collapse them
- Click files to open them in the editor
- Right-click for options (New File, Delete, Rename, etc.)

### Opening Files Quickly

Instead of clicking through folders:
- **Cmd+P** (Mac) or **Ctrl+P** (Windows)
- Start typing a file name
- Click the file from the list

Example: Type "casa" to find `casa-marianella.md`

---

## Recommended Extensions

Extensions add extra features to VS Code. Here are the most useful for this project:

### Essential Extensions

1. **Markdown All in One**
   - Preview markdown files
   - Shortcuts for formatting
   - Table of contents generation

2. **YAML**
   - Syntax highlighting for frontmatter
   - Error detection
   - Auto-formatting

### Installing Extensions

1. Click the Extensions icon (🧩) in the sidebar (or **View → Extensions**)
2. Search for the extension name
3. Click "Install"
4. Reload VS Code if prompted

### Optional but Helpful Extensions

- **Prettier** - Auto-formats code
- **Code Spell Checker** - Catches typos
- **GitLens** - Enhanced git features
- **Image Preview** - Shows image thumbnails

---

## Basic Editing

### Opening and Editing Files

1. Use the Explorer or Cmd+P/Ctrl+P to open a file
2. Edit the content
3. **Save:** Cmd+S (Mac) or Ctrl+S (Windows)
4. Unsaved files show a dot (●) in the tab

### Markdown Preview

To see how your markdown will look:
1. Open a `.md` file
2. Click the preview icon (📖) in the top right
3. Or: Cmd+Shift+V (Mac) / Ctrl+Shift+V (Windows)

Split view shows editor and preview side-by-side.

### Multiple Files

Open multiple files in tabs:
- Tabs appear at the top of the editor
- Switch between tabs by clicking
- Close tabs with Cmd+W (Mac) or Ctrl+W (Windows)

---

## Using the Terminal

VS Code has a built-in terminal for running commands like `npm start` or `git commit`.

### Opening the Terminal

- **Menu:** View → Terminal
- **Keyboard:** Ctrl+` (backtick key, under Esc)

The terminal opens at the bottom of the window.

### Using the Terminal

You can run any command here:
```bash
npm start              # Start development server
git status             # Check git status
git add .              # Stage changes
git commit -m "..."    # Create commit
```

See [Making Commits](making-commits.md) and [Git for Beginners](git-for-beginners.md) for command details.

---

## Keyboard Shortcuts

### Essential Shortcuts

| Action | Mac | Windows |
|--------|-----|---------|
| **Save file** | Cmd+S | Ctrl+S |
| **Open file** | Cmd+P | Ctrl+P |
| **Find in file** | Cmd+F | Ctrl+F |
| **Find in all files** | Cmd+Shift+F | Ctrl+Shift+F |
| **Open terminal** | Ctrl+` | Ctrl+` |
| **Markdown preview** | Cmd+Shift+V | Ctrl+Shift+V |
| **Command palette** | Cmd+Shift+P | Ctrl+Shift+P |

### Command Palette

The command palette gives access to all VS Code features:
- **Cmd+Shift+P** (Mac) or **Ctrl+Shift+P** (Windows)
- Type what you want to do
- Example: Type "format" to format the current file

---

## Git Integration

VS Code has built-in git features. See the Source Control icon (🌿) in the sidebar.

### Viewing Changes

1. Click the Source Control icon
2. See list of changed files
3. Click a file to see what changed (diff view)

### Staging and Committing

1. Click the Source Control icon
2. Hover over files and click "+" to stage them
3. Type a commit message in the text box
4. Click the checkmark ✓ to commit
5. Click "..." → "Push" to upload to GitHub

See [Making Commits](making-commits.md) for detailed workflow.

---

## Tips and Tricks

### Auto-Save

Enable auto-save so you don't have to manually save:
1. **File → Auto Save** (Mac) or **File → Auto Save** (Windows)
2. Check the menu item
3. Files save automatically after a short delay

### Zen Mode

Hide everything except the editor for distraction-free writing:
- **View → Appearance → Zen Mode**
- Or: Cmd+K Z (Mac) / Ctrl+K Z (Windows)
- Press Esc twice to exit

### Split Editor

View two files side by side:
1. Open a file
2. Click the split editor icon (top right)
3. Or: Cmd+\ (Mac) / Ctrl+\ (Windows)

Useful for comparing files or copying content.

### Folding Sections

Collapse sections to focus on specific parts:
- Click the arrow next to line numbers
- Or: Cmd+Option+[ (Mac) / Ctrl+Shift+[ (Windows) to fold
- Or: Cmd+Option+] (Mac) / Ctrl+Shift+] (Windows) to unfold

---

## Working Locally vs. Online

### Advantages of Local Editing (VS Code)

✅ **Instant feedback** - See changes immediately with local dev server
✅ **Offline work** - Edit without internet connection
✅ **Batch operations** - Edit multiple files quickly
✅ **Advanced features** - Autocomplete, syntax checking, extensions
✅ **Faster** - No page reloads between edits

### Advantages of Online Editing (GitHub Web)

✅ **No installation** - Works in any browser
✅ **Any device** - Phone, tablet, or computer
✅ **No setup** - No git, no npm, no dependencies
✅ **Always latest** - No need to pull changes
✅ **Simpler** - Less to learn and maintain

**Both methods are valid!** Choose what works best for your workflow.

---

## Troubleshooting

### "VS Code won't open the folder"

**Problem:** You get an error when opening the folder.

**Solutions:**
- Make sure you cloned the repository first
- Check folder permissions
- Try opening VS Code as administrator (Windows)

### "I don't see my files in the sidebar"

**Problem:** The Explorer is empty or shows wrong files.

**Solutions:**
- Make sure you opened the correct folder (lowdo-dot-net)
- Click the Explorer icon (📁) in the sidebar
- File → Open Folder and select the right folder

### "Extensions won't install"

**Problem:** Extensions fail to install.

**Solutions:**
- Check your internet connection
- Restart VS Code
- Check for VS Code updates (Code → Check for Updates)

### "Terminal won't open"

**Problem:** Terminal doesn't appear when you try to open it.

**Solutions:**
- Try the keyboard shortcut: Ctrl+`
- View → Terminal
- Restart VS Code

---

## Next Steps

### If You Installed VS Code:

1. **[Git for Beginners](git-for-beginners.md)** - Clone the repository
2. **[Making Commits](making-commits.md)** - Save and publish changes
3. **[Viewing Changes Live](viewing-changes-live.md)** - Test locally

### If You're Sticking with Web Editing:

1. **[GitHub Web Editor](github-web-editor.md)** - Complete browser-based guide
2. **[Making Commits](making-commits.md)** - Web editor workflow (Method 1)
3. **[Using AI Assistants](using-ai-assistants.md)** - Get help without installation

---

## Quick Reference

### First Time Setup
1. Download VS Code from https://code.visualstudio.com/
2. Install it
3. Open the project folder (File → Open Folder)
4. Install extensions: Markdown All in One, YAML

### Common Tasks
- **Edit file:** Click it in Explorer or Cmd+P/Ctrl+P
- **Save:** Cmd+S / Ctrl+S
- **Preview markdown:** Click 📖 icon or Cmd+Shift+V / Ctrl+Shift+V
- **Open terminal:** Ctrl+`
- **Find text:** Cmd+F / Ctrl+F

### Remember
Installing VS Code is optional. You can edit the entire site in your web browser using GitHub's web editor!
