
"use strict";

// Change this to your actual GitHub username.
const GITHUB_USERNAME = "christinecacho";

const projectList = document.getElementById("projectList");
const githubRepos = document.getElementById("githubRepos");
const filterButtons = document.querySelectorAll(".filter-btn");

let allProjects = [];

// Update footer year and GitHub profile link.
document.getElementById("year").textContent =
  new Date().getFullYear();

document.getElementById("githubProfile").href =
  `https://github.com/${GITHUB_USERNAME}`;

// ------------------------------
// 1. LOAD PROJECTS FROM JSON
// ------------------------------

async function loadProjects() {
  try {
    const response = await fetch("data/projects.json");

    if (!response.ok) {
      throw new Error("Projects file could not be found.");
    }

    const data = await response.json();

    if (!Array.isArray(data.projects)) {
      throw new Error("Invalid project data.");
    }

    allProjects = data.projects;

    if (allProjects.length === 0) {
      projectList.innerHTML =
        '<p class="loading">No projects have been added yet.</p>';
      return;
    }

    renderProjects("All");
  } catch (error) {
    console.error("Project loading error:", error);

    projectList.innerHTML =
      '<p class="error-message">Unable to load projects. ' +
      'Please check data/projects.json and run the site using ' +
      'GitHub Pages or a local web server.</p>';
  }
}

// Create safe HTML elements using textContent for project data.
function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;

  return element;
}

function renderProjects(category) {
  projectList.replaceChildren();

  const filtered = category === "All"
    ? allProjects
    : allProjects.filter(
        project => project.category === category
      );

  if (filtered.length === 0) {
    projectList.appendChild(
      createElement("p", "loading", "No projects in this category.")
    );
    return;
  }

  filtered.forEach(project => {
    const card = createElement("article", "panel project-card");

    const art = createElement("div", "project-art", "💻");
    art.setAttribute("aria-hidden", "true");

    const content = createElement("div", "project-content");

    content.appendChild(
      createElement("span", "project-category", project.category || "Project")
    );

    content.appendChild(
      createElement("h3", "", project.title || "Untitled Project")
    );

    content.appendChild(
      createElement("p", "", project.description || "No description available.")
    );

    const technologies = createElement("div", "skill-tags");

    (Array.isArray(project.technologies) ? project.technologies : [])
      .forEach(technology => {
        technologies.appendChild(
          createElement("span", "", technology)
        );
      });

    content.appendChild(technologies);

    content.appendChild(
      createElement("p", "note", "My role: " + (project.role || "Student developer"))
    );

    const links = createElement("div", "project-links");

    addSafeLink(links, project.github, "GitHub");
    addSafeLink(links, project.demo, "View Demo");

    content.appendChild(links);
    card.append(art, content);
    projectList.appendChild(card);
  });
}

function addSafeLink(container, url, label) {
  if (!url) return;

  try {
    const parsed = new URL(url, window.location.href);

    if (!["http:", "https:"].includes(parsed.protocol)) return;

    const link = createElement("a", "", label);
    link.href = parsed.href;

    if (parsed.origin !== window.location.origin) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    container.appendChild(link);
  } catch (error) {
    console.warn("Invalid project link:", url);
  }
}

// Project category filters.
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");

    renderProjects(button.dataset.filter);
  });
});

loadProjects();

// ------------------------------
// 2. LATEST GITHUB REPOSITORIES
// ------------------------------

async function loadGitHubRepos() {
  if (
    !GITHUB_USERNAME ||
    GITHUB_USERNAME === "YOUR_GITHUB_USERNAME"
  ) {
    githubRepos.innerHTML =
      '<p class="loading">Edit GITHUB_USERNAME in js/script.js ' +
      'to display your public GitHub repositories.</p>';
    return;
  }

  try {
    const url =
      `https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}` +
      `/repos?sort=updated&per_page=5&type=owner`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("GitHub API request failed.");
    }

    const repos = await response.json();

    githubRepos.replaceChildren();

    if (repos.length === 0) {
      githubRepos.appendChild(
        createElement("p", "loading", "No public repositories found.")
      );
      return;
    }

    const list = createElement("ul", "repo-list");

    repos.forEach(repo => {
      const item = document.createElement("li");
      const link = createElement("a", "", repo.name);

      link.href = repo.html_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      const description = createElement(
        "p",
        "",
        repo.description || "No description provided."
      );

      const language = repo.language || "Not specified";
      const meta = createElement(
        "span",
        "repo-meta",
        `Language: ${language} | Updated: ${
          new Date(repo.updated_at).toLocaleDateString()
        }`
      );

      item.append(link, description, meta);
      list.appendChild(item);
    });

    githubRepos.appendChild(list);
  } catch (error) {
    console.error("GitHub loading error:", error);

    githubRepos.replaceChildren(
      createElement(
        "p",
        "error-message",
        "GitHub data is currently unavailable. Check your username, " +
        "internet connection, and try again later."
      )
    );
  }
}

loadGitHubRepos();

// ------------------------------
// 3. CONTACT FORM VALIDATION
// ------------------------------

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", event => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    formStatus.textContent = "Please complete all fields.";
    return;
  }

  formStatus.textContent =
    `Thank you,Your form passed validation. `;

  contactForm.reset();
});

// ------------------------------
// 4. DARK / LIGHT THEME SWITCH
// ------------------------------

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-theme");

  themeToggle.textContent = isLight ? "🌙" : "☀️";
  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Switch to dark theme" : "Switch to light theme"
  );
});

// ------------------------------
// 5. TYPING EFFECT
// ------------------------------

const typingText = document.getElementById("typingText");

const taglines = [
  "Aspiring IT Professional",
  "Future Web Developer",
  "Java Programming Student",
  "Technology Enthusiast"
];

let taglineIndex = 0;
let characterIndex = 0;
let deleting = false;

function typeEffect() {
  const phrase = taglines[taglineIndex];

  if (deleting) {
    characterIndex--;
  } else {
    characterIndex++;
  }

  typingText.textContent = phrase.substring(0, characterIndex);

  let delay = deleting ? 45 : 85;

  if (!deleting && characterIndex === phrase.length) {
    deleting = true;
    delay = 1300;
  } else if (deleting && characterIndex === 0) {
    deleting = false;
    taglineIndex = (taglineIndex + 1) % taglines.length;
    delay = 350;
  }

  setTimeout(typeEffect, delay);
}

typeEffect();

// ------------------------------
// 6. BACK TO TOP BUTTON
// ------------------------------

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 350);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
