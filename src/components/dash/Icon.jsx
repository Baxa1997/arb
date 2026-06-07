// Lucide-style line icons (1.8px stroke, rounded) — ported from the
// Claude Design dashboard bundle (dash-icons.jsx).
export default function Icon({ name, size = 20, sw = 1.8 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" /><path d="M9.5 21v-6h5v6" /></>,
    students: <><path d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4Z" /><path d="M6 10.5V15c0 1.4 2.7 2.8 6 2.8s6-1.4 6-2.8v-4.5" /><path d="M21.5 8.5V14" /></>,
    book: <><path d="M4 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v15l-5-2.5L8 20" /><path d="M4 5v13a2 2 0 0 0 2 2h2" /></>,
    pencil: <><path d="M4 20h4l10-10a2.1 2.1 0 0 0-3-3L5 17v3Z" /><path d="M13.5 6.5l3 3" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    chevL: <path d="M15 6l-6 6 6 6" />,
    chevR: <path d="M9 6l6 6-6 6" />,
    chevD: <path d="M6 9l6 6 6-6" />,
    arrowR: <path d="M5 12h14M13 6l6 6-6 6" />,
    arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
    check: <path d="M20 6 9 17l-5-5" />,
    checkCircle: <><circle cx="12" cy="12" r="9" /><path d="M8.5 12l2.5 2.5 4.5-5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    hourglass: <><path d="M6 3h12M6 21h12" /><path d="M7 3c0 4 3.5 5.2 5 7 1.5-1.8 5-3 5-7" /><path d="M7 21c0-4 3.5-5.2 5-7 1.5 1.8 5 3 5 7" /></>,
    fileCheck: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5" /><path d="M9 15l2 2 4-4" /></>,
    inbox: <><path d="M4 13h4l1.5 2.5h5L16 13h4" /><path d="M5.5 6h13l2 7v5a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1v-5l2-7Z" /></>,
    logout: <><path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>,
    alert: <><path d="M10.3 4.3 2.6 18A1.8 1.8 0 0 0 4.2 20.7h15.6A1.8 1.8 0 0 0 21.4 18L13.7 4.3a1.8 1.8 0 0 0-3.4 0Z" /><path d="M12 9v4.5M12 17h.01" /></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>,
    filter: <path d="M3 5h18l-7 8v6l-4-2v-4L3 5Z" />,
    calendar: <><rect x="3.5" y="4.5" width="17" height="16" rx="2" /><path d="M3.5 9h17M8 2.5v4M16 2.5v4" /></>,
    sortDown: <path d="M11 5h10M11 9h7M11 13h4M3 13l3 3 3-3M6 6v10" />,
    kebab: <><circle cx="12" cy="5" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="12" cy="19" r="1.4" /></>,
    teacher: <><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>,
    chart: <><path d="M4 20V4M4 20h16" /><path d="M8 16v-3M12 16v-7M16 16v-5" /></>,
    target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="0.6" fill="currentColor" /></>,
    star: <path d="M12 3.5l2.4 5.2 5.6.6-4.2 3.8 1.2 5.5L12 16l-5 2.4 1.2-5.5L4 9.3l5.6-.6L12 3.5Z" />,
    lock: <><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></>,
    video: <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3" /></>,
    sound: <><path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" /><path d="M15.5 9a4 4 0 0 1 0 6" /></>,
    write: <><path d="M5 19h14" /><path d="M14 4.5l3.5 3.5L8 17.5 4 18.5l1-4 9-10Z" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
  };
  return <svg {...p} aria-hidden="true">{paths[name] || null}</svg>;
}
