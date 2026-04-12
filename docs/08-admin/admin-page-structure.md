# Admin Page Structure

```
┌──────────────────────────────────────────────────────────────────────────┐
│ HEADER (.admin-header) [sticky]                                          │
│  LowDO Admin                              [changes] [Save] [Logout]      │
├──────────────────────────────────────────────────────────────────────────┤
│ TOOLBAR (.admin-toolbar) [sticky]                                        │
│  grid: 2fr | 8fr                    | 2fr   | 2fr   | 4fr    | 2fr      │
│  ─────────────────────────────────────────────────────────────────────   │
│  [STATUS▾] [Search_____________________________] [Manage  ] [Manage ] …  │
│            [ALL TYPES▾] [ALL CATEGORIES▾      ] [Labels  ] [Collabs] …  │
│                                                            …[N selected] │
│                                                            …[Bulk Actn]  │
│                                                                  [+New]  │
├──────────────────────────────────────────────────────────────────────────┤
│ TABLE HEADER (<thead>) [sticky]                                          │
│  □  Draft  Title                    Type    Categories  Date   Actions   │
├──────────────────────────────────────────────────────────────────────────┤
│ TABLE BODY (<tbody>)  [scrolls]                                          │
│  □   ●    Title                     TYPE    [TAG][TAG]  DATE  [Edit][×]  │
│  □   ●    Title                     TYPE    [TAG]        DATE  [Edit][×]  │
│  …                                                                       │
└──────────────────────────────────────────────────────────────────────────┘

                    ┌─ EDIT PANEL (.edit-panel) [fixed, right side] ─┐
                    │ Edit Entry                               [×]   │
                    ├────────────────────────────────────────────────┤
                    │ IDENTITY                                        │
                    │   Slug [___________]                           │
                    │   Type [PROJECT ▾] [Change]                    │
                    │   [✓] Draft                                    │
                    ├────────────────────────────────────────────────┤
                    │ CONTENT                                         │
                    │   Title [___________]                          │
                    │   Subtitle [___________]                       │
                    │   Description [___________]                    │
                    │   Date [___________]                           │
                    ├────────────────────────────────────────────────┤
                    │ METADATA                                        │
                    │   Categories [TAG][TAG] [+ add...]             │
                    │   Link [___________]                           │
                    │   Position [___]                               │
                    │   Year* [___________]                          │
                    │   Location* [___________]                      │
                    │   Status* [___________]                        │
                    ├────────────────────────────────────────────────┤
                    │ HOMEPAGE*                                       │
                    │   [✓] Featured on homepage                     │
                    │   Featured Position [___]                      │
                    ├────────────────────────────────────────────────┤
                    │ BODY (Markdown)                    [Preview]   │
                    │   [textarea                               ]    │
                    ├────────────────────────────────────────────────┤
                    │ COLLABORATORS*                                  │
                    │   [Name___] [Role___] [×]                      │
                    │   [+ Add Collaborator]                         │
                    ├────────────────────────────────────────────────┤
                    │ RELATED PROJECTS†                               │
                    │   [slug-tag][×] [type slug...]                 │
                    ├────────────────────────────────────────────────┤
                    │              [Apply Changes] [Cancel]          │
                    └────────────────────────────────────────────────┘

* project-only sections/fields
† non-project-only

MODALS (overlays):
  - Bulk Actions modal     — [+ Add Category] [-Remove Category] tabs,
                             category input + suggestions, Apply/Cancel
  - Manage Labels modal    — rename categories / types (tabs)
  - Delete Confirm modal   — confirm entry deletion
  - Save Overlay           — full-screen "Saving…" status
```
