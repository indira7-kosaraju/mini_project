// Frontend-only data layer.
// Replaces the old backend with mock data persisted in localStorage.
// Every function is async so components keep their existing async flow.
import maleImg from '../assets/male.png';
import femaleImg from '../assets/female.png';

const KEYS = {
    members: 'pf_members',
    trainers: 'pf_trainers',
    workoutPlans: 'pf_workout_plans',
    dietPlans: 'pf_diet_plans',
    events: 'pf_events',
    coupons: 'pf_coupons',
};

const DAY = 24 * 60 * 60 * 1000;
const daysFromNow = (n) => new Date(Date.now() + n * DAY).toISOString();
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ---------- Seed data ----------

const seedTrainers = () => [
    {
        _id: 't1', username: 'coach_alex', password: 'trainer123', email: 'alex@powerfit.com',
        fullName: 'Alex Johnson', age: 35, gender: 'male', phone: '1112223333',
        specialization: 'Strength Training', experience: 8, certification: 'NSCA-CSCS',
        feePerMonth: 3000, availability: 'Mon-Fri, 6AM-2PM', photo: null, userType: 'trainer',
        rating: 4.8, reviews: [
            { memberId: 'm1', rating: 5, comment: 'Great coach!', date: daysFromNow(-20) },
            { memberId: 'm3', rating: 4.5, comment: 'Very motivating.', date: daysFromNow(-10) },
        ],
    },
    {
        _id: 't2', username: 'coach_emma', password: 'trainer123', email: 'emma@powerfit.com',
        fullName: 'Emma Wilson', age: 29, gender: 'female', phone: '4445556666',
        specialization: 'Yoga', experience: 5, certification: 'RYT-500',
        feePerMonth: 2500, availability: 'Mon-Sat, 7AM-12PM', photo: null, userType: 'trainer',
        rating: 4.6, reviews: [
            { memberId: 'm2', rating: 5, comment: 'So calming and helpful.', date: daysFromNow(-5) },
        ],
    },
    {
        _id: 't3', username: 'coach_david', password: 'trainer123', email: 'david@powerfit.com',
        fullName: 'David Brown', age: 40, gender: 'male', phone: '7778889999',
        specialization: 'Cardio', experience: 12, certification: 'ACE-CPT',
        feePerMonth: 3500, availability: 'Tue-Sun, 4PM-9PM', photo: null, userType: 'trainer',
        rating: 4.3, reviews: [],
    },
    {
        _id: 't4', username: 'coach_priya', password: 'trainer123', email: 'priya@powerfit.com',
        fullName: 'Priya Sharma', age: 31, gender: 'female', phone: '9990001111',
        specialization: 'Weight Loss', experience: 6, certification: 'NASM-CPT',
        feePerMonth: 2800, availability: 'Mon-Fri, 5PM-9PM', photo: null, userType: 'trainer',
        rating: 4.7, reviews: [
            { memberId: 'm4', rating: 5, comment: 'Lost 8kg in 3 months!', date: daysFromNow(-30) },
        ],
    },
];

const activeMembership = (type) => ({
    type, startDate: daysFromNow(-10), endDate: daysFromNow(20), status: 'active',
});

const seedMembers = () => [
    {
        _id: 'm0', username: 'testmember', password: 'test123', email: 'test@example.com',
        phone: '1234567890', age: 25, gender: 'male', emergencyContact: '9876543210',
        healthConditions: 'None', userType: 'member', membership: { status: 'inactive' },
        assignedTrainer: null,
    },
    {
        _id: 'm1', username: 'john_doe', password: 'member123', email: 'john@example.com',
        phone: '1234567890', age: 28, gender: 'male', emergencyContact: '9876500000',
        healthConditions: '', userType: 'member', membership: activeMembership('Premium Plan'),
        assignedTrainer: 't1',
    },
    {
        _id: 'm2', username: 'jane_smith', password: 'member123', email: 'jane@example.com',
        phone: '9876543210', age: 24, gender: 'female', emergencyContact: '9876511111',
        healthConditions: '', userType: 'member', membership: { status: 'inactive', type: null },
        assignedTrainer: 't2',
    },
    {
        _id: 'm3', username: 'mike_johnson', password: 'member123', email: 'mike@example.com',
        phone: '5551234567', age: 32, gender: 'male', emergencyContact: '9876522222',
        healthConditions: 'Mild asthma', userType: 'member', membership: activeMembership('Basic Plan'),
        assignedTrainer: 't1',
    },
    {
        _id: 'm4', username: 'sarah_williams', password: 'member123', email: 'sarah@example.com',
        phone: '7778889999', age: 27, gender: 'female', emergencyContact: '9876533333',
        healthConditions: '', userType: 'member', membership: activeMembership('Pro Plan'),
        assignedTrainer: 't4',
    },
];

const seedWorkoutPlans = () => [
    {
        _id: 'w1', memberId: 'm1', trainerId: 't1',
        weeklyPlan: DAYS.map((day, i) => ({
            day,
            exercises: i === 6 ? [] : [
                [
                    { name: 'Bench Press', sets: 4, reps: 8, duration: 15, notes: 'Warm up first' },
                    { name: 'Incline Dumbbell Press', sets: 3, reps: 10, duration: 10, notes: '' },
                ],
                [
                    { name: 'Squats', sets: 4, reps: 8, duration: 15, notes: 'Keep back straight' },
                    { name: 'Leg Press', sets: 3, reps: 12, duration: 10, notes: '' },
                ],
                [{ name: 'Treadmill Run', sets: 1, reps: 1, duration: 30, notes: 'Moderate pace' }],
                [
                    { name: 'Deadlift', sets: 4, reps: 6, duration: 15, notes: '' },
                    { name: 'Pull-ups', sets: 3, reps: 10, duration: 10, notes: '' },
                ],
                [
                    { name: 'Overhead Press', sets: 4, reps: 8, duration: 12, notes: '' },
                    { name: 'Bicep Curls', sets: 3, reps: 12, duration: 8, notes: '' },
                ],
                [{ name: 'Yoga Stretch', sets: 1, reps: 1, duration: 40, notes: 'Recovery' }],
            ][i],
        })),
        createdAt: daysFromNow(-7), updatedAt: daysFromNow(-7),
    },
];

const seedDietPlans = () => [
    {
        _id: 'd1', memberId: 'm1', trainerId: 't1',
        weeklyPlan: DAYS.map((day) => ({
            day,
            meals: [
                { type: 'breakfast', foods: [
                    { name: 'Oats with banana', quantity: '1 bowl', calories: 350 },
                    { name: 'Boiled eggs', quantity: '3', calories: 210 },
                ] },
                { type: 'lunch', foods: [
                    { name: 'Grilled chicken', quantity: '200g', calories: 330 },
                    { name: 'Brown rice', quantity: '1 cup', calories: 215 },
                ] },
                { type: 'snack', foods: [{ name: 'Greek yogurt', quantity: '1 cup', calories: 150 }] },
                { type: 'dinner', foods: [
                    { name: 'Paneer / Tofu stir fry', quantity: '200g', calories: 300 },
                    { name: 'Mixed salad', quantity: '1 bowl', calories: 80 },
                ] },
            ],
        })),
        createdAt: daysFromNow(-7), updatedAt: daysFromNow(-7),
    },
];

const seedEvents = () => [
    { _id: 'e1', userId: 'm1', title: 'Leg day with Alex', date: daysFromNow(1) },
    { _id: 'e2', userId: 'm1', title: 'Yoga class', date: daysFromNow(3) },
];

const seedCoupons = () => [
    { _id: 'c1', code: 'SUMMER25', discount: 25, expiryDate: daysFromNow(90), isActive: true, createdAt: daysFromNow(-30) },
    { _id: 'c2', code: 'WELCOME10', discount: 10, expiryDate: daysFromNow(365), isActive: true, createdAt: daysFromNow(-30) },
    { _id: 'c3', code: 'FLASH50', discount: 50, expiryDate: daysFromNow(30), isActive: true, createdAt: daysFromNow(-2) },
];

const SEEDS = {
    members: seedMembers,
    trainers: seedTrainers,
    workoutPlans: seedWorkoutPlans,
    dietPlans: seedDietPlans,
    events: seedEvents,
    coupons: seedCoupons,
};

// ---------- localStorage helpers ----------

const read = (name) => {
    try {
        const raw = localStorage.getItem(KEYS[name]);
        if (raw) return JSON.parse(raw);
    } catch (e) {
        console.warn(`Resetting corrupted ${name} data`);
    }
    const seeded = SEEDS[name]();
    write(name, seeded);
    return seeded;
};

const write = (name, value) => {
    localStorage.setItem(KEYS[name], JSON.stringify(value));
};

const clone = (v) => JSON.parse(JSON.stringify(v));
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
const newId = (prefix) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const withoutPassword = ({ password, ...rest }) => rest;
const currentUserId = () => localStorage.getItem('userId');

const withPhoto = (trainer) => ({
    ...trainer,
    photo: trainer.photo || (trainer.gender === 'female' ? femaleImg : maleImg),
});

const publicTrainer = (t) => withPhoto(withoutPassword(t));

const isTaken = (list, { username, email }, ignoreId) =>
    list.some((u) => u._id !== ignoreId && (u.username === username || u.email === email));

// ---------- Auth ----------

export const login = async ({ username, password, role }) => {
    await delay();
    const list = role === 'trainer' ? read('trainers') : read('members');
    const user = list.find((u) => u.username === username && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    return {
        _id: user._id,
        username: user.username,
        userType: user.userType,
        email: user.email,
        fullName: user.fullName,
        token: `demo-token-${user._id}`,
    };
};

export const signupMember = async (data) => {
    await delay();
    const members = read('members');
    if (isTaken(members, data)) throw new Error('User already exists');
    const { confirmPassword, ...fields } = data;
    const member = {
        ...fields,
        _id: newId('m'),
        age: Number(fields.age),
        userType: 'member',
        membership: { status: 'inactive' },
        assignedTrainer: null,
    };
    write('members', [...members, member]);
    return {
        user: { _id: member._id, username: member.username, email: member.email, userType: 'member' },
        token: `demo-token-${member._id}`,
    };
};

export const signupTrainer = async (data) => {
    await delay();
    const trainers = read('trainers');
    if (isTaken(trainers, data)) throw new Error('Trainer already exists');
    const { confirmPassword, photo, ...fields } = data;
    const trainer = {
        ...fields,
        _id: newId('t'),
        age: Number(fields.age),
        experience: Number(fields.experience),
        feePerMonth: Number(fields.feePerMonth),
        photo: photo || null,
        userType: 'trainer',
        rating: 0,
        reviews: [],
    };
    try {
        write('trainers', [...trainers, trainer]);
    } catch (e) {
        // Photo too large for localStorage – save without it
        write('trainers', [...trainers, { ...trainer, photo: null }]);
    }
    return {
        user: { _id: trainer._id, username: trainer.username, email: trainer.email, userType: 'trainer', fullName: trainer.fullName },
        token: `demo-token-${trainer._id}`,
    };
};

// Reads an uploaded image file as a data URL so it can be stored locally
export const fileToDataUrl = (file) =>
    new Promise((resolve) => {
        if (!file) return resolve(null);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
    });

// ---------- Members ----------

export const getMemberProfile = async () => {
    await delay();
    const member = read('members').find((m) => m._id === currentUserId());
    if (!member) throw new Error('Member not found');
    const trainer = read('trainers').find((t) => t._id === member.assignedTrainer);
    return clone({
        ...withoutPassword(member),
        assignedTrainer: trainer
            ? { _id: trainer._id, fullName: trainer.fullName, specialization: trainer.specialization, experience: trainer.experience }
            : null,
    });
};

export const updateMemberProfile = async (updates) => {
    await delay();
    const members = read('members');
    const id = currentUserId();
    const idx = members.findIndex((m) => m._id === id);
    if (idx === -1) throw new Error('Member not found');
    if (isTaken(members, updates, id)) throw new Error('Username or email already in use');
    const { username, email, phone, age, gender, emergencyContact, healthConditions } = updates;
    members[idx] = { ...members[idx], username, email, phone, age: Number(age), gender, emergencyContact, healthConditions };
    write('members', members);
    localStorage.setItem('username', username);
    return clone(withoutPassword(members[idx]));
};

export const activateMembership = async (planName) => {
    await delay();
    const members = read('members');
    const idx = members.findIndex((m) => m._id === currentUserId());
    if (idx === -1) throw new Error('Member not found');
    members[idx].membership = {
        type: planName,
        startDate: new Date().toISOString(),
        endDate: daysFromNow(30),
        status: 'active',
    };
    write('members', members);
    return clone(members[idx].membership);
};

export const selectTrainer = async (trainerId) => {
    await delay();
    const members = read('members');
    const idx = members.findIndex((m) => m._id === currentUserId());
    if (idx === -1) throw new Error('Member not found');
    members[idx].assignedTrainer = trainerId;
    write('members', members);
};

// ---------- Trainers ----------

export const getTrainers = async () => {
    await delay();
    return clone(read('trainers').map(publicTrainer));
};

export const getTrainerProfile = async () => {
    await delay();
    const trainer = read('trainers').find((t) => t._id === currentUserId());
    if (!trainer) throw new Error('Trainer not found');
    return clone(withoutPassword(trainer));
};

export const updateTrainerProfile = async (updates) => {
    await delay();
    const trainers = read('trainers');
    const id = currentUserId();
    const idx = trainers.findIndex((t) => t._id === id);
    if (idx === -1) throw new Error('Trainer not found');
    if (isTaken(trainers, updates, id)) throw new Error('Username or email already in use');
    const fields = ['username', 'email', 'fullName', 'phone', 'gender', 'specialization', 'certification', 'availability'];
    fields.forEach((f) => { trainers[idx][f] = updates[f]; });
    ['age', 'experience', 'feePerMonth'].forEach((f) => { trainers[idx][f] = Number(updates[f]); });
    write('trainers', trainers);
    localStorage.setItem('username', updates.username);
    localStorage.setItem('trainerName', updates.fullName);
    return clone(withoutPassword(trainers[idx]));
};

export const getTrainerMembers = async () => {
    await delay();
    const id = currentUserId();
    return clone(read('members').filter((m) => m.assignedTrainer === id).map(withoutPassword));
};

// ---------- Workout & diet plans ----------

const getPlan = (name, memberId) =>
    read(name)
        .filter((p) => p.memberId === memberId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null;

const savePlan = (name, prefix, memberId, weeklyPlan) => {
    const plans = read(name);
    const now = new Date().toISOString();
    const existing = plans.find((p) => p.memberId === memberId);
    let plan;
    if (existing) {
        existing.weeklyPlan = weeklyPlan;
        existing.trainerId = currentUserId();
        existing.updatedAt = now;
        plan = existing;
    } else {
        plan = { _id: newId(prefix), memberId, trainerId: currentUserId(), weeklyPlan, createdAt: now, updatedAt: now };
        plans.push(plan);
    }
    write(name, plans);
    return clone(plan);
};

export const getWorkoutPlan = async (memberId) => {
    await delay();
    return clone(getPlan('workoutPlans', memberId));
};

export const saveWorkoutPlan = async (memberId, weeklyPlan) => {
    await delay();
    return savePlan('workoutPlans', 'w', memberId, weeklyPlan);
};

export const getDietPlan = async (memberId) => {
    await delay();
    return clone(getPlan('dietPlans', memberId));
};

export const saveDietPlan = async (memberId, weeklyPlan) => {
    await delay();
    return savePlan('dietPlans', 'd', memberId, weeklyPlan);
};

// ---------- Events (bookings / calendar) ----------

export const getEvents = async () => {
    await delay(100);
    const id = currentUserId();
    return clone(read('events').filter((e) => e.userId === id));
};

export const createEvent = async ({ title, date }) => {
    await delay(100);
    const event = { _id: newId('e'), userId: currentUserId(), title, date: new Date(date).toISOString() };
    write('events', [...read('events'), event]);
    return clone(event);
};

export const updateEvent = async (eventId, { title, date }) => {
    await delay(100);
    const events = read('events').map((e) =>
        e._id === eventId && e.userId === currentUserId()
            ? { ...e, title, date: new Date(date).toISOString() }
            : e
    );
    write('events', events);
};

export const deleteEvent = async (eventId) => {
    await delay(100);
    write('events', read('events').filter((e) => !(e._id === eventId && e.userId === currentUserId())));
};

// ---------- Admin ----------

export const adminGetMembers = async () => {
    await delay();
    return clone(read('members').map(withoutPassword));
};

export const adminGetTrainers = async () => {
    await delay();
    return clone(read('trainers').map(publicTrainer));
};

export const adminUpdateMember = async (id, updates) => {
    await delay();
    const members = read('members');
    const idx = members.findIndex((m) => m._id === id);
    if (idx === -1) throw new Error('Member not found');
    const { username, email, phone, age, gender } = updates;
    members[idx] = { ...members[idx], username, email, phone, age: Number(age), gender };
    write('members', members);
    return clone(withoutPassword(members[idx]));
};

export const adminUpdateTrainer = async (id, updates) => {
    await delay();
    const trainers = read('trainers');
    const idx = trainers.findIndex((t) => t._id === id);
    if (idx === -1) throw new Error('Trainer not found');
    const { username, email, fullName, phone, specialization, experience, feePerMonth } = updates;
    trainers[idx] = {
        ...trainers[idx], username, email, fullName, phone, specialization,
        experience: Number(experience), feePerMonth: Number(feePerMonth),
    };
    write('trainers', trainers);
    return clone(publicTrainer(trainers[idx]));
};

export const adminDeleteMember = async (id) => {
    await delay();
    write('members', read('members').filter((m) => m._id !== id));
    write('workoutPlans', read('workoutPlans').filter((p) => p.memberId !== id));
    write('dietPlans', read('dietPlans').filter((p) => p.memberId !== id));
    write('events', read('events').filter((e) => e.userId !== id));
};

export const adminDeleteTrainer = async (id) => {
    await delay();
    write('trainers', read('trainers').filter((t) => t._id !== id));
    write('members', read('members').map((m) => (m.assignedTrainer === id ? { ...m, assignedTrainer: null } : m)));
};

// ---------- Coupons ----------

export const getCoupons = async () => {
    await delay();
    return clone(read('coupons'));
};

export const createCoupon = async ({ code, discount, expiryDate, isActive }) => {
    await delay();
    const coupons = read('coupons');
    if (coupons.some((c) => c.code === code)) throw new Error('Coupon code already exists');
    const coupon = {
        _id: newId('c'), code, discount: Number(discount), expiryDate, isActive,
        createdAt: new Date().toISOString(),
    };
    write('coupons', [...coupons, coupon]);
    return clone(coupon);
};

export const updateCoupon = async (id, { code, discount, expiryDate, isActive }) => {
    await delay();
    const coupons = read('coupons');
    if (coupons.some((c) => c.code === code && c._id !== id)) throw new Error('Coupon code already exists');
    const idx = coupons.findIndex((c) => c._id === id);
    if (idx === -1) throw new Error('Coupon not found');
    coupons[idx] = { ...coupons[idx], code, discount: Number(discount), expiryDate, isActive };
    write('coupons', coupons);
    return clone(coupons[idx]);
};

export const deleteCoupon = async (id) => {
    await delay();
    write('coupons', read('coupons').filter((c) => c._id !== id));
};

// Returns { code, discount } for an active, unexpired coupon, or null
export const validateCoupon = async (code) => {
    await delay(150);
    const coupon = read('coupons').find(
        (c) => c.code === code && c.isActive && new Date(c.expiryDate) > new Date()
    );
    return coupon ? { code: coupon.code, discount: coupon.discount } : null;
};
