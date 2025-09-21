export function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// получаю дату в формате yyyy-MM-dd для input[type="date"] и фильтра
export function formatDateISO(dateString: string | null): string {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
}
