# Where Should We Store Large Downloadable Files?

### A plain-English comparison for deciding how LowDO handles big files (Revit, DWG, PDF drawing sets, Rhino 3D models)

*Prepared for decision-makers. No technical background needed.*

---

## The short version (TL;DR)

- **Today, our website cannot accept large files at all.** The current upload tool fails on
  anything bigger than about **4.4 MB** — far smaller than a typical Revit model, DWG set, or
  PDF drawing package.
- **Even if we could, we shouldn't store them the way we do now.** Every uploaded file is
  saved *inside the website's source code*, which has already grown to **4.2 GB**. This is
  past the size the platform recommends and it slowly makes the site harder and slower to
  publish.
- **We have two good ways forward**, and because we already pay for Netlify, one of them
  needs **no new account or vendor**.
- **Our recommendation: start with Netlify Blobs** (no new account, fits our current plan for
  moderate download traffic), and keep **Cloudflare R2** in our back pocket if downloads ever
  become heavy. Details below.

---

## 1. What's the problem with how we do it today?

When someone uploads a file through our website's admin page, that file gets tucked **inside
the website's own source code** (the "repository" — think of it as the master folder that
holds the entire website). Nothing is stored separately; it all piles into one place.

This causes three real problems:

### Problem 1 — Large files simply don't work
The upload tool can only handle files up to roughly **4.4 MB**. For context:

| File type | Typical size | Works today? |
|---|---|---|
| Small PDF | 1–5 MB | ✅ Sometimes |
| PDF drawing set | 20–100 MB | ❌ No |
| DWG architectural drawing | 5–50 MB | ❌ Usually no |
| Revit model | 50–300 MB | ❌ No |
| Rhino 3D model | 50–500 MB+ | ❌ No |

So the very files you want to offer — the architecture deliverables — are exactly the ones
the current system rejects.

> **Why is the cap 4.4 MB specifically?** It's not a setting we chose — it's a hard limit
> baked into the technology underneath our site, and it comes from two things stacking up:
>
> 1. **Netlify's 6 MB ceiling.** When a file is uploaded, it passes through a small Netlify
>    program (a "serverless function") on its way to storage. Netlify caps the amount of data
>    that program can receive in one go at **6 MB**, and that cap **cannot be raised** — it's
>    inherited from Amazon's cloud, which Netlify runs on. Think of it as a doorway with a
>    fixed width: anything wider simply won't fit through.
> 2. **Files get ~33% bigger in transit.** To send a file safely through that doorway, it's
>    first converted into a text-only format (called "base64"). That conversion inflates the
>    file by about a third — so a 4.5 MB file effectively becomes ~6 MB once it's being sent.
>
> Put those together: `6 MB doorway ÷ 1.33 inflation ≈ 4.4 MB` of actual file. That's the
> real-world limit. (Worth noting: the larger platform, GitHub, would actually allow files up
> to 100 MB — but our files can't even reach it, because they're stopped at Netlify's 6 MB
> doorway first.)
>
> **The takeaway:** raising the cap isn't a matter of flipping a switch. It requires changing
> *how* files get to storage — which is exactly what the two options below do.

### Problem 2 — The website's source code is getting bloated
The master folder is now **4.2 GB**, and its change-history alone is **1.3 GB**. The platform
(GitHub) recommends keeping this under **1 GB**. We're already several times over that, mostly
from large images. Adding 100 MB+ design files would make this dramatically worse, and unlike
normal files, **these never shrink** — every version ever uploaded is kept forever.

> **Why do these files "never shrink"?** The master folder isn't just storage — it's a system
> designed to track the *entire history* of the project so we can always see what changed and
> undo mistakes. That's great for code, but it means that when you replace a 100 MB file with a
> new version, **both copies are kept forever** — the old one is never thrown away. Upload a
> file ten times and the project quietly carries all ten. With big design files, that adds up
> fast and can never be cleaned up without expensive, risky surgery on the project's history.
>
> **Why does GitHub recommend staying under 1 GB?** Because the whole master folder has to be
> copied in full to every computer and every service that works on the site (including
> Netlify, every time it publishes). The bigger it gets, the slower and more fragile that
> copying becomes — which is exactly the problem in #3 below.

### Problem 3 — It slows down publishing the website (build time)
Every time we publish an update, the platform has to process **everything** in that master
folder from scratch — including re-checking and re-optimizing all those heavy files. The
bigger the folder, the longer each publish takes and the more of our paid usage it consumes.
**This is the "reduced build time" benefit of moving files out** — see Section 5.

> **Why does publishing re-process everything?** When we update the site, Netlify doesn't just
> tweak the one thing that changed — it **rebuilds the whole website from the master folder
> from scratch**, on a fresh machine, every single time. (This is what makes the site reliable:
> there are no leftover bits from previous builds to cause surprises.) But it also means the
> machine has to first **download the entire 4.2 GB folder**, then **examine and re-optimize
> every image and file** in it. The heavier the folder, the longer every publish takes — even
> if all you changed was a sentence of text. Big files we'll never display on the site (like
> Revit models) would still have to be hauled along for the ride on every publish.

> **In one sentence:** *Storing big files inside the website's code is the wrong tool for the
> job — it can't handle the sizes we need, it bloats the project, and it slows down every
> update.*

---

## 2. The three options, side by side

| | **Current setup** (files in the code) | **Netlify Blobs** | **Cloudflare R2** |
|---|---|---|---|
| **Max file size** | ~4.4 MB ❌ | 5 GB ✅ | 5 GB+ ✅ |
| **Handles Revit/DWG/Rhino?** | No ❌ | Yes ✅ | Yes ✅ |
| **Needs a new account/vendor?** | No | **No** ✅ (we already pay Netlify) | Yes (free to start) |
| **Bloats the website's code?** | Yes, badly ❌ | No ✅ | No ✅ |
| **Slows down publishing?** | Yes ❌ | No ✅ | No ✅ |
| **How files are delivered** | From the website | Through our website's behind-the-scenes code | From a fast global network (built-in) ✅ |
| **Download cost** | "Free" but unsustainable | Uses our monthly Netlify credits | **No download fees at all** ✅ |
| **Setup effort** | — | Moderate | Moderate–High |
| **Best when** | (not viable) | Low–moderate downloads | Heavy downloads / lots of traffic |

A quick note on the two new options: both store files **outside** the website's code and just
keep a small "link" to each file. That single change fixes the bloat and the build-time
problems no matter which one we pick.

---

## 3. How much can we get from our CURRENT Netlify plan?

We're on the **Netlify Pro plan ($20/month)**, which includes **3,000 "credits" per month.**
Credits are Netlify's catch-all unit — the same pool covers website traffic, publishing, and
(if we use it) Netlify Blobs.

**The key thing to understand:** with Netlify Blobs, **storing** files is essentially free —
**the credits get used up when people *download* the files.** The bill is driven by traffic,
not by how much we keep on the shelf.

> **Why are downloads what cost us, not storage?** A file just sitting in storage isn't doing
> any work, so Netlify barely charges for it. But every time someone *downloads* a file, two
> things happen that Netlify meters: (1) the file's data has to travel out across the internet
> to that person ("bandwidth"), and (2) — because Netlify Blobs has no public link of its own —
> one of our small Netlify programs has to wake up, fetch the file, and hand it over
> ("compute"). So a single download is billed *twice*. That's also **why Cloudflare R2 is
> cheaper for heavy traffic** (Section 4): R2 hands files to the public directly, with no
> per-download fee and no program needed in the middle.

Rough rule of thumb: **downloading one 100 MB file uses about 2 credits.**

| If the public downloads… | Credits used | Inside our 3,000/month? |
|---|---|---|
| ~100 large files/month | ~200 | ✅ Plenty of room |
| ~500 large files/month | ~1,000 | ✅ Comfortable |
| ~1,000 large files/month | ~2,000 | ✅ Workable |
| ~1,500 large files/month | ~3,000 | ⚠️ Uses the entire plan |
| ~3,000 large files/month | ~6,000 | ❌ ~$20/month in overage |

Two important caveats:
- These credits are **shared** with normal website traffic and publishing, so the real
  ceiling for downloads is a bit lower than the table suggests.
- Going over isn't a disaster — extra credits are cheap (about **$10 for 1,500 more**) and
  unused top-ups roll over.

**For our expected "moderate" download volume, Netlify Blobs fits comfortably within the plan
we already pay for.** If downloads grew into the many-hundreds-to-thousands per month, the
math would start favoring Cloudflare R2 (next section).

---

## 4. Why Cloudflare R2 is the strong alternative

Cloudflare R2 is purpose-built for exactly this — storing files and serving them to the public
through a fast global network. Its standout feature: **it charges nothing for downloads
("zero egress fees").**

- **Storage** is cheap (about **$0.015 per GB per month** — roughly **$1.50/month for 100 GB**
  of design files).
- **Downloads are free**, no matter how popular a file gets. With Netlify Blobs, a file that
  goes viral costs us credits every time; with R2, it costs nothing extra.
- It includes a **built-in fast delivery network**, so downloads are quick worldwide.

> **Why can Cloudflare give away downloads for free when others charge?** Most providers
> (including Amazon, whom Netlify relies on) treat data leaving their network as a billable
> service — it's a long-standing industry norm and a major profit center. Cloudflare built its
> business as a global delivery network first, so it already operates the "pipes" at massive
> scale and chose to **not charge for data going out** as a way to win customers away from
> Amazon. It's a deliberate competitive strategy, not a gimmick — and it happens to be exactly
> what benefits a site that hands large files to the public.

**The one real downside:** it's a **separate account/vendor** to set up and manage — which is
precisely the convenience we'd be giving up versus Netlify Blobs.

> **Why is "a separate vendor" actually a downside?** It's not about difficulty — it's about
> overhead: another company to sign a contract with, another bill and login to manage, another
> account someone has to own if a team member leaves, and another set of credentials to keep
> secure. For a small team, "one less vendor" has real day-to-day value, which is why the
> no-new-account nature of Netlify Blobs carries weight in the recommendation.

---

## 5. The hidden bonus: faster, cheaper website publishing

This benefits us **even if no one ever downloads a single file.**

Right now, every time we publish a change to the website, Netlify rebuilds the whole thing
from the master folder — and that folder is heavy with large files it has to process every
time. Moving big files **out** of the code means:

- **Faster publishing** — less to process, so updates go live sooner.
- **Lower usage** — publishing itself consumes credits; a leaner project costs less to publish.
- **A healthier project long-term** — the code stays small and manageable instead of growing
  without limit. (Today: 4.2 GB and climbing. Target: keep it lean.)

In short, getting big files out of the code is good housekeeping that pays off on **every
single update**, separate from any download savings.

---

## 6. Recommendation

**Start with Netlify Blobs.**

1. **No new vendor or account** — it's part of the Netlify service we already pay for, which
   keeps things simple for the team and for procurement.
2. **It fits our current plan** for the moderate download volume we expect — large files
   become possible without a new monthly bill.
3. **It immediately fixes the bloat and slow-publishing problems** by moving files out of the
   website's code.

**Keep Cloudflare R2 as the upgrade path.** If download traffic grows beyond roughly a
thousand-plus large downloads a month — or if we simply want the most predictable, lowest cost
at scale — R2's free downloads make it the better long-term home. The good news: both options
use the same underlying approach, so a later switch is straightforward.

> **Why start with one and keep the other in reserve, instead of just picking the "best" one
> now?** Because the cheapest option depends entirely on something we can't yet measure: how
> often the public will actually download these files. Committing to R2 now means taking on a
> new vendor for a problem we may never have; committing to Blobs forever risks rising credit
> costs if downloads take off. Starting with Blobs lets us solve the urgent problem (we can't
> handle large files at all) with zero new overhead, **watch the real download numbers**, and
> only take on R2 if and when the traffic justifies it.
>
> **Why is switching later "straightforward"?** Both options work the same way under the hood:
> files live outside the website's code, and each project page simply holds a *link* to where
> its file lives. Changing storage providers means moving the files and updating those links —
> a contained, mechanical job — rather than rebuilding how the whole site works. We're not
> locking ourselves in.

**Either way, one thing is certain:** we should stop storing large files inside the website's
code. It can't handle the file sizes our work requires, it's bloating the project, and it
slows down everything we publish.

---

## 7. An important caveat: the original "drag-and-drop" idea

When the website was first designed, a core goal was simplicity: you could **drag an image
file straight into a project's folder**, and the site would automatically pick it up and
display it — no special tools required. That principle shaped a lot of how the site was built.

In practice, the site has since evolved. **Day-to-day editing and adding projects and files
now happens through the admin page**, not by dropping files into folders. The admin page has
become the main way we manage content.

The caveat to be aware of: **moving files to a separate storage service (Netlify Blobs or
Cloudflare R2) means the old drag-and-drop method will no longer work for those large files.**

> **Why won't drag-and-drop work anymore?** Drag-and-drop relied on the files living *inside
> the website's own folder* — that's the very thing we're deliberately moving away from to fix
> the size, bloat, and build-time problems. Once a file lives in a separate storage service, it
> isn't in that folder at all, so there's nothing to drag it into. The **admin page becomes the
> only way to add these large files** — which is consistent with how the team already works
> today, but it does formally close the door on the original drag-and-drop workflow for them.

This isn't a reason to avoid the change — it simply makes official a shift that has already
happened in practice. Smaller images can continue to work as they do today; this caveat
applies specifically to the large files we're moving to separate storage.

---

## 8. What would happen next (high level)

Whichever option is approved, the work involves three pieces — shared across both choices:

1. **Update the upload tool** so the admin page can accept large files and send them to the
   new storage location (instead of cramming them into the code). *This is needed regardless
   of which option we pick, because today's tool caps out at ~4.4 MB.*
2. **Connect the storage** (turn on Netlify Blobs, or create the R2 account/bucket).
3. **Update the website** so each project page links to its files in their new home.

We can scope and estimate this once a direction is chosen.

---

### A few open questions to finalize the plan

- **Should downloads be public, or gated** (e.g. require an email, like the current Toolkit
  section)? This affects the setup.
- **Do we need to migrate existing files**, or only handle new uploads going forward?
- **Is there a budget ceiling** we should design around (to decide how much headroom to leave
  in the Netlify plan)?

---

*Figures reflect Netlify and Cloudflare pricing as of mid-2026 and our current repository
size at the time of writing. Credit and pricing rates can change; treat the dollar figures as
close estimates for planning.*
