// Make the ball move to a certain position:
/*
const f = document.getElementById("ball");
document.addEventListener("click", (ev) => {
  f.style.transform = `translateY(${ev.clientY - 25}px)`;
  f.style.transform += `translateX(${ev.clientX - 25}px)`;
});
*/

// Get references to elements
const soft = document.getElementById("software-btn");
const elec = document.getElementById("electronics-btn");
const mech = document.getElementById("mechanical-btn");

const soft_tab = document.getElementById("software");
const elec_tab = document.getElementById("electronics");
const mech_tab = document.getElementById("mechanical");

//if project_types gets too big,
//loop over all for click event,
//then project_types[i] += "active"
//then loop over again
//then if (p_t[i] != p_t[j]) p_t[j] -= "active"

// Function for showing a tab
function showTab(nav, tab) {
  // Remove the active state from all navigation links
  [soft, elec, mech].forEach((button) => {
    button.classList.remove("active");
  });

  // Hide all project sections
  [soft_tab, elec_tab, mech_tab].forEach((section) => {
    section.classList.remove("vis");
  });

  // Activate the selected navigation link and section
  nav.classList.add("active");
  tab.classList.add("vis");
}

// Set up the project tabs
if (soft && elec && mech && soft_tab && elec_tab && mech_tab) {
  showTab(soft, soft_tab);

  soft.addEventListener("click", (event) => {
    event.preventDefault();
    showTab(soft, soft_tab);
  });

  elec.addEventListener("click", (event) => {
    event.preventDefault();
    showTab(elec, elec_tab);
  });

  mech.addEventListener("click", (event) => {
    event.preventDefault();
    showTab(mech, mech_tab);
  });
}
else {
  console.error("One or more project tab elements could not be found.");
}

// Scroll event listener to add/remove topnav border radius based on scroll position
const topnav = document.querySelector('.topnav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 12.5) {
    topnav.classList.add('scrolled');
  } else {
    topnav.classList.remove('scrolled');
  }
});