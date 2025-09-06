#!/usr/bin/env python3
"""
Fetch publications from PubMed for a given author query and write assets/publications.json.

Usage:
  python tools/fetch_pubmed.py "Stanfield BA"
"""
import json, sys, urllib.parse, urllib.request

def fetch_pubmed(author_query, retmax=200):
    term = urllib.parse.quote_plus(author_query)
    # Search for PMIDs
    esearch = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax={retmax}&term={term}"
    with urllib.request.urlopen(esearch) as r:
        data = json.loads(r.read().decode("utf-8"))
    idlist = data.get("esearchresult", {}).get("idlist", [])
    if not idlist: return []

    # Get summaries
    ids = ",".join(idlist)
    esum = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id={ids}"
    with urllib.request.urlopen(esum) as r:
        summ = json.loads(r.read().decode("utf-8"))

    out = []
    for pid in idlist:
        rec = summ.get("result", {}).get(pid, {})
        title = rec.get("title") or ""
        journal = rec.get("fulljournalname") or rec.get("source") or ""
        year = None
        try:
            year = int((rec.get("pubdate") or "")[:4])
        except Exception:
            pass
        # Authors
        authors = ", ".join([a.get("name") for a in rec.get("authors", []) if a.get("name")])
        # DOI
        doi = ""
        for idobj in rec.get("articleids", []):
            if idobj.get("idtype") == "doi":
                doi = idobj.get("value")
                break
        url = f"https://pubmed.ncbi.nlm.nih.gov/{pid}/"
        out.append({"title": title, "authors": authors, "journal": journal, "year": year, "doi": doi, "url": url})
    return out

def main():
    q = "Stanfield BA"
    if len(sys.argv) > 1:
        q = sys.argv[1]
    pubs = fetch_pubmed(q)
    with open("assets/publications.json", "w", encoding="utf-8") as f:
        json.dump(pubs, f, indent=2, ensure_ascii=False)
    print(f"Wrote {len(pubs)} records to assets/publications.json")

if __name__ == "__main__":
    main()
