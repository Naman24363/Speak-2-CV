/**
 * Resume Editor - Voice Input System
 * Handles speech recognition, text-to-speech, and form management
 */

import { postProcessSpeech } from "./speech_postprocess.js";
window.postProcessSpeech = postProcessSpeech;

// ===================== JSON Data Helpers =====================

function readJson(id) {
  const el = document.getElementById(id);
  if (!el) return [];
  const txt = (el.textContent || "").trim();
  if (!txt) return [];
  try {
    return JSON.parse(txt);
  } catch {
    return [];
  }
}

const EDUCATION = readJson("education-data");
const EXPERIENCE = readJson("experience-data");
const PROJECTS = readJson("projects-data");
const SKILLS = readJson("skills-data");

// ===================== DOM Helpers =====================

function el(tag, attrs = {}, children = []) {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") n.className = v;
    else if (k.startsWith("aria-")) n.setAttribute(k, v);
    else if (k === "text") n.textContent = v;
    else n[k] = v;
  });
  children.forEach((c) => n.appendChild(c));
  return n;
}

function sectionCard(titleText, onRemove) {
  const title = el("div", { class: "row between" }, [
    el("strong", { text: titleText }),
    el("button", { class: "btn danger", type: "button", text: "Remove" }),
  ]);
  title.querySelector("button").addEventListener("click", onRemove);
  return el("div", { class: "card subtle" }, [title]);
}

// ===================== Education Section =====================

const educationList = document.getElementById("educationList");
function renderEducation() {
  educationList.innerHTML = "";
  EDUCATION.forEach((item, idx) => {
    const card = sectionCard("Education Entry", () => {
      EDUCATION.splice(idx, 1);
      renderEducation();
    });

    const degree = el("input", {
      placeholder: "Degree (e.g., B.Tech CSE)",
      value: item.degree || "",
      class: "input",
      "data-narrator": "Education degree",
    });
    const institution = el("input", {
      placeholder: "Institution",
      value: item.institution || "",
      class: "input",
      "data-narrator": "Education institution",
    });
    const dates = el("input", {
      placeholder: "Dates (e.g., 2024–2028)",
      value: item.dates || "",
      class: "input",
      "data-narrator": "Education dates",
    });
    const details = el("textarea", {
      placeholder: "Details (optional)",
      value: item.details || "",
      rows: 3,
      class: "input",
      "data-narrator": "Education details",
    });

    [degree, institution, dates, details].forEach((inp) =>
      inp.addEventListener("input", () => {
        item.degree = degree.value;
        item.institution = institution.value;
        item.dates = dates.value;
        item.details = details.value;
      })
    );

    card.appendChild(el("div", { class: "grid2" }, [degree, institution]));
    card.appendChild(el("div", { class: "grid2" }, [dates, el("div")]));
    card.appendChild(details);
    educationList.appendChild(card);
  });
}

// ===================== Experience Section =====================

const experienceList = document.getElementById("experienceList");
function renderExperience() {
  experienceList.innerHTML = "";
  EXPERIENCE.forEach((item, idx) => {
    const card = sectionCard("Experience Entry", () => {
      EXPERIENCE.splice(idx, 1);
      renderExperience();
    });

    const role = el("input", {
      placeholder: "Role",
      value: item.role || "",
      class: "input",
      "data-narrator": "Experience role",
    });
    const company = el("input", {
      placeholder: "Company/Org",
      value: item.company || "",
      class: "input",
      "data-narrator": "Experience company",
    });
    const dates = el("input", {
      placeholder: "Dates",
      value: item.dates || "",
      class: "input",
      "data-narrator": "Experience dates",
    });
    const bullets = el("textarea", {
      placeholder: "Bullet points (one per line)",
      value: (item.bullets || []).join("\n"),
      rows: 5,
      class: "input mono",
      "data-narrator": "Experience bullet points",
    });

    [role, company, dates, bullets].forEach((inp) =>
      inp.addEventListener("input", () => {
        item.role = role.value;
        item.company = company.value;
        item.dates = dates.value;
        item.bullets = bullets.value
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      })
    );

    card.appendChild(el("div", { class: "grid2" }, [role, company]));
    card.appendChild(el("div", { class: "grid2" }, [dates, el("div")]));
    card.appendChild(bullets);
    experienceList.appendChild(card);
  });
}

// ===================== Projects Section =====================

const projectsList = document.getElementById("projectsList");
function renderProjects() {
  projectsList.innerHTML = "";
  PROJECTS.forEach((item, idx) => {
    const card = sectionCard("Project Entry", () => {
      PROJECTS.splice(idx, 1);
      renderProjects();
    });

    const name = el("input", {
      placeholder: "Project name",
      value: item.name || "",
      class: "input",
      "data-narrator": "Project name",
    });
    const tech = el("input", {
      placeholder: "Tech (e.g., Django, HTML, CSS)",
      value: item.tech || "",
      class: "input",
      "data-narrator": "Project tech stack",
    });
    const bullets = el("textarea", {
      placeholder: "Bullets (one per line)",
      value: (item.bullets || []).join("\n"),
      rows: 5,
      class: "input mono",
      "data-narrator": "Project bullet points",
    });

    [name, tech, bullets].forEach((inp) =>
      inp.addEventListener("input", () => {
        item.name = name.value;
        item.tech = tech.value;
        item.bullets = bullets.value
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      })
    );

    card.appendChild(el("div", { class: "grid2" }, [name, tech]));
    card.appendChild(bullets);
    projectsList.appendChild(card);
  });
}

// ===================== Skills Section =====================

const skillsText = document.getElementById("skillsText");
skillsText.value = (SKILLS || [])
  .filter((x) => typeof x === "string")
  .join("\n");

// ===================== Add Buttons =====================

document.getElementById("addEducation").addEventListener("click", () => {
  EDUCATION.push({ degree: "", institution: "", dates: "", details: "" });
  renderEducation();
});

document.getElementById("addExperience").addEventListener("click", () => {
  EXPERIENCE.push({ role: "", company: "", dates: "", bullets: [] });
  renderExperience();
});

document.getElementById("addProject").addEventListener("click", () => {
  PROJECTS.push({ name: "", tech: "", bullets: [] });
  renderProjects();
});

// ===================== Form Submission =====================

document.getElementById("resumeForm").addEventListener("submit", () => {
  if (recognition) {
    try {
      recognition.stop();
    } catch {}
  }
  setListeningUI(false);
  setLive("");

  document.getElementById("education_json").value = JSON.stringify(EDUCATION);
  document.getElementById("experience_json").value = JSON.stringify(EXPERIENCE);
  document.getElementById("projects_json").value = JSON.stringify(PROJECTS);

  const skills = skillsText.value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  document.getElementById("skills_json").value = JSON.stringify(skills);
});

// ===================== Initial Render =====================

renderEducation();
renderExperience();
renderProjects();

// ===================== Voice Input + UI =====================

let recognition = null;
let isVoiceModeOn = false;
let handlersAttached = false;

// While narrator is speaking and we intentionally paused recognition
let ttsPausing = false;

// Text case transformation modes
let caseMode = "original"; // "original", "caps", "camelCase", "lowercase"

const status = document.getElementById("voiceStatus");
const liveTranscript = document.getElementById("liveTranscript");
const voiceDetails = document.querySelector("details.card.subtle");
const caseModeIndicator = document.getElementById("caseModeIndicator");

function setLive(text) {
  if (!liveTranscript) return;
  liveTranscript.textContent = text ? `Heard: ${text}` : "";
}

function setListeningUI(isListening) {
  if (!voiceDetails) return;
  voiceDetails.classList.toggle("listening-glow", !!isListening);
  voiceDetails.classList.toggle("pulse", !!isListening);
}

// ===================== Case Mode Helpers =====================

function updateCaseModeIndicator() {
  if (!caseModeIndicator) return;
  
  const modeTexts = {
    original: "",
    caps: "🔤 ALL CAPS",
    camelCase: "🐪 Camel Case",
    lowercase: "🔡 Lower Case"
  };
  
  caseModeIndicator.textContent = modeTexts[caseMode] || "";
  caseModeIndicator.className = caseMode !== "original" ? "case-mode-active" : "";
}

function transformText(text) {
  if (caseMode === "original") {
    return text;
  } else if (caseMode === "caps") {
    return text.toUpperCase();
  } else if (caseMode === "camelCase") {
    return toCamelCase(text);
  } else if (caseMode === "lowercase") {
    return text.toLowerCase();
  }
  return text;
}

function toCamelCase(text) {
  // Split by spaces and special characters
  const words = text.split(/[\s\-_]+/).filter(w => w.length > 0);
  if (words.length === 0) return text;
  
  // First word is lowercase, rest are title case
  const camel = words[0].toLowerCase() + 
    words.slice(1)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join("");
  
  return camel;
}

function setCaseMode(newMode) {
  const validModes = ["original", "caps", "camelCase", "lowercase"];
  if (!validModes.includes(newMode)) return;
  
  caseMode = newMode;
  updateCaseModeIndicator();
}

// Active field highlight
let lastActive = null;
function setActiveFieldUI(field) {
  if (lastActive && lastActive.classList) lastActive.classList.remove("voice-active");
  lastActive = field;
  if (field && field.classList) field.classList.add("voice-active");
}

document.addEventListener("focusin", (e) => {
  const t = e.target;
  if (!t) return;
  const tag = (t.tagName || "").toLowerCase();
  if (tag !== "input" && tag !== "textarea") return;
  setActiveFieldUI(t);
  announceActiveField(t);
});

function getActiveField() {
  const a = document.activeElement;
  return a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA") ? a : null;
}

// ===================== Audio Context =====================

let audioContext;

function ensureAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === "suspended") {
    return audioContext.resume();
  }
  return Promise.resolve();
}

// ===================== Narrator (TTS) =====================

const narrator = {
  enabled: true,
  lastKey: "",
  isSpeaking: false,
  speakTimeout: null,

  speak(text, onEnd) {
    if (!this.enabled) {
      if (onEnd) onEnd();
      return;
    }
    if (!text) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      this.isSpeaking = true;
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.0;
      u.pitch = 1.0;
      u.lang = "en-IN";

      u.onend = () => {
        this.isSpeaking = false;
        if (this.speakTimeout) clearTimeout(this.speakTimeout);
        if (onEnd) onEnd();
      };

      u.onerror = () => {
        this.isSpeaking = false;
        if (this.speakTimeout) clearTimeout(this.speakTimeout);
        if (onEnd) onEnd();
      };

      this.speakTimeout = setTimeout(() => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      }, 5000);

      window.speechSynthesis.speak(u);
    } catch {
      this.isSpeaking = false;
      if (this.speakTimeout) clearTimeout(this.speakTimeout);
      if (onEnd) onEnd();
    }
  },
};

async function speakWithDelay(text) {
  await ensureAudioContext();
  setTimeout(() => narrator.speak(text), 150);
}

// Narrator toggle
const narratorToggle = document.getElementById("narratorToggle");
if (narratorToggle) {
  narrator.enabled = narratorToggle.checked;
  narratorToggle.addEventListener("change", () => {
    narrator.enabled = narratorToggle.checked;
    if (narrator.enabled) speakWithDelay("Narrator on.");
  });
}

// ===================== Recognition Safe Controls =====================

function safeStartRecognition() {
  if (!recognition) return;
  try {
    recognition.start();
  } catch {}
}

function safeStopRecognition() {
  if (!recognition) return;
  try {
    recognition.stop();
  } catch {}
}

/**
 * Speak something while voice mode is ON without killing recognition permanently.
 * - Temporarily stop recognition
 * - Speak
 * - Restart recognition after speech ends
 */
function speakWhileListening(text) {
  if (!text) return;

  if (isVoiceModeOn && recognition) {
    ttsPausing = true;
    safeStopRecognition(); // triggers onend, but auto-restart suppressed there
    narrator.speak(text, () => {
      ttsPausing = false;
      if (isVoiceModeOn) {
        setTimeout(() => safeStartRecognition(), 250);
      }
    });
  } else {
    narrator.speak(text);
  }
}

// ===================== Field Announcement =====================

function labelForField(field) {
  if (!field) return "";
  const dn = field.getAttribute("data-narrator");
  if (dn) return dn.trim();
  if (field.id) {
    const lab = document.querySelector(`label[for="${field.id}"]`);
    if (lab) return (lab.textContent || "").trim();
  }
  return (field.name || "field").trim();
}

function sectionForField(field) {
  if (!field) return "";
  let node = field;
  while (node && node !== document.body) {
    let prev = node.previousElementSibling;
    while (prev) {
      if ((prev.tagName || "").toLowerCase() === "h3") {
        return (prev.textContent || "").trim();
      }
      prev = prev.previousElementSibling;
    }
    node = node.parentElement;
  }
  return "";
}

function announceActiveField(field) {
  const sec = sectionForField(field);
  const lab = labelForField(field);
  const key = `${sec}::${lab}`;
  if (key === narrator.lastKey) return;
  narrator.lastKey = key;

  if (sec) speakWhileListening(`You are now in ${sec}. ${lab}.`);
  else speakWhileListening(`You are now editing ${lab}.`);
}

// ===================== Voice Command Helpers =====================

function findSectionHeading(text) {
  const target = (text || "").trim().toLowerCase();
  const headings = Array.from(document.querySelectorAll("h3"));
  return headings.find((h) => (h.textContent || "").trim().toLowerCase() === target) || null;
}

function focusFirstFieldInSection(sectionName) {
  const h3 = findSectionHeading(sectionName);
  if (!h3) return false;

  const focusables = Array.from(document.querySelectorAll("input, textarea")).filter(
    (el) => !el.disabled && el.type !== "hidden" && el.offsetParent !== null
  );

  for (const el of focusables) {
    const pos = h3.compareDocumentPosition(el);
    const isAfter = !!(pos & Node.DOCUMENT_POSITION_FOLLOWING);
    if (isAfter) {
      el.focus();
      return true;
    }
  }
  return false;
}

function focusNextField() {
  const focusables = Array.from(document.querySelectorAll("input, textarea")).filter(
    (el) => !el.disabled && el.type !== "hidden" && el.offsetParent !== null
  );
  const current = document.activeElement;
  const idx = focusables.indexOf(current);
  const next = focusables[Math.min(idx + 1, focusables.length - 1)];
  if (next) next.focus();
}

function focusPreviousField() {
  const focusables = Array.from(document.querySelectorAll("input, textarea")).filter(
    (el) => !el.disabled && el.type !== "hidden" && el.offsetParent !== null
  );
  const current = document.activeElement;
  const idx = focusables.indexOf(current);
  const prev = focusables[Math.max(idx - 1, 0)];
  if (prev) prev.focus();
}

function removeLastItem(arr, renderFn) {
  if (!Array.isArray(arr) || arr.length === 0) return false;
  arr.pop();
  renderFn();
  return true;
}

function removeAllItems(arr, renderFn) {
  if (!Array.isArray(arr) || arr.length === 0) return false;
  arr.length = 0;
  renderFn();
  return true;
}

function deleteLastWord(field) {
  const v = field.value || "";
  let trimmed = v.trimEnd();
  const lastSpace = trimmed.lastIndexOf(" ");
  field.value = lastSpace === -1 ? "" : trimmed.slice(0, lastSpace + 1);
  field.dispatchEvent(new Event("input", { bubbles: true }));
}

function deleteLastSentence(field) {
  const v = field.value || "";
  const cut = Math.max(v.lastIndexOf("."), v.lastIndexOf("?"), v.lastIndexOf("!"), v.lastIndexOf("\n"));
  const newVal = cut > 0 ? v.slice(0, cut + 1).trimEnd() : v.slice(0, Math.max(0, v.length - 30)).trimEnd();
  field.value = newVal;
  field.dispatchEvent(new Event("input", { bubbles: true }));
}

function handleVoiceCommand(raw, field) {
  const t = (raw || "").trim().toLowerCase();

  // Section navigation
  const m = t.match(/^(go to|open|edit)\s+(basics|education|experience|projects|skills)$/);
  if (m) {
    const section = m[2];
    const ok = focusFirstFieldInSection(section);
    status.textContent = ok ? `Moved to ${section}.` : `Could not find ${section}.`;
    speakWhileListening(ok ? `Opening ${section}.` : `I could not find ${section}.`);
    return true;
  }

  const m2 = t.match(/^go\s+(basics|education|experience|projects|skills)$/);
  if (m2) {
    const section = m2[1];
    const ok = focusFirstFieldInSection(section);
    status.textContent = ok ? `Moved to ${section}.` : `Could not find ${section}.`;
    speakWhileListening(ok ? `Opening ${section}.` : `I could not find ${section}.`);
    return true;
  }

  // Add entry commands
  if (t === "add education") {
    document.getElementById("addEducation")?.click();
    status.textContent = "Added education entry.";
    return true;
  }
  if (t === "add experience") {
    document.getElementById("addExperience")?.click();
    status.textContent = "Added experience entry.";
    return true;
  }
  if (t === "add project" || t === "add projects") {
    document.getElementById("addProject")?.click();
    status.textContent = "Added project entry.";
    return true;
  }

  // Remove items
  if (t === "remove last education" || t === "delete last education" || t === "remove education") {
    const ok = removeLastItem(EDUCATION, renderEducation);
    status.textContent = ok ? "Removed last education entry." : "No education entries to remove.";
    return true;
  }
  if (t === "remove all education" || t === "delete all education") {
    const ok = removeAllItems(EDUCATION, renderEducation);
    status.textContent = ok ? "Removed all education entries." : "No education entries to remove.";
    return true;
  }

  if (t === "remove last experience" || t === "delete last experience" || t === "remove experience") {
    const ok = removeLastItem(EXPERIENCE, renderExperience);
    status.textContent = ok ? "Removed last experience entry." : "No experience entries to remove.";
    return true;
  }
  if (t === "remove all experience" || t === "delete all experience") {
    const ok = removeAllItems(EXPERIENCE, renderExperience);
    status.textContent = ok ? "Removed all experience entry." : "No experience entries to remove.";
    return true;
  }

  if (t === "remove last project" || t === "delete last project" || t === "remove project" || t === "remove projects") {
    const ok = removeLastItem(PROJECTS, renderProjects);
    status.textContent = ok ? "Removed last project entry." : "No projects to remove.";
    return true;
  }
  if (
    t === "remove all project" ||
    t === "delete all project" ||
    t === "remove all projects" ||
    t === "delete all projects"
  ) {
    const ok = removeAllItems(PROJECTS, renderProjects);
    status.textContent = ok ? "Removed all project entries." : "No projects to remove.";
    return true;
  }

  // Navigation
  if (t === "go to next field") {
    focusNextField();
    status.textContent = "Moved to next field.";
    setTimeout(() => {
      const f = getActiveField();
      if (f) announceActiveField(f);
    }, 50);
    return true;
  }
  if (t === "go to previous field") {
    focusPreviousField();
    status.textContent = "Moved to previous field.";
    setTimeout(() => {
      const f = getActiveField();
      if (f) announceActiveField(f);
    }, 50);
    return true;
  }

  // Field editing
  if (t === "clear field" || t === "clear this" || t === "clear" || t === "delete all") {
    if (!field) {
      status.textContent = "No field selected.";
      return true;
    }
    field.value = "";
    field.dispatchEvent(new Event("input", { bubbles: true }));
    status.textContent = "Cleared field.";
    return true;
  }

  if (t === "delete word") {
    if (!field) {
      status.textContent = "No field selected.";
      return true;
    }
    deleteLastWord(field);
    status.textContent = "Deleted last word.";
    return true;
  }

  if (t === "delete last" || t === "undo last" || t === "delete last sentence" || t === "delete sentence") {
    if (!field) {
      status.textContent = "No field selected.";
      return true;
    }
    deleteLastSentence(field);
    status.textContent = "Deleted last part.";
    return true;
  }

  // Quick formatting
  if (t === "next line" || t === "new line") {
    if (!field) return true;
    field.value = (field.value || "") + "\n";
    field.dispatchEvent(new Event("input", { bubbles: true }));
    status.textContent = "Inserted new line.";
    speakWhileListening("New line.");
    return true;
  }

  if (t === "new paragraph" || t === "next paragraph") {
    if (!field) return true;
    field.value = (field.value || "") + "\n\n";
    field.dispatchEvent(new Event("input", { bubbles: true }));
    status.textContent = "Inserted new paragraph.";
    speakWhileListening("New paragraph.");
    return true;
  }

  // Document actions
  if (t === "save the resume" || t === "save resume") {
    saveResume();
    status.textContent = "Saving resume...";
    speakWhileListening("Saving your resume.");
    return true;
  }

  if (t === "preview the resume" || t === "preview resume") {
    previewResume();
    status.textContent = "Opening preview...";
    speakWhileListening("Opening preview.");
    return true;
  }

  if (
    t === "export the resume as pdf" ||
    t === "export resume as pdf" ||
    t === "download the resume as pdf" ||
    t === "download resume as pdf"
  ) {
    exportResumeAsPdf();
    status.textContent = "Exporting as PDF...";
    speakWhileListening("Exporting your resume as PDF.");
    return true;
  }

  if (
    t === "export the resume as doc" ||
    t === "export resume as doc" ||
    t === "export the resume as docx" ||
    t === "export resume as docx" ||
    t === "download the resume as doc" ||
    t === "download resume as doc" ||
    t === "download the resume as docx" ||
    t === "download resume as docx"
  ) {
    exportResumeAsDocx();
    status.textContent = "Exporting as DOCX...";
    speakWhileListening("Exporting your resume as Word document.");
    return true;
  }

  // Text case modes
  if (t === "switch to all capital" || t === "switch to all caps" || t === "caps lock on") {
    setCaseMode("caps");
    status.textContent = "ALL CAPS mode ON";
    speakWhileListening("All capitals mode enabled. Everything you type will be in capital letters.");
    return true;
  }

  if (t === "switch to camel case") {
    setCaseMode("camelCase");
    status.textContent = "Camel Case mode ON";
    speakWhileListening("Camel case mode enabled. Text will be formatted as camel case.");
    return true;
  }

  if (t === "switch to lower case" || t === "switch to lowercase") {
    setCaseMode("lowercase");
    status.textContent = "Lower Case mode ON";
    speakWhileListening("Lower case mode enabled. Everything you type will be lowercase.");
    return true;
  }

  if (t === "revert back to original" || t === "turn off case mode" || t === "reset case mode") {
    setCaseMode("original");
    status.textContent = "Original mode - all typing modes off";
    speakWhileListening("All typing modes have been turned off. You are back to normal mode.");
    return true;
  }

  return false;
}

// ===================== Document Action Helpers =====================

function getResumeId() {
  // Extract resume ID from the URL or data attribute
  const urlMatch = window.location.pathname.match(/\/r\/(\d+)\//);
  return urlMatch ? urlMatch[1] : null;
}

function saveResume() {
  // Submit the form with "save" action
  const form = document.getElementById("resumeForm");
  if (!form) return;

  // Update hidden JSON fields before saving
  updateHiddenJsonFields();

  const submitBtn = form.querySelector('button[name="action"][value="save"]');
  if (submitBtn) {
    submitBtn.click();
  } else {
    form.submit();
  }
}

function previewResume() {
  // Submit the form with "preview" action
  const form = document.getElementById("resumeForm");
  if (!form) return;

  // Update hidden JSON fields before saving
  updateHiddenJsonFields();

  const submitBtn = form.querySelector('button[name="action"][value="preview"]');
  if (submitBtn) {
    submitBtn.click();
  }
}

function exportResumeAsPdf() {
  const resumeId = getResumeId();
  if (!resumeId) {
    speakWhileListening("Could not find resume ID.");
    return;
  }
  window.location.href = `/builder/r/${resumeId}/export/pdf/`;
}

function exportResumeAsDocx() {
  const resumeId = getResumeId();
  if (!resumeId) {
    speakWhileListening("Could not find resume ID.");
    return;
  }
  window.location.href = `/builder/r/${resumeId}/export/docx/`;
}

function updateHiddenJsonFields() {
  // This function ensures JSON fields are updated before form submission
  document.getElementById("education_json").value = JSON.stringify(EDUCATION);
  document.getElementById("experience_json").value = JSON.stringify(EXPERIENCE);
  document.getElementById("projects_json").value = JSON.stringify(PROJECTS);
  document.getElementById("skills_json").value = JSON.stringify(SKILLS);
}

// ===================== SpeechRecognition Setup =====================

function createRecognitionOrNull() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;

  const r = new SR();
  r.lang = "en-IN";
  r.continuous = true;
  r.interimResults = true;
  r.maxAlternatives = 1;
  return r;
}

function attachRecognitionHandlersOnce() {
  if (!recognition || handlersAttached) return;
  handlersAttached = true;

  // Dedup final transcripts (prevents triple insert)
  let lastFinal = "";
  let lastFinalAt = 0;

  recognition.onstart = () => {
    status.textContent = "Listening";
    setListeningUI(true);
  };

  recognition.onend = () => {
    setListeningUI(false);

    // If we intentionally stopped recognition for narrator speech,
    // do NOT auto-restart here. We'll restart after speech ends.
    if (ttsPausing) return;

    if (isVoiceModeOn) {
      setTimeout(() => safeStartRecognition(), 200);
    }
  };

  recognition.onerror = (event) => {
    status.textContent = event?.error ? `Voice error: ${event.error}` : "Voice error";
    setListeningUI(false);
  };

  recognition.onresult = (event) => {
    if (!event?.results?.length) return;

    const lastResult = event.results[event.results.length - 1];
    if (!lastResult?.length) return;

    const transcript = (lastResult[0].transcript || "").trim();
    if (!transcript) return;

    setLive(transcript);

    if (!lastResult.isFinal) return;

    const now = Date.now();
    const normalized = transcript.toLowerCase();

    if (normalized === lastFinal && now - lastFinalAt < 900) {
      setLive("");
      return;
    }
    lastFinal = normalized;
    lastFinalAt = now;

    const currentField = getActiveField();

    if (handleVoiceCommand(transcript, currentField)) {
      setLive("");
      return;
    }

    if (!currentField) {
      status.textContent = `Heard: "${transcript}". Click a text field first.`;
      setLive("");
      return;
    }

    const processed = window.postProcessSpeech ? window.postProcessSpeech(transcript) : transcript;
    if (!processed) {
      setLive("");
      return;
    }

    // Apply case transformation if a mode is active
    let toInsert = transformText(processed);

    // ---- NEW: email-friendly insertion (optional change applied: APPEND, no forced spaces) ----
    const isEmailField =
      currentField &&
      (currentField.type === "email" ||
        (currentField.name && currentField.name.toLowerCase().includes("email")) ||
        (currentField.id && currentField.id.toLowerCase().includes("email")) ||
        (currentField.placeholder && currentField.placeholder.toLowerCase().includes("email")));

    if (isEmailField) {
      // Append without adding spaces (speech_postprocess should already normalize spaces/symbols)
      currentField.value = (currentField.value || "") + toInsert;
      currentField.value = currentField.value.trim(); // keep clean
    } else {
      // Normal fields: keep your old behavior (adds a space unless it's a newline)
      const add = toInsert.startsWith("\n") ? toInsert : " " + toInsert;
      currentField.value = (currentField.value || "") + add;
      currentField.value = currentField.value.replace(/^\s+/, "");
    }

    currentField.dispatchEvent(new Event("input", { bubbles: true }));

    status.textContent = "Inserted";
    setLive("");
  };
}

// ===================== Start / Stop Voice Mode =====================

async function startVoice() {
  if (!recognition) {
    recognition = createRecognitionOrNull();
    if (!recognition) {
      status.textContent = "Voice input not supported. Use Chrome or Edge.";
      speakWhileListening("Voice input is not supported in your browser. Please use Chrome or Edge.");
      return;
    }
  }

  attachRecognitionHandlersOnce();

  const field =
    getActiveField() || document.getElementById("full_name") || document.getElementById("title");
  if (field) field.focus();

  isVoiceModeOn = true;

  await ensureAudioContext();
  speakWithDelay("Voice mode turning ON");

  safeStartRecognition();
}

function stopVoice() {
  isVoiceModeOn = false;
  ttsPausing = false;

  safeStopRecognition();

  setListeningUI(false);
  setLive("");
  speakWithDelay("Voice mode turning OFF");
  status.textContent = "Stopped";
}

// ===================== Buttons =====================

function setupVoiceButtons() {
  const voiceModeBtn = document.getElementById("voiceMode");
  const startVoiceBtn = document.getElementById("startVoice");
  const stopVoiceBtn = document.getElementById("stopVoice");

  if (voiceModeBtn) {
    voiceModeBtn.addEventListener("click", () => {
      if (isVoiceModeOn) stopVoice();
      else startVoice();
    });
  }

  if (startVoiceBtn) {
    startVoiceBtn.addEventListener("click", () => {
      if (isVoiceModeOn) {
        status.textContent = "Already listening";
        speakWhileListening("Voice mode already on.");
        return;
      }
      startVoice();
    });
  }

  if (stopVoiceBtn) {
    stopVoiceBtn.addEventListener("click", () => {
      if (!isVoiceModeOn) {
        status.textContent = "Already stopped";
        speakWhileListening("Voice mode already off.");
        return;
      }
      stopVoice();
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupVoiceButtons);
} else {
  setupVoiceButtons();
}
