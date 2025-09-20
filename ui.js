"use strict";

setBoard();
setPlayers();
setSpread();
setStats();
setPhase();
doneInitializing();

function setBoard() {
  const element = document.getElementById("board");
  const cards = element.querySelectorAll(".card");
  cards.forEach((card) => setCard(card));
}

function setPlayers() {
  const element = document.getElementById("players");
  const cards = element.querySelectorAll(".card");
  cards.forEach((card) => setCard(card));
}

function setCard(element, deadCards, value) {
  setCard.options ??= ["A", "K", "Q", "J", ...Array.from({ length: 9 }, (_, i) => 10 - i)].flatMap((rank) =>
    ["♠️", "♥️", "♦️", "♣️"].map((suit) => `${rank} ${suit}`)
  );
  setCard.onChange ??= (element, deadCards = getDeadCards(), value) => {
    deadCards.delete(element.firstChild.textContent);
    deadCards.add((element.firstChild.textContent = value ??= getRandom(getAvailableCards(deadCards))));
    document
      .querySelectorAll(".card:not(.missing)")
      .forEach((card) =>
        setCard(
          card,
          new Set([...deadCards].filter((c) => c !== card.firstChild.textContent)),
          card.firstChild.textContent
        )
      );
  };
  deadCards ??= getDeadCards();
  const availableCards = getAvailableCards(deadCards);
  value ??= getRandom(availableCards);
  element.textContent = value;
  const select = document.createElement("select");
  select.addEventListener("change", () => setCard.onChange(element, deadCards, select.value));
  select.append(
    ...availableCards.map((option) =>
      Object.assign(document.createElement("option"), {
        selected: option === element.textContent,
        textContent: option,
      })
    )
  );
  element.append(select);
  function getDeadCards() {
    return new Set([...document.querySelectorAll(".card:not(.missing)")].map((card) => card.firstChild.textContent));
  }
  function getRandom(availableCards = getAvailableCards()) {
    return availableCards[Math.floor(availableCards.length * Math.random())];
  }
  function getAvailableCards(deadCards = getDeadCards()) {
    return setCard.options.filter((card) => !deadCards.has(card));
  }
}

function setSpread() {
  const colors = ["navy", "white", "cyan", "orange", "magenta"].slice(0, 3);
  const element = document.getElementById("spread");
  const legendItems = element.querySelectorAll("button");
  const canvas = element.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  new ResizeObserver(onResize).observe(canvas);
  canvas.addEventListener(
    "pointerdown",
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      document.documentElement.style.overflow = "clip";
      document.documentElement.style.scrollbarGutter = "stable";
      const done = () => {
        canvas.removeEventListener("pointerup", done);
        canvas.removeEventListener("pointercancel", done);
        canvas.releasePointerCapture(e.pointerId);
        document.documentElement.style.overflow = document.documentElement.style.scrollbarGutter = null;
      };
      canvas.addEventListener("pointerup", done);
      canvas.addEventListener("pointercancel", done);
      draw({ crosshair: (e.clientX - canvas.getBoundingClientRect().left) * globalThis.devicePixelRatio });
    },
    { capture: true }
  );
  canvas.addEventListener(
    "pointermove",
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      draw({ crosshair: (e.clientX - canvas.getBoundingClientRect().left) * globalThis.devicePixelRatio });
    },
    { capture: true }
  );

  legendItems.forEach((item, i) => item.style.setProperty("--color", colors[i]));

  function draw({ crosshair = canvas.width * Math.random() } = {}) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00240088";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Placeholder content...
    colors.forEach((color, i) => {
      const mean = mix(0, canvas.width, Math.random());
      const stdDev = mix(0, canvas.width / 6, Math.random());

      [...Array(7462).keys()].forEach((j) => {
        const x = mix(0, canvas.width, j / (7462 - 1));
        const h = mix(0, canvas.height, Math.random() * Math.exp((-1 * (x - mean) ** 2) / 2 / stdDev ** 2));
        const w = canvas.width / 7462;
        ctx.fillStyle = color;
        ctx.fillRect(x, canvas.height - h, w, h);
      });
    });

    ctx.fillStyle = "lime";
    ctx.lineWidth = 1.5 * globalThis.devicePixelRatio;
    ctx.fillRect(crosshair - ctx.lineWidth, 0, ctx.lineWidth, canvas.height);
  }

  function onResize() {
    Object.assign(canvas, {
      height: Math.ceil(canvas.clientHeight * globalThis.devicePixelRatio),
      width: Math.ceil(canvas.clientWidth * globalThis.devicePixelRatio),
    });

    draw();
  }

  function mix(a, b, t) {
    return a + (b - a) * t;
  }
}

function setStats() {
  const element = document.getElementById("stats").children[1];
  // Placeholder content...
  element.innerHTML = element.innerHTML.replaceAll("…", () => `${(Math.random() * 100).toFixed(2)} %`);
}

function setPhase() {
  const element = document.getElementById("phase");
  element.scrollLeft = parseFloat(getComputedStyle(element).paddingLeft);
  element.children[0].scrollIntoView({ behavior: "instant" });
  element.addEventListener("click", () => {
    if (current === 0) {
      [...document.querySelectorAll("#players .card")].forEach((card) => setCard.onChange(card));
    } else {
      [...document.querySelectorAll("#board .card")]
        .slice(cardsShowing[current - 1], cardsShowing[current])
        .forEach((card) => setCard.onChange(card));
    }
  });
  let current = 0;
  const cardsShowing = [0, 3, 4, 5];
  element.addEventListener(
    "scroll",
    () => {
      const i = Math.round(element.scrollLeft / element.clientWidth);
      if (current !== i) {
        const previous = current;
        current = i;
        document.querySelectorAll("#board .card").forEach((card, j) => {
          const isMissing = j >= cardsShowing[current];
          const isNew = cardsShowing[previous] <= j && j < cardsShowing[current];
          card.classList.toggle("missing", isMissing);
          if (isNew) {
            setCard.onChange(card);
          }
        });
      }
    },
    { passive: true }
  );
}

function doneInitializing() {
  document.body.classList.toggle("initializing");
}
