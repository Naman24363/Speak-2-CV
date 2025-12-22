/**
 * Speech Post-Processing Module
 * 
 * Converts spoken punctuation and formatting commands into actual text characters.
 * This module takes raw speech recognition output and normalizes it into proper
 * formatting for resume text fields.
 * 
 * Usage:
 *   import { postProcessSpeech } from './speech_postprocess.js';
 *   const cleanText = postProcessSpeech("hello comma world period");
 *   // Returns: "hello, world."
 */

/**
 * Mapping of spoken phrases to their text equivalents.
 * Uses word boundaries (\b) to match complete words only.
 */
const PHRASE_MAP = [
  // Formatting commands
  { re: /\b(new|next)\s+paragraph\b/gi, out: "\n\n" },
  { re: /\b(new|next)\s+line\b/gi, out: "\n" },

  // Bullet points
  { re: /\b(bullet\s+)?point\b/gi, out: "\n• " },

  // Punctuation marks
  { re: /\bcomma\b/gi, out: "," },
  { re: /\b(full\s+)?stop\b/gi, out: "." },
  { re: /\bperiod\b/gi, out: "." },
  { re: /\bquestion\s+mark\b/gi, out: "?" },
  { re: /\bexclamation\s+(mark|point)\b/gi, out: "!" },
  { re: /\bcolon\b/gi, out: ":" },
  { re: /\bsemicolon\b/gi, out: ";" },

  // Symbols
  { re: /\b(dash|hyphen)\b/gi, out: "-" },
  { re: /\bopen\s+bracket\b/gi, out: "(" },
  { re: /\bclose\s+bracket\b/gi, out: ")" },
];

/**
 * Normalizes email addresses from speech input.
 * 
 * Handles:
 * - Speech phrases: "at the rate" → "@", "dot" → "."
 * - Extra spaces around special characters
 * - Common TLD formats
 * 
 * @param {string} text - Raw speech email text
 * @returns {string} Normalized email address
 */
function normalizeEmailFromSpeech(text) {
  if (!text) return text;

  let t = String(text).toLowerCase().trim();

  // Common speech phrases → symbols
  t = t
    .replace(/\b(at the rate|at-the-rate|at the-rate|at)\b/g, "@")
    .replace(/\b(dot)\b/g, ".")
    .replace(/\s*@\s*/g, "@")
    .replace(/\s*\.\s*/g, ".");

  // Remove all spaces (speech often inserts them)
  t = t.replace(/\s+/g, "");

  // Fix common split TLDs (extra safety)
  t = t
    .replace(/\.com\b/g, ".com")
    .replace(/\.in\b/g, ".in")
    .replace(/\.org\b/g, ".org")
    .replace(/\.net\b/g, ".net");

  return t;
}

/**
 * Normalizes spacing around punctuation and removes excessive newlines.
 * 
 * Rules:
 * - Remove spaces before punctuation: "hello , world" → "hello, world"
 * - Ensure space after punctuation: "hello,world" → "hello, world"
 * - Collapse 3+ newlines to 2 newlines (paragraph breaks)
 * 
 * @param {string} text - Text to clean
 * @returns {string} Cleaned text with normalized spacing
 */
function cleanSpacing(text) {
  // Remove spaces before punctuation
  text = text.replace(/\s+([,.;:!?])/g, "$1");
  
  // Add space after punctuation if missing
  text = text.replace(/([,.;:!?])([A-Za-z0-9])/g, "$1 $2");
  
  // Collapse excessive newlines (3+) into double newline (paragraph break)
  text = text.replace(/\n{3,}/g, "\n\n");
  
  return text;
}

/**
 * Post-processes raw speech recognition output.
 * 
 * Performs the following transformations:
 * 1. Trims whitespace
 * 2. Replaces spoken punctuation commands with actual characters
 * 3. Normalizes spacing around punctuation
 * 4. Collapses excessive newlines
 * 
 * @param {string} raw - Raw speech recognition output
 * @returns {string} Processed text ready for display
 * 
 * @example
 * postProcessSpeech("hello comma new line world") 
 * // Returns: "hello,\nworld"
 */
export function postProcessSpeech(raw) {
  if (!raw) return "";

  let text = raw.trim();

  // Apply phrase replacements
  for (const { re, out } of PHRASE_MAP) {
    text = text.replace(re, out);
  }

  // Normalize spacing
  text = cleanSpacing(text);

  // If the active field is an email input, aggressively normalize it
  const active = document.activeElement;
  const isEmailField =
    active &&
    (active.type === "email" ||
      (active.name && active.name.toLowerCase().includes("email")) ||
      (active.id && active.id.toLowerCase().includes("email")) ||
      (active.placeholder && active.placeholder.toLowerCase().includes("email")));

  if (isEmailField) {
    text = normalizeEmailFromSpeech(text);
  }

  return text;
}

