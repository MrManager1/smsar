import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jsonServer from 'json-server';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import * as firestoreAdapter from './data/firestoreAdapter';

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

app.use(cors());
app.use(bodyParser.json());

// Feature: Request Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../client/public')));

// JSON Server setup (handle source vs dist locations for db.json)
const dataPathSrc = path.join(__dirname, '..', 'src', 'data', 'db.json');
const dataPathDist = path.join(__dirname, 'data', 'db.json');

// Prefer source file if it exists to persist data across builds (when dist is wiped)
let dataFile = fs.existsSync(dataPathSrc) ? dataPathSrc : dataPathDist;

// Ensure DB file exists with default structure to prevent crashes
if (!fs.existsSync(dataFile)) {
  const defaultDb = { properties: [], conversations: [], messages: [], admins: [], logs: [] };
  try {
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    fs.writeFileSync(dataFile, JSON.stringify(defaultDb, null, 2));
    console.log('Created default db.json at', dataFile);
  } catch (e) { console.error('Failed to create db.json', e); }
}

console.log(`Using database file: ${dataFile}`);
const router = jsonServer.router(dataFile);
const middlewares = jsonServer.defaults();

// Load config.json for secrets
const configPathSrc = path.join(__dirname, '..', 'src', 'config.json');
const configPathDist = path.join(__dirname, 'config.json');
// If src folder exists, use config there to persist across builds
const configPath = fs.existsSync(path.dirname(configPathSrc)) ? configPathSrc : configPathDist;

let config: { adminTokens: Record<string,string>, adminPasswords?: Record<string,string> } = { adminTokens: {} };
const loadConfig = () => {
  try {
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } else {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    }
  } catch (e) {
    console.error('Failed to read config.json', e);
  }
};
const saveConfig = () => {
  try { fs.writeFileSync(configPath, JSON.stringify(config, null, 2)); } catch (e) { console.error('Failed to save config.json', e); }
};
loadConfig();

// Pre-router middleware: capture tokens, enforce read-only, etc.
app.use('/api', (req: Request, res: Response, next: NextFunction) => {
  // Capture token on admin create/update and remove from body so it's not persisted in db.json
  if (req.method === 'POST' && req.path.startsWith('/admins') && req.body && req.body.token) {
    (req as any)._tokenToStore = req.body.token;
    delete req.body.token;
  }

  if ((req.method === 'PATCH' || req.method === 'PUT') && req.path.startsWith('/admins') && req.body && req.body.token) {
    (req as any)._tokenToUpdate = req.body.token;
    delete req.body.token;
  }

  // If deleting an admin, clean up token mapping first (owner-only already enforced later)
  if (req.method === 'DELETE' && req.path.startsWith('/admins/')) {
    const parts = req.path.split('/');
    const id = parts[parts.length - 1];
    if (config.adminTokens && config.adminTokens[id]) {
      delete config.adminTokens[id];
      saveConfig();
      console.log(`Removed admin token mapping for id ${id}`);
    }
  }

  // Identify admin based on token stored in config
  const token = req.header('x-admin-token');
  let admin: any = null;
  if (token) {
    const foundId = Object.keys(config.adminTokens).find(k => config.adminTokens[k] === token);
    if (foundId && (router as any).db) {
      admin = (router as any).db.get('admins').getById(parseInt(foundId, 10)).value();
    }
  }

  // fallback to single ADMIN_TOKEN env var for compatibility
  if (!admin && process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN) {
    admin = { id: 0, name: 'env-admin', isOwner: true };
  }

  console.log('API middleware:', { method: req.method, path: req.path, readOnly: process.env.READ_ONLY, token: token ? 'present' : undefined, adminExists: !!admin });

  const unsafe = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (process.env.READ_ONLY === 'true') {
    // allow posting logs even in read-only mode so we can record events
    if (unsafe.includes(req.method) && !req.path.startsWith('/logs')) {
      if (!admin) {
        return res.status(403).json({ error: 'Read-only mode: write operations are disabled' });
      }
      // only owner can delete
      if (req.method === 'DELETE' && !admin.isOwner) {
        return res.status(403).json({ error: 'Only owner can delete resources' });
      }
    }
  }

  next();
});

// Diagnostic: test DB write on startup to detect permission or path issues
try {
  (router as any).db.get('logs').push({ type: 'startup_write_test', ts: new Date().toISOString() }).write();
  console.log('DB write test succeeded');
} catch (e) {
  console.error('DB write test failed', e);
}

// If requested, initialize Firestore adapter and perform a simple test write
if (process.env.USE_FIRESTORE === 'true') {
  try {
    firestoreAdapter.initFirestore();
    // simple write test: create a tiny doc in a 'system' collection
    (async () => {
      try {
        const p = await firestoreAdapter.addProperty({ _meta: 'startup_write_test', ts: new Date().toISOString() });
        console.log('Firestore write test succeeded, created doc id:', p.id);
      } catch (err) {
        console.error('Firestore write test failed', err);
      }
    })();
  } catch (err) {
    console.error('Failed to initialize Firestore (use FIREBASE_SERVICE_ACCOUNT_* env vars):', err);
  }
}

// Add explicit handler for property creation so we can log and return errors cleanly
app.post('/api/properties', express.json(), async (req: Request, res: Response) => {
  try {
    console.log('Received POST /api/properties', req.body);
    if (process.env.USE_FIRESTORE === 'true') {
      const created = await firestoreAdapter.addProperty(req.body);
      console.log('Property created (firestore):', created && created.id);
      return res.json(created);
    }

    const created = (router as any).db.get('properties').insert(req.body).write();
    console.log('Property created:', created && created.id);
    return res.json(created);
  } catch (e: any) {
    console.error('Error creating property:', e);
    return res.status(500).json({ error: e && e.message ? e.message : String(e) });
  }
});

// Create http server and socket.io for real-time chat
const httpServer = http.createServer(app);
const io = new IOServer(httpServer, { cors: { origin: '*', methods: ['GET', 'POST'] } });

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join_conversation', (id) => {
    socket.join(`conversation:${id}`);
  });

  socket.on('create_conversation', async (payload, cb) => {
    try {
      const conv: any = {
        clientId: payload.clientId || null,
        guestName: payload.guestName || null,
        guestContact: payload.guestContact || null,
        propertyId: payload.propertyId || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        open: true,
      };
      let created: any;
      if (process.env.USE_FIRESTORE === 'true') {
        created = await firestoreAdapter.addConversation(conv);
      } else {
        created = (router as any).db.get('conversations').insert(conv).write();
      }
      io.emit('conversation_created', created);
      if (cb) cb({ ok: true, conversation: created });
    } catch (e: any) {
      console.error(e);
      if (cb) cb({ ok: false, error: e.message });
    }
  });

  socket.on('send_message', async (payload, cb) => {
    try {
      const msg: any = {
        conversationId: payload.conversationId,
        sender: payload.sender,
        senderName: payload.senderName || null,
        text: payload.text || '',
        ts: new Date().toISOString(),
      };
      let createdMsg: any;
      if (process.env.USE_FIRESTORE === 'true') {
        createdMsg = await firestoreAdapter.addMessage(msg);
      } else {
        createdMsg = (router as any).db.get('messages').insert(msg).write();
        (router as any).db.get('conversations').find({ id: payload.conversationId }).assign({ updatedAt: new Date().toISOString() }).write();
      }
      io.to(`conversation:${payload.conversationId}`).emit('new_message', createdMsg);
      io.emit('message_created', createdMsg);
      if (cb) cb({ ok: true, message: createdMsg });
    } catch (e: any) {
      console.error(e);
      if (cb) cb({ ok: false, error: e.message });
    }
  });
});

// Ensure uploads directory exists and configure multer for file uploads
const uploadsDir = path.join(__dirname, '../../client/public', 'uploads');
try { if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true }); } catch (e) { console.error('Failed to create uploads dir', e); }

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const safeName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, safeName);
  }
});
const upload = multer({ storage });

// Upload endpoint: POST /api/uploads (field 'file')
app.post('/api/uploads', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const urlPath = `/uploads/${req.file.filename}`;
  console.log('File uploaded:', urlPath);
  res.json({ url: urlPath });
});

// ADMIN PASSWORDS: owner can set password for an admin; password is stored hashed in config.adminPasswords
app.post('/api/admins/set-password', (req: Request, res: Response) => {
  // only owner can set passwords
  const token = req.header('x-admin-token');
  const ownerId = token ? Object.keys(config.adminTokens).find(k => config.adminTokens[k] === token) : undefined;
  if (!ownerId) return res.status(403).json({ error: 'Owner authentication required' });
  const owner = (router as any).db.get('admins').getById(parseInt(ownerId, 10)).value();
  if (!owner || !owner.isOwner) return res.status(403).json({ error: 'Only owner can set passwords' });

  const { id, password } = req.body as any;
  if (!id || !password) return res.status(400).json({ error: 'id and password are required' });

  const idStr = String(id);
  const salt = bcrypt.genSaltSync(10);
  const hashed = bcrypt.hashSync(password, salt);
  config.adminPasswords = config.adminPasswords || {};
  config.adminPasswords[idStr] = hashed;
  saveConfig();
  console.log(`Set password for admin ${idStr}`);
  res.json({ ok: true });
});

// Login with name or id and password
app.post('/api/admins/login', express.json(), (req: Request, res: Response) => {
  const { id, name, password } = req.body as any;
  if (!password) return res.status(400).json({ error: 'password required' });

  let admin: any = null;
  if (id) {
    admin = (router as any).db.get('admins').getById(parseInt(String(id), 10)).value();
  } else if (name) {
    admin = (router as any).db.get('admins').find({ name }).value();
  }

  if (!admin) return res.status(400).json({ error: 'admin not found' });

  const pwHash = (config.adminPasswords || {})[String(admin.id)];
  if (!pwHash) return res.status(403).json({ error: 'This admin does not have a password set' });

  if (!bcrypt.compareSync(password, pwHash)) return res.status(403).json({ error: 'Invalid password' });

  // ensure token exists for this admin and return it to the client
  config.adminTokens = config.adminTokens || {};
  if (!config.adminTokens[String(admin.id)]) {
    const t = crypto.randomBytes(16).toString('hex');
    config.adminTokens[String(admin.id)] = t;
    saveConfig();
  }

  res.json({ admin: { id: admin.id, name: admin.name, isOwner: admin.isOwner, phone: admin.phone, photo: admin.photo }, token: config.adminTokens[String(admin.id)] });
});

// Provide a helper endpoint: GET /api/admins?token=... to validate tokens without exposing them in DB
app.get('/api/admins', (req: Request, res: Response, next: NextFunction) => {
  const q = req.query as any;
  if (q && q.token) {
    const token = String(q.token);
    console.log('Verifying admin token:', token);
    const id = Object.keys(config.adminTokens).find(k => config.adminTokens[k] === token);
    console.log('Found admin id for token:', id);
    if (id && (router as any).db) {
      const admin = (router as any).db.get('admins').getById(parseInt(id, 10)).value();
      console.log('Resolved admin:', admin);
      return res.json(admin ? [admin] : []);
    }
    return res.json([]);
  }
  next();
});

// --- Chat REST endpoints ---
app.get('/api/conversations', async (req: Request, res: Response) => {
  try {
    if (process.env.USE_FIRESTORE === 'true') {
      const convs = await firestoreAdapter.listConversations();
      return res.json(convs);
    }
    const convs = (router as any).db.get('conversations').value() || [];
    res.json(convs);
  } catch (err) {
    console.error('Error fetching conversations', err);
    res.status(500).json({ error: String(err) });
  }
});

app.get('/api/conversations/:id/messages', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (process.env.USE_FIRESTORE === 'true') {
      const msgs = await firestoreAdapter.getMessagesForConversation(id);
      return res.json(msgs);
    }
    const idNum = parseInt(id, 10);
    const msgs = (router as any).db.get('messages').filter({ conversationId: idNum }).value() || [];
    res.json(msgs);
  } catch (err) {
    console.error('Error fetching messages', err);
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/conversations', express.json(), async (req: Request, res: Response) => {
  try {
    const { clientId, guestName, guestContact, propertyId } = req.body || {};
    const conv: any = { clientId: clientId || null, guestName: guestName || null, guestContact: guestContact || null, propertyId: propertyId || null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), open: true };
    if (process.env.USE_FIRESTORE === 'true') {
      const created = await firestoreAdapter.addConversation(conv);
      io.emit('conversation_created', created);
      return res.json(created);
    }

    const created = (router as any).db.get('conversations').insert(conv).write();
    io.emit('conversation_created', created);
    res.json(created);
  } catch (err) {
    console.error('Error creating conversation', err);
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/messages', express.json(), async (req: Request, res: Response) => {
  try {
    const { conversationId, sender, senderName, text } = req.body || {};
    const msg: any = { conversationId, sender, senderName: senderName || null, text: text || '', ts: new Date().toISOString() };
    if (process.env.USE_FIRESTORE === 'true') {
      const created = await firestoreAdapter.addMessage(msg);
      io.to(`conversation:${conversationId}`).emit('new_message', created);
      io.emit('message_created', created);
      return res.json(created);
    }

    const created = (router as any).db.get('messages').insert(msg).write();
    (router as any).db.get('conversations').find({ id: conversationId }).assign({ updatedAt: new Date().toISOString() }).write();
    io.to(`conversation:${conversationId}`).emit('new_message', created);
    io.emit('message_created', created);
    res.json(created);
  } catch (err) {
    console.error('Error creating message', err);
    res.status(500).json({ error: String(err) });
  }
});

// --- New Features Endpoints ---

// Feature: Advanced Property Search
app.get('/api/search/properties', async (req: Request, res: Response) => {
  try {
    const { minPrice, maxPrice, type, city, status } = req.query;
    let properties: any[] = [];

    if (process.env.USE_FIRESTORE === 'true') {
      properties = await firestoreAdapter.listProperties();
    } else {
      properties = (router as any).db.get('properties').value() || [];
    }

    // Apply filters
    if (minPrice) properties = properties.filter(p => Number(p.price) >= Number(minPrice));
    if (maxPrice) properties = properties.filter(p => Number(p.price) <= Number(maxPrice));
    if (type) properties = properties.filter(p => p.type === String(type));
    if (city) properties = properties.filter(p => p.city === String(city));
    if (status) properties = properties.filter(p => p.status === String(status));

    res.json(properties);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Feature: Dashboard Statistics
app.get('/api/dashboard/stats', async (req: Request, res: Response) => {
  try {
    let stats = { properties: 0, conversations: 0, messages: 0, admins: 0 };
    
    if (process.env.USE_FIRESTORE === 'true') {
      const p = await firestoreAdapter.listProperties();
      const c = await firestoreAdapter.listConversations();
      stats.properties = p.length;
      stats.conversations = c.length;
    } else {
      const db = (router as any).db;
      stats.properties = db.get('properties').size().value();
      stats.conversations = db.get('conversations').size().value();
      stats.messages = db.get('messages').size().value();
      stats.admins = db.get('admins').size().value();
    }
    res.json(stats);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Feature: Update Property Status (e.g., sold, rented)
app.patch('/api/properties/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const { id } = req.params;
  if (!status) return res.status(400).json({ error: 'Status is required' });
  
  try {
    const db = (router as any).db;
    // Try finding by string or number ID
    let exists = db.get('properties').getById(id).value();
    if (!exists) exists = db.get('properties').getById(parseInt(id, 10)).value();
    
    if (!exists) return res.status(404).json({ error: 'Property not found' });

    const updated = db.get('properties').updateById(exists.id, { status }).write();
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Feature: Mortgage Calculator Tool
app.get('/api/tools/mortgage', (req: Request, res: Response) => {
  const { price, rate, years, downPayment } = req.query;
  
  const P = Number(price) - (Number(downPayment) || 0);
  const r = (Number(rate) || 10) / 100 / 12; // monthly rate, default 10% annual interest
  const n = (Number(years) || 20) * 12; // months, default 20 years

  if (P <= 0) return res.json({ monthlyPayment: 0 });

  // Formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
  const x = Math.pow(1 + r, n);
  const monthly = (P * x * r) / (x - 1);

  res.json({
    propertyPrice: Number(price),
    loanAmount: P,
    monthlyPayment: Math.round(monthly),
    totalPayment: Math.round(monthly * n),
    totalInterest: Math.round((monthly * n) - P)
  });
});

// Feature: Smart Description Generator (Template Based)
app.post('/api/tools/generate-description', (req: Request, res: Response) => {
  const { type, location, area, rooms, features } = req.body;
  
  const adjectives = ['رائعة', 'مذهلة', 'فرصة لا تعوض', 'مميزة', 'عصرية', 'لقطة'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  
  const city = location?.city || 'موقع مميز';
  const neighborhood = location?.neighborhood ? `في ${location.neighborhood}` : '';
  
  let desc = `استمتع بالسكن في ${type} ${adj} بقلب ${city} ${neighborhood}. `;
  desc += `تمتد على مساحة ${area} متر مربع، وتتكون من ${rooms} غرف نوم مصممة بعناية لاستغلال المساحات. `;
  
  if (features && features.length > 0) {
    desc += `يتميز العقار بوجود: ${features.join('، ')}. `;
  }
  
  desc += `العقار قريب من الخدمات والطرق الرئيسية. تواصل معنا الآن لمزيد من التفاصيل ولا تدع الفرصة تفوتك!`;
  
  res.json({ description: desc });
});

// Feature: Find Similar Properties (Recommendation Engine)
app.get('/api/properties/:id/similar', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let allProps: any[] = [];
    
    if (process.env.USE_FIRESTORE === 'true') {
      allProps = await firestoreAdapter.listProperties();
    } else {
      allProps = (router as any).db.get('properties').value() || [];
    }

    // Find target property
    const target = allProps.find(p => String(p.id) === String(id));
    
    if (!target) return res.status(404).json({ error: 'Property not found' });

    // Filter similar: same city OR same type, AND price within 20% range
    const similar = allProps.filter(p => {
      if (String(p.id) === String(id)) return false; // exclude self
      
      const sameCity = p.location?.city === target.location?.city;
      const sameType = p.type === target.type;
      
      const priceRatio = Number(p.price) / Number(target.price);
      const similarPrice = priceRatio >= 0.8 && priceRatio <= 1.2;

      // Logic: Must be in same city, and either same type or similar price
      return sameCity && (sameType || similarPrice);
    }).slice(0, 3); // Limit to 3 recommendations

    res.json(similar);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// --- Additional Features (Auto-added) ---

// Feature: Property View Counter (Analytics)
app.post('/api/properties/:id/view', (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const db = (router as any).db;
    let prop = db.get('properties').getById(id).value();
    if (!prop) prop = db.get('properties').getById(parseInt(id, 10)).value();

    if (prop) {
      const newViews = (prop.views || 0) + 1;
      db.get('properties').updateById(prop.id, { views: newViews }).write();
      res.json({ views: newViews });
    } else {
      res.status(404).json({ error: 'Property not found' });
    }
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Feature: Newsletter Subscription
app.post('/api/newsletter', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const db = (router as any).db;
    // Ensure subscribers collection exists
    if (!db.has('subscribers').value()) {
      db.set('subscribers', []).write();
    }
    
    const exists = db.get('subscribers').find({ email }).value();
    if (exists) return res.json({ message: 'Already subscribed' });

    const sub = { email, ts: new Date().toISOString() };
    db.get('subscribers').push(sub).write();
    res.json({ success: true, message: 'Subscribed successfully' });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Feature: Currency Converter (Helper for international buyers)
app.get('/api/tools/currency', (req: Request, res: Response) => {
  const { amount, to } = req.query;
  const val = Number(amount);
  if (isNaN(val)) return res.status(400).json({ error: 'Invalid amount' });

  // Approximate rates relative to EGP (Base) - You can update these
  const rates: Record<string, number> = {
    'USD': 1 / 50,
    'EUR': 1 / 54,
    'SAR': 1 / 13.3,
    'AED': 1 / 13.6,
    'EGP': 1
  };

  const target = String(to || 'USD').toUpperCase();
  const rate = rates[target];

  if (!rate) return res.status(400).json({ error: 'Unsupported currency. Try USD, EUR, SAR, AED' });

  res.json({
    original: val,
    currency: target,
    converted: Math.round(val * rate * 100) / 100 // 2 decimal places
  });
});

// Mount JSON Server router at the end to handle all other API requests
app.use('/api', middlewares, router);

// Hook into router.render to persist tokens captured during create/update
(router as any).render = (req: Request, res: Response) => {
  try {
    if (req.method === 'POST' && req.path === '/admins' && (req as any)._tokenToStore) {
      const created: any = res.locals.data;
      if (created && created.id) {
        config.adminTokens[String(created.id)] = (req as any)._tokenToStore;
        saveConfig();
        console.log(`Stored admin token for id ${created.id}`);
      }
    }

    if ((req.method === 'PATCH' || req.method === 'PUT') && req.path.startsWith('/admins/') && (req as any)._tokenToUpdate) {
      const parts = req.path.split('/');
      const id = parts[parts.length - 1];
      if (id) {
        config.adminTokens[String(id)] = (req as any)._tokenToUpdate;
        saveConfig();
        console.log(`Updated admin token for id ${id}`);
      }
    }
  } catch (e) {
    console.error('Error handling admin token persistence', e);
  }

  res.json(res.locals.data);
};

httpServer.listen(port, () => {
  console.log(`Server (http & socket.io) is running on http://localhost:${port}`);
  console.log(`JSON Server is running on http://localhost:${port}/api`);
});
