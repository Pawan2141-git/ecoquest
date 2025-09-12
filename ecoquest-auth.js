/* ecoquest-auth.js
   Lightweight front-end auth state + UI wiring for EcoQuest
   Works on: index.html, characterProfile.html
*/

const EQ_KEYS = {
  user: "eq_user",
  loggedIn: "eq_logged_in",
};

function setAuth(userObj) {
  localStorage.setItem(EQ_KEYS.user, JSON.stringify(userObj || {}));
  localStorage.setItem(EQ_KEYS.loggedIn, "true");
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem(EQ_KEYS.user) || "{}");
  } catch {
    return {};
  }
}

function isLoggedIn() {
  return localStorage.getItem(EQ_KEYS.loggedIn) === "true";
}

function clearAuth() {
  localStorage.removeItem(EQ_KEYS.user);
  localStorage.removeItem(EQ_KEYS.loggedIn);
}

/* ------------------------- Index Page Wiring ------------------------- */
function initIndexPage() {
  const getStartedBtn = document.getElementById("getStartedBtn"); // exists on index hero
  const secondBtn = document.querySelector(".her-content .content .btn-secondary"); // "I ALREADY HAVE AN ACCOUNT"
  const signinForm = document.querySelector("#signinModal form");
  const signupForm = document.querySelector("#signupModal form");

  if (signinForm) {
    signinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = signinForm.querySelector('input[type="email"]')?.value?.trim() || "";
      // Try to keep previous name if present
      const prev = getUser();
      let name = prev.name;
      if (!name) {
        // Fallback: derive name from email (before @)
        name = email.split("@")[0] || "EcoWarrior";
      }
      setAuth({ name, email });
      // Close modal if helpers exist in page
      if (typeof window.closeSignin === "function") window.closeSignin();
      updateIndexButtons();
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = signupForm.querySelector('#signupModal input[type="text"]')?.value?.trim() || "EcoWarrior";
      const email = signupForm.querySelector('#signupModal input[type="email"]')?.value?.trim() || "";
      setAuth({ name, email });
      if (typeof window.closeSignup === "function") window.closeSignup();
      updateIndexButtons();
    });
  }

  function wipeHandlers(btn) {
    // Remove any previously attached listeners by cloning
    if (!btn) return null;
    const clone = btn.cloneNode(true);
    btn.parentNode.replaceChild(clone, btn);
    return clone;
  }

  function updateIndexButtons() {
    if (!getStartedBtn || !secondBtn) return;

    if (isLoggedIn()) {
      // Replace labels & actions
      const gs = wipeHandlers(getStartedBtn);
      gs.textContent = "My Profile";
      gs.addEventListener("click", () => (window.location.href = "characterProfile.html"));

      const sec = wipeHandlers(secondBtn);
      sec.textContent = "Choose Modules";
      sec.addEventListener("click", () => (window.location.href = "chooseModule.html"));
    } else {
      // Restore default labels & actions that open modals provided in index.html
      const gs = wipeHandlers(getStartedBtn);
      gs.textContent = "GET STARTED";
      gs.addEventListener("click", () => {
        if (typeof window.openSignup === "function") window.openSignup();
      });

      const sec = wipeHandlers(secondBtn);
      sec.textContent = "I ALREADY HAVE AN ACCOUNT";
      sec.addEventListener("click", () => {
        if (typeof window.openSignin === "function") window.openSignin();
      });
    }
  }

  updateIndexButtons();
}

/* ------------------- Character Profile Page Wiring ------------------- */
function initCharacterProfilePage() {
  const user = getUser();
  const name = user.name || "EcoWarrior";

  // Username banner target
  const usernameSpan = document.querySelector(".username-banner .username"); // exists in characterProfile.html
  if (usernameSpan) usernameSpan.textContent = name;

  // Optional: guard page if not logged-in
  if (!isLoggedIn()) {
    // Soft redirect to home; you can show a toast if desired
    window.location.replace("index.html");
    return;
  }

  // Logout
  const logoutBtn = document.querySelector(".btn.btn--logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearAuth();
      window.location.href = "index.html";
    });
  }
}

/* --------------------------- Bootstrapping --------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const path = (location.pathname || "").toLowerCase();
  if (path.endsWith("index.html") || path.endsWith("/") || path === "" ) {
    initIndexPage();
  } else if (path.endsWith("characterprofile.html")) {
    initCharacterProfilePage();
  } else {
    // If you also want dynamic header states on other pages later, you can add more initializers here.
  }
});
