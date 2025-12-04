const API_BASE = '/api';

const token = localStorage.getItem('token');

export const authHeaders = () =>
  token
    ? {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    : { 'Content-Type': 'application/json' };

export async function fetchCars(filters = '') {
  const res = await fetch(`${API_BASE}/cars${filters}`);
  return res.json();
}

export async function fetchBookings() {
  const res = await fetch(`${API_BASE}/bookings`, { headers: authHeaders() });
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('name', data.name);
  }
  return data;
}

export async function registerUser(form) {
  const payload = Object.fromEntries(new FormData(form).entries());
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export function renderCars(container, cars) {
  container.innerHTML = cars
    .map(
      (car) => `
      <article class="card">
        <img src="${car.image_url || 'https://placehold.co/600x400?text=Car'}" alt="${car.name}" style="width:100%; border-radius:10px;" />
        <h3>${car.name}</h3>
        <p>${car.fuel_type} · ${car.transmission} · ${car.seats} суудал</p>
        <p><strong>$${car.daily_rate}</strong>/өдөр</p>
        <a class="button" href="car-detail.html?id=${car.id}">Дэлгэрэнгүй</a>
      </article>
    `,
    )
    .join('');
}
