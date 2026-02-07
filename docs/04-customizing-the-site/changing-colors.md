# How to Change Site Colors

Edit theme colors without touching CSS code.

---

## Overview

The LowDO site uses a centralized color system stored in `_data/settings.yaml`. You can change all site colors by editing this one file—no CSS knowledge required!

---

## Step 1: Open settings.yaml

Navigate to:
```
_data/settings.yaml
```

Open it in your text editor (VS Code recommended).

---

## Step 2: Find the Colors Section

Look for the `colors:` section (usually near the top):

```yaml
colors:
  # Main colors
  background: "#ffffff"
  text: "#000000"
  accent: "#0000ff"
  
  # Additional colors
  background-alt: "#f5f5f5"
  border: "#cccccc"
  # ... more colors
```

---

## Step 3: Edit Color Values

Colors are specified as **hex codes** (e.g., `#ffffff`) or **color names** (e.g., `white`).

### Using Hex Codes

Hex codes start with `#` followed by 6 characters (0-9, A-F):

- `#ffffff` = White
- `#000000` = Black
- `#ff0000` = Red
- `#00ff00` = Green
- `#0000ff` = Blue

**Example change:**
```yaml
background: "#f0f0f0"  # Light gray instead of white
text: "#333333"        # Dark gray instead of black
accent: "#ff6600"      # Orange instead of blue
```

### Using Color Names

You can also use basic color names:

```yaml
background: "white"
text: "black"
accent: "blue"
```

**However**, hex codes give you more precise control.

---

## Step 4: Save and Publish

1. Save `settings.yaml`
2. Commit your changes with git
3. Push to GitHub
4. Wait 3-5 minutes for the site to rebuild

See [Making Commits](../05-tools-and-workflow/making-commits.md) for details.

---

## Available Color Variables

Here are the main color variables you can edit:

| Variable | What It Controls | Default |
|----------|-----------------|---------|
| `background` | Main page background | White |
| `text` | Body text color | Black |
| `accent` | Links, highlights, hover states | Blue |
| `background-alt` | Alternate background (sections) | Light gray |
| `border` | Grid lines, borders | Gray |
| `accent-hover` | Link hover color | Darker blue |

Check `settings.yaml` for the complete list (may vary based on site version).

---

## Common Color Schemes

### Dark Mode

```yaml
colors:
  background: "#1a1a1a"
  text: "#ffffff"
  accent: "#66ccff"
  background-alt: "#2a2a2a"
  border: "#444444"
```

### High Contrast

```yaml
colors:
  background: "#ffffff"
  text: "#000000"
  accent: "#0000ff"
  background-alt: "#f0f0f0"
  border: "#000000"
```

### Warm Neutrals

```yaml
colors:
  background: "#faf8f5"
  text: "#2b2520"
  accent: "#c17444"
  background-alt: "#f0ebe3"
  border: "#d4cfc7"
```

---

## Tips

**Finding Colors:**
- Use a color picker tool (Google "color picker")
- Use online palette generators (Coolors, Adobe Color)
- Copy hex codes from design references

**Testing:**
- Make small changes first
- Preview on the live site after deployment
- Check both light and dark areas of the site

**Accessibility:**
- Ensure sufficient contrast between text and background
- Use tools like WebAIM Contrast Checker
- Avoid pure red/green combinations (colorblind-friendly)

---

## Troubleshooting

**"Changes don't appear"**
- Wait 3-5 minutes for rebuild
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)
- Check that you saved `settings.yaml`

**"Site looks broken"**
- Check for typos in hex codes (must be exactly 6 characters)
- Make sure hex codes start with `#`
- Revert to previous values if needed (use git)

**"Not sure what a variable does"**
- Change it to a bright color (e.g., `#ff0000` red)
- Rebuild and see what turns red
- Change back to your desired color

---

## Advanced: CSS Variables

The colors in `settings.yaml` are converted to CSS custom properties:

```
--color-background
--color-text
--color-accent
```

If you're comfortable with CSS, you can edit `_includes/assets/css/base.css` directly for more control.

See [Editing CSS Basics](editing-css-basics.md) for details.

---

## Next Steps

- **[Updating Site Info](updating-site-info.md)** - Change site title, contact info
- **[Settings Reference](settings-reference.md)** - Complete guide to settings.yaml
- **[Making Commits](../05-tools-and-workflow/making-commits.md)** - Publish your changes

---

## Questions?

See [FAQ](../06-troubleshooting/faq.md) or ask a team member.
