// ---------- Puzzle shape helpers ----------
// Every piece is an SVG path. Each side is flat (0), has a tab (1), or a socket (-1).
const SVG_NS = "http://www.w3.org/2000/svg";

function el(tag, attrs) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const key in attrs) node.setAttribute(key, attrs[key]);
  return node;
}

function edge(x0, y0, x1, y1, side, k) {
  if (!side) return ` L${x1} ${y1}`;
  const r = 14 * k;
  const neck = 8 * k;
  const dx = Math.sign(x1 - x0);
  const dy = Math.sign(y1 - y0);
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;
  const sweep = side > 0 ? 1 : 0;
  return ` L${mx - dx * neck} ${my - dy * neck} A${r} ${r} 0 1 ${sweep} ${mx + dx * neck} ${my + dy * neck} L${x1} ${y1}`;
}

function piecePath(x, y, w, h, top, right, bottom, left, k = Math.min(w, h) / 100) {
  return (
    `M${x} ${y}` +
    edge(x, y, x + w, y, top, k) +
    edge(x + w, y, x + w, y + h, right, k) +
    edge(x + w, y + h, x, y + h, bottom, k) +
    edge(x, y + h, x, y, left, k) +
    " Z"
  );
}

// ---------- Header: scattered pieces ----------
// Pattern for tabs/sockets between neighbouring cells so shared edges always match.
const hv = (r, c) => ((r * 2 + c * 3 + r * c) % 2 ? 1 : -1);
const vv = (r, c) => ((r * 3 + c * 2 + r * c + 1) % 2 ? 1 : -1);

function scatter(svgId, cells) {
  const svg = document.getElementById(svgId);
  const size = 56;
  cells.forEach(([r, c, color]) => {
    const path = el("path", {
      d: piecePath(c * size, r * size, size, size, -vv(r - 1, c), hv(r, c), vv(r, c), -hv(r, c - 1)),
      stroke: "var(--card)",
      "stroke-width": 3,
      "stroke-linejoin": "round",
    });
    path.style.fill = color;
    svg.appendChild(path);
  });
}

scatter("cluster-left", [
  [0, 0, "var(--s)"],
  [1, 1, "var(--m)"],
  [2, 0, "var(--e)"],
  [3, 1, "var(--e)"],
]);

scatter("cluster-right", [
  [0, 2, "var(--s)"],
  [1, 1, "var(--m)"],
  [2, 1, "var(--pink)"],
  [2, 2, "var(--e)"],
  [3, 0, "var(--e)"],
  [3, 1, "var(--s)"],
]);

// ---------- Puzzle nav (vertical column) ----------
const projects = Array.from(document.querySelectorAll(".proj"));
const nav = document.getElementById("nav");
const title = document.getElementById("results-title");
const countLabel = document.getElementById("results-count");

// Top to bottom. edges = [top, right, bottom, left]; neighbours always have opposite
// values on the side they share, so each tab fits the socket below or above it.
const pieces = [
  { key: "all", label: "All", edges: [0, 0, 1, 0], fill: "var(--a)", ink: "var(--a-ink)", border: "var(--a-edge)", heading: "All projects" },
  { key: "software", label: "Software", edges: [-1, 0, -1, 0], fill: "var(--s)", ink: "var(--s-ink)", border: "var(--s-edge)", heading: "Software projects" },
  { key: "electronics", label: "Electronics", edges: [1, 0, 1, 0], fill: "var(--e)", ink: "var(--e-ink)", border: "var(--e-edge)", heading: "Electronics projects" },
  { key: "mechanical", label: "Mechanical", edges: [-1, 0, 0, 0], fill: "var(--m)", ink: "var(--m-ink)", border: "var(--m-edge)", heading: "Mechanical projects" },
];

const horizontal = window.matchMedia("(max-width: 860px)").matches;
const W = horizontal ? 140 : 220;
const H = horizontal ? 90 : 110;
nav.setAttribute("viewBox", horizontal
  ? `-4 -4 ${W * pieces.length + 8} ${H + 8}`
  : `-4 -4 ${W + 8} ${H * pieces.length + 8}`);
nav.setAttribute("aria-orientation", horizontal ? "horizontal" : "vertical");

function matches(proj, key) {
  return key === "all" || proj.dataset.disc.split(" ").includes(key);
}

function plural(n) {
  return `${n} project${n === 1 ? "" : "s"}`;
}

pieces.forEach((piece, i) => {
  const x = horizontal ? i * W : 0;
  const y = horizontal ? 0 : i * H;
  const e = horizontal ? [0, piece.edges[2], 0, piece.edges[0]] : piece.edges;
  const group = el("g", {
    class: "piece",
    role: "tab",
    tabindex: i === 0 ? 0 : -1,
    "aria-label": piece.label,
    "aria-selected": "false",
  });

  const d = piecePath(x, y, W, H, ...e);
  const body = el("path", { d });
  body.style.fill = piece.fill;
  const ring = el("path", { d, class: "ring" });
  ring.style.stroke = piece.border;

  const name = el("text", { x: x + W / 2, y: y + H / 2 - 2, "text-anchor": "middle", class: "piece-label" });
  name.textContent = piece.label;
  name.style.fill = piece.ink;
  const count = el("text", { x: x + W / 2, y: y + H / 2 + 20, "text-anchor": "middle", class: "piece-count" });
  count.textContent = plural(projects.filter((p) => matches(p, piece.key)).length);
  count.style.fill = piece.ink;

  group.append(body, ring, name, count);
  nav.appendChild(group);
  piece.group = group;

  group.addEventListener("click", () => select(piece));
  group.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(piece);
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      select(pieces[(i + 1) % pieces.length], true);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      select(pieces[(i - 1 + pieces.length) % pieces.length], true);
    }
  });
});

function select(piece, moveFocus = false) {
  const hadFocus = moveFocus || nav.contains(document.activeElement);

  // Move the chosen piece to the end so it is drawn on top of its neighbours,
  // then force a reflow so the lift animation still plays.
  nav.appendChild(piece.group);
  void piece.group.getBoundingClientRect();

  pieces.forEach((p) => {
    const on = p === piece;
    p.group.classList.toggle("on", on);
    p.group.setAttribute("aria-selected", on);
    p.group.setAttribute("tabindex", on ? 0 : -1);
  });
  if (hadFocus) piece.group.focus({ preventScroll: true });

  let shown = 0;
  projects.forEach((proj) => {
    const match = matches(proj, piece.key);
    proj.hidden = !match;
    if (match) shown++;
  });

  title.textContent = piece.heading;
  countLabel.textContent = plural(shown);
}

select(pieces[0]);

// Tell the CSS how tall the nav is so it can stay centred in the viewport.
const setNavHeight = () =>
  document.documentElement.style.setProperty("--nav-h", `${nav.getBoundingClientRect().height}px`);
setNavHeight();
if ("ResizeObserver" in window) new ResizeObserver(setNavHeight).observe(nav);
else window.addEventListener("resize", setNavHeight);

// ---------- Topnav border radius on scroll ----------
const topnav = document.querySelector(".topnav");
window.addEventListener("scroll", () => {
  topnav.classList.toggle("scrolled", window.scrollY > 12.5);
});

window.matchMedia("(max-width: 860px)").addEventListener("change", () => location.reload());