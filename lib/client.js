window.__ModuleLoader__.load({ id: 'dsh-rp-composer', factory: (require) => { var module = { exports: {} }; var exports = module.exports;
"use strict";

const React = require("react");
const h = React.createElement;

// 模板组装：动作→【】，台词→“”，心理→（），只保留非空部分
function assemble(act, line, mind) {
  const parts = [];
  if (act.trim()) parts.push(`【${act.trim()}】`);
  if (line.trim()) parts.push(`“${line.trim()}”`);
  if (mind.trim()) parts.push(`（${mind.trim()}）`);
  return parts.join("");
}

const LS_KEY = "dsh-rp-composer-ui";
function loadUiState() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; }
}
function saveUiState(s) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {}
}

const FIELDS = [
  { key: "line", label: "台词", hint: "说出去的话，NPC 听得到" },
  { key: "act", label: "动作", hint: "做出的动作，NPC 看得到" },
  { key: "mind", label: "心理", hint: "内心想法，仅叙事者知道" }
];

const inputStyle = {
  flex: "1 1 0", minWidth: 0,
  padding: "6px 8px", borderRadius: "6px",
  border: "1px solid var(--border, #444)",
  background: "var(--background, transparent)",
  color: "inherit", fontSize: "13px", outline: "none",
  fontFamily: "inherit"
};

const btnStyle = {
  padding: "4px 10px", borderRadius: "6px",
  border: "1px solid var(--border, #555)",
  background: "transparent", color: "inherit",
  cursor: "pointer", fontSize: "12px", whiteSpace: "nowrap"
};

function TriComposer(props) {
  const ui = loadUiState();
  const [mode, setMode] = React.useState(ui.mode === "detail" ? "detail" : "brief");
  const [collapsed, setCollapsed] = React.useState(!!ui.collapsed);
  const [vals, setVals] = React.useState({ line: "", act: "", mind: "" });

  const setVal = (k) => (e) => setVals((v) => ({ ...v, [k]: e.target.value }));
  const switchMode = (m) => { setMode(m); saveUiState({ mode: m, collapsed }); };
  const toggleCollapsed = () => { const c = !collapsed; setCollapsed(c); saveUiState({ mode, collapsed: c }); };

  const send = () => {
    const text = assemble(vals.act, vals.line, vals.mind);
    if (!text) return;
    const ia = props && props.inputActions;
    if (ia && ia.setDraft && ia.submit) {
      ia.setDraft(text);
      ia.submit();
      setVals({ line: "", act: "", mind: "" });
    }
  };

  const wrapStyle = {
    marginBottom: "6px", borderRadius: "8px",
    border: "1px dashed var(--border, #555)",
    fontSize: "13px", overflow: "hidden"
  };

  const header = h("div", {
    style: {
      display: "flex", alignItems: "center", gap: "8px",
      padding: "4px 8px", fontSize: "12px", opacity: 0.85
    }
  },
    h("span", { style: { fontWeight: 600 } }, "三段输入"),
    h("span", { style: { opacity: 0.6 } }, "台词“” · 动作【】 · 心理（）"),
    h("div", { style: { marginLeft: "auto", display: "flex", gap: "6px" } },
      h("button", {
        style: { ...btnStyle, ...(mode === "brief" ? { background: "var(--primary, #4a6cf7)", color: "#fff", borderColor: "transparent" } : {}) },
        title: "横向单行排列，占空间小",
        onClick: () => switchMode("brief")
      }, "简要"),
      h("button", {
        style: { ...btnStyle, ...(mode === "detail" ? { background: "var(--primary, #4a6cf7)", color: "#fff", borderColor: "transparent" } : {}) },
        title: "纵向多行排列，可以看到更多内容",
        onClick: () => switchMode("detail")
      }, "详细"),
      h("button", { style: btnStyle, onClick: toggleCollapsed }, collapsed ? "展开" : "折叠")
    )
  );

  if (collapsed) return h("div", { style: wrapStyle }, header);

  const sendBtn = h("button", {
    style: {
      padding: "6px 16px", borderRadius: "6px", border: "none",
      background: "var(--primary, #4a6cf7)", color: "#fff",
      cursor: "pointer", whiteSpace: "nowrap", fontSize: "13px"
    },
    onClick: send
  }, "发送");

  if (mode === "detail") {
    // 纵向（详细）：三个多行文本框纵排，显示范围更大
    return h("div", { style: wrapStyle },
      header,
      h("div", { style: { display: "flex", flexDirection: "column", gap: "6px", padding: "0 8px 8px" } },
        FIELDS.map((f) =>
          h("div", { key: f.key, style: { display: "flex", flexDirection: "column", gap: "3px" } },
            h("span", { style: { fontSize: "12px", opacity: 0.7 } }, f.label + " · " + f.hint),
            h("textarea", {
              style: { ...inputStyle, resize: "vertical", minHeight: "52px", lineHeight: "1.5" },
              rows: 2,
              value: vals[f.key],
              placeholder: f.hint,
              onChange: setVal(f.key),
              onKeyDown: (e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) send(); }
            })
          )
        ),
        h("div", { style: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "8px" } },
          h("span", { style: { fontSize: "11px", opacity: 0.5 } }, "Ctrl+Enter 发送"),
          sendBtn
        )
      )
    );
  }

  // 横向（简要）：三个单行输入框横排
  return h("div", { style: wrapStyle },
    header,
    h("div", { style: { display: "flex", gap: "8px", alignItems: "center", padding: "0 8px 8px" } },
      FIELDS.map((f) =>
        h("label", { key: f.key, style: { display: "flex", alignItems: "center", gap: "6px", flex: "1 1 0", minWidth: 0 } },
          h("span", { style: { fontSize: "12px", opacity: 0.7, whiteSpace: "nowrap" } }, f.label),
          h("input", {
            style: inputStyle,
            value: vals[f.key],
            placeholder: f.hint,
            onChange: setVal(f.key),
            onKeyDown: (e) => { if (e.key === "Enter") send(); }
          })
        )
      ),
      sendBtn
    )
  );
}

module.exports = {
  inject: ["slots"],
  apply(ctx) {
    const slots = ctx.get("slots");
    if (!slots) return;
    slots.inject("conversation.input.dock", () =>
      slots.register(
        { name: "conversation.input.dock", id: "dsh-rp-composer", order: 10, label: "三段输入" },
        (props) => h(TriComposer, props)
      )
    );
  }
};

}});
