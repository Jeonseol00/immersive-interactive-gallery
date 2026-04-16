# 🤖 FRONTEND AI DIRECTIVE: THE VISUAL SOUL OVERHAUL

**To: Frontend Automation Agent / Cursor / AI IDE Assistant**
**From: Lead Backend & Architecture Agent**

> **SYSTEM CONTEXT:**
> You are assuming the role of an Expert Frontend UI/UX Designer & Animator. You are working on "IMGAL" (Immersive Interactive Gallery). This project uses Next.js 14, TailwindCSS, and Framer Motion. 

---

## 🚫 ARCHITECTURAL BOUNDARIES (CRITICAL RULES)

1. **DO NOT Touch State Logic:** The entire backend connection, state management, Gemini AI processing, and Cloud TTS Audio Stream has been isolated into a custom hook: `src/hooks/useAICurator.ts`. **Do not modify this hook under any circumstances.**
2. **DO NOT Remove Scroll Physics Locks:** Inside `src/components/ui/AICuratorChat.tsx`, the message container uses `data-lenis-prevent="true"`, `overscroll-contain`, and `onWheel={(e) => e.stopPropagation()}` to prevent smooth-scroll leakage. **Preserve these exact attributes.**
3. **DO NOT Break the Hook Signature:** You must continue subscribing to the hook precisely via `const { isOpen, setIsOpen, input, setInput, ... } = useAICurator();`. 

---

## 🎨 DESIGN AESTHETICS (YOUR MAIN MISSION)

The user wants the AI Curator interface ("The Oracle Terminal") to look like a high-end, futuristic, luxury "Glassmorphic / Neuromorphic" artifact. It should not look like a cheap customer service chat widget. 

### Mission Objectives (Execute These):

**1. The Breathing Orb (Trigger Button)**
- **Current State:** A circle with amber glow in the bottom right corner.
- **Your Task:** Enhance the CSS/Framer Motion. Make the orb look like a 3D glass sphere or a cosmic portal. Make the shadow and glow react more organically to hover states. *Hint: Use complex Tailwind radial gradients and backdrop blurs.*

**2. The Oracle Terminal (Chat Window)**
- **Current State:** A basic `backdrop-blur-3xl` dark box.
- **Your Task:** Overhaul the container. Add sleek ambient light bleeding from the edges (glowing borders). Use `ring-white/10` and subtle inner shadows to simulate frosted dark glass. Ensure the padding and typography spacing breathe luxury.

**3. Cinematic Message Bubbles**
- **Current State:** Standard rectangular chat bubbles with rounded edges.
- **Your Task:** Differentiate User messages from the Oracle's messages heavily. 
   - **Assistant (Oracle):** Pure, edge-to-edge typography (serif fonts if possible), glowing amber or ethereal white text, fading in softly like a spirit typing.
   - **User:** Crisp, frosted-glass capsules, modern sans-serif.

**4. The Voice Resonance Indicator**
- **Trigger:** The state `isSpeaking` (boolean) becomes `true` when the Cloud Audio TTS is talking.
- **Your Task:** Tie `isSpeaking` to a spectacular visualizer. Instead of just scaling the dot up and down, animate a waveform or make the entire border of the chat window pulsate softly to the beat of `isSpeaking === true`.

**5. Seamless Input Field**
- **Current State:** A simple input box with `bg-black/40`.
- **Your Task:** Redesign the input field to look like a command-line terminal for "Spiritual Intentions". Use placeholder texts that are philosophical, remove harsh borders, focus on focus-rings with glowing drop-shadows instead of standard web outlines.

---

## 📂 FILE ASSIGNMENT
Your playground is completely restricted to **one file**:
👉 `src/components/ui/AICuratorChat.tsx`

Good luck, Frontend Agent. The engine is primed and bulletproof. Make it beautiful.
