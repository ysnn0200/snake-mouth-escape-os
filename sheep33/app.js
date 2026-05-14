const els = {
  viewport: document.getElementById("viewport"),
  surface: document.getElementById("surface"),
  projectSelect: document.getElementById("projectSelect"),
  addProjectBtn: document.getElementById("addProjectBtn"),
  deleteProjectBtn: document.getElementById("deleteProjectBtn"),
  uploadBtn: document.getElementById("uploadBtn"),
  fileInput: document.getElementById("fileInput"),
  textBtn: document.getElementById("textBtn"),
  emojiBtn: document.getElementById("emojiBtn"),
  emojiPopover: document.getElementById("emojiPopover"),
  emojiTabs: document.getElementById("emojiTabs"),
  emojiGrid: document.getElementById("emojiGrid"),
  emojiPrevBtn: document.getElementById("emojiPrevBtn"),
  emojiNextBtn: document.getElementById("emojiNextBtn"),
  emojiPageLabel: document.getElementById("emojiPageLabel"),
  lineBtn: document.getElementById("lineBtn"),
  lineOptions: document.getElementById("lineOptions"),
  eraserBtn: document.getElementById("eraserBtn"),
  colorStrip: document.getElementById("colorStrip"),
  textOptions: document.getElementById("textOptions"),
  textFontSelect: document.getElementById("textFontSelect"),
  textColorStrip: document.getElementById("textColorStrip"),
  addTextFromOptionsBtn: document.getElementById("addTextFromOptionsBtn"),
  linePreviewPath: document.getElementById("linePreviewPath"),
  themeBtn: document.getElementById("themeBtn"),
  undoBtn: document.getElementById("undoBtn"),
  zoomOutBtn: document.getElementById("zoomOutBtn"),
  zoomInBtn: document.getElementById("zoomInBtn"),
  zoomLabel: document.getElementById("zoomLabel"),
  homeBtn: document.getElementById("homeBtn"),
  locateBtn: document.getElementById("locateBtn"),
  accountBtn: document.getElementById("accountBtn"),
  accountPanel: document.getElementById("accountPanel"),
  accountCloseBtn: document.getElementById("accountCloseBtn"),
  accountSubmitBtn: document.getElementById("accountSubmitBtn"),
  sendCodeBtn: document.getElementById("sendCodeBtn"),
  deleteBtn: document.getElementById("deleteBtn"),
  clearBtn: document.getElementById("clearBtn"),
  appDialogLayer: document.getElementById("appDialogLayer"),
  appDialogTitle: document.getElementById("appDialogTitle"),
  appDialogMessage: document.getElementById("appDialogMessage"),
  appDialogInput: document.getElementById("appDialogInput"),
  appDialogCloseBtn: document.getElementById("appDialogCloseBtn"),
  appDialogCancelBtn: document.getElementById("appDialogCancelBtn"),
  appDialogConfirmBtn: document.getElementById("appDialogConfirmBtn"),
  connectionDeleteBtn: document.getElementById("connectionDeleteBtn"),
  statusText: document.getElementById("statusText"),
  statusIcon: document.getElementById("statusIcon"),
  template: document.getElementById("itemTemplate")
};

const DB_NAME = "lan-infinite-canvas";
const STORE_NAME = "canvas";
const FILE_RECORD = "files";
const STATE_RECORD = "state";
const MAX_FILE_BYTES = 300 * 1024 * 1024;
const DEFAULT_PROJECT_ID = "default";
const STRAIGHTEN_HOLD_MS = 620;
const EMOJI_PAGE_SIZE = 36;

const state = {
  panX: window.innerWidth / 2,
  panY: window.innerHeight / 2,
  zoom: 1,
  projects: [{ id: DEFAULT_PROJECT_ID, name: "默认项目" }],
  currentProjectId: DEFAULT_PROJECT_ID,
  items: [],
  strokes: [],
  connections: [],
  selectedId: null,
  selectedStrokeId: null,
  selectedConnectionId: null,
  theme: "light",
  activeTool: "select",
  activeColor: "#0f5bd7",
  activeTextColor: "#16181d",
  activeTextFont: "Microsoft YaHei, PingFang SC, Segoe UI, Arial, sans-serif",
  linkSourceId: null,
  emojiPage: 0,
  emojiCategory: "表情",
  drag: null,
  drawing: null,
  connecting: null,
  erasing: null,
  history: [],
  spaceDown: false,
  db: null
};

const emojiLibrary = [
  "😀","😁","😂","🤣","😊","😍","😘","😎","🤩","🥳","😇","🙂","🙃","😉","😌","😋","😜","🤪",
  "😝","🤑","🤗","🤭","🫢","🫡","🤔","🤨","😐","😑","😶","🫠","😏","😒","🙄","😬","😮‍💨","🤥",
  "😴","🤤","😪","😵","🤯","🥴","😭","🥺","😢","😡","🤬","😱","😨","😰","😅","😓","😤","😮",
  "👍","👎","👏","🙌","👐","🤲","🙏","🤝","💪","🫶","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘",
  "👋","🤚","🖐️","✋","🖖","👉","👈","👆","👇","☝️","✍️","💅","👀","👁️","🧠","🫀","🫁","🦷",
  "❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","💝",
  "🔥","✨","⭐","🌟","💫","⚡","💥","💯","💢","💨","💦","💤","🎉","🎊","🎈","🎁","🏆","🥇",
  "✅","❌","⚠️","❗","❓","💡","📌","📍","📝","📎","📁","📂","📅","⏰","🔒","🔓","🔔","📣",
  "🚀","🛠️","⚙️","🧩","🎯","📈","📉","💎","💰","🧲","🪄","🔍","🔗","🧪","🧬","🗂️","🧾","📊",
  "☕","🍵","🍺","🍻","🍷","🍰","🍕","🍔","🍟","🍎","🍓","🍉","🌶️","🍭","🍫","🥤","🥢","🍽️",
  "☀️","🌙","🌈","☁️","🌧️","⛈️","❄️","🌊","🌪️","🌱","🌿","🍀","🌸","🌻","🌹","🌵","🌍","🪐",
  "🐏","🐑","🐱","🐶","🐼","🐧","🦊","🐸","🐵","🦄","🐝","🦋","🐢","🐳","🐙","🦕","🦖","🐉",
  "🚗","🚕","🚌","🚲","✈️","🚁","🚄","🚢","🏠","🏢","🏫","🏥","🏖️","⛰️","🗽","🧭","🗺️","🧳"
];

emojiLibrary.push(
  "😄","😃","😆","😅","🙂‍↕️","🙂‍↔️","😙","😚","☺️","🥰","😛","😗","🤓","🧐","🥸","😈","👿","👻",
  "💀","☠️","🤖","👽","👾","🤡","💩","🙈","🙉","🙊","💋","💌","💟","☮️","✝️","☪️","🕉️","☸️",
  "✡️","🔯","🕎","☯️","☦️","🛐","⛎","♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒",
  "♓","🆔","⚛️","🉑","☢️","☣️","📴","📳","🈶","🈚","🈸","🈺","🈷️","✴️","🆚","💮","🉐","㊙️",
  "㊗️","🈴","🈵","🈹","🈲","🅰️","🅱️","🆎","🆑","🅾️","🆘","⛔","📛","🚫","💯","💢","♨️","🚷",
  "🚯","🚳","🚱","🔞","📵","🚭","❕","❔","‼️","⁉️","🔅","🔆","〽️","⚜️","🔱","⚕️","♻️","✅",
  "🈯","💹","❇️","✳️","❎","🌐","💠","Ⓜ️","🌀","💤","🏧","🚾","♿","🅿️","🛗","🈳","🈂️","🛂",
  "🛃","🛄","🛅","🚹","🚺","🚼","⚧️","🚻","🚮","🎦","📶","🈁","🔣","ℹ️","🔤","🔡","🔠","🆖",
  "🆗","🆙","🆒","🆕","🆓","0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟","🔢","▶️",
  "⏸️","⏯️","⏹️","⏺️","⏭️","⏮️","⏩","⏪","⏫","⏬","◀️","🔼","🔽","➡️","⬅️","⬆️","⬇️","↗️",
  "↘️","↙️","↖️","↕️","↔️","↪️","↩️","⤴️","⤵️","🔀","🔁","🔂","🔄","🔃","🎵","🎶","➕","➖",
  "➗","✖️","🟰","♾️","💲","💱","™️","©️","®️","〰️","➰","➿","🔚","🔙","🔛","🔝","🔜","✔️",
  "☑️","🔘","🔴","🟠","🟡","🟢","🔵","🟣","⚫","⚪","🟤","🔺","🔻","🔸","🔹","🔶","🔷","🔳",
  "🔲","▪️","▫️","◾","◽","◼️","◻️","🟥","🟧","🟨","🟩","🟦","🟪","⬛","⬜","🟫","🔈","🔇",
  "🔉","🔊","🔔","🔕","📣","📢","💬","💭","🗯️","♠️","♣️","♥️","♦️","🃏","🎴","🀄","🕐","🕑",
  "🕒","🕓","🕔","🕕","🕖","🕗","🕘","🕙","🕚","🕛","🧿","🪬","🪩","🪅","🪆","🧸","🪀","🪁"
);

function emojiRange(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => String.fromCodePoint(start + index));
}

function uniqueEmoji(list) {
  return [...new Set(list.filter(Boolean))];
}

const emojiCategories = {
  表情: uniqueEmoji([
    ...emojiLibrary.slice(0, 72),
    ...emojiRange(0x1F600, 0x1F64F)
  ]),
  人物: uniqueEmoji([
    "👶","🧒","👦","👧","🧑","👨","👩","🧔","👱","👴","👵","🙍","🙎","🙅","🙆","💁","🙋","🧏","🙇","🤦","🤷",
    ...emojiRange(0x1F466, 0x1F487),
    ...emojiRange(0x1F9D1, 0x1F9DD)
  ]),
  动物: uniqueEmoji([
    "🐏","🐑","🐱","🐶","🐼","🐧","🦊","🐸","🐵","🦄","🐝","🦋","🐢","🐳","🐙","🦕","🦖","🐉",
    ...emojiRange(0x1F400, 0x1F43F),
    ...emojiRange(0x1F980, 0x1F9AE)
  ]),
  食物: uniqueEmoji([
    "☕","🍵","🍺","🍻","🍷","🍰","🍕","🍔","🍟","🍎","🍓","🍉","🌶️","🍭","🍫","🥤","🥢","🍽️",
    ...emojiRange(0x1F32D, 0x1F37F),
    ...emojiRange(0x1F950, 0x1F96F)
  ]),
  物品: uniqueEmoji([
    "📱","💻","⌨️","🖥️","🖨️","🖱️","💽","💾","💿","📷","🎥","📞","☎️","📺","📻","⏰","⌚","💡","🔦","🕯️",
    ...emojiRange(0x1F4A0, 0x1F4FF),
    ...emojiRange(0x1F9F0, 0x1F9FF)
  ]),
  建筑: uniqueEmoji([
    "🏠","🏡","🏢","🏣","🏤","🏥","🏦","🏨","🏩","🏪","🏫","🏬","🏭","🏯","🏰","💒","🗼","🗽","⛪","🕌",
    ...emojiRange(0x1F3E0, 0x1F3F0)
  ]),
  风景: uniqueEmoji([
    "☀️","🌙","🌈","☁️","🌧️","⛈️","❄️","🌊","🌪️","🌱","🌿","🍀","🌸","🌻","🌹","🌵","🌍","🪐",
    ...emojiRange(0x1F300, 0x1F32C),
    ...emojiRange(0x1F330, 0x1F343)
  ]),
  符号: uniqueEmoji([
    ...emojiLibrary.slice(216),
    ...emojiRange(0x1F170, 0x1F251),
    ...emojiRange(0x1F7E0, 0x1F7EB)
  ])
};

const totalEmojiCount = Object.values(emojiCategories).reduce((sum, list) => sum + list.length, 0);

const previewTypes = {
  image: /^image\//,
  video: /^video\//,
  audio: /^audio\//,
  pdf: /^application\/pdf$/
};

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function setStatus(text) {
  els.statusText.textContent = text;
  const icons = [
    ["画线", "╱"],
    ["文字", "T"],
    ["表情", "☺"],
    ["定位", "◎"],
    ["连接", "⛓"],
    ["擦除", "⌁"],
    ["账号", "👤"],
    ["项目", "▣"]
  ];
  const match = icons.find(([keyword]) => text.includes(keyword));
  if (els.statusIcon) els.statusIcon.textContent = match ? match[1] : "🐏";
}

function snapshotState() {
  return JSON.stringify({
    panX: state.panX,
    panY: state.panY,
    zoom: state.zoom,
    projects: state.projects,
    currentProjectId: state.currentProjectId,
    items: state.items,
    strokes: state.strokes,
    connections: state.connections,
    theme: state.theme
  });
}

function recordHistory() {
  state.history.push(snapshotState());
  if (state.history.length > 60) state.history.shift();
}

function restoreSnapshot(snapshot) {
  const saved = JSON.parse(snapshot);
  state.panX = saved.panX ?? state.panX;
  state.panY = saved.panY ?? state.panY;
  state.zoom = saved.zoom ?? state.zoom;
  state.projects = Array.isArray(saved.projects) ? saved.projects : state.projects;
  state.currentProjectId = saved.currentProjectId || state.currentProjectId;
  state.items = Array.isArray(saved.items) ? saved.items : [];
  state.strokes = Array.isArray(saved.strokes) ? saved.strokes : [];
  state.connections = Array.isArray(saved.connections) ? saved.connections : [];
  state.selectedId = null;
  state.selectedStrokeId = null;
  state.selectedConnectionId = null;
  normalizeProjects();
  renderProjects();
    setTheme(saved.theme === "dark" ? "dark" : "light", false);
  applyTransform();
  render();
  scheduleSave();
}

function undo() {
  const snapshot = state.history.pop();
  if (!snapshot) {
    setStatus("暂无可撤回操作");
    return;
  }
  restoreSnapshot(snapshot);
  setStatus("已撤回上一步操作");
}

function currentProject() {
  return state.projects.find((project) => project.id === state.currentProjectId) || state.projects[0];
}

function normalizeProjects() {
  if (!Array.isArray(state.projects) || !state.projects.length) {
    state.projects = [{ id: DEFAULT_PROJECT_ID, name: "默认项目" }];
  }
  const seen = new Set();
  state.projects = state.projects
    .map((project, index) => ({
      id: project?.id || (index === 0 ? DEFAULT_PROJECT_ID : uid()),
      name: String(project?.name || `项目 ${index + 1}`).trim() || `项目 ${index + 1}`
    }))
    .filter((project) => {
      if (seen.has(project.id)) return false;
      seen.add(project.id);
      return true;
    });

  if (!state.projects.some((project) => project.id === DEFAULT_PROJECT_ID)) {
    state.projects.unshift({ id: DEFAULT_PROJECT_ID, name: "默认项目" });
  }

  if (!state.projects.some((project) => project.id === state.currentProjectId)) {
    state.currentProjectId = state.projects[0].id;
  }

  for (const item of state.items) {
    item.projectId ||= DEFAULT_PROJECT_ID;
    item.displayName ||= item.kind === "text" ? "文字框" : item.kind === "emoji" ? "表情贴纸" : item.name || "项目框";
    item.note ||= "";
    if (item.kind === "text") {
      item.color ||= "#16181d";
      item.fontFamily ||= state.activeTextFont;
    }
  }
  for (const stroke of state.strokes) {
    stroke.projectId ||= DEFAULT_PROJECT_ID;
    stroke.color ||= "#0f5bd7";
  }
  if (!Array.isArray(state.connections)) state.connections = [];
  for (const connection of state.connections) {
    connection.projectId ||= DEFAULT_PROJECT_ID;
    connection.color ||= "#64748b";
  }
}

function renderProjects() {
  normalizeProjects();
  const options = state.projects.map((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.name;
    return option;
  });
  els.projectSelect.replaceChildren(...options);
  els.projectSelect.value = state.currentProjectId;
  if (els.deleteProjectBtn) {
    els.deleteProjectBtn.disabled = state.currentProjectId === DEFAULT_PROJECT_ID || state.projects.length <= 1;
  }
}

let dialogResolve = null;
let dialogMode = "confirm";

function closeAppDialog(result = null) {
  if (!els.appDialogLayer?.classList.contains("open")) return;
  els.appDialogLayer.classList.remove("open");
  els.appDialogLayer.setAttribute("aria-hidden", "true");
  const resolve = dialogResolve;
  dialogResolve = null;
  if (resolve) resolve(result);
}

function openAppDialog({
  title,
  message,
  confirmText = "确定",
  cancelText = "取消",
  danger = false,
  input = false,
  defaultValue = ""
}) {
  closeAppDialog(null);
  dialogMode = input ? "input" : "confirm";
  els.appDialogTitle.textContent = title;
  els.appDialogMessage.textContent = message;
  els.appDialogConfirmBtn.textContent = confirmText;
  els.appDialogCancelBtn.textContent = cancelText;
  els.appDialogConfirmBtn.classList.toggle("danger", danger);
  els.appDialogInput.classList.toggle("open", input);
  els.appDialogInput.value = defaultValue;
  els.appDialogLayer.classList.add("open");
  els.appDialogLayer.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => {
    if (input) {
      els.appDialogInput.focus();
      els.appDialogInput.select();
    } else {
      els.appDialogConfirmBtn.focus();
    }
  });
  return new Promise((resolve) => {
    dialogResolve = resolve;
  });
}

function appConfirm(options) {
  return openAppDialog(options);
}

async function appPrompt(options) {
  const value = await openAppDialog({ ...options, input: true });
  return typeof value === "string" ? value : null;
}

async function addProject() {
  const name = await appPrompt({
    title: "新建项目",
    message: "给这个画布项目起一个方便查找的名字。",
    defaultValue: `项目 ${state.projects.length + 1}`,
    confirmText: "创建项目"
  });
  const trimmed = name?.trim();
  if (!trimmed) return;
  recordHistory();
  const project = { id: uid(), name: trimmed };
  state.projects.push(project);
  state.currentProjectId = project.id;
  state.selectedId = null;
  state.selectedConnectionId = null;
  renderProjects();
  render();
  scheduleSave();
  setStatus(`已切换到项目：${project.name}`);
}

function switchProject(projectId) {
  if (!state.projects.some((project) => project.id === projectId)) return;
  state.currentProjectId = projectId;
  state.selectedId = null;
  state.selectedStrokeId = null;
  state.selectedConnectionId = null;
  renderProjects();
  render();
  scheduleSave();
  setStatus(`当前项目：${currentProject().name}`);
}

async function deleteCurrentProject() {
  normalizeProjects();
  const project = currentProject();
  if (!project) return;
  if (project.id === DEFAULT_PROJECT_ID || state.projects.length <= 1) {
    setStatus("默认项目需要保留，不能删除");
    return;
  }

  const items = state.items.filter((item) => (item.projectId || DEFAULT_PROJECT_ID) === project.id);
  const strokes = state.strokes.filter((stroke) => (stroke.projectId || DEFAULT_PROJECT_ID) === project.id);
  const ok = await appConfirm({
    title: "删除项目",
    message: `确认删除“${project.name}”吗？该项目里的 ${items.length} 个项目框、${strokes.length} 条线条和连接关系都会从本机浏览器中删除。`,
    confirmText: "删除项目",
    cancelText: "取消",
    danger: true
  });
  if (!ok) return;

  recordHistory();
  const fileIds = items.map((item) => item.fileId).filter(Boolean);
  await Promise.all(fileIds.map((fileId) => deleteFileRecord(fileId)));
  for (const fileId of fileIds) {
    state.fileCache?.delete(fileId);
    const url = objectUrls.get(fileId);
    if (url) URL.revokeObjectURL(url);
    objectUrls.delete(fileId);
  }

  state.projects = state.projects.filter((entry) => entry.id !== project.id);
  state.items = state.items.filter((item) => (item.projectId || DEFAULT_PROJECT_ID) !== project.id);
  state.strokes = state.strokes.filter((stroke) => (stroke.projectId || DEFAULT_PROJECT_ID) !== project.id);
  state.connections = state.connections.filter((connection) => (connection.projectId || DEFAULT_PROJECT_ID) !== project.id);
  state.currentProjectId = state.projects[0]?.id || DEFAULT_PROJECT_ID;
  state.selectedId = null;
  state.selectedStrokeId = null;
  state.selectedConnectionId = null;
  normalizeProjects();
  renderProjects();
  render();
  scheduleSave();
  setStatus(`已删除项目：${project.name}`);
}

function projectItems() {
  return state.items.filter((item) => (item.projectId || DEFAULT_PROJECT_ID) === state.currentProjectId);
}

function projectStrokes() {
  return state.strokes.filter((stroke) => (stroke.projectId || DEFAULT_PROJECT_ID) === state.currentProjectId);
}

function projectConnections() {
  return state.connections.filter((connection) => (connection.projectId || DEFAULT_PROJECT_ID) === state.currentProjectId);
}

function worldFromClient(clientX, clientY) {
  const rect = els.viewport.getBoundingClientRect();
  return {
    x: (clientX - rect.left - state.panX) / state.zoom,
    y: (clientY - rect.top - state.panY) / state.zoom
  };
}

function clientFromWorld(x, y) {
  const rect = els.viewport.getBoundingClientRect();
  return {
    x: rect.left + state.panX + x * state.zoom,
    y: rect.top + state.panY + y * state.zoom
  };
}

function applyTransform() {
  els.surface.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
  els.viewport.style.backgroundPosition = `${state.panX}px ${state.panY}px`;
  els.viewport.style.backgroundSize = `${160 * state.zoom}px ${160 * state.zoom}px, ${160 * state.zoom}px ${160 * state.zoom}px, ${32 * state.zoom}px ${32 * state.zoom}px, ${32 * state.zoom}px ${32 * state.zoom}px`;
  els.zoomLabel.value = `${Math.round(state.zoom * 100)}%`;
  positionConnectionDelete();
}

function clampZoom(value) {
  return Math.min(4, Math.max(0.15, value));
}

function zoomAt(clientX, clientY, nextZoom) {
  const before = worldFromClient(clientX, clientY);
  state.zoom = clampZoom(nextZoom);
  const rect = els.viewport.getBoundingClientRect();
  state.panX = clientX - rect.left - before.x * state.zoom;
  state.panY = clientY - rect.top - before.y * state.zoom;
  applyTransform();
  scheduleSave();
}

function centerView() {
  state.panX = window.innerWidth / 2;
  state.panY = window.innerHeight / 2;
  state.zoom = 1;
  applyTransform();
  scheduleSave();
}

function locateProjectContent() {
  const boxes = projectItems().map((item) => [
    { x: item.x, y: item.y },
    { x: item.x + item.w, y: item.y + item.h }
  ]).flat();
  const strokePoints = projectStrokes().map(strokeSamplePoints).flat();
  const points = boxes.concat(strokePoints);
  if (!points.length) {
    centerView();
    setStatus("当前项目还没有内容，已回到中心");
    return;
  }
  const bounds = boundsOf(points);
  const targetZoom = clampZoom(Math.min(1.35, Math.max(0.25, Math.min((window.innerWidth - 180) / Math.max(bounds.w, 220), (window.innerHeight - 180) / Math.max(bounds.h, 160)))));
  state.zoom = targetZoom;
  state.panX = window.innerWidth / 2 - bounds.cx * state.zoom;
  state.panY = window.innerHeight / 2 - bounds.cy * state.zoom;
  applyTransform();
  scheduleSave();
  setStatus("已定位到当前项目内容");
}

function setTheme(theme, saveHistory = true) {
  if (saveHistory && state.theme !== theme) recordHistory();
  state.theme = theme;
  document.body.classList.toggle("dark", theme === "dark");
  els.themeBtn.textContent = theme === "dark" ? "☀" : "◐";
  scheduleSave();
}

function createItemElement(item) {
  const node = els.template.content.firstElementChild.cloneNode(true);
  node.dataset.id = item.id;
  node.style.left = `${item.x}px`;
  node.style.top = `${item.y}px`;
  node.style.width = `${item.w}px`;
  node.style.height = `${item.h}px`;
  node.classList.toggle("selected", item.id === state.selectedId);
  node.classList.toggle("text-item", item.kind === "text");
  node.classList.toggle("emoji-item", item.kind === "emoji");

  const content = node.querySelector(".item-content");
  const meta = node.querySelector(".item-meta");
  const note = node.querySelector(".item-note");
  const nameInput = node.querySelector(".item-name-input");
  const noteBtn = node.querySelector(".item-note-btn");
  const notePopover = node.querySelector(".item-note-popover");
  const noteInput = node.querySelector(".item-note-input");
  const noteSave = node.querySelector(".item-note-save");
  const noteCancel = node.querySelector(".item-note-cancel");
  const connector = node.querySelector(".connector-handle");
  note.textContent = item.note || "";
  note.hidden = !item.note;
  nameInput.value = item.displayName || item.name || "项目框";
  noteInput.value = item.note || "";
  renderItemContent(item, content, meta);

  nameInput.addEventListener("pointerdown", (event) => event.stopPropagation());
  noteBtn.addEventListener("pointerdown", (event) => event.stopPropagation());
  notePopover.addEventListener("pointerdown", (event) => event.stopPropagation());
  nameInput.addEventListener("change", () => renameItem(item.id, nameInput.value));
  nameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      nameInput.blur();
    }
  });
  noteBtn.addEventListener("click", () => {
    notePopover.classList.toggle("open");
    noteInput.focus();
  });
  noteSave.addEventListener("click", () => editItemNote(item.id, noteInput.value));
  noteCancel.addEventListener("click", () => notePopover.classList.remove("open"));
  connector.addEventListener("pointerdown", (event) => beginConnectorDrag(event, item.id));
  node.addEventListener("pointerdown", (event) => beginItemPointer(event, item.id));
  node.addEventListener("focus", () => selectItem(item.id));

  return node;
}

function renderItemContent(item, content, meta) {
  content.replaceChildren();
  meta.replaceChildren();

  if (item.kind === "text") {
    const box = document.createElement("div");
    box.className = "text-box";
    box.contentEditable = "true";
    box.spellcheck = false;
    box.textContent = item.text || "";
    box.style.color = item.color || state.activeTextColor;
    box.style.fontFamily = item.fontFamily || state.activeTextFont;
    box.addEventListener("input", () => {
      item.text = box.textContent;
      scheduleSave();
    });
    box.addEventListener("pointerdown", (event) => event.stopPropagation());
    content.append(box);
    meta.textContent = item.displayName || "文字框";
    return;
  }

  if (item.kind === "emoji") {
    const sticker = document.createElement("div");
    sticker.className = "emoji-sticker";
    sticker.textContent = item.text;
    content.append(sticker);
    meta.textContent = item.displayName || "表情贴纸";
    return;
  }

  if (item.kind === "file") {
    const url = item.fileId ? getFileUrl(item.fileId) : item.url;
    const group = fileGroup(item.type);
    if (group === "image") {
      const img = document.createElement("img");
      img.src = url;
      img.alt = item.name;
      content.append(img);
    } else if (group === "video") {
      const video = document.createElement("video");
      video.src = url;
      video.controls = true;
      video.playsInline = true;
      video.addEventListener("pointerdown", (event) => event.stopPropagation());
      content.append(video);
    } else if (group === "audio") {
      const audio = document.createElement("audio");
      audio.src = url;
      audio.controls = true;
      audio.addEventListener("pointerdown", (event) => event.stopPropagation());
      content.append(audio);
    } else if (group === "pdf") {
      const frame = document.createElement("iframe");
      frame.src = url;
      frame.title = item.name;
      frame.loading = "lazy";
      content.append(frame);
    } else {
      const card = document.createElement("div");
      card.className = "file-card";

      const icon = document.createElement("div");
      icon.className = "file-icon";
      icon.textContent = extensionOf(item.name) || "FILE";

      const name = document.createElement("div");
      name.className = "file-name";
      name.textContent = item.name;

      const size = document.createElement("div");
      size.className = "file-size";
      size.textContent = humanSize(item.size);

      card.append(icon, name, size);
      content.append(card);
    }

    const label = document.createElement("span");
    label.textContent = `${item.displayName || item.name} · ${humanSize(item.size)}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = item.name;
    link.textContent = "下载";
    link.addEventListener("pointerdown", (event) => event.stopPropagation());
    meta.append(label, link);
  }
}

const objectUrls = new Map();

function getFileUrl(fileId) {
  const record = state.fileCache?.get(fileId);
  if (!record) return "";
  if (!objectUrls.has(fileId)) {
    objectUrls.set(fileId, URL.createObjectURL(record.blob));
  }
  return objectUrls.get(fileId);
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function boundsOf(points) {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return {
    minX,
    maxX,
    minY,
    maxY,
    w: Math.max(1, maxX - minX),
    h: Math.max(1, maxY - minY),
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2
  };
}

function pointsToPath(points) {
  if (!points?.length) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  return points.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
}

function polygonPath(cx, cy, rx, ry, count, rotation = -Math.PI / 2) {
  const points = Array.from({ length: count }, (_, index) => {
    const angle = rotation + (index / count) * Math.PI * 2;
    return {
      x: Math.round(cx + Math.cos(angle) * rx),
      y: Math.round(cy + Math.sin(angle) * ry)
    };
  });
  return `${pointsToPath(points)} Z`;
}

function starPath(cx, cy, rx, ry) {
  const outer = Math.max(rx, ry);
  const inner = outer * 0.45;
  const points = Array.from({ length: 10 }, (_, index) => {
    const angle = -Math.PI / 2 + (index / 10) * Math.PI * 2;
    const radius = index % 2 ? inner : outer;
    return {
      x: Math.round(cx + Math.cos(angle) * radius),
      y: Math.round(cy + Math.sin(angle) * radius)
    };
  });
  return `${pointsToPath(points)} Z`;
}

function heartPath(cx, cy, rx, ry) {
  return [
    `M ${cx} ${cy + ry}`,
    `C ${cx - rx * 1.1} ${cy + ry * 0.34}, ${cx - rx} ${cy - ry * 0.56}, ${cx - rx * 0.36} ${cy - ry * 0.46}`,
    `C ${cx - rx * 0.06} ${cy - ry * 0.92}, ${cx + rx * 0.06} ${cy - ry * 0.92}, ${cx + rx * 0.36} ${cy - ry * 0.46}`,
    `C ${cx + rx} ${cy - ry * 0.56}, ${cx + rx * 1.1} ${cy + ry * 0.34}, ${cx} ${cy + ry}`,
    "Z"
  ].join(" ");
}

function shapeToPath(shape) {
  if (!shape) return "";
  const rx = shape.w / 2;
  const ry = shape.h / 2;
  const cx = shape.x + rx;
  const cy = shape.y + ry;
  if (shape.type === "circle" || shape.type === "ellipse") {
    return [
      `M ${cx - rx} ${cy}`,
      `A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy}`,
      `A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`,
      "Z"
    ].join(" ");
  }
  if (shape.type === "rectangle") {
    return `M ${shape.x} ${shape.y} H ${shape.x + shape.w} V ${shape.y + shape.h} H ${shape.x} Z`;
  }
  if (shape.type === "arrow") {
    const start = shape.start;
    const end = shape.end;
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const size = shape.headSize || 28;
    const left = {
      x: Math.round(end.x - Math.cos(angle - Math.PI / 6) * size),
      y: Math.round(end.y - Math.sin(angle - Math.PI / 6) * size)
    };
    const right = {
      x: Math.round(end.x - Math.cos(angle + Math.PI / 6) * size),
      y: Math.round(end.y - Math.sin(angle + Math.PI / 6) * size)
    };
    return `M ${start.x} ${start.y} L ${end.x} ${end.y} M ${left.x} ${left.y} L ${end.x} ${end.y} L ${right.x} ${right.y}`;
  }
  if (shape.type === "triangle") return polygonPath(cx, cy, rx, ry, 3);
  if (shape.type === "pentagon") return polygonPath(cx, cy, rx, ry, 5);
  if (shape.type === "star") return starPath(cx, cy, rx, ry);
  if (shape.type === "heart") return heartPath(cx, cy, rx, ry);
  return "";
}

function strokePoints(stroke) {
  if (stroke.straight && stroke.points.length > 1) {
    return [stroke.points[0], stroke.points[stroke.points.length - 1]];
  }
  return stroke.points;
}

function strokePathData(stroke) {
  if (stroke.shape) return shapeToPath(stroke.shape);
  return pointsToPath(strokePoints(stroke));
}

function pointLineDistance(point, start, end) {
  const lengthSq = (end.x - start.x) ** 2 + (end.y - start.y) ** 2;
  if (!lengthSq) return distance(point, start);
  const t = Math.max(0, Math.min(1, ((point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y)) / lengthSq));
  return distance(point, {
    x: start.x + (end.x - start.x) * t,
    y: start.y + (end.y - start.y) * t
  });
}

function translateStroke(stroke, dx, dy) {
  stroke.points = stroke.points.map((point) => ({ x: Math.round(point.x + dx), y: Math.round(point.y + dy) }));
  if (stroke.shape) {
    if (stroke.shape.type === "arrow") {
      stroke.shape.start = { x: Math.round(stroke.shape.start.x + dx), y: Math.round(stroke.shape.start.y + dy) };
      stroke.shape.end = { x: Math.round(stroke.shape.end.x + dx), y: Math.round(stroke.shape.end.y + dy) };
    } else {
      stroke.shape.x = Math.round(stroke.shape.x + dx);
      stroke.shape.y = Math.round(stroke.shape.y + dy);
    }
  }
}

function beautifyCurrentStroke() {
  if (!state.drawing || state.drawing.stroke.points.length < 2) return;
  const result = window.ShapeRecognizer?.recognizeStroke(state.drawing.stroke.points);
  if (!result) return;
  state.drawing.stroke.straight = result.straight;
  state.drawing.stroke.shape = result.shape;
  if (result.points) state.drawing.stroke.points = result.points;
  state.drawing.path.classList.add("is-straight");
  state.drawing.path.setAttribute("d", strokePathData(state.drawing.stroke));
  setStatus(`已自动修正为${result.label}，松手即可保留`);
}

function sampleShape(shape) {
  if (!shape) return [];
  const rx = shape.w / 2;
  const ry = shape.h / 2;
  const cx = shape.x + rx;
  const cy = shape.y + ry;
  if (shape.type === "circle" || shape.type === "ellipse") {
    return Array.from({ length: 40 }, (_, index) => {
      const angle = (index / 40) * Math.PI * 2;
      return { x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry };
    });
  }
  if (shape.type === "rectangle") {
    return [
      { x: shape.x, y: shape.y },
      { x: shape.x + shape.w, y: shape.y },
      { x: shape.x + shape.w, y: shape.y + shape.h },
      { x: shape.x, y: shape.y + shape.h },
      { x: shape.x, y: shape.y }
    ];
  }
  if (shape.type === "arrow") {
    return [shape.start, shape.end];
  }
  if (shape.type === "heart") {
    return Array.from({ length: 40 }, (_, index) => {
      const t = (index / 39) * Math.PI * 2;
      return {
        x: cx + (16 * Math.sin(t) ** 3 / 18) * rx,
        y: cy - ((13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 18) * ry
      };
    });
  }
  const count = shape.type === "triangle" ? 3 : shape.type === "pentagon" ? 5 : 10;
  return Array.from({ length: count + 1 }, (_, index) => {
    const i = index % count;
    const angle = -Math.PI / 2 + (i / count) * Math.PI * 2;
    const radius = shape.type === "star" && i % 2 ? Math.max(rx, ry) * 0.45 : Math.max(rx, ry);
    return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
  });
}

function strokeSamplePoints(stroke) {
  if (stroke.shape) return sampleShape(stroke.shape);
  return strokePoints(stroke);
}

function minDistanceToStroke(point, stroke) {
  const points = strokeSamplePoints(stroke);
  if (points.length === 1) return distance(point, points[0]);
  let nearest = Infinity;
  for (let index = 1; index < points.length; index += 1) {
    nearest = Math.min(nearest, pointLineDistance(point, points[index - 1], points[index]));
  }
  return nearest;
}

function eraseAt(point) {
  const before = state.strokes.length;
  const radius = Math.max(12, 22 / state.zoom);
  state.strokes = state.strokes.filter((stroke) => {
    if ((stroke.projectId || DEFAULT_PROJECT_ID) !== state.currentProjectId) return true;
    return minDistanceToStroke(point, stroke) > radius;
  });
  if (state.strokes.length !== before) {
    state.selectedStrokeId = null;
    render();
    scheduleSave();
    setStatus("已消除线条");
  }
}

function createStrokePath(stroke, preview = false) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.classList.add("ink-path");
  path.classList.toggle("is-preview", preview);
  path.classList.toggle("is-straight", Boolean(stroke.straight));
  path.classList.toggle("selected", stroke.id === state.selectedStrokeId);
  path.dataset.id = stroke.id;
  path.setAttribute("d", strokePathData(stroke));
  path.setAttribute("stroke-width", String(stroke.width || 4));
  path.setAttribute("stroke", stroke.color || state.activeColor);
  path.setAttribute("vector-effect", "non-scaling-stroke");
  path.addEventListener("pointerdown", (event) => beginStrokePointer(event, stroke.id));
  path.addEventListener("dblclick", (event) => {
    selectStroke(stroke.id);
    setActiveTool("strokeEdit");
    setStatus("已选中线条：拖动可移动，按删除可删除");
    event.stopPropagation();
  });
  return path;
}

function itemCenter(item) {
  return {
    x: item.x + item.w / 2,
    y: item.y + item.h / 2
  };
}

function connectionCenter(connection) {
  const from = state.items.find((item) => item.id === connection.fromId);
  const to = state.items.find((item) => item.id === connection.toId);
  if (!from || !to) return null;
  const start = itemCenter(from);
  const end = itemCenter(to);
  return {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2
  };
}

function createConnectionPath(connection) {
  const from = state.items.find((item) => item.id === connection.fromId);
  const to = state.items.find((item) => item.id === connection.toId);
  if (!from || !to) return null;
  const start = itemCenter(from);
  const end = itemCenter(to);
  const dx = Math.abs(end.x - start.x) * 0.42;
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.classList.add("connector-path");
  path.dataset.id = connection.id;
  path.setAttribute("d", `M ${start.x} ${start.y} C ${start.x + dx} ${start.y}, ${end.x - dx} ${end.y}, ${end.x} ${end.y}`);
  path.setAttribute("stroke", connection.color || "#64748b");
  path.setAttribute("vector-effect", "non-scaling-stroke");
  path.classList.toggle("selected", connection.id === state.selectedConnectionId);
  path.addEventListener("pointerdown", (event) => {
    selectConnection(connection.id);
    event.preventDefault();
    event.stopPropagation();
  });
  path.addEventListener("dblclick", (event) => {
    selectConnection(connection.id);
    removeSelected();
    event.preventDefault();
    event.stopPropagation();
  });
  return path;
}

function itemAtPoint(point, exceptId = null) {
  return [...projectItems()].reverse().find((item) =>
    item.id !== exceptId &&
    point.x >= item.x &&
    point.x <= item.x + item.w &&
    point.y >= item.y &&
    point.y <= item.y + item.h
  );
}

function connectorPreviewPath(from, point) {
  const start = itemCenter(from);
  const dx = Math.abs(point.x - start.x) * 0.42;
  return `M ${start.x} ${start.y} C ${start.x + dx} ${start.y}, ${point.x - dx} ${point.y}, ${point.x} ${point.y}`;
}

function renderInk() {
  const layer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  layer.classList.add("ink-layer");
  for (const connection of projectConnections()) {
    const path = createConnectionPath(connection);
    if (path) layer.append(path);
  }
  for (const stroke of projectStrokes()) {
    layer.append(createStrokePath(stroke));
  }
  return layer;
}

function refreshInkLayer() {
  const current = els.surface.querySelector(".ink-layer");
  if (current) current.replaceWith(renderInk());
}

function render() {
  const nodes = projectItems().map(createItemElement);
  els.surface.replaceChildren(renderInk(), ...nodes);
}

function selectItem(id) {
  state.selectedId = id;
  state.selectedStrokeId = null;
  state.selectedConnectionId = null;
  hideConnectionDelete();
  for (const child of els.surface.children) {
    child.classList.toggle("selected", child.dataset.id === id);
  }
  for (const path of els.surface.querySelectorAll(".ink-path")) {
    path.classList.toggle("selected", path.dataset.id === state.selectedStrokeId);
  }
  for (const path of els.surface.querySelectorAll(".connector-path")) {
    path.classList.toggle("selected", false);
  }
}

function selectStroke(id) {
  state.selectedStrokeId = id;
  if (id) state.selectedId = null;
  state.selectedConnectionId = null;
  hideConnectionDelete();
  for (const child of els.surface.children) {
    child.classList.toggle("selected", false);
  }
  for (const path of els.surface.querySelectorAll(".ink-path")) {
    path.classList.toggle("selected", path.dataset.id === id);
  }
  for (const path of els.surface.querySelectorAll(".connector-path")) {
    path.classList.toggle("selected", false);
  }
}

function selectConnection(id) {
  state.selectedConnectionId = id;
  if (id) {
    state.selectedId = null;
    state.selectedStrokeId = null;
  }
  for (const child of els.surface.children) {
    child.classList.toggle("selected", false);
  }
  for (const path of els.surface.querySelectorAll(".ink-path")) {
    path.classList.toggle("selected", false);
  }
  for (const path of els.surface.querySelectorAll(".connector-path")) {
    path.classList.toggle("selected", path.dataset.id === id);
  }
  if (id) {
    showConnectionDelete();
    setStatus("已选中连接线，点击取消连接或按 Delete 删除");
  } else {
    hideConnectionDelete();
  }
}

function beginItemPointer(event, id) {
  selectItem(id);
  const item = state.items.find((entry) => entry.id === id);
  if (!item) return;

  const target = event.target;
  const resizing = target.classList.contains("resize-handle");
  recordHistory();
  const start = worldFromClient(event.clientX, event.clientY);
  state.drag = {
    type: resizing ? "resize" : "move",
    id,
    startX: start.x,
    startY: start.y,
    itemX: item.x,
    itemY: item.y,
    itemW: item.w,
    itemH: item.h
  };
  event.currentTarget.setPointerCapture(event.pointerId);
  event.preventDefault();
}

function renameItem(id, value) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item) return;
  const trimmed = value?.trim();
  if (!trimmed) return;
  recordHistory();
  item.displayName = trimmed;
  render();
  scheduleSave();
  setStatus(`已命名：${trimmed}`);
}

function editItemNote(id, value) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item) return;
  recordHistory();
  item.note = value.trim();
  render();
  scheduleSave();
  setStatus(item.note ? "已保存备注" : "已清空备注");
}

function positionConnectionDelete() {
  if (!els.connectionDeleteBtn || !state.selectedConnectionId) return;
  const connection = state.connections.find((entry) => entry.id === state.selectedConnectionId);
  const point = connection ? connectionCenter(connection) : null;
  if (!point) {
    hideConnectionDelete();
    return;
  }
  const client = clientFromWorld(point.x, point.y);
  const margin = 16;
  const x = Math.max(margin, Math.min(window.innerWidth - margin, client.x));
  const y = Math.max(72, Math.min(window.innerHeight - margin, client.y));
  els.connectionDeleteBtn.style.left = `${x}px`;
  els.connectionDeleteBtn.style.top = `${y}px`;
}

function showConnectionDelete() {
  if (!els.connectionDeleteBtn) return;
  els.connectionDeleteBtn.hidden = false;
  positionConnectionDelete();
  requestAnimationFrame(() => els.connectionDeleteBtn.classList.add("open"));
}

function hideConnectionDelete() {
  if (!els.connectionDeleteBtn) return;
  els.connectionDeleteBtn.classList.remove("open");
  els.connectionDeleteBtn.hidden = true;
}

function cancelConnectorDrag(message = "已取消连线") {
  if (!state.connecting) return false;
  state.connecting.path?.remove();
  state.connecting = null;
  state.history.pop();
  els.viewport.classList.remove("is-connecting");
  setStatus(message);
  return true;
}

function beginConnectorDrag(event, id) {
  if (event.button !== 0) return;
  if (state.connecting) cancelConnectorDrag();
  const from = state.items.find((entry) => entry.id === id);
  if (!from) return;
  recordHistory();
  state.connecting = {
    fromId: id,
    point: worldFromClient(event.clientX, event.clientY),
    path: null
  };
  selectItem(id);
  refreshInkLayer();
  els.viewport.classList.add("is-connecting");
  const layer = els.surface.querySelector(".ink-layer");
  const preview = document.createElementNS("http://www.w3.org/2000/svg", "path");
  preview.classList.add("connector-path", "is-preview");
  preview.setAttribute("stroke", state.activeColor);
  preview.setAttribute("vector-effect", "non-scaling-stroke");
  layer.append(preview);
  state.connecting.path = preview;
  showConnectionCancel();
  setStatus("拖到其他项目框完成连线");
  event.currentTarget.setPointerCapture(event.pointerId);
  event.preventDefault();
  event.stopPropagation();
}

function beginStrokePointer(event, id) {
  const stroke = state.strokes.find((entry) => entry.id === id);
  if (!stroke) return;
  selectStroke(id);
  if (state.activeTool !== "strokeEdit" && state.selectedStrokeId !== id) {
    if (state.activeTool === "eraser") eraseAt(worldFromClient(event.clientX, event.clientY));
    event.stopPropagation();
    return;
  }

  recordHistory();
  const start = worldFromClient(event.clientX, event.clientY);
  state.drag = {
    type: "strokeMove",
    id,
    startX: start.x,
    startY: start.y,
    originalPoints: stroke.points.map((point) => ({ ...point })),
    originalShape: stroke.shape ? { ...stroke.shape } : null
  };
  event.currentTarget.setPointerCapture(event.pointerId);
  event.preventDefault();
  event.stopPropagation();
}

function beginPan(event) {
  state.drag = {
    type: "pan",
    clientX: event.clientX,
    clientY: event.clientY,
    panX: state.panX,
    panY: state.panY
  };
  els.viewport.classList.add("is-panning");
}

function setActiveTool(tool) {
  state.activeTool = tool;
  if (tool !== "connect") state.linkSourceId = null;
  els.lineBtn.classList.toggle("active", tool === "line");
  els.eraserBtn.classList.toggle("active", tool === "eraser");
  els.lineOptions.classList.toggle("open", tool === "line");
  if (tool === "line") positionPopover(els.lineOptions, els.lineBtn);
  els.viewport.classList.toggle("is-drawing", tool === "line");
  els.viewport.classList.toggle("is-moving-ink", tool === "strokeEdit");
  els.viewport.classList.toggle("is-erasing", tool === "eraser");
  const labels = {
    line: "画线模式：画线或画形状，停住长按会自动修正",
    strokeEdit: "线条编辑：拖动可移动，按删除可删除",
    eraser: "消除模式：按住拖动可消除线条和图形",
    select: "选择模式：拖拽素材或画布"
  };
  setStatus(labels[tool] || labels.select);
}

function beginDrawing(event) {
  recordHistory();
  const point = worldFromClient(event.clientX, event.clientY);
  const stroke = {
    id: uid(),
    projectId: state.currentProjectId,
    points: [{ x: Math.round(point.x), y: Math.round(point.y) }],
    width: 4,
    color: state.activeColor,
    straight: false
  };
  state.drawing = {
    stroke,
    lastClientX: event.clientX,
    lastClientY: event.clientY,
    holdTimer: null,
    path: createStrokePath(stroke, true)
  };
  const layer = els.surface.querySelector(".ink-layer") || renderInk();
  if (!layer.parentElement) els.surface.prepend(layer);
  layer.append(state.drawing.path);
  scheduleStraightenHold();
  event.currentTarget.setPointerCapture(event.pointerId);
  event.preventDefault();
}

function scheduleStraightenHold() {
  window.clearTimeout(state.drawing?.holdTimer);
  if (!state.drawing) return;
  state.drawing.holdTimer = window.setTimeout(() => {
    if (!state.drawing || state.drawing.stroke.points.length < 2) return;
    beautifyCurrentStroke();
  }, STRAIGHTEN_HOLD_MS);
}

function onPointerMove(event) {
  if (state.connecting) {
    const point = worldFromClient(event.clientX, event.clientY);
    state.connecting.point = point;
    const from = state.items.find((item) => item.id === state.connecting.fromId);
    if (from && state.connecting.path) {
      state.connecting.path.setAttribute("d", connectorPreviewPath(from, point));
    }
    positionConnectionCancel(point);
    return;
  }

  if (state.drawing) {
    const move = Math.hypot(event.clientX - state.drawing.lastClientX, event.clientY - state.drawing.lastClientY);
    const point = worldFromClient(event.clientX, event.clientY);
    state.drawing.stroke.points.push({ x: Math.round(point.x), y: Math.round(point.y) });
    state.drawing.stroke.straight = false;
    state.drawing.stroke.shape = null;
    state.drawing.path.classList.remove("is-straight");
    state.drawing.path.setAttribute("d", pointsToPath(state.drawing.stroke.points));
    if (move > 3) {
      state.drawing.lastClientX = event.clientX;
      state.drawing.lastClientY = event.clientY;
      scheduleStraightenHold();
    }
    return;
  }

  if (state.erasing) {
    eraseAt(worldFromClient(event.clientX, event.clientY));
    return;
  }

  if (!state.drag) return;

  if (state.drag.type === "pan") {
    state.panX = state.drag.panX + event.clientX - state.drag.clientX;
    state.panY = state.drag.panY + event.clientY - state.drag.clientY;
    applyTransform();
    return;
  }

  if (state.drag.type === "strokeMove") {
    const stroke = state.strokes.find((entry) => entry.id === state.drag.id);
    if (!stroke) return;
    const point = worldFromClient(event.clientX, event.clientY);
    const dx = point.x - state.drag.startX;
    const dy = point.y - state.drag.startY;
    stroke.points = state.drag.originalPoints.map((entry) => ({ x: Math.round(entry.x + dx), y: Math.round(entry.y + dy) }));
    stroke.shape = state.drag.originalShape ? {
      ...state.drag.originalShape,
      x: Math.round(state.drag.originalShape.x + dx),
      y: Math.round(state.drag.originalShape.y + dy)
    } : null;
    const path = els.surface.querySelector(`.ink-path[data-id="${CSS.escape(stroke.id)}"]`);
    path?.setAttribute("d", strokePathData(stroke));
    return;
  }

  const item = state.items.find((entry) => entry.id === state.drag.id);
  if (!item) return;

  const point = worldFromClient(event.clientX, event.clientY);
  const dx = point.x - state.drag.startX;
  const dy = point.y - state.drag.startY;

  if (state.drag.type === "move") {
    item.x = Math.round(state.drag.itemX + dx);
    item.y = Math.round(state.drag.itemY + dy);
  } else {
    item.w = Math.max(96, Math.round(state.drag.itemW + dx));
    item.h = Math.max(72, Math.round(state.drag.itemH + dy));
  }

  const node = els.surface.querySelector(`[data-id="${CSS.escape(item.id)}"]`);
  if (node) {
    node.style.left = `${item.x}px`;
    node.style.top = `${item.y}px`;
    node.style.width = `${item.w}px`;
    node.style.height = `${item.h}px`;
  }
  refreshInkLayer();
  positionConnectionDelete();
}

function onPointerUp() {
  if (state.connecting) {
    const target = itemAtPoint(state.connecting.point, state.connecting.fromId);
    if (target) {
      state.connecting.path?.remove();
      state.connections.push({
        id: uid(),
        projectId: state.currentProjectId,
        fromId: state.connecting.fromId,
        toId: target.id,
        color: state.activeColor
      });
      setStatus("已添加连接线");
    } else {
      state.history.pop();
      setStatus("已取消连接");
    }
    state.connecting?.path?.remove();
    state.connecting = null;
    els.viewport.classList.remove("is-connecting");
    hideConnectionCancel();
    render();
    scheduleSave();
    return;
  }

  if (state.drawing) {
    window.clearTimeout(state.drawing.holdTimer);
    if (state.drawing.stroke.points.length > 1) {
      state.strokes.push(state.drawing.stroke);
      setStatus(state.drawing.stroke.straight ? "已添加直线" : "已添加手绘线");
    }
    state.drawing = null;
    render();
    scheduleSave();
    return;
  }

  if (state.erasing) {
    state.erasing = null;
    return;
  }

  if (!state.drag) return;
  state.drag = null;
  els.viewport.classList.remove("is-panning");
  scheduleSave();
}

function addItem(item, focus = true) {
  recordHistory();
  state.items.push(item);
  render();
  if (focus) {
    selectItem(item.id);
    const node = els.surface.querySelector(`[data-id="${CSS.escape(item.id)}"]`);
    node?.focus();
  }
  scheduleSave();
}

function addTextAt(point, text = "双击编辑文字") {
  addItem({
    id: uid(),
    projectId: state.currentProjectId,
    kind: "text",
    displayName: "文字框",
    note: "",
    color: state.activeTextColor,
    fontFamily: state.activeTextFont,
    text,
    x: Math.round(point.x - 120),
    y: Math.round(point.y - 60),
    w: 260,
    h: 140
  });
}

function addEmojiAt(point, text) {
  const size = { w: 190, h: 196 };
  addItem({
    id: uid(),
    projectId: state.currentProjectId,
    kind: "emoji",
    displayName: "表情贴纸",
    note: "",
    text,
    x: Math.round(point.x - size.w / 2),
    y: Math.round(point.y - size.h / 2),
    w: size.w,
    h: size.h
  });
}

async function addFiles(files, point) {
  const list = Array.from(files);
  for (let index = 0; index < list.length; index += 1) {
    const file = list[index];
    if (file.size > MAX_FILE_BYTES) {
      setStatus(`${file.name} 超过 300MB，未放入画布`);
      continue;
    }

    const id = uid();
    const fileId = uid();
    await putFileRecord(fileId, file);
    if (!state.fileCache) state.fileCache = new Map();
    state.fileCache.set(fileId, { blob: file });

    const size = await suggestedSize(file);
    addItem({
      id,
      projectId: state.currentProjectId,
      kind: "file",
      displayName: file.name || "未命名文件",
      note: "",
      fileId,
      name: file.name || "未命名文件",
      type: file.type || mimeFromName(file.name),
      size: file.size,
      x: Math.round(point.x + index * 28),
      y: Math.round(point.y + index * 28),
      w: size.w,
      h: size.h
    }, true);
  }
  if (list.length) setStatus(`已添加 ${list.length} 个文件`);
}

async function suggestedSize(file) {
  const group = fileGroup(file.type || mimeFromName(file.name));
  if (group === "image" || group === "video") {
    const dimensions = await mediaDimensions(file, group);
    if (dimensions) return framedMediaSize(dimensions.width, dimensions.height, group);
    return group === "image" ? { w: 380, h: 310 } : { w: 480, h: 330 };
  }
  if (group === "audio") return { w: 320, h: 120 };
  if (group === "pdf") return { w: 360, h: 460 };
  return { w: 260, h: 190 };
}

function framedMediaSize(width, height, group = "image") {
  const ratio = Math.max(0.18, Math.min(5.8, width / Math.max(1, height)));
  const maxInnerW = group === "video" ? 560 : 520;
  const maxInnerH = group === "video" ? 360 : 560;
  const minInnerW = group === "video" ? 260 : 170;
  const minInnerH = group === "video" ? 150 : 130;
  let innerW = Math.min(maxInnerW, Math.max(minInnerW, width));
  let innerH = innerW / ratio;

  if (innerH > maxInnerH) {
    innerH = maxInnerH;
    innerW = innerH * ratio;
  }
  if (innerW < minInnerW) {
    innerW = minInnerW;
    innerH = innerW / ratio;
  }
  if (innerH < minInnerH) {
    innerH = minInnerH;
    innerW = innerH * ratio;
  }
  if (innerW > maxInnerW) {
    innerW = maxInnerW;
    innerH = innerW / ratio;
  }
  if (innerH > maxInnerH) {
    innerH = maxInnerH;
    innerW = innerH * ratio;
  }

  return {
    w: Math.round(innerW + 20),
    h: Math.round(innerH + 50)
  };
}

function mediaDimensions(file, group) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const cleanup = () => URL.revokeObjectURL(url);
    const done = (value) => {
      cleanup();
      resolve(value);
    };

    if (group === "image") {
      const image = new Image();
      image.onload = () => done({ width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = () => done(null);
      image.src = url;
      return;
    }

    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => done({ width: video.videoWidth || 460, height: video.videoHeight || 300 });
    video.onerror = () => done(null);
    video.src = url;
  });
}

function fileGroup(type) {
  if (previewTypes.image.test(type)) return "image";
  if (previewTypes.video.test(type)) return "video";
  if (previewTypes.audio.test(type)) return "audio";
  if (previewTypes.pdf.test(type)) return "pdf";
  return "file";
}

function extensionOf(name = "") {
  const ext = name.split(".").pop();
  return ext && ext !== name ? ext.slice(0, 5) : "";
}

function mimeFromName(name = "") {
  const ext = extensionOf(name).toLowerCase();
  const map = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    mp4: "video/mp4",
    mov: "video/quicktime",
    webm: "video/webm",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    pdf: "application/pdf"
  };
  return map[ext] || "application/octet-stream";
}

function humanSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

function removeSelected() {
  if (state.selectedConnectionId) {
    recordHistory();
    state.connections = state.connections.filter((entry) => entry.id !== state.selectedConnectionId);
    state.selectedConnectionId = null;
    hideConnectionDelete();
    render();
    scheduleSave();
    setStatus("已取消连接");
    return;
  }
  if (state.selectedStrokeId) {
    recordHistory();
    state.strokes = state.strokes.filter((entry) => entry.id !== state.selectedStrokeId);
    state.selectedStrokeId = null;
    render();
    scheduleSave();
    return;
  }
  if (!state.selectedId) return;
  recordHistory();
  const item = state.items.find((entry) => entry.id === state.selectedId);
  state.items = state.items.filter((entry) => entry.id !== state.selectedId);
  state.connections = state.connections.filter((entry) => entry.fromId !== state.selectedId && entry.toId !== state.selectedId);
  state.selectedConnectionId = null;
  hideConnectionDelete();
  if (item?.fileId) {
    deleteFileRecord(item.fileId);
    state.fileCache?.delete(item.fileId);
    const url = objectUrls.get(item.fileId);
    if (url) URL.revokeObjectURL(url);
    objectUrls.delete(item.fileId);
  }
  state.selectedId = null;
  render();
  scheduleSave();
}

async function clearCanvas() {
  const items = projectItems();
  const strokes = projectStrokes();
  if (!items.length && !strokes.length) return;
  const ok = await appConfirm({
    title: "清空画布",
    message: `确认清空“${currentProject().name}”项目吗？此操作会删除本机浏览器中保存的当前项目内容。`,
    confirmText: "清空",
    cancelText: "取消",
    danger: true
  });
  if (!ok) return;
  recordHistory();
  for (const item of items) {
    if (item.fileId) deleteFileRecord(item.fileId);
  }
  for (const url of objectUrls.values()) URL.revokeObjectURL(url);
  objectUrls.clear();
  state.items = state.items.filter((item) => (item.projectId || DEFAULT_PROJECT_ID) !== state.currentProjectId);
  state.strokes = state.strokes.filter((stroke) => (stroke.projectId || DEFAULT_PROJECT_ID) !== state.currentProjectId);
  state.connections = state.connections.filter((connection) => (connection.projectId || DEFAULT_PROJECT_ID) !== state.currentProjectId);
  state.selectedId = null;
  state.selectedStrokeId = null;
  state.selectedConnectionId = null;
  hideConnectionDelete();
  for (const item of items) {
    if (item.fileId) state.fileCache?.delete(item.fileId);
  }
  render();
  scheduleSave();
  setStatus("当前项目已清空");
}

let saveTimer = null;

function scheduleSave() {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(saveState, 220);
}

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function txStore(mode = "readonly") {
  return state.db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
}

function dbGet(key) {
  return new Promise((resolve, reject) => {
    const req = txStore().get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function dbPut(key, value) {
  return new Promise((resolve, reject) => {
    const req = txStore("readwrite").put(value, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function dbDelete(key) {
  return new Promise((resolve, reject) => {
    const req = txStore("readwrite").delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function putFileRecord(id, file) {
  const files = (await dbGet(FILE_RECORD)) || {};
  files[id] = {
    name: file.name,
    type: file.type,
    size: file.size,
    blob: file
  };
  await dbPut(FILE_RECORD, files);
}

async function deleteFileRecord(id) {
  const files = (await dbGet(FILE_RECORD)) || {};
  delete files[id];
  await dbPut(FILE_RECORD, files);
}

async function saveState() {
  if (!state.db) return;
  const payload = {
    panX: state.panX,
    panY: state.panY,
    zoom: state.zoom,
    theme: state.theme,
    projects: state.projects,
    currentProjectId: state.currentProjectId,
    strokes: state.strokes,
    connections: state.connections,
    items: state.items
  };
  await dbPut(STATE_RECORD, payload);
}

async function restoreState() {
  state.db = await openDb();
  const saved = await dbGet(STATE_RECORD);
  const files = (await dbGet(FILE_RECORD)) || {};
  state.fileCache = new Map(Object.entries(files).map(([id, record]) => [id, record]));

  if (saved) {
    state.panX = saved.panX ?? state.panX;
    state.panY = saved.panY ?? state.panY;
    state.zoom = saved.zoom ?? state.zoom;
    state.items = Array.isArray(saved.items) ? saved.items : [];
    state.strokes = Array.isArray(saved.strokes) ? saved.strokes : [];
    state.connections = Array.isArray(saved.connections) ? saved.connections : [];
    state.projects = Array.isArray(saved.projects) ? saved.projects : state.projects;
    state.currentProjectId = saved.currentProjectId || state.currentProjectId;
    normalizeProjects();
  setTheme(saved.theme === "dark" ? "dark" : "light", false);
  }
  normalizeProjects();
  renderProjects();
  applyTransform();
  render();
}

function pastePoint() {
  return worldFromClient(window.innerWidth / 2, window.innerHeight / 2);
}

function isLikelyEmoji(text) {
  const trimmed = text.trim();
  return trimmed.length <= 8 && /\p{Extended_Pictographic}/u.test(trimmed);
}

function renderEmojiPage() {
  renderEmojiTabs();
  const list = emojiCategories[state.emojiCategory] || emojiCategories.表情;
  const pageCount = Math.max(1, Math.ceil(list.length / EMOJI_PAGE_SIZE));
  state.emojiPage = Math.max(0, Math.min(pageCount - 1, state.emojiPage));
  const start = state.emojiPage * EMOJI_PAGE_SIZE;
  const buttons = list.slice(start, start + EMOJI_PAGE_SIZE).map((emoji) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = emoji;
    button.title = emoji;
    return button;
  });
  els.emojiGrid.replaceChildren(...buttons);
  els.emojiPageLabel.value = `${state.emojiCategory} ${state.emojiPage + 1} / ${pageCount}`;
  els.emojiPrevBtn.disabled = state.emojiPage === 0;
  els.emojiNextBtn.disabled = state.emojiPage === pageCount - 1;
}

function renderEmojiTabs() {
  const tabs = Object.keys(emojiCategories).map((name) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = name;
    button.dataset.category = name;
    button.classList.toggle("active", name === state.emojiCategory);
    return button;
  });
  els.emojiTabs.replaceChildren(...tabs);
}

function positionPopover(popover, anchor, gap = 10) {
  const rect = anchor.getBoundingClientRect();
  popover.style.top = `${rect.bottom + gap}px`;
  popover.style.left = `${rect.left + rect.width / 2}px`;
  window.requestAnimationFrame(() => {
    const half = popover.offsetWidth / 2;
    const left = Math.min(window.innerWidth - half - 12, Math.max(half + 12, rect.left + rect.width / 2));
    popover.style.left = `${left}px`;
  });
}

function setAccountMode(mode) {
  const labels = { register: "创建账号", login: "登录", recover: "找回账号" };
  for (const button of els.accountPanel.querySelectorAll("[data-account-tab]")) {
    button.classList.toggle("active", button.dataset.accountTab === mode);
  }
  els.accountSubmitBtn.textContent = labels[mode] || labels.register;
  els.accountPanel.classList.toggle("recover-mode", mode === "recover");
}

function toggleAccountPanel(open) {
  els.accountPanel.classList.toggle("open", open);
  if (open) setAccountMode("register");
}

function setActiveColor(color) {
  state.activeColor = color;
  for (const button of els.colorStrip.querySelectorAll(".color-swatch")) {
    button.classList.toggle("active", button.dataset.color === color);
  }
  els.linePreviewPath?.setAttribute("stroke", color);
}

function setActiveTextColor(color) {
  state.activeTextColor = color;
  for (const button of els.textColorStrip.querySelectorAll(".color-swatch")) {
    button.classList.toggle("active", button.dataset.color === color);
  }
}

function toggleTextOptions(open = !els.textOptions.classList.contains("open")) {
  els.textOptions.classList.toggle("open", open);
  if (open) {
    els.lineOptions.classList.remove("open");
    els.emojiPopover.classList.remove("open");
    positionPopover(els.textOptions, els.textBtn);
  }
}

function closeToolPopovers(except = "") {
  if (except !== "emoji") els.emojiPopover.classList.remove("open");
  if (except !== "text") els.textOptions.classList.remove("open");
  if (except !== "line") els.lineOptions.classList.remove("open");
}

function bindEvents() {
  renderEmojiPage();
  els.projectSelect.addEventListener("change", () => {
    closeToolPopovers();
    switchProject(els.projectSelect.value);
  });
  els.addProjectBtn.addEventListener("click", () => {
    closeToolPopovers();
    addProject();
  });
  els.deleteProjectBtn.addEventListener("click", () => {
    closeToolPopovers();
    deleteCurrentProject();
  });

  els.uploadBtn.addEventListener("click", () => {
    closeToolPopovers();
    els.fileInput.click();
  });
  els.fileInput.addEventListener("change", async () => {
    await addFiles(els.fileInput.files, pastePoint());
    els.fileInput.value = "";
  });

  els.textBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    const shouldOpen = !els.textOptions.classList.contains("open");
    closeToolPopovers("text");
    toggleTextOptions(shouldOpen);
  });
  els.addTextFromOptionsBtn.addEventListener("click", () => {
    addTextAt(pastePoint());
  });
  els.textFontSelect.addEventListener("change", () => {
    state.activeTextFont = els.textFontSelect.value;
    setStatus("已切换文字字体");
  });
  els.textColorStrip.addEventListener("click", (event) => {
    const button = event.target.closest(".color-swatch");
    if (!button) return;
    setActiveTextColor(button.dataset.color);
    setStatus("已切换文字颜色");
  });
  els.lineBtn.addEventListener("click", () => {
    closeToolPopovers("line");
    setActiveTool(state.activeTool === "line" ? "select" : "line");
  });
  els.eraserBtn.addEventListener("click", () => {
    closeToolPopovers();
    setActiveTool(state.activeTool === "eraser" ? "select" : "eraser");
  });
  els.colorStrip.addEventListener("click", (event) => {
    const button = event.target.closest(".color-swatch");
    if (!button) return;
    setActiveColor(button.dataset.color);
  });

  els.emojiBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    const shouldOpen = !els.emojiPopover.classList.contains("open");
    closeToolPopovers("emoji");
    els.emojiPopover.classList.toggle("open", shouldOpen);
    if (shouldOpen) {
      renderEmojiPage();
      positionPopover(els.emojiPopover, els.emojiBtn);
    }
  });

  els.emojiPopover.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLButtonElement)) return;
    if (event.target.dataset.category) {
      state.emojiCategory = event.target.dataset.category;
      state.emojiPage = 0;
      renderEmojiPage();
      return;
    }
    if (event.target === els.emojiPrevBtn) {
      state.emojiPage -= 1;
      renderEmojiPage();
      return;
    }
    if (event.target === els.emojiNextBtn) {
      state.emojiPage += 1;
      renderEmojiPage();
      return;
    }
    if (!els.emojiGrid.contains(event.target)) return;
    addEmojiAt(pastePoint(), event.target.textContent);
  });

  els.themeBtn.addEventListener("click", () => {
    closeToolPopovers();
    setTheme(state.theme === "dark" ? "light" : "dark");
  });
  els.undoBtn.addEventListener("click", () => {
    closeToolPopovers();
    undo();
  });
  els.zoomOutBtn.addEventListener("click", () => {
    closeToolPopovers();
    zoomAt(window.innerWidth / 2, window.innerHeight / 2, state.zoom / 1.2);
  });
  els.zoomInBtn.addEventListener("click", () => {
    closeToolPopovers();
    zoomAt(window.innerWidth / 2, window.innerHeight / 2, state.zoom * 1.2);
  });
  els.homeBtn.addEventListener("click", () => {
    closeToolPopovers();
    centerView();
  });
  els.locateBtn.addEventListener("click", () => {
    closeToolPopovers();
    locateProjectContent();
  });
  els.accountBtn.addEventListener("click", () => {
    closeToolPopovers();
    toggleAccountPanel(true);
  });
  els.accountCloseBtn.addEventListener("click", () => toggleAccountPanel(false));
  els.accountPanel.addEventListener("click", (event) => {
    if (event.target === els.accountPanel) toggleAccountPanel(false);
    const tab = event.target.closest("[data-account-tab]");
    if (tab) setAccountMode(tab.dataset.accountTab);
  });
  els.appDialogLayer.addEventListener("click", (event) => {
    if (event.target === els.appDialogLayer) closeAppDialog(null);
  });
  els.appDialogCloseBtn.addEventListener("click", () => closeAppDialog(null));
  els.appDialogCancelBtn.addEventListener("click", () => closeAppDialog(null));
  els.appDialogConfirmBtn.addEventListener("click", () => {
    closeAppDialog(dialogMode === "input" ? els.appDialogInput.value : true);
  });
  els.appDialogInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      closeAppDialog(els.appDialogInput.value);
    }
  });
  els.sendCodeBtn.addEventListener("click", () => setStatus("验证码发送功能待后续接入"));
  els.accountSubmitBtn.addEventListener("click", () => setStatus("账号功能 UI 已就绪，后续接入邮箱注册和找回"));
  els.connectionDeleteBtn?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  els.connectionDeleteBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    removeSelected();
  });
  els.deleteBtn.addEventListener("click", () => {
    closeToolPopovers();
    removeSelected();
  });
  els.clearBtn.addEventListener("click", () => {
    closeToolPopovers();
    clearCanvas();
  });

  els.viewport.addEventListener("pointerdown", (event) => {
    els.viewport.focus();
    const onCanvas = event.target === els.viewport || event.target === els.surface || event.target.classList?.contains("ink-layer");
    if (!onCanvas) return;
    closeToolPopovers();
    selectItem(null);
    if (event.button === 1 || state.spaceDown) {
      beginPan(event);
      event.preventDefault();
      return;
    }
    if (state.activeTool === "eraser") {
      if (event.button !== 0) return;
      recordHistory();
      state.erasing = true;
      eraseAt(worldFromClient(event.clientX, event.clientY));
      event.preventDefault();
      return;
    }
    if (state.activeTool === "line") {
      if (event.button !== 0) return;
      beginDrawing(event);
      return;
    }
    beginPan(event);
  });

  els.viewport.addEventListener("auxclick", (event) => {
    if (event.button === 1) event.preventDefault();
  });

  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointerdown", (event) => {
    if (state.connecting && event.button === 2) {
      event.preventDefault();
      cancelConnectorDrag();
      render();
    }
  });
  document.addEventListener("contextmenu", (event) => {
    if (!state.connecting) return;
    event.preventDefault();
    cancelConnectorDrag();
    render();
  });

  els.viewport.addEventListener("wheel", (event) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    zoomAt(event.clientX, event.clientY, state.zoom * delta);
  }, { passive: false });

  els.viewport.addEventListener("dragover", (event) => {
    event.preventDefault();
    els.viewport.classList.add("dragging-file");
  });

  els.viewport.addEventListener("dragleave", (event) => {
    if (event.currentTarget === event.target) {
      els.viewport.classList.remove("dragging-file");
    }
  });

  els.viewport.addEventListener("drop", async (event) => {
    event.preventDefault();
    els.viewport.classList.remove("dragging-file");
    await addFiles(event.dataTransfer.files, worldFromClient(event.clientX, event.clientY));
  });

  document.addEventListener("paste", async (event) => {
    const items = Array.from(event.clipboardData?.items || []);
    const files = items
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile())
      .filter(Boolean);

    if (files.length) {
      await addFiles(files, pastePoint());
      return;
    }

    const text = event.clipboardData?.getData("text/plain");
    if (!text) return;
    if (isLikelyEmoji(text)) addEmojiAt(pastePoint(), text.trim());
    else addTextAt(pastePoint(), text);
  });

  document.addEventListener("keydown", (event) => {
    if (els.appDialogLayer.classList.contains("open")) {
      if (event.key === "Escape") closeAppDialog(null);
      return;
    }
    if (event.target?.isContentEditable) return;
    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      removeSelected();
    }
    if (event.key === "Escape") {
      if (cancelConnectorDrag()) {
        event.preventDefault();
        render();
        return;
      }
      selectItem(null);
      setActiveTool("select");
      closeToolPopovers();
    }
    if (event.key === " ") state.spaceDown = true;
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === " ") state.spaceDown = false;
  });

  window.addEventListener("resize", applyTransform);
  window.addEventListener("resize", () => {
    if (els.emojiPopover.classList.contains("open")) positionPopover(els.emojiPopover, els.emojiBtn);
    if (els.textOptions.classList.contains("open")) positionPopover(els.textOptions, els.textBtn);
    if (els.lineOptions.classList.contains("open")) positionPopover(els.lineOptions, els.lineBtn);
  });
}

async function init() {
  bindEvents();
  try {
    await restoreState();
    setStatus("已就绪：拖拽上传、Ctrl+V 粘贴、滚轮缩放、拖动画布移动");
  } catch (error) {
    console.error(error);
    applyTransform();
    setStatus("浏览器本地保存不可用，但当前画布仍可使用");
  }
}

init();
