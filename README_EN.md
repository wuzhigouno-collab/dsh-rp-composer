# TriComposer (dsh-rp-composer)

[中文 README](README.md)

A structured-input plugin for LLM roleplay on the DeepSeek Harness (DSH) web UI.

In RP conversations, a single player message typically mixes **dialogue**, **actions**, and **inner thoughts**. As unmarked free text, these components are easily misread by the model — NPCs "hear" what was only thought, actions get quoted as speech, or the model fills in player behavior that never happened. TriComposer splits the composer into three fill-in fields and assembles them into a tagged template before sending, eliminating component confusion at the source.

## Features

- **Three-field input**: dialogue / action / thought boxes; combine freely, empty fields are omitted
- **Template assembly**: action → `【…】`, dialogue → `“…”`, thought → `（…）` — directly compatible with RP input-parsing protocols (e.g. the Gent agent preset)
- **Two layouts**: Brief (horizontal single-line) / Detail (vertical multi-line textareas, larger visible area, Ctrl+Enter to send)
- **Collapsible**: folds into a slim title bar; layout & collapse state persist in localStorage
- **Zero-intrusion**: mounts on the official `conversation.input.dock` slot; the default composer stays untouched and other RP plugins (Agent RP, Portable Tavern) are unaffected
- **Standard pipeline**: send = `inputActions.setDraft()` + `submit()`, identical to typing manually — session logs, undo and regenerate all behave normally

## Screenshots

| Brief | Detail | Collapsed |
|---|---|---|
| ![brief](docs/images/brief.png) | ![detail](docs/images/detail.png) | ![collapsed](docs/images/collapsed.png) |

## Install

```bash
# From GitHub
dsh plugin --profile web add github:wuzhigouno-collab/dsh-rp-composer

# Or from a local checkout (linked; edits take effect on restart)
dsh plugin --profile web add /path/to/dsh-rp-composer
```

Restart the web app (`dsh web`), open any session, and the panel appears above the composer.

## Technical notes

- Client-only plugin: the Node half is an empty shell; the browser half loads via the `dsh.client` manifest
- UI mount: cordis `slots` service, `conversation.input.dock` (list-kind, session scope)
- Structure: DSH dual-face plugin layout (`dsh.plugin.json` + `cordis.patch.yml` bundle declaration + ModuleLoader-format client bundle), modeled after dsh-portable-tavern

## License

MIT (see LICENSE)
