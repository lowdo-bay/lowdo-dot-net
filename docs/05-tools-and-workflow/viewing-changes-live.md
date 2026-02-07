# Viewing Changes Live

How to see your changes on the live website.

---

## After You Push

When you `git push` your changes:

1. **GitHub receives your changes** (instant)
2. **Netlify detects the update** (few seconds)
3. **Site rebuilds** (3-5 minutes)
4. **Live site updates** (automatic)

---

## Checking Deployment Status

Visit: https://app.netlify.com/

Look for your site and check the "Deploys" tab.

**Statuses:**
- 🟢 Published - Live on the site
- 🟡 Building - In progress
- 🔴 Failed - Something went wrong

---

## Viewing the Live Site

Visit: https://lowdo.netlify.app

Hard refresh to see changes: Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)

---

## Pull Request Previews

If you create a pull request on GitHub, Netlify generates a preview URL. This lets you test changes before merging to main.

---

## Troubleshooting

**"Changes don't appear"**
- Wait full 3-5 minutes
- Hard refresh browser
- Check deployment status

**"Build failed"**
- Check Netlify deploy logs
- Look for error messages
- Ask for help

---

## Next Steps

- [Making Commits](making-commits.md)
- [Common Issues](../06-troubleshooting/common-issues.md)

