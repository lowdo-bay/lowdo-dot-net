# Editing Existing Entries

How to modify published content.

---

## Step 1: Find the File

Navigate to the entry folder:

```
entries/projects/casa-marianella/casa-marianella.md
```

Or:

```
entries/news/studio-expansion/studio-expansion.md
```

---

## Step 2: Open and Edit

Open the .md file in your editor and make changes:

- Edit frontmatter (title, date, categories)
- Edit content below the frontmatter
- Add/remove/replace images

---

## Step 3: Save and Publish

1. Save the file
2. Commit: `git add . && git commit -m "Update entry"`
3. Push: `git push`

---

## What You Can Edit

**Frontmatter:**
- title, subtitle, description
- date (changes sort order)
- categories (changes filters)
- draft status (hide/show)

**Content:**
- Project descriptions
- Markdown text
- Headings and formatting

**Images:**
- Replace images (keep same filename)
- Add new gallery images
- Remove images (delete files)

---

## Tips

- Test locally if possible
- Make one change at a time
- Write clear commit messages

---

## Next Steps

- [Hiding/Unpublishing](hiding-unpublishing.md)
- [Organizing Entries](organizing-entries.md)

