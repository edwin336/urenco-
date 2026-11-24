(() => {
  const app = document.getElementById("app");
  const KEY = "gymlog.v1";

  // ---- storage ----
  // data = { runs: { [sessionId]: run }, history: { [sessionId]: run } }
  // run  = { sets: { "b-i-s": {w, r, d} }, blocks: { b: true }, scores: { b: "text" } }
  const load = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || { runs: {}, history: {} }; }
    catch { return { runs: {}, history: {} }; }
  };
  let data = load();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {} };
  const run = (id) => (data.runs[id] ||= { sets: {}, blocks: {}, scores: {} });

  // ---- tiny DOM helper ----
  const h = (tag, props = {}, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === "class") el.className = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) el.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat()) if (kid != null) el.append(kid.nodeType ? kid : document.createTextNode(kid));
    return el;
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const totalSets = (s) => s.blocks.reduce((n, b) => n + b.items.reduce((m, it) => m + (it.sets || 0), 0), 0);
  const doneSets = (s) => Object.values(run(s.id).sets).filter((x) => x.d).length;

  // ---- rest timer ----
  const timerEl = document.getElementById("timer");
  const timeEl = document.getElementById("timer-time");
  let endAt = 0, tick = null;
  const startTimer = (sec) => {
    endAt = Date.now() + sec * 1000;
    timerEl.hidden = false;
    clearInterval(tick);
    tick = setInterval(renderTimer, 250);
    renderTimer();
  };
  const stopTimer = () => { clearInterval(tick); timerEl.hidden = true; };
  const renderTimer = () => {
    const left = Math.round((endAt - Date.now()) / 1000);
    timeEl.textContent = left >= 0 ? fmt(left) : "+" + fmt(-left);
    timerEl.classList.toggle("over", left < 0);
    if (left === 0 && navigator.vibrate) navigator.vibrate([200, 100, 200]);
  };
  document.getElementById("timer-add").onclick = () => { endAt += 15000; renderTimer(); };
  document.getElementById("timer-skip").onclick = stopTimer;

  // ---- views ----
  const home = () => {
    stopTimer();
    app.replaceChildren(
      h("h1", {}, "Gym log"),
      h("p", { class: "muted" }, "Pick a session."),
      ...WORKOUTS.map((s) => {
        const t = totalSets(s), d = doneSets(s);
        const last = data.history[s.id]?.finishedAt;
        return h("button", { class: "session-card", onclick: () => go(s.id) },
          h("h2", {}, s.title),
          h("div", { class: "meta" }, s.subtitle),
          h("div", { class: "meta" },
            d ? `In progress: ${d}/${t} sets` : last ? `Last done ${new Date(last).toLocaleDateString()}` : `${s.blocks.length} blocks`),
          d ? h("div", { class: "bar" }, h("i", { style: `width:${(d / t) * 100}%` })) : null);
      }));
  };

  const session = (s) => {
    const r = run(s.id);
    const prev = data.history[s.id];

    const blockEl = (b, bi) => {
      const body = h("div", { class: "block-body" });
      const wrap = h("section", { class: "block" + (r.blocks[bi] ? " done" : "") });

      b.items.forEach((it, ii) => {
        if (it.text) { body.append(h("div", { class: "line" }, it.text)); return; }
        const spec = [`${it.sets} x ${it.reps}`, it.rpe && `RPE ${it.rpe}`, it.rest && `rest ${fmt(it.rest)}`].filter(Boolean).join(" · ");
        const ex = h("div", { class: "ex" },
          h("div", { class: "ex-name" }, it.name),
          h("div", { class: "ex-spec" }, spec),
          h("div", { class: "set-head" }, h("span"), h("span", {}, "kg"), h("span", {}, "reps"), h("span")));
        for (let si = 0; si < it.sets; si++) {
          const k = `${bi}-${ii}-${si}`;
          const cur = (r.sets[k] ||= { w: "", r: "", d: false });
          const old = prev?.sets[k];
          const row = h("div", { class: "set" + (cur.d ? " on" : "") });
          const w = h("input", { type: "number", inputmode: "decimal", placeholder: old?.w || "kg", value: cur.w });
          const rp = h("input", { type: "number", inputmode: "numeric", placeholder: old?.r || it.reps, value: cur.r });
          w.oninput = () => { cur.w = w.value; save(); };
          rp.oninput = () => { cur.r = rp.value; save(); };
          const tickBtn = h("button", { class: "tick", type: "button", "aria-label": `Set ${si + 1} done` }, "✓");
          tickBtn.onclick = () => {
            cur.d = !cur.d;
            if (cur.d && !w.value && old?.w) { cur.w = w.value = old.w; }
            if (cur.d && !rp.value && old?.r) { cur.r = rp.value = old.r; }
            row.classList.toggle("on", cur.d);
            save();
            if (cur.d && it.rest) startTimer(it.rest);
          };
          row.append(h("span", { class: "n" }, si + 1), w, rp, tickBtn);
          ex.append(row);
        }
        body.append(ex);
      });

      if (b.score) {
        const inp = h("input", { placeholder: "Score (rounds + reps)", value: r.scores[bi] || "" });
        inp.oninput = () => { r.scores[bi] = inp.value; save(); };
        body.append(h("div", { class: "score" }, inp));
      }
      if (b.notes?.length) {
        body.append(h("details", { class: "notes" }, h("summary", {}, "Coach's notes"), b.notes.map((n) => h("p", {}, n))));
      }

      const check = h("button", { class: "check" + (r.blocks[bi] ? " on" : ""), type: "button", "aria-label": "Mark block done" });
      check.onclick = (e) => {
        e.stopPropagation();
        r.blocks[bi] = !r.blocks[bi];
        check.classList.toggle("on", r.blocks[bi]);
        wrap.classList.toggle("done", r.blocks[bi]);
        save();
      };
      const head = h("div", { class: "block-head" },
        h("h2", {}, b.title, b.optional ? h("span", { class: "tag" }, "optional") : null), check);
      wrap.append(head, body);
      return wrap;
    };

    const finish = h("button", { class: "finish", type: "button" }, "Finish session");
    finish.onclick = () => {
      if (!confirm("Finish and save this session? Weights carry over as hints next time.")) return;
      data.history[s.id] = { ...r, finishedAt: Date.now() };
      delete data.runs[s.id];
      save();
      go();
    };
    const reset = h("button", { class: "finish ghost", type: "button" }, "Clear this session");
    reset.onclick = () => {
      if (!confirm("Clear everything logged in this session?")) return;
      delete data.runs[s.id];
      save();
      go(s.id);
    };

    app.replaceChildren(
      h("div", { class: "top" },
        h("button", { class: "link", onclick: () => go() }, "‹ Sessions"),
        h("span", { class: "muted" }, s.subtitle)),
      h("h1", {}, s.title),
      ...s.blocks.map(blockEl),
      finish, reset);
  };

  // ---- routing ----
  function go(id) {
    location.hash = id ? "#" + id : "";
    render();
  }
  function render() {
    const s = WORKOUTS.find((w) => "#" + w.id === location.hash);
    window.scrollTo(0, 0);
    s ? session(s) : home();
  }
  window.addEventListener("hashchange", render);
  render();

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
