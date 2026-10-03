# Fitness Club Management System (Frontend Only)

A React frontend for a fitness club: members pick plans and trainers, view workout and diet plans, and keep a personal event calendar. Trainers manage plans for their clients, and admins manage users and coupons.

This is a **frontend-only** project. There is no backend or database. All data is mock data stored in the browser's `localStorage`, and payments are a demo only (no real payment processing).

## Features

- **Demo authentication**: login and registration for members and trainers, stored in localStorage.
- **Trainer selection**: browse, search and filter mock trainers.
- **Workout & diet plans**: trainers create and edit plans; members view them.
- **Event calendar**: members add, edit and delete events (localStorage).
- **Membership plans**: demo checkout with coupon codes.
- **Profile settings** for members and trainers.
- **Admin panel**: manage members, trainers and coupons.

## Demo accounts

| Role    | Username / Email   | Password     |
|---------|--------------------|--------------|
| Member  | `testmember`       | `test123`    |
| Member  | `john_doe` (has trainer, workout & diet plan) | `member123` |
| Trainer | `coach_alex`       | `trainer123` |
| Admin   | `e@e.com`          | `123456`     |

Demo coupons: `SUMMER25`, `WELCOME10`, `FLASH50`.

To reset all demo data, clear the site's localStorage in your browser's dev tools.

## Run locally

```bash
npm install
npm start
```

Open http://localhost:3000/mini_project

## Production build

```bash
npm run build
```

## Deploy to GitHub Pages

```bash
npm run deploy
```
