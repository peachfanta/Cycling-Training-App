const { useState, useEffect, useMemo } = React;
const { DragDropContext, Droppable, Draggable } = window.ReactBeautifulDnd;

const STORAGE_KEY = "cycling-planner-v1";
const CLASS_TIMES = ["09:00", "10:45", "12:00", "14:00"];

const RIDE_TYPES = [
  { value: "Long Ride", color: "#3b82f6" },
  { value: "Threshold", color: "#f59e0b" },
  { value: "VO2 Max", color: "#ef4444" },
  { value: "Race", color: "#8b5cf6" },
  { value: "Other", color: "#6b7280" },
];

const DEFAULT_ICS_URL =
  "https://wurunseniorcampus-vic.compass.education/download/sharedCalendar.aspx?uid=4976&key=5f124ff7-201c-478c-869b-74ae6b5e1078&c.ics";
const DEFAULT_WEATHER_URL = "http://localhost:8787/forecast";

const INITIAL_EVENTS = [
  {
    date: "2026-03-29",
    kind: "race",
    title: "Shifty Fifty R1 Wombat",
    time: "",
    order: 999,
  },
  { date: "2026-04-03", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-04-04", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-04-05", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-04-06", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-04-07", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-04-08", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-04-09", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-04-10", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-04-11", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-04-12", kind: "holiday", title: "Holiday", time: "", order: 999 },
  {
    date: "2026-04-12",
    kind: "race",
    title: "Shifty Fifty R2 Creswick",
    time: "",
    order: 999,
  },
  { date: "2026-04-13", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-04-14", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-04-15", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-04-16", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-04-17", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-05-03", kind: "race", title: "Round 1: Dromana", time: "", order: 999 },
  {
    date: "2026-05-09",
    kind: "race",
    title: "Shifty Fifty R3 Anglesea",
    time: "",
    order: 999,
  },
  { date: "2026-05-30", kind: "race", title: "Shifty Fifty R4 Yack", time: "", order: 999 },
  { date: "2026-05-31", kind: "race", title: "Shifty Fifty R5 Yack", time: "", order: 999 },
  { date: "2026-05-31", kind: "race", title: "Round 2: Lysterfield", time: "", order: 999 },
  { date: "2026-06-27", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-06-28", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-06-29", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-06-30", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-07-01", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-07-02", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-07-03", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-07-04", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-07-05", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-07-06", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-07-07", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-07-08", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-07-09", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-07-10", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-07-11", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-07-12", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-07-18", kind: "race", title: "Round 4: Gippsland", time: "", order: 999 },
  { date: "2026-08-23", kind: "race", title: "Round 5: Geelong", time: "", order: 999 },
  { date: "2026-09-12", kind: "race", title: "Round 6: Castlemaine", time: "", order: 999 },
  { date: "2026-09-13", kind: "race", title: "Round 7: Bendigo", time: "", order: 999 },
  { date: "2026-09-19", kind: "holiday", title: "Holiday", time: "", order: 999 },
  {
    date: "2026-09-20",
    kind: "race",
    title: "Shifty Fifty R6 Blores Hill",
    time: "",
    order: 999,
  },
  { date: "2026-09-20", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-09-21", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-09-22", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-09-23", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-09-24", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-09-25", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-09-26", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-09-27", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-09-28", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-09-29", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-09-30", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-10-01", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-10-02", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-10-03", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-10-04", kind: "holiday", title: "Holiday", time: "", order: 999 },
  { date: "2026-10-26", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-10-27", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-10-28", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-10-29", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-10-30", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-10-31", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-11-01", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-11-02", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-11-03", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-11-04", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-11-05", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-11-06", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-11-07", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-11-08", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-11-09", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-11-10", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-11-11", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-11-12", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-11-13", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-11-14", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-11-15", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-11-16", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-11-17", kind: "race", title: "Exam Period", time: "", order: 999 },
  { date: "2026-11-18", kind: "race", title: "Exam Period", time: "", order: 999 },
  {
    date: "2026-11-29",
    kind: "race",
    title: "Shifty Fifty R7 Warburton",
    time: "",
    order: 999,
  },
];

function pad2(value) {
  return String(value).padStart(2, "0");
}

function addMinutesToTime(time, minutesToAdd) {
  if (!time) return "";
  const [hh, mm] = time.split(":").map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return "";
  const total = hh * 60 + mm + minutesToAdd;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${pad2(newH)}:${pad2(newM)}`;
}

function parseICSTime(value, isDateOnly) {
  if (!value) return null;
  const raw = value.trim();
  if (!raw) return null;

  if (isDateOnly) {
    const match = raw.match(/^(\d{4})(\d{2})(\d{2})$/);
    if (!match) return null;
    const y = Number(match[1]);
    const m = Number(match[2]);
    const d = Number(match[3]);
    return new Date(y, m - 1, d);
  }

  const match = raw.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})/);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const hh = Number(match[4]);
  const mm = Number(match[5]);
  const isUtc = raw.endsWith("Z");
  return isUtc ? new Date(Date.UTC(y, m - 1, d, hh, mm)) : new Date(y, m - 1, d, hh, mm);
}

function parseICS(text) {
  if (!text) return [];
  const rawLines = text.replace(/\r\n/g, "\n").split("\n");
  const lines = [];
  rawLines.forEach((line) => {
    if (!line) return;
    if (line.startsWith(" ") || line.startsWith("\t")) {
      const prev = lines.pop() || "";
      lines.push(prev + line.trim());
    } else {
      lines.push(line.trim());
    }
  });

  const events = [];
  let current = null;

  lines.forEach((line) => {
    if (line === "BEGIN:VEVENT") {
      current = {};
      return;
    }
    if (line === "END:VEVENT") {
      if (current) events.push(current);
      current = null;
      return;
    }
    if (!current) return;

    const [rawKey, ...rest] = line.split(":");
    const value = rest.join(":");
    const [key, ...params] = rawKey.split(";");

    const paramMap = params.reduce((acc, part) => {
      const [pKey, pValue] = part.split("=");
      if (pKey && pValue) acc[pKey.toUpperCase()] = pValue;
      return acc;
    }, {});

    if (key === "UID") current.uid = value;
    if (key === "SUMMARY") current.summary = value;
    if (key === "DTSTART") {
      current.dtstartRaw = value;
      current.dtstartIsDate = paramMap.VALUE === "DATE";
    }
  });

  return events;
}

const ALLOWED_COMPASS_CLASSES = new Set([
  "12BUS3",
  "12MAM2",
  "12BIO6",
  "12PHY1",
  "12ENG4",
  "STCB4",
]);

function summaryHasAllowedCode(summary) {
  if (!summary) return false;
  const upper = summary.toUpperCase();
  for (const code of ALLOWED_COMPASS_CLASSES) {
    if (upper.includes(code)) return true;
  }
  return false;
}

function groupSchoolClasses(classes) {
  const groupsByDate = new Map();

  classes.forEach((cls) => {
    if (!groupsByDate.has(cls.date)) groupsByDate.set(cls.date, []);
    groupsByDate.get(cls.date).push(cls);
  });

  const grouped = [];

  groupsByDate.forEach((list, date) => {
    const sorted = list.slice().sort((a, b) => a.minutes - b.minutes);
    let current = [];
    const mergeWindow = 135; // 2h15 between start times (1h15 session + 1h gap)

    sorted.forEach((cls) => {
      if (!current.length) {
        current = [cls];
        return;
      }
      const last = current[current.length - 1];
      const diff = cls.minutes - last.minutes;
      if (diff <= mergeWindow) {
        current.push(cls);
      } else {
        grouped.push({ date, classes: current });
        current = [cls];
      }
    });

    if (current.length) grouped.push({ date, classes: current });
  });

  return grouped;
}

function normalizeStoredSchoolBlocks(allEvents) {
  const others = allEvents.filter((e) => !(e.source === "ics" && e.kind === "school"));
  const schoolEvents = allEvents.filter((e) => e.source === "ics" && e.kind === "school");

  const classItems = schoolEvents
    .filter((e) => summaryHasAllowedCode(e.title || ""))
    .map((e) => {
      const time = e.time || (e.timeRange ? e.timeRange.split("–")[0] : "");
      if (!time) return null;
      const [hh, mm] = time.split(":").map(Number);
      if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
      return {
        date: e.date,
        minutes: hh * 60 + mm,
        time,
      };
    })
    .filter(Boolean);

  const grouped = groupSchoolClasses(classItems).map((group) => {
    const sorted = group.classes.slice().sort((a, b) => a.minutes - b.minutes);
    const start = sorted[0];
    const end = sorted[sorted.length - 1];
    const endTime = addMinutesToTime(end.time, 75);
    const timeRange = start.time === end.time ? `${start.time}–${endTime}` : `${start.time}–${endTime}`;
    const icsId = `school-${group.date}-${start.time}-${end.time}`;
    return {
      id: generateId("event"),
      icsId,
      source: "ics",
      edited: false,
      date: group.date,
      kind: "school",
      title: "School",
      time: start.time,
      timeRange,
      classTimes: sorted.map((cls) => cls.time),
      order: 999,
    };
  });

  return [...others, ...grouped];
}

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fromDateKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfWeek(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function normalizeTime(value) {
  if (!value) return "";
  const raw = String(value).trim();
  if (!raw) return "";
  const match = raw.match(/^(\d{1,2}):(\d{2})$/);
  if (match) {
    const h = String(match[1]).padStart(2, "0");
    return `${h}:${match[2]}`;
  }
  return raw;
}

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getWeekDays(startDate) {
  return Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
}

function formatDayLabel(date) {
  return date.toLocaleDateString(undefined, { weekday: "short" });
}

function formatDateLabel(date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatWeekRange(startDate) {
  const end = addDays(startDate, 6);
  const startLabel = startDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const endLabel = end.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${startLabel} – ${endLabel}`;
}

function getRideColor(type) {
  const match = RIDE_TYPES.find((t) => t.value === type);
  return match ? match.color : "#6b7280";
}

function sortItems(items) {
  return items
    .slice()
    .sort((a, b) => {
      const aHasOrder = typeof a.order === "number" && a.order !== 999;
      const bHasOrder = typeof b.order === "number" && b.order !== 999;
      const aKey = aHasOrder ? a.order : a.sortKey ?? 0;
      const bKey = bHasOrder ? b.order : b.sortKey ?? 0;
      if (aKey !== bKey) return aKey - bKey;
      return 0;
    });
}

function App() {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));
  const [rides, setRides] = useState([]);
  const [events, setEvents] = useState([]);
  const [showRides, setShowRides] = useState(true);
  const [showSchool, setShowSchool] = useState(true);
  const [showRacesHolidays, setShowRacesHolidays] = useState(true);
  const [history, setHistory] = useState([]);
  const [modal, setModal] = useState({ open: false, mode: "add", kind: "ride", data: null });
  const [icsModalOpen, setIcsModalOpen] = useState(false);
  const [icsUrl, setIcsUrl] = useState(DEFAULT_ICS_URL);
  const [icsStatus, setIcsStatus] = useState("idle");
  const [deletedIcsIds, setDeletedIcsIds] = useState([]);
  const [lastSyncedAt, setLastSyncedAt] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [weatherStatus, setWeatherStatus] = useState("idle");
  const [weatherByDate, setWeatherByDate] = useState({});
  const [weatherUpdatedAt, setWeatherUpdatedAt] = useState("");

  useEffect(() => {
    function hideLoader() {
      const loader = document.getElementById("loading");
      if (!loader) return;
      loader.classList.add("loading-hide");
      setTimeout(() => loader.remove(), 650);
    }

    if (document.readyState === "complete") {
      hideLoader();
    } else {
      window.addEventListener("load", hideLoader, { once: true });
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setEvents(INITIAL_EVENTS.map((event) => ({ ...event, id: generateId("event") })));
      setIcsUrl(DEFAULT_ICS_URL);
      setDeletedIcsIds([]);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (parsed.rides) setRides(parsed.rides);
      if (parsed.events) {
        const normalized = normalizeStoredSchoolBlocks(parsed.events);
        const keyOf = (e) => `${e.date}|${e.kind}|${e.title}`;
        const existingKeys = new Set(normalized.map(keyOf));
        const seeded = INITIAL_EVENTS.map((event) => ({
          ...event,
          id: generateId("event"),
        })).filter((event) => !existingKeys.has(keyOf(event)));
        setEvents([...normalized, ...seeded]);
      }
      if (typeof parsed.showRides === "boolean") setShowRides(parsed.showRides);
      if (typeof parsed.showSchool === "boolean") setShowSchool(parsed.showSchool);
      if (typeof parsed.showRacesHolidays === "boolean")
        setShowRacesHolidays(parsed.showRacesHolidays);
      if (typeof parsed.icsUrl === "string") setIcsUrl(parsed.icsUrl);
      if (Array.isArray(parsed.deletedIcsIds)) setDeletedIcsIds(parsed.deletedIcsIds);
      if (typeof parsed.lastSyncedAt === "string") setLastSyncedAt(parsed.lastSyncedAt);
      if (typeof parsed.weatherByDate === "object" && parsed.weatherByDate)
        setWeatherByDate(parsed.weatherByDate);
      if (typeof parsed.weatherUpdatedAt === "string") setWeatherUpdatedAt(parsed.weatherUpdatedAt);
      if (parsed.currentWeekStart) setCurrentWeekStart(fromDateKey(parsed.currentWeekStart));
    } catch (err) {
      console.warn("Failed to load saved data", err);
    }
  }, []);

  useEffect(() => {
    const payload = {
      rides,
      events,
      showRides,
      showSchool,
      showRacesHolidays,
      icsUrl,
      deletedIcsIds,
      lastSyncedAt,
      weatherByDate,
      weatherUpdatedAt,
      currentWeekStart: toDateKey(currentWeekStart),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [
    rides,
    events,
    showRides,
    showSchool,
    showRacesHolidays,
    icsUrl,
    deletedIcsIds,
    lastSyncedAt,
    weatherByDate,
    weatherUpdatedAt,
    currentWeekStart,
  ]);

  useEffect(() => {
    if (!icsUrl) return;
    syncICS(icsUrl);
  }, [icsUrl]);

  useEffect(() => {
    async function loadWeather() {
      const isHttp = window.location.protocol.startsWith("http");
      if (isHttp) {
        try {
          setWeatherStatus("loading");
          const response = await fetch("/api/weather", { cache: "no-store" });
          if (!response.ok) throw new Error("Weather API failed");
          const data = await response.json();
          applyWeatherData(data);
          return;
        } catch (err) {
          console.warn("Weather API failed", err);
        }
      }

      const data = window.__WEATHER_DATA__;
      if (!data || !data.daily) {
        setWeatherStatus("error");
        return;
      }
      applyWeatherData(data);
    }

    function applyWeatherData(data) {
      const daily = data.daily || {};
      const dates = daily.time || [];
      const temps = daily.temperature_2m_max || [];
      const precip = daily.precipitation_sum || [];
      const prob = daily.precipitation_probability_max || [];

      const map = {};
      dates.forEach((date, idx) => {
        map[date] = {
          tmax: temps[idx],
          precip: precip[idx],
          prob: prob[idx],
        };
      });

      setWeatherByDate(map);
      setWeatherUpdatedAt(new Date().toLocaleString());
      setWeatherStatus("ok");
    }

    loadWeather();
  }, []);

  function pushHistory() {
    setHistory((prev) => {
      const snapshot = {
        rides: rides.map((r) => ({ ...r })),
        events: events.map((e) => ({ ...e })),
      };
      const next = [...prev, snapshot];
      return next.length > 20 ? next.slice(-20) : next;
    });
  }

  function handleUndo() {
    setHistory((prev) => {
      if (!prev.length) return prev;
      const snapshot = prev[prev.length - 1];
      setRides(snapshot.rides || []);
      setEvents(snapshot.events || []);
      return prev.slice(0, -1);
    });
  }

  function openAddRide(dateKey) {
    setModal({
      open: true,
      mode: "add",
      kind: "ride",
      data: { date: dateKey, type: "Long Ride", duration: 1 },
    });
  }

  function openEditItem(item) {
    setModal({
      open: true,
      mode: "edit",
      kind: item.kind,
      data: { ...item },
    });
  }

  function closeModal() {
    setModal({ open: false, mode: "add", kind: "ride", data: null });
  }

  function saveModal(form) {
    if (modal.kind === "ride") {
      if (!form.duration || Number(form.duration) <= 0) return;
      pushHistory();
      if (modal.mode === "add") {
        const newRide = {
          id: generateId("ride"),
          date: form.date,
          type: form.type,
          duration: Number(form.duration),
          order: 999,
        };
        setRides((prev) => [...prev, newRide]);
      } else {
        setRides((prev) =>
          prev.map((r) =>
            r.id === form.id
              ? { ...r, type: form.type, duration: Number(form.duration) }
              : r
          )
        );
      }
    } else {
      const cleaned = {
        ...form,
        time: form.kind === "school" ? normalizeTime(form.time) : "",
        edited: form.source === "ics" ? true : form.edited,
      };
      pushHistory();
      setEvents((prev) =>
        prev.map((e) => (e.id === cleaned.id ? { ...e, ...cleaned } : e))
      );
    }
    closeModal();
  }

  function deleteModalItem() {
    if (!modal.data) return;
    pushHistory();
    if (modal.kind === "ride") {
      setRides((prev) => prev.filter((r) => r.id !== modal.data.id));
    } else {
      if (modal.data?.source === "ics" && modal.data?.icsId) {
        setDeletedIcsIds((prev) => Array.from(new Set([...prev, modal.data.icsId])));
      }
      setEvents((prev) => prev.filter((e) => e.id !== modal.data.id));
    }
    closeModal();
  }

  function getCombinedItems(dateKey, ridesList = rides, eventsList = events) {
    const rideItems = ridesList
      .filter((r) => r.date === dateKey)
      .map((r) => ({ ...r, kind: "ride", sortKey: 100 }));

    const eventItems = eventsList
      .filter((e) => e.date === dateKey)
      .map((e) => {
        let sortKey = 0;
        if (e.kind === "school") {
          sortKey = CLASS_TIMES.indexOf(e.time || "") + 1;
        } else if (e.kind === "race") {
          sortKey = 150;
        } else if (e.kind === "holiday") {
          sortKey = -10;
        }
        const defaultOrder = e.kind === "school" && (!e.order || e.order === 999) ? sortKey : e.order;
        return { ...e, kind: e.kind, sortKey, order: defaultOrder };
      });

    return sortItems([...eventItems, ...rideItems]);
  }

  function setOrdersForDay(dateKey, orderedIds, ridesList, eventsList) {
    const newRides = ridesList.map((r) => {
      if (r.date !== dateKey) return r;
      const idx = orderedIds.indexOf(r.id);
      return idx === -1 ? r : { ...r, order: idx };
    });
    const newEvents = eventsList.map((e) => {
      if (e.date !== dateKey) return e;
      const idx = orderedIds.indexOf(e.id);
      return idx === -1 ? e : { ...e, order: idx };
    });
    return { newRides, newEvents };
  }

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    const sourceDay = source.droppableId;
    const destDay = destination.droppableId;

    if (sourceDay === destDay && source.index === destination.index) return;

    pushHistory();

    let newRides = rides;
    let newEvents = events;

    const ride = rides.find((r) => r.id === draggableId);
    if (ride) {
      newRides = rides.map((r) => (r.id === draggableId ? { ...r, date: destDay } : r));
    } else {
      newEvents = events.map((e) => (e.id === draggableId ? { ...e, date: destDay } : e));
    }

    if (sourceDay === destDay) {
      const { draggableIds } = buildDisplayItemsForDay(sourceDay, newRides, newEvents);
      const reordered = Array.from(draggableIds);
      const [removed] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, removed);
      const { newRides: orderedRides, newEvents: orderedEvents } = setOrdersForDay(
        sourceDay,
        reordered,
        newRides,
        newEvents
      );
      setRides(orderedRides);
      setEvents(orderedEvents);
      return;
    }

    const sourceIds = buildDisplayItemsForDay(sourceDay, newRides, newEvents).draggableIds;
    const destIdsRaw = buildDisplayItemsForDay(destDay, newRides, newEvents).draggableIds;
    const destIds = destIdsRaw.filter((id) => id !== draggableId);
    destIds.splice(destination.index, 0, draggableId);

    const sourceOrdered = setOrdersForDay(sourceDay, sourceIds, newRides, newEvents);
    const destOrdered = setOrdersForDay(destDay, destIds, sourceOrdered.newRides, sourceOrdered.newEvents);

    setRides(destOrdered.newRides);
    setEvents(destOrdered.newEvents);
  }

  async function syncICS(url) {
    try {
      setIcsStatus("loading");
      let text = "";
      try {
        const direct = await fetch(url, { cache: "no-store" });
        if (direct.ok) text = await direct.text();
      } catch (err) {
        // ignore direct fetch failure; we'll try proxy below
      }

      if (!text || !text.includes("BEGIN:VCALENDAR")) {
        const proxy = await fetch(
          `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
          { cache: "no-store" }
        );
        if (!proxy.ok) throw new Error("Proxy fetch failed");
        text = await proxy.text();
      }
      const rawEvents = parseICS(text);
      const schoolClasses = [];
      const otherEvents = [];

      rawEvents.forEach((evt) => {
        const summary = evt.summary || "Calendar Event";
        const dt = parseICSTime(evt.dtstartRaw, evt.dtstartIsDate);
        if (!dt) return;
        const dateKey = toDateKey(dt);
        const time = evt.dtstartIsDate ? "" : `${pad2(dt.getHours())}:${pad2(dt.getMinutes())}`;
        const summaryLower = summary.toLowerCase();

        if (summaryLower.includes("holiday")) {
          otherEvents.push({
            id: generateId("event"),
            icsId: evt.uid || `${dateKey}-${summary}`,
            source: "ics",
            edited: false,
            date: dateKey,
            kind: "holiday",
            title: summary,
            time: "",
            order: 999,
          });
          return;
        }

        if (summaryLower.includes("race")) {
          otherEvents.push({
            id: generateId("event"),
            icsId: evt.uid || `${dateKey}-${summary}`,
            source: "ics",
            edited: false,
            date: dateKey,
            kind: "race",
            title: summary,
            time: "",
            order: 999,
          });
          return;
        }

        if (!summaryHasAllowedCode(summary)) return;
        if (!time) return;
        const [hh, mm] = time.split(":").map(Number);
        const minutes = hh * 60 + mm;
        schoolClasses.push({
          date: dateKey,
          minutes,
          time,
        });
      });

      const groupedClasses = groupSchoolClasses(schoolClasses).map((group) => {
        const sorted = group.classes.slice().sort((a, b) => a.minutes - b.minutes);
        const start = sorted[0];
        const end = sorted[sorted.length - 1];
        const endTime = addMinutesToTime(end.time, 75);
        const timeRange = start.time === end.time ? `${start.time}–${endTime}` : `${start.time}–${endTime}`;
        const icsId = `school-${group.date}-${start.time}-${end.time}`;
        return {
          id: generateId("event"),
          icsId,
          source: "ics",
          edited: false,
          date: group.date,
          kind: "school",
          title: "School",
          time: start.time,
          timeRange,
          classTimes: sorted.map((cls) => cls.time),
          order: 999,
        };
      });

      const mapped = [...otherEvents, ...groupedClasses];

      setEvents((prev) => {
        const nonIcs = prev.filter((e) => e.source !== "ics");
        const prevIcs = prev.filter((e) => e.source === "ics");
        const prevMap = new Map(prevIcs.map((e) => [e.icsId, e]));
        const deleted = new Set(deletedIcsIds);

        const merged = mapped
          .filter((e) => !deleted.has(e.icsId))
          .map((e) => {
            const existing = prevMap.get(e.icsId);
            if (existing && existing.edited) return { ...existing };
            return e;
          });

        return [...nonIcs, ...merged];
      });

      setIcsStatus("ok");
      setLastSyncedAt(new Date().toLocaleString());
    } catch (err) {
      console.warn("ICS sync failed", err);
      setIcsStatus("error");
    }
  }


  function buildDisplayItemsForDay(dateKey, ridesList = rides, eventsList = events) {
    const dayItems = getCombinedItems(dateKey, ridesList, eventsList);
    const dayDate = fromDateKey(dateKey);
    const hasHoliday = eventsList.some((e) => e.date === dateKey && e.kind === "holiday");
    const isSchoolDay = !isWeekend(dayDate) && !hasHoliday;

    const classTimesTaken = eventsList
      .filter((e) => e.date === dateKey && e.kind === "school")
      .flatMap((e) => (Array.isArray(e.classTimes) && e.classTimes.length ? e.classTimes : [e.time]))
      .filter(Boolean);

    const freeSessions = isSchoolDay
      ? CLASS_TIMES.filter((time) => !classTimesTaken.includes(time))
      : [];

    const visibleItems = dayItems.filter((item) => {
      if (item.kind === "ride" && !showRides) return false;
      if (item.kind === "school" && !showSchool) return false;
      if ((item.kind === "race" || item.kind === "holiday") && !showRacesHolidays) return false;
      return true;
    });

    const scheduleItems = showSchool
      ? [
          ...visibleItems.filter((item) => item.kind === "school"),
          ...freeSessions.map((time) => ({
            id: `free-${dateKey}-${time}`,
            kind: "free",
            time,
          })),
        ]
      : [];

    scheduleItems.sort((a, b) => {
      const aIdx = CLASS_TIMES.indexOf(a.time || "");
      const bIdx = CLASS_TIMES.indexOf(b.time || "");
      return aIdx - bIdx;
    });

    const scheduleGroup =
      scheduleItems.length > 0
        ? {
            id: `schedule-${dateKey}`,
            kind: "schedule",
            displayType: "schedule",
            items: scheduleItems,
            time: scheduleItems[0].time || "",
          }
        : null;

    const displayItems = [
      ...visibleItems
        .filter((item) => item.kind !== "school")
        .map((item) => ({ ...item, displayType: "event" })),
      ...(scheduleGroup ? [scheduleGroup] : []),
    ];

            const displayKeyFor = (item) => {
              if (item.kind === "holiday") return -10;
      if (item.kind === "schedule") {
        const idx = CLASS_TIMES.indexOf(item.time);
        return idx === -1 ? 10 : idx;
      }
      if (item.kind === "school" || item.kind === "free") {
        const idx = CLASS_TIMES.indexOf(item.time);
        return idx === -1 ? 10 : idx;
      }
              const hasOrder = typeof item.order === "number" && item.order !== 999;
              if (hasOrder) return item.order;
              if (item.kind === "race") return 80;
              if (item.kind === "ride") return 120;
              return item.sortKey ?? 200;
            };

    displayItems.sort((a, b) => displayKeyFor(a) - displayKeyFor(b));
    const draggableIds = displayItems.map((item) => item.id);

    return { displayItems, draggableIds };
  }


  const weekDays = useMemo(() => getWeekDays(currentWeekStart), [currentWeekStart]);
  const weekKeys = weekDays.map((d) => toDateKey(d));

  const totalHours = useMemo(() => {
    return rides
      .filter((r) => weekKeys.includes(r.date))
      .reduce((sum, r) => sum + Number(r.duration || 0), 0);
  }, [rides, weekKeys]);

  return (
    <div className="app">
      <header className="top-bar">
        <div className="title-group">
          <h1>Cycling Training Planner</h1>
          <p className="subtle">Plan a week at a time, keep it clean and visual.</p>
        </div>
        <div className="summary-card">
          <span className="summary-label">Total Riding</span>
          <span className="summary-value">{totalHours.toFixed(1)} hours</span>
        </div>
      </header>

      <section className="controls">
        <div className="week-controls">
          <button className="ghost" onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}>
            ← Previous
          </button>
          <div className="week-range">{formatWeekRange(currentWeekStart)}</div>
          <button className="ghost" onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}>
            Next →
          </button>
        </div>
        <div className="control-right">
          <div className="toggles">
            <label>
              <input type="checkbox" checked={showRides} onChange={(e) => setShowRides(e.target.checked)} />
              Show rides
            </label>
            <label>
              <input type="checkbox" checked={showSchool} onChange={(e) => setShowSchool(e.target.checked)} />
              Show school
            </label>
            <label>
              <input
                type="checkbox"
                checked={showRacesHolidays}
                onChange={(e) => setShowRacesHolidays(e.target.checked)}
              />
              Show races/holidays
            </label>
          </div>
          <div className="import-block">
            <button className="ghost icon-button" onClick={() => setIcsModalOpen(true)}>
              Compass Sync
            </button>
            <span className={`ics-status ${weatherStatus}`}>{weatherStatus}</span>
            <span className={`ics-status ${icsStatus}`}>{icsStatus}</span>
            <span className="ics-last">
              {weatherUpdatedAt ? `Weather: ${weatherUpdatedAt}` : ""}
            </span>
            <span className="ics-last">{lastSyncedAt ? `Compass: ${lastSyncedAt}` : ""}</span>
            <button className="ghost" onClick={handleUndo} disabled={!history.length}>
              Undo
            </button>
          </div>
        </div>
      </section>

      <DragDropContext
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(result) => {
          setIsDragging(false);
          onDragEnd(result);
        }}
      >
        <section className="calendar">
          {weekDays.map((day) => {
            const dateKey = toDateKey(day);
            const dayItems = getCombinedItems(dateKey);
            const { displayItems } = buildDisplayItemsForDay(dateKey);
            const hasHoliday = events.some((e) => e.date === dateKey && e.kind === "holiday");

            return (
              <div
                className={`day-column ${hasHoliday && showRacesHolidays ? "holiday" : ""}`}
                key={dateKey}
                onClick={() => {
                  if (isDragging) return;
                  openAddRide(dateKey);
                }}
              >
                <div className="day-header">
                  <div className="day-name">{formatDayLabel(day)}</div>
                  <div className="day-date">{formatDateLabel(day)}</div>
                </div>

                <Droppable droppableId={dateKey}>
                  {(provided) => (
                    <div className="day-body" ref={provided.innerRef} {...provided.droppableProps}>
                      {(() => {
                        let dragIndex = -1;
                        return displayItems.map((item) => {
                        dragIndex += 1;
                        if (item.displayType === "schedule") {
                          return (
                            <Draggable
                              draggableId={item.id}
                              index={dragIndex}
                              key={item.id}
                              isDragDisabled={true}
                            >
                              {(dragProvided) => (
                                <div
                                  className="schedule-group"
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                >
                                  {item.items.map((subItem) => (
                                    <div
                                      key={subItem.id || `${item.id}-${subItem.time}`}
                                      className={subItem.kind === "free" ? "free-session" : "block event-block school"}
                                    >
                                      {subItem.kind === "free"
                                        ? `Free Session · ${subItem.time}`
                                        : `School · ${subItem.timeRange || subItem.time || ""}`}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </Draggable>
                          );
                        }

                        const isRide = item.kind === "ride";
                        const isSchool = item.kind === "school";
                        const isRace = item.kind === "race";
                        const isHoliday = item.kind === "holiday";

                        const label = isRide
                          ? item.type
                          : isSchool
                          ? "School"
                          : isRace
                          ? item.title || "Race"
                          : item.title || "Holiday";

                        const style = {
                          backgroundColor: isRide
                            ? getRideColor(item.type)
                            : isRace
                            ? "#8b5cf6"
                            : isHoliday
                            ? "#fbbf24"
                            : "#e5e7eb",
                          color: isRide || isRace ? "white" : "#111827",
                          height: isRide ? `${Math.max(18, Number(item.duration || 1) * 72)}px` : "auto",
                        };

                        return (
                          <Draggable draggableId={item.id} index={dragIndex} key={item.id}>
                            {(dragProvided) => (
                              <div
                                className={`block ${isRide ? "ride-block" : "event-block"} ${
                                  isSchool ? "school" : ""
                                }`}
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                style={{ ...style, ...dragProvided.draggableProps.style }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditItem(item);
                                }}
                              >
                                <div className="block-title">{label}</div>
                                {isRide ? (
                                  <div className="block-sub">
                                    {item.duration}h
                                  </div>
                                ) : isSchool ? (
                                  <div className="block-sub">{item.timeRange || item.time || ""}</div>
                                ) : null}
                              </div>
                            )}
                          </Draggable>
                        );
                      });
                      })()}
                      {provided.placeholder}
                      <WeatherBadge weather={weatherByDate[dateKey]} status={weatherStatus} />
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </section>
      </DragDropContext>

      <Modal modal={modal} onClose={closeModal} onSave={saveModal} onDelete={deleteModalItem} />
      <IcsModal
        open={icsModalOpen}
        onClose={() => setIcsModalOpen(false)}
        icsUrl={icsUrl}
        setIcsUrl={setIcsUrl}
        onSync={() => syncICS(icsUrl)}
        status={icsStatus}
      />
    </div>
  );
}

function Modal({ modal, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(modal.data || {});

  useEffect(() => {
    setForm(modal.data || {});
  }, [modal]);

  if (!modal.open) return null;

  const isRide = modal.kind === "ride";
  const isEdit = modal.mode === "edit";

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{isRide ? (isEdit ? "Edit Ride" : "Add Ride") : "Edit Event"}</h3>

        {isRide ? (
          <div className="modal-body">
            <label>
              Ride type
              <select value={form.type} onChange={(e) => updateField("type", e.target.value)}>
                {RIDE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.value}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Duration (hours)
              <input
                type="number"
                min="0.25"
                step="0.25"
                value={form.duration}
                onChange={(e) => updateField("duration", e.target.value)}
              />
            </label>
          </div>
        ) : (
          <div className="modal-body">
            <label>
              Event type
              <select value={form.kind} onChange={(e) => updateField("kind", e.target.value)}>
                <option value="school">School class</option>
                <option value="race">Race</option>
                <option value="holiday">Holiday</option>
              </select>
            </label>
            <label>
              Title
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Title"
              />
            </label>
            {form.kind === "school" && (
              <label>
                Time
                <select value={form.time} onChange={(e) => updateField("time", e.target.value)}>
                  <option value="">Select time</option>
                  {CLASS_TIMES.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        )}

        <div className="modal-actions">
          {isEdit && (
            <button className="danger" onClick={onDelete}>
              Delete
            </button>
          )}
          <div className="spacer" />
          <button className="ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="primary" onClick={() => onSave(form)}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

function WeatherBadge({ weather, status }) {
  if (!weather && status !== "ok") {
    return <div className="weather-badge muted">Weather —</div>;
  }
  if (!weather) return <div className="weather-badge muted">Weather —</div>;
  const tmax = weather.tmax != null ? Math.round(weather.tmax) : "-";
  const precip = weather.precip != null ? weather.precip : "-";
  const prob = weather.prob != null ? weather.prob : "-";
  const wetLevel = prob !== "-" ? Number(prob) : 0;
  let tone = "dry";
  if (wetLevel >= 70) tone = "wet";
  else if (wetLevel >= 40) tone = "mixed";
  return (
    <div className={`weather-badge ${tone}`}>
      <span>{tmax}°</span>
      <span>{precip}mm</span>
      <span>{prob}%</span>
    </div>
  );
}

function IcsModal({ open, onClose, icsUrl, setIcsUrl, onSync, status }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Compass Calendar</h3>
        <div className="modal-body">
          <label>
            ICS link
            <input
              type="text"
              value={icsUrl}
              onChange={(e) => setIcsUrl(e.target.value)}
              spellCheck={false}
            />
          </label>
          <div className="ics-status-row">
            <span className={`ics-status ${status}`}>{status}</span>
          </div>
        </div>
        <div className="modal-actions">
          <button className="ghost" onClick={onClose}>
            Close
          </button>
          <button
            className="primary"
            onClick={() => {
              onSync();
              onClose();
            }}
          >
            Sync
          </button>
        </div>
      </div>
    </div>
  );
}
