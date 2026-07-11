export const STATUT_LABELS = {
  payé: 'Payé',
  impayé: 'Impayé',
  acompte: 'Acompte',
};

export const STATUT_ORDER = ['payé', 'impayé', 'acompte'];

export function statutLabel(statut) {
  if (!statut) return '';
  return STATUT_LABELS[statut] || statut;
}

export function nextStatut(current) {
  if (!current) return '';
  const idx = STATUT_ORDER.indexOf(current);
  return STATUT_ORDER[(idx + 1) % STATUT_ORDER.length];
}

export function countByCat(appts, cat) {
  if (!appts || !cat) return 0;
  if (cat === 'all') return appts.length;
  return appts.filter((a) => a.service === cat).length;
}

export function recurringNames(appts) {
  if (!appts) return {};
  const counts = {};
  appts.forEach((a) => {
    counts[a.clientName] = (counts[a.clientName] || 0) + 1;
  });
  return counts;
}

function parseDateString(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function parseAppointmentDate(appt) {
  if (!appt) return null;
  if (appt.date) return parseDateString(appt.date);
  if (appt.startTime?.includes('T')) {
    return parseDateString(appt.startTime.split('T')[0]);
  }
  return null;
}

export function parseAppointmentDateTime(appt) {
  if (!appt) return null;
  if (appt.startTime?.includes('T')) {
    const date = new Date(appt.startTime);
    if (!Number.isNaN(date.getTime())) return date;
  }
  if (appt.date && appt.startTime) {
    const date = new Date(`${appt.date}T${appt.startTime}`);
    if (!Number.isNaN(date.getTime())) return date;
  }
  if (appt.date) return parseDateString(appt.date);
  return null;
}

function getToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function getWeekBounds(today) {
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { start: monday, end: sunday };
}

function isSameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function isThisMonth(date, today) {
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth()
  );
}

export function getFiltered(appts, state) {
  if (!appts) return [];
  let list = appts.slice();

  if (state.cat && state.cat !== 'all') {
    list = list.filter((a) => (a.service || a.cat) === state.cat);
  }

  if (state.search?.trim()) {
    const query = state.search.trim().toLowerCase();
    list = list.filter((a) =>
      (a.clientName || a.name || '')
        .toLowerCase()
        .includes(query),
    );
  }

  if (state.statuts?.length) {
    list = list.filter((a) =>
      state.statuts.includes(a.statut || a.status),
    );
  }

  if (state.selectedDate) {
    const selected = parseDateString(state.selectedDate);
    if (selected) {
      list = list.filter((a) => {
        const apptDate = parseAppointmentDate(a);
        if (!apptDate) return false;
        return isSameDay(apptDate, selected);
      });
    }
  }

  list.sort((a, b) => {
    const dateA = parseAppointmentDateTime(a);
    const dateB = parseAppointmentDateTime(b);
    if (!dateA || !dateB) return 0;
    return dateA - dateB;
  });

  return list;
}
