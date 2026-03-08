(function () {
  var FALLBACK_LOGO = "/assets/albertsons-logo-placeholder.svg";

  function getConfig() {
    if (!window.CINDE_CONFIG) {
      throw new Error("CINDE_CONFIG is missing. Update landing/config.js.");
    }

    return window.CINDE_CONFIG;
  }

  function getEpisodeMap(episodes) {
    return episodes.reduce(function (acc, episode) {
      acc[episode.id] = episode;
      return acc;
    }, {});
  }

  function iconPlay() {
    return '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1.5L10 6L2 10.5V1.5Z"/></svg>';
  }

  function iconPause() {
    return '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1H4.75V11H2V1ZM7.25 1H10V11H7.25V1Z"/></svg>';
  }

  function iconSpinner() {
    return '<span class="spinner" aria-hidden="true"></span>';
  }

  function buildEpisodeMeta(episode) {
    var parts = [episode.duration, episode.date].filter(Boolean);
    return parts.join(" · ");
  }

  function getRequestedEpisode(config) {
    var params = new URLSearchParams(window.location.search);
    var requestedId = params.get("episode");
    var episodeMap = getEpisodeMap(config.episodes);
    return episodeMap[requestedId] || episodeMap[config.latestEpisodeId] || config.episodes[0];
  }

  function setText(selector, value) {
    var node = document.querySelector(selector);
    if (node) {
      node.textContent = value || "";
    }
  }

  function setLink(selector, href) {
    document.querySelectorAll(selector).forEach(function (node) {
      node.href = href;
    });
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function setImage(selector, src, alt) {
    document.querySelectorAll(selector).forEach(function (node) {
      var fallback = node.parentElement.querySelector("[data-logo-fallback]");

      node.onerror = function () {
        if (node.dataset.fallbackApplied === "1") {
          if (fallback) {
            fallback.style.display = "flex";
          }
          node.style.display = "none";
          return;
        }

        node.dataset.fallbackApplied = "1";
        node.src = FALLBACK_LOGO;
      };

      node.src = src;
      node.alt = alt;
    });
  }

  function updateButtonContent(button, state) {
    if (state === "loading") {
      button.innerHTML = iconSpinner() + "<span>Loading audio</span>";
      return;
    }

    if (state === "playing") {
      button.innerHTML = iconPause() + "<span>Pause</span>";
      return;
    }

    button.innerHTML = iconPlay() + "<span>Resume</span>";
  }

  function bindCaptureForm(episode) {
    var form = document.querySelector("[data-capture-form]");
    var status = document.querySelector("[data-capture-status]");
    var emailInput = document.querySelector("[data-email-input]");
    var episodeField = document.querySelector("[data-episode-id-field]");

    if (!form || !status || !emailInput || !episodeField) {
      return;
    }

    episodeField.value = episode.id;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      status.className = "capture-status";
      status.textContent = "Sending email...";

      fetch("/.netlify/functions/send-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput.value,
          episode_id: episode.id,
          episode_title: episode.title
        })
      })
        .then(function (response) {
          if (!response.ok) {
            return response.json().catch(function () {
              return { error: "Request failed" };
            }).then(function (data) {
              throw new Error(data.error || "Request failed");
            });
          }

          return response.json();
        })
        .then(function () {
          form.reset();
          episodeField.value = episode.id;
          status.className = "capture-status success";
          status.textContent = "Email sent successfully.";
        })
        .catch(function (error) {
          status.className = "capture-status error";
          status.textContent = error.message || "Email send failed.";
        });
    });
  }

  function bindAudioPlayer(container, episode) {
    var button = container.querySelector("[data-audio-toggle]");
    var status = container.querySelector("[data-audio-status]");
    var fill = container.querySelector("[data-progress-fill]");
    var audio = container.querySelector("audio");
    var loadingLabel = container.querySelector("[data-loading-label]");
    var shell = container.querySelector("[data-player-shell]") || container;
    var params = new URLSearchParams(window.location.search);
    var wantsAutoplay = params.get("autoplay") === "1";

    if (!button || !status || !fill || !audio) {
      return;
    }

    audio.preload = wantsAutoplay ? "auto" : "metadata";
    audio.src = episode.audioUrl;

    function setStatus(message, isError) {
      status.textContent = message;
      shell.classList.toggle("is-error", Boolean(isError));
    }

    function setLoadingState(isLoading, message) {
      shell.classList.toggle("is-loading", isLoading);
      button.disabled = isLoading;
      updateButtonContent(button, isLoading ? "loading" : audio.paused ? "paused" : "playing");

      if (loadingLabel) {
        loadingLabel.textContent = message || "Preparing audio stream...";
      }
    }

    function syncProgress() {
      if (!audio.duration || !Number.isFinite(audio.duration)) {
        fill.style.width = "0%";
        return;
      }

      fill.style.width = Math.max(0, (audio.currentTime / audio.duration) * 100) + "%";
    }

    function startPlayback(trigger) {
      setLoadingState(true, trigger === "autoplay" ? "Starting latest episode..." : "Preparing audio...");

      audio
        .play()
        .then(function () {
          setLoadingState(false);
          updateButtonContent(button, "playing");
          setStatus("Now playing: " + episode.title);
        })
        .catch(function () {
          setLoadingState(false);
          setStatus(
            trigger === "autoplay"
              ? "Autoplay was blocked by the browser. Press Resume to start playback."
              : "Playback was blocked by the browser. Press Resume again.",
            true
          );
        });
    }

    button.addEventListener("click", function () {
      if (audio.paused) {
        startPlayback("manual");
      } else {
        audio.pause();
        updateButtonContent(button, "paused");
        setStatus("Playback paused.");
      }
    });

    audio.addEventListener("loadstart", function () {
      if (audio.paused) {
        setLoadingState(true, "Connecting to audio stream...");
      }
    });

    audio.addEventListener("loadedmetadata", function () {
      syncProgress();
      if (audio.paused) {
        setLoadingState(false);
        setStatus("Ready to play.");
      }
    });

    audio.addEventListener("canplay", function () {
      if (audio.paused) {
        setLoadingState(false);
        setStatus("Ready to play.");
      }
    });

    audio.addEventListener("timeupdate", syncProgress);

    audio.addEventListener("playing", function () {
      setLoadingState(false);
      updateButtonContent(button, "playing");
      setStatus("Now playing: " + episode.title);
    });

    audio.addEventListener("waiting", function () {
      setLoadingState(true, "Buffering audio...");
    });

    audio.addEventListener("pause", function () {
      if (audio.ended) {
        return;
      }

      setLoadingState(false);
      updateButtonContent(button, "paused");
    });

    audio.addEventListener("ended", function () {
      setLoadingState(false);
      fill.style.width = "100%";
      updateButtonContent(button, "paused");
      setStatus("Playback finished.");
    });

    audio.addEventListener("error", function () {
      setLoadingState(false);
      setStatus("Audio failed to load. Check the MP3 URL and try again.", true);
    });

    updateButtonContent(button, "paused");
    setStatus(wantsAutoplay ? "Preparing autoplay..." : "Ready to play.");

    if (wantsAutoplay) {
      startPlayback("autoplay");
    }
  }

  function renderLatestPage(config) {
    var episode = getRequestedEpisode(config);
    var latestHref = config.landingUrl + "?episode=" + encodeURIComponent(episode.id) + "&autoplay=1";

    setImage("[data-logo]", config.logoUrl, config.companyName + " logo");
    setText("[data-brief-title]", config.briefTitle);
    setText("[data-company-name]", config.companyName);
    setText("[data-section-pill]", config.sectionPill);
    setText("[data-section-name]", config.sectionName);
    setText("[data-updated-label]", config.updatedLabel);
    setText("[data-hero-description]", config.heroDescription);
    setLink("[data-all-episodes-link]", config.allEpisodesUrl);
    setLink("[data-hero-latest-link]", latestHref);

    setText("[data-episode-tag]", episode.tag);
    setText("[data-episode-meta]", buildEpisodeMeta(episode));
    setText("[data-episode-cadence]", episode.cadence);
    setText("[data-episode-status]", episode.status || "");
    setText("[data-episode-title]", episode.title);
    setText("[data-episode-eyebrow]", episode.eyebrow);
    setText("[data-episode-summary]", episode.summary);
    setText("[data-episode-plays]", episode.plays);
    setLink("[data-download-link]", episode.audioUrl);

    bindCaptureForm(episode);
    bindAudioPlayer(document.querySelector("[data-latest-player]"), episode);
  }

  function renderEpisodeCard(episode, config) {
    return [
      '<article class="episode-card" data-player-card>',
      '  <div class="player-shell" data-player-shell>',
      '    <div class="episode-topline">',
      '      <span class="tag">' + escapeHtml(episode.tag) + "</span>",
      '      <span>' + escapeHtml(buildEpisodeMeta(episode)) + "</span>",
      '      <span class="meta-label">' + escapeHtml(episode.cadence) + "</span>",
      '      ' + (episode.status ? '<span class="pill muted">' + escapeHtml(episode.status) + "</span>" : ""),
      "    </div>",
      '    <h2 class="episode-title">' + escapeHtml(episode.title) + "</h2>",
      '    <p class="episode-eyebrow">' + escapeHtml(episode.eyebrow) + "</p>",
      '    <p class="episode-summary">' + escapeHtml(episode.summary) + "</p>",
      '    <div class="loading-row"><span class="spinner" aria-hidden="true"></span><span data-loading-label>Preparing audio stream...</span></div>',
      '    <div class="progress-wrap">',
      '      <div class="progress-bar"><span class="progress-fill" data-progress-fill></span></div>',
      '      <div class="plays">' + escapeHtml(episode.plays) + "</div>",
      "    </div>",
      '    <div class="card-actions">',
      '      <button class="button primary" type="button" data-audio-toggle></button>',
      '      <a class="button ghost" href="' + escapeHtml(episode.audioUrl) + '" target="_blank" rel="noreferrer">Download MP3</a>',
      '      <a class="button secondary" href="' + escapeHtml(config.landingUrl) + '?episode=' + encodeURIComponent(episode.id) + '&autoplay=1">Open hosted player</a>',
      "    </div>",
      '    <p class="audio-status" data-audio-status></p>',
      '    <audio preload="metadata"></audio>',
      "  </div>",
      "</article>"
    ].join("");
  }

  function renderArchivePage(config) {
    setImage("[data-logo]", config.logoUrl, config.companyName + " logo");
    setText("[data-brief-title]", config.briefTitle);
    setText("[data-company-name]", config.companyName);
    setLink("[data-home-link]", config.landingUrl);

    var list = document.querySelector("[data-episodes-list]");
    if (!list) {
      return;
    }

    if (!config.episodes.length) {
      list.innerHTML = '<div class="archive-empty">No episodes are configured yet.</div>';
      return;
    }

    list.innerHTML = config.episodes.map(function (episode) {
      return renderEpisodeCard(episode, config);
    }).join("");

    list.querySelectorAll("[data-player-card]").forEach(function (card, index) {
      bindAudioPlayer(card, config.episodes[index]);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var config = getConfig();

    if (document.body.dataset.page === "latest") {
      renderLatestPage(config);
    }

    if (document.body.dataset.page === "archive") {
      renderArchivePage(config);
    }
  });
})();
