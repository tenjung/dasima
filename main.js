(function () {
  var config = window.LANDING_CONFIG || {};
  var links = config.links || {};
  var products = config.products || {};
  var NAMES = { cream: "앰플크림", oil: "동백오일" };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  /* ── 구매 버튼: 판매처 새 탭, 링크가 없으면 비활성화 ── */
  function withUtm(url) {
    if (!config.utm) return url;
    try {
      var u = new URL(url);
      Object.keys(config.utm).forEach(function (key) {
        if (!u.searchParams.has(key)) u.searchParams.set(key, config.utm[key]);
      });
      return u.toString();
    } catch (e) {
      return url;
    }
  }
  document.querySelectorAll("[data-buy]").forEach(function (el) {
    var key = el.getAttribute("data-buy");
    var url = links[key];
    if (url) {
      el.href = withUtm(url);
      el.target = "_blank";
      el.rel = "noopener";
    } else {
      el.removeAttribute("href");
      el.setAttribute("aria-disabled", "true");
      el.title = "구매 링크 준비 중";
      el.classList.add("is-pending");
      el.textContent = NAMES[key] + " · 링크 준비 중";
    }
  });

  /* ── 문의 전화: 번호를 CSS 가상 요소로만 그리고 tel: 링크는 누를 때 연다 ──
     HTML 텍스트와 href에 번호가 남지 않아 검색엔진에 수집·노출되지 않는다. */
  var tel = (config.contact && config.contact.tel) || "";
  document.querySelectorAll("[data-tel]").forEach(function (el) {
    if (!tel) { el.closest(".footer__cs").hidden = true; return; }
    el.setAttribute("data-tel-text", tel);
    el.tabIndex = 0;
    var call = function () { window.location.href = "tel:" + tel.replace(/[^0-9+]/g, ""); };
    el.addEventListener("click", call);
    el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); call(); } });
  });

  /* ── 가격 ── */
  var won = function (n) { return n.toLocaleString("ko-KR") + "원"; };
  document.querySelectorAll("[data-price]").forEach(function (el) {
    var p = products[el.getAttribute("data-price")] || {};
    if (p.salePrice && p.price && p.salePrice < p.price) {
      var rate = Math.round((1 - p.salePrice / p.price) * 100);
      el.innerHTML =
        '<span class="price__rate">' + rate + "%</span>" +
        '<strong class="price__now">' + won(p.salePrice) + "</strong>" +
        '<del class="price__was">' + won(p.price) + "</del>";
    } else if (p.salePrice || p.price) {
      el.innerHTML = '<strong class="price__now">' + won(p.salePrice || p.price) + "</strong>";
    } else {
      el.innerHTML = '<span class="price__note">가격은 공식 판매처 데이세븐에서 확인해 주세요</span>';
    }
  });

  /* ── 후기: 실제 후기가 있을 때만 표시 ── */
  var reviews = config.reviews || [];
  var reviewSection = document.getElementById("reviews");
  var reviewList = document.querySelector("[data-review-list]");
  if (reviews.length && reviewSection && reviewList) {
    reviews.forEach(function (r) {
      var li = document.createElement("li");
      li.className = "review";
      var rating = Math.max(0, Math.min(5, Number(r.rating) || 0));
      var stars = document.createElement("span");
      stars.className = "review__stars";
      stars.textContent = "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);
      stars.setAttribute("aria-label", "별점 " + rating + "점");
      var text = document.createElement("p");
      text.textContent = r.text;
      var meta = document.createElement("span");
      meta.className = "review__meta";
      meta.textContent = [NAMES[r.product], r.name, r.source].filter(Boolean).join(" · ");
      li.append(stars, text, meta);
      reviewList.appendChild(li);
    });
    reviewSection.hidden = false;
  }

  /* ── 오프닝 꽃잎 ── */
  var petals = document.querySelector("[data-petals]");
  if (petals && !reduceMotion) {
    var count = window.innerWidth < 640 ? 7 : 12;
    for (var i = 0; i < count; i++) {
      var p = document.createElement("span");
      p.className = "petal";
      var size = 10 + Math.random() * 14;
      p.style.left = Math.random() * 100 + "%";
      p.style.setProperty("--s", size.toFixed(0) + "px");
      p.style.setProperty("--dur", (12 + Math.random() * 12).toFixed(1) + "s");
      p.style.setProperty("--delay", (-Math.random() * 20).toFixed(1) + "s");
      p.style.setProperty("--sway", (Math.random() * 120 - 60).toFixed(0) + "px");
      petals.appendChild(p);
    }
  }

  /* ── 숫자 카운트업 ── */
  function runCount(el) {
    var target = Number(el.getAttribute("data-count"));
    if (reduceMotion || !target) { el.textContent = target.toLocaleString("ko-KR"); return; }
    var start = null;
    var duration = target > 100 ? 1800 : 1200;
    function tick(ts) {
      if (!start) start = ts;
      var t = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toLocaleString("ko-KR");
      if (t < 1) requestAnimationFrame(tick);
    }
    el.textContent = "0";
    requestAnimationFrame(tick);
  }

  /* ── 스크롤 등장 (형제끼리 순차 지연) ── */
  var reveals = document.querySelectorAll(".reveal");
  reveals.forEach(function (el) {
    var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
      return c.classList.contains("reveal");
    });
    var idx = siblings.indexOf(el);
    if (idx > 0) el.style.setProperty("--d", Math.min(idx, 4) * 0.12 + "s");
  });

  if (!hasIO || reduceMotion) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
    document.querySelectorAll("[data-count]").forEach(function (el) {
      el.textContent = Number(el.getAttribute("data-count")).toLocaleString("ko-KR");
    });
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        entry.target.querySelectorAll("[data-count]").forEach(runCount);
        revealIO.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px" });
    reveals.forEach(function (el) { revealIO.observe(el); });
  }

  /* ── 쇼케이스: 보이는 단계에 맞춰 고정 비주얼 교체 ── */
  if (hasIO) {
    document.querySelectorAll("[data-showcase]").forEach(function (showcase) {
      var visuals = showcase.querySelectorAll(".showcase__visual > [data-visual]");
      var steps = showcase.querySelectorAll("[data-step]");
      var stepIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var n = entry.target.getAttribute("data-step");
          steps.forEach(function (s) { s.classList.toggle("is-active", s === entry.target); });
          visuals.forEach(function (v) { v.classList.toggle("is-active", v.getAttribute("data-visual") === n); });
        });
      }, { rootMargin: "-45% 0px -45% 0px" });
      steps.forEach(function (s) { stepIO.observe(s); });
      if (steps[0]) steps[0].classList.add("is-active");
    });
  } else {
    document.querySelectorAll("[data-step]").forEach(function (s) { s.classList.add("is-active"); });
  }

  /* ── 오프닝 이후: 챕터 탭 · 하단 구매바 표시 ── */
  var topbar = document.querySelector(".topbar");
  var opening = document.querySelector("[data-opening]");
  var buybar = document.querySelector("[data-buybar]");
  if (opening && hasIO) {
    new IntersectionObserver(function (entries) {
      var past = !entries[0].isIntersecting;
      if (topbar) topbar.classList.toggle("is-scrolled", past);
      if (buybar) buybar.classList.toggle("is-visible", past);
    }, { rootMargin: "-80px 0px 0px 0px" }).observe(opening);
  }

  /* ── 현재 챕터 탭 강조 ── */
  var tabs = document.querySelectorAll("[data-chapter-tab]");
  if (hasIO && tabs.length) {
    var chapterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var key = entry.target.getAttribute("data-chapter");
        tabs.forEach(function (t) {
          var on = t.getAttribute("data-chapter-tab") === key;
          t.classList.toggle("is-active", on);
          if (on) t.setAttribute("aria-current", "true"); else t.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll("[data-chapter]").forEach(function (c) { chapterIO.observe(c); });
  }

  /* ── 상품정보 탭 ── */
  var tabButtons = Array.prototype.slice.call(document.querySelectorAll('.tabs [role="tab"]'));
  function selectTab(btn) {
    tabButtons.forEach(function (b) {
      var on = b === btn;
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
      document.getElementById(b.getAttribute("aria-controls")).hidden = !on;
    });
  }
  tabButtons.forEach(function (btn, i) {
    btn.addEventListener("click", function () { selectTab(btn); });
    btn.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var next = tabButtons[(i + (e.key === "ArrowRight" ? 1 : -1) + tabButtons.length) % tabButtons.length];
      selectTab(next);
      next.focus();
    });
  });
})();
