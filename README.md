
# Stanfield Lab Site (v2)

- **New illustrative logo** (DNA helix + guinea pig + viral capsid) in `assets/stanfield-lab-logo.svg` and `assets/stanfield-lab-icon.svg`.
- **Auto-sync Publications** from PubMed using E-utilities.

## Auto-sync from PubMed
- Edit the search string in **`tools/fetch_pubmed.py`** (default: "Stanfield BA").
- Run locally: `python tools/fetch_pubmed.py "Stanfield BA"` then commit.
- Or enable the included **GitHub Action** at `.github/workflows/sync_pubmed.yml` (runs weekly; can be run on-demand).

## Deploy
Upload all files to your GitHub repo (replace existing) and commit.
