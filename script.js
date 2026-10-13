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
  soft.classList.remove("active");
  elec.classList.remove("active");
  mech.classList.remove("active");

  soft_tab.classList.remove("vis");
  elec_tab.classList.remove("vis");
  mech_tab.classList.remove("vis");

  nav.classList.add("active");
  tab.classList.add("vis");
}

// Default project type open
showTab(soft, soft_tab);

soft.addEventListener("click", () => {
  showTab(soft, soft_tab);
});

elec.addEventListener("click", () => {
  showTab(elec, elec_tab);
});

mech.addEventListener("click", () => {
  showTab(mech, mech_tab);
});
