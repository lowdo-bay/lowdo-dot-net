# How to Update Site Information

Change site title, contact info, and social links.

---

## Overview

Basic site information is stored in `_data/settings.yaml`. You can update:
- Site title and description
- Contact email
- Social media links
- Site metadata

---

## Step 1: Open settings.yaml

Navigate to:
```
_data/settings.yaml
```

---

## Step 2: Find the Metadata Section

Look for fields near the top:

```yaml
# Site information
title: "LowDO"
description: "Low Design Office - Architecture and Design Studio based in Austin, Texas"
email: "lowdo@lowdo.net"
url: "https://lowdo.netlify.app"
```

---

## Step 3: Edit Values

Update the values in quotes:

```yaml
title: "LowDO"  # Site name (appears in header, browser tabs)
description: "Architecture and design studio"  # SEO description
email: "contact@lowdo.net"  # Contact email
```

---

## Step 4: Save and Publish

1. Save the file
2. Commit and push changes
3. Wait for rebuild (3-5 minutes)

---

## Next Steps

- [Changing Colors](changing-colors.md)
- [Settings Reference](settings-reference.md)
- [Making Commits](../05-tools-and-workflow/making-commits.md)

