## 🎯 Assignment: Build an Elegant TODO Web App

**Objective**  
Create a single-page TODO application that lets users add, tag, search, mark done/undone, and delete tasks—all with a clean, modern UI.

### 🛠 Technical Requirements
* **Languages & Frameworks**  
  * **HTML5** + **Tailwind CSS** (via CDN)  
  * **Vanilla JavaScript** (no frameworks)
* **Persistence**  
  * Store all tasks in localStorage so data survives page reloads.
* **Initialization**  
  * Wrap your JS in DOMContentLoaded so it only runs after the DOM is ready.
* **Responsive Layout**  
  * Must look good on mobile and desktop.

### ✨ Features
1. **Add Task Form**  
   * Text input with placeholder “What needs to be done?”  
   * Tags input (comma-separated)  
   * “Add Task” button  
2. **Search Bar**  
   * Live-filter tasks by text **or** tag.  
3. **Stats Banner**  
   * Displays **Total**, **Done**, and **Pending** counts.  
4. **Task List**  
   * Shows each item with:  
     * Task text  
     * ✨ Tag “pills”  
     * ✅ Done/↺ Undo button  
     * 🗑 Delete button  
   * If no tasks (or no matches), show a friendly placeholder message.

### 💅 UI & Color Palette

Use the following Tailwind classes or exact hex codes to match our “elegant” theme:

| Element              | Tailwind Utility                                                 | Hex Colors                        |
|----------------------|------------------------------------------------------------------|-----------------------------------|
| **Page background**  | bg-gradient-to-br from-indigo-100 via-white to-pink-100         | #C7D2FE → #FFFFFF → #FCE7F3       |
| **Input borders**    | border-gray-300                                                 | #D1D5DB                           |
| **Input focus ring** | focus:ring-purple-500                                           | #A855F7                           |
| **Add Task button**  | bg-gradient-to-r from-indigo-500 to-purple-500                  | #6366F1 → #A855F7                 |
| **Done button**      | bg-gradient-to-r from-green-400 to-green-600                    | #34D399 → #047857                 |
| **Delete button**    | bg-gradient-to-r from-red-400 to-red-600                        | #F87171 → #DC2626                 |
| **Tag pills**        | bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800    | #F3E8FF → #FCE7F3; text #6B21A8   |
| **List item bg**     | bg-gray-50                                                      | #F9FAFB                           |
| **Stats text**       | text-gray-600                                                   | #4B5563                           |
| **Heading text**     | text-gray-800                                                   | #1F2937                           |

*Use rounded corners (`rounded-xl` / `rounded-2xl`), shadows (`shadow-xl`), and smooth hover/transition classes for polish.*

### 📦 Deliverables
* A **single HTML** file (plus any CSS/js includes) in a public GitHub repo or ZIP.
* Clear instructions (in a README) on how to open/run the app.

### ✅ Evaluation Criteria
* **Correctness**: All features work as described.
* **Code Quality**: Clean, well-structured, commented JS and semantic HTML.
* **UI/UX**: Matches the color specs, is responsive, and feels smooth.
* **Creativity**: Any extra polish (animations, error handling, accessibility) is a plus.

> **Time Estimate:** 30–50 minutes

---

### 🖼 Example Screenshot

![TODO Web App Example](https://questionimagedb.blob.core.windows.net/questionimagedbcontainers/TODO_website_example.png)
