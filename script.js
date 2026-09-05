// Make the ball move to a certain position:
const f = document.getElementById("ball");
document.addEventListener("click", (ev) => {
  f.style.transform = `translateY(${ev.clientY - 25}px)`;
  f.style.transform += `translateX(${ev.clientX - 25}px)`;
});


// Get references to elements
const sites = document.getElementById("sites-btn");
const games = document.getElementById("games-btn");
const other = document.getElementById("other-btn");

const sites_tab = document.getElementById("sites");
const games_tab = document.getElementById("games");
const other_tab = document.getElementById("other");

//if project_types gets too big,
//loop over all for click event,
//then project_types[i] += "active"
//then loop over again
//then if (p_t[i] != p_t[j]) p_t[j] -= "active"

// Function for showing a tab
function showTab(nav, tab) {
  sites.classList.remove("active");
  games.classList.remove("active");
  other.classList.remove("active");

  sites_tab.classList.remove("vis");
  games_tab.classList.remove("vis");
  other_tab.classList.remove("vis");

  nav.classList.add("active");
  tab.classList.add("vis");
}

// Default project type open
showTab(sites, sites_tab);

sites.addEventListener("click", () => {
  showTab(sites, sites_tab);
});

games.addEventListener("click", () => {
  showTab(games, games_tab);
});

other.addEventListener("click", () => {
  showTab(other, other_tab);
});
