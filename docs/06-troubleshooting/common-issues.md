# Common Issues

Solutions to frequent problems.

---

## "My entry doesn't appear in the index"

**Check:**
1. Is `draft: false`? (not `draft: true`)
2. Do the folder and .md file names match?
3. Is the date in correct format (YYYY-MM-DD)?
4. Did you wait 3-5 minutes for the build?

**Fix:**
- Set `draft: false`
- Rename folder or file to match
- Fix date format
- Wait for deployment to complete

---

## "Entry appears but looks wrong"

**Check:**
1. Is frontmatter formatted correctly?
2. Are quotes in the right places?
3. Is indentation consistent (2 spaces)?

**Fix:**
- Validate YAML: https://www.yamllint.com/
- Check examples in this documentation
- Fix indentation and quotes

---

## "Changes don't show up on live site"

**Check:**
1. Did you commit and push?
2. Did you wait 3-5 minutes?
3. Did the build succeed?

**Fix:**
- Run `git push`
- Wait full 3-5 minutes
- Check Netlify deploy status
- Hard refresh browser (Cmd+Shift+R)

---

## "I broke something"

**Fix:**
1. Find the last working commit: `git log`
2. Revert: `git revert HEAD`
3. Push: `git push`
4. Or ask for help!

---

## Next Steps

- [Image Problems](image-problems.md)
- [FAQ](faq.md)

