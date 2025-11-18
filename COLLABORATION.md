# Dashboard Development Collaboration Guide

## Overview

This guide outlines the workflow for team members to collaborate on improving the four dashboards using Git branches and pull requests.

---

## Branch Structure Overview

```
develop (main)
    └── develop-dashboard (base for dashboard improvements)
            ├── person1/community-dashboard
            ├── person2/recycler-dashboard
            ├── person3/organization-dashboard
            └── person4/individual-dashboard
```

---

## STEP 1: Team Member Setup (Each person does this once)

### Each team member should:

```powershell
# 1. Clone/update the repository
git clone https://github.com/PrerikaP1331/scrapp-platform.git
cd scrapp-platform

# 2. Switch to develop-dashboard
git checkout develop-dashboard
git pull origin develop-dashboard

# 3. Create their dashboard branch (replace "person1" with their name/username)
git checkout -b person1/community-dashboard

# 4. Push their branch to remote
git push origin person1/community-dashboard

# 5. Verify their branch exists
git branch -a
```

---

## STEP 2: Dashboard Assignments

Assign each person to work on one dashboard:

| Person   | Branch Name                      | Dashboard                 |
| -------- | -------------------------------- | ------------------------- |
| Person 1 | `person1/community-dashboard`    | Community Admin Dashboard |
| Person 2 | `person2/recycler-dashboard`     | Recycler Dashboard        |
| Person 3 | `person3/organization-dashboard` | Organization Dashboard    |
| Person 4 | `person4/individual-dashboard`   | Individual/User Dashboard |

---

## STEP 3: Development Phase (Each person works independently)

### Each team member during development:

```powershell
# 1. Make sure you're on your branch
git checkout person1/community-dashboard

# 2. Pull latest changes from your branch
git pull origin person1/community-dashboard

# 3. Make your code changes (frontend & backend)

# 4. Commit your changes
git add .
git commit -m "feat: improve community dashboard UI"

# 5. Push to your branch
git push origin person1/community-dashboard

# 6. Repeat steps 3-5 as needed
```

---

## STEP 4: Merging to develop-dashboard (You do this as the coordinator)

### When a person completes their dashboard work:

```powershell
# 1. Switch to develop-dashboard
cd e:\scrapp\scrapp-platform
git checkout develop-dashboard
git pull origin develop-dashboard

# 2. Merge their branch into develop-dashboard
git merge person1/community-dashboard

# 3. Handle merge conflicts if any (see STEP 5)

# 4. Push the merged changes
git push origin develop-dashboard
```

---

## STEP 5: Handling Merge Conflicts

### If Git reports merge conflicts:

```powershell
# 1. Check conflicted files
git status

# 2. Open the conflicted files and manually resolve them
# Look for markers like:
# <<<<<<< HEAD
# your code
# =======
# their code
# >>>>>>> person1/community-dashboard

# 3. Keep the changes you want (usually combine both improvements)

# 4. Mark as resolved
git add <conflicted-file>

# 5. Complete the merge
git commit -m "Merge person1/community-dashboard with conflict resolution"
git push origin develop-dashboard
```

---

## STEP 6: Final Integration (After all 4 dashboards are complete)

### Merge develop-dashboard back to develop:

```powershell
# 1. Update both branches
git checkout develop
git pull origin develop

git checkout develop-dashboard
git pull origin develop-dashboard

# 2. Perform the final merge
git checkout develop
git merge develop-dashboard

# 3. Resolve any remaining conflicts

# 4. Push to develop
git push origin develop
```

---

## STEP 7: Cleanup (Optional, after merging to develop)

### Delete the feature branches:

```powershell
# 1. Locally delete completed branches
git branch -d person1/community-dashboard person2/recycler-dashboard person3/organization-dashboard person4/individual-dashboard

# 2. Delete from remote
git push origin --delete person1/community-dashboard person2/recycler-dashboard person3/organization-dashboard person4/individual-dashboard

# 3. Delete develop-dashboard if no longer needed
git branch -d develop-dashboard
git push origin --delete develop-dashboard
```

---

## Quick Reference: What Each File Change Maps To

For your team members to know which files to modify:

### Community Dashboard (person1):

- `client/src/pages/CommunityDashboard/CommunityDashboardHome.js`
- `server/controllers/communityController.js`
- `server/routes/communityRoutes.js`

### Recycler Dashboard (person2):

- `client/src/pages/RecyclerDashboard/RecyclerDashboardHome.js`
- `server/controllers/recyclerDashboardController.js`
- `server/routes/recyclerDashboardRoutes.js`

### Organization Dashboard (person3):

- `client/src/pages/OrganizationDashboard/OrganizationDashboardHome.js`
- `server/controllers/organisationController.js`
- `server/routes/organisationRoutes.js`

### Individual/User Dashboard (person4):

- `client/src/pages/Dashboard/DashboardHome.js`
- `server/controllers/userController.js`
- `server/routes/userRoutes.js`

---

## Tips for Success

✅ **Communicate** before starting - tell your team what you're changing
✅ **Keep branches updated** - pull frequently to avoid large conflicts
✅ **Small commits** - commit changes regularly, not all at once
✅ **Test locally** - verify everything works before pushing
✅ **Clear commit messages** - helps during conflict resolution
✅ **One feature per branch** - makes merging easier

---

## Common Git Commands Reference

```powershell
# Check current branch
git branch

# List all branches (local and remote)
git branch -a

# See branch history
git log --oneline

# See what changed in a branch
git diff develop person1/community-dashboard

# Abort a merge if it goes wrong
git merge --abort

# Check status of current changes
git status

# See unpushed commits
git log origin/person1/community-dashboard..person1/community-dashboard
```

---

## Troubleshooting

### "I accidentally committed to the wrong branch"

```powershell
git reset HEAD~1  # Undo the last commit
git stash         # Save your changes
git checkout correct-branch
git stash pop     # Apply your changes
git add .
git commit -m "correct commit message"
```

### "I have local changes but need to switch branches"

```powershell
git stash         # Save changes temporarily
git checkout other-branch
# ... do other work ...
git checkout your-branch
git stash pop     # Apply your changes back
```

### "My branch is behind develop-dashboard"

```powershell
git fetch origin
git merge origin/develop-dashboard
# Resolve conflicts if any
git push origin person1/community-dashboard
```

---

## Questions or Issues?

If you encounter any merge conflicts or Git issues, communicate with the team lead for assistance.
