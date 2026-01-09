<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Complete VS Code and Netlify Workflow

### Initial Setup (One Time)

**1. Open your project in VS Code**
After cloning with `netlify clone`, navigate to the directory and open it:

```
cd ~/path/to/your-project
code .
```

This opens the entire project folder in VS Code.[^1]

**2. Open the integrated terminal**
Press `Ctrl+`` (Control + backtick) or go to View → Terminal. This terminal works exactly like your regular terminal but stays inside VS Code.[^8][^2]

### Daily Development Workflow

**3. Update your local repository**
Start each session by getting the latest changes from GitHub:[^2]

```
git checkout main
git pull origin main
```

This ensures you're starting with the most recent code.[^2]

**4. Create a feature branch**
Create a new branch for your changes:[^3][^2]

```
git checkout -b update-homepage
```

Replace `update-homepage` with a descriptive name for what you're working on. The `-b` flag creates the branch and checks it out in one command.[^3]

**5. Start local development server**
In the VS Code terminal, run:[^4]

```
netlify dev
```

This starts your local server. Leave this terminal tab running, and you can open a new terminal tab in VS Code by clicking the `+` icon.[^5][^1]

**6. Edit your code in VS Code**
Make changes to your files using VS Code's editor. Save files with `Cmd+S` (Mac) or `Ctrl+S` (Windows). Your local server will auto-refresh to show changes.[^6][^5]

**7. Check what files you changed**
In your terminal (not the one running `netlify dev`), run:

```
git status
```

This shows which files you've modified.[^7][^3]

**8. Stage your changes**
Add files to be committed:[^3][^7]

```
git add .
```

The `.` adds all changed files. To add specific files: `git add filename.html`.[^7]

**9. Commit your changes locally**
Save a checkpoint with a descriptive message:[^3]

```
git commit -m "Update homepage hero section and add new images"
```

Keep messages clear and descriptive. This saves changes only on your computer.[^8][^3]

**10. Repeat steps 6-9 as needed**
You can make multiple commits while working. Each commit creates a save point you can return to.[^3]

### Testing on Netlify (Deploy Preview)

**11. Push your branch to GitHub**
Send your feature branch to GitHub:[^9]

```
git push origin update-homepage
```

Netlify automatically detects this and creates a Deploy Preview (0 credits).[^10][^9]

**12. View your Deploy Preview**
Check your Netlify dashboard or the GitHub pull request to find the Deploy Preview URL. Test your changes in the real Netlify environment.[^11][^9]

**13. Make additional changes if needed**
If you need to fix something:

- Edit files in VS Code
- Run `git add .`
- Run `git commit -m "Fix navigation styling"`
- Run `git push origin update-homepage`

Each push updates the same Deploy Preview.[^11]

### Deploying to Production

**14. Merge to main branch**
When everything looks good, merge your changes:[^12]

```
git checkout main
git pull origin main
git merge update-homepage
```

This combines your feature branch into main.[^2]

**15. Push to production**
Deploy to your live site:[^12]

```
git push origin main
```

Netlify detects the push to main and automatically builds and deploys to production (15 credits).[^10][^12]

**16. Delete your feature branch (optional)**
Clean up after merging:[^3]

```
git branch -d update-homepage
```


### Quick Reference Commands

- **See all branches**: `git branch`
- **Switch branches**: `git checkout branch-name`
- **Stop netlify dev**: Press `Ctrl+C` in the terminal running it
- **View commit history**: `git log --oneline`
- **Discard changes to a file**: `git checkout -- filename.html`

This workflow keeps you working locally for free, uses Deploy Previews for testing (free), and only deploys to production when you're ready (15 credits per deploy).[^5][^9][^10]
<span style="display:none">[^13][^14][^15][^16]</span>

<div align="center">⁂</div>

[^1]: https://code.visualstudio.com/docs/terminal/basics

[^2]: https://gist.github.com/blackfalcon/8428401

[^3]: https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow

[^4]: https://docs.netlify.com/api-and-cli-guides/cli-guides/debug-with-vscode/

[^5]: https://docs.netlify.com/api-and-cli-guides/cli-guides/local-development/

[^6]: https://code.visualstudio.com/docs/sourcecontrol/overview

[^7]: https://graphite.com/guides/how-to-push-code-from-vscode-to-github

[^8]: https://graphite.com/guides/git-commit-vs-push

[^9]: https://docs.netlify.com/build/git-workflows/overview/

[^10]: https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/

[^11]: https://www.netlify.com/blog/guide-to-ci-cd-automation-using-webhooks/

[^12]: https://www.netlify.com/blog/enhance-your-development-workflow-with-continuous-deployment/

[^13]: https://stackoverflow.com/questions/63759337/how-to-enable-git-autocomplete-in-integrated-terminal-in-vscode

[^14]: https://code.visualstudio.com/docs/sourcecontrol/quickstart

[^15]: https://www.geeksforgeeks.org/git/how-to-integrate-git-bash-with-visual-studio-code/

[^16]: https://answers.netlify.com/t/vs-code-and-github-workflow/70487

