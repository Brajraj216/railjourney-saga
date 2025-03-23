
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
let db;

async function initializeDatabase() {
  try {
    // Create the connection pool
    db = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    console.log('Connected to MySQL database');
    
    // Initialize tables
    await createTables();
    
    // Seed initial data
    await seedData();
    
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

async function createTables() {
  try {
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create trains table
    await db.query(`
      CREATE TABLE IF NOT EXISTS trains (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        number VARCHAR(50) NOT NULL,
        from_station VARCHAR(255) NOT NULL,
        to_station VARCHAR(255) NOT NULL,
        departure TIME NOT NULL,
        arrival TIME NOT NULL,
        duration VARCHAR(50) NOT NULL,
        type ENUM('Premium', 'Superfast', 'Express', 'Passenger') NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        availability ENUM('Available', 'Limited', 'Full') NOT NULL DEFAULT 'Available',
        rating DECIMAL(3, 1) NOT NULL DEFAULT 4.0
      )
    `);

    // Create train_classes table
    await db.query(`
      CREATE TABLE IF NOT EXISTS train_classes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        train_id INT NOT NULL,
        class VARCHAR(5) NOT NULL,
        FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE
      )
    `);

    // Create train_amenities table
    await db.query(`
      CREATE TABLE IF NOT EXISTS train_amenities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        train_id INT NOT NULL,
        amenity ENUM('food', 'wifi', 'entertainment', 'charging', 'bedding') NOT NULL,
        FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE
      )
    `);

    // Create tickets table
    await db.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id VARCHAR(20) PRIMARY KEY,
        user_id INT NOT NULL,
        train_id INT NOT NULL,
        journey_date DATE NOT NULL,
        booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        class VARCHAR(5) NOT NULL,
        status ENUM('confirmed', 'waiting', 'cancelled', 'completed') NOT NULL DEFAULT 'confirmed',
        total_amount DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE
      )
    `);

    // Create passengers table
    await db.query(`
      CREATE TABLE IF NOT EXISTS passengers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ticket_id VARCHAR(20) NOT NULL,
        name VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        gender ENUM('male', 'female', 'other') NOT NULL,
        FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
      )
    `);

    console.log('Database tables created');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

async function seedData() {
  try {
    // Check if we already have users
    const [users] = await db.query('SELECT * FROM users LIMIT 1');
    
    if (users.length === 0) {
      // Hash passwords
      const adminPassword = await bcrypt.hash('admin123', 10);
      const userPassword = await bcrypt.hash('user123', 10);
      
      // Insert admin user
      await db.query(`
        INSERT INTO users (name, email, password, role) 
        VALUES (?, ?, ?, ?)
      `, ['Admin User', 'admin@indiarail.com', adminPassword, 'admin']);
      
      // Insert regular user
      await db.query(`
        INSERT INTO users (name, email, password, role) 
        VALUES (?, ?, ?, ?)
      `, ['Test User', 'user@example.com', userPassword, 'user']);
      
      console.log('Default users seeded');
    }

    // Check if we already have trains
    const [trains] = await db.query('SELECT * FROM trains LIMIT 1');
    
    if (trains.length === 0) {
      // Insert trains
      const trainData = [
        {
          name: 'Rajdhani Express',
          number: '12301',
          from_station: 'New Delhi',
          to_station: 'Mumbai Central',
          departure: '16:50',
          arrival: '08:35',
          duration: '15h 45m',
          type: 'Superfast',
          price: 1450,
          availability: 'Available',
          rating: 4.7
        },
        {
          name: 'Shatabdi Express',
          number: '12002',
          from_station: 'New Delhi',
          to_station: 'Bhopal',
          departure: '06:15',
          arrival: '14:10',
          duration: '7h 55m',
          type: 'Premium',
          price: 850,
          availability: 'Limited',
          rating: 4.5
        },
        {
          name: 'Duronto Express',
          number: '12213',
          from_station: 'Mumbai CST',
          to_station: 'Delhi Sarai Rohilla',
          departure: '23:10',
          arrival: '16:25',
          duration: '17h 15m',
          type: 'Superfast',
          price: 1250,
          availability: 'Available',
          rating: 4.3
        },
        {
          name: 'Vande Bharat Express',
          number: '22435',
          from_station: 'New Delhi',
          to_station: 'Varanasi',
          departure: '06:00',
          arrival: '14:00',
          duration: '8h 00m',
          type: 'Premium',
          price: 1950,
          availability: 'Available',
          rating: 4.9
        },
        {
          name: 'Tejas Express',
          number: '22119',
          from_station: 'Mumbai CST',
          to_station: 'Karmali',
          departure: '05:50',
          arrival: '14:15',
          duration: '8h 25m',
          type: 'Premium',
          price: 1200,
          availability: 'Limited',
          rating: 4.5
        }
      ];
      
      for (const train of trainData) {
        // Insert train
        const [result] = await db.query(`
          INSERT INTO trains 
          (name, number, from_station, to_station, departure, arrival, duration, type, price, availability, rating) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          train.name, train.number, train.from_station, train.to_station, 
          train.departure, train.arrival, train.duration, train.type, 
          train.price, train.availability, train.rating
        ]);
        
        const trainId = result.insertId;
        
        // Insert train classes
        const classesMap = {
          'Rajdhani Express': ['SL', '3A', '2A', '1A'],
          'Shatabdi Express': ['CC', 'EC'],
          'Duronto Express': ['SL', '3A', '2A'],
          'Vande Bharat Express': ['CC', 'EC'],
          'Tejas Express': ['CC', 'EC']
        };
        
        const classes = classesMap[train.name] || [];
        for (const cls of classes) {
          await db.query(`
            INSERT INTO train_classes (train_id, class) VALUES (?, ?)
          `, [trainId, cls]);
        }
        
        // Insert train amenities
        const amenitiesMap = {
          'Rajdhani Express': ['food', 'wifi', 'entertainment', 'charging', 'bedding'],
          'Shatabdi Express': ['food', 'wifi', 'entertainment', 'charging'],
          'Duronto Express': ['food', 'bedding', 'charging'],
          'Vande Bharat Express': ['food', 'wifi', 'entertainment', 'charging'],
          'Tejas Express': ['food', 'wifi', 'entertainment', 'charging']
        };
        
        const amenities = amenitiesMap[train.name] || [];
        for (const amenity of amenities) {
          await db.query(`
            INSERT INTO train_amenities (train_id, amenity) VALUES (?, ?)
          `, [trainId, amenity]);
        }
      }
      
      console.log('Default trains seeded');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
}

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'user']
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertId, name, email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: result.insertId, name, email, role: 'user' },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Train routes
app.get('/api/trains', async (req, res) => {
  try {
    // Get trains with classes and amenities
    const [trains] = await db.query(`
      SELECT * FROM trains
    `);
    
    // Fetch classes and amenities for each train
    const enhancedTrains = await Promise.all(trains.map(async (train) => {
      // Get classes
      const [classes] = await db.query(
        'SELECT class FROM train_classes WHERE train_id = ?',
        [train.id]
      );
      
      // Get amenities
      const [amenities] = await db.query(
        'SELECT amenity FROM train_amenities WHERE train_id = ?',
        [train.id]
      );
      
      return {
        id: train.id.toString(),
        name: train.name,
        number: train.number,
        from: train.from_station,
        to: train.to_station,
        departure: train.departure.substring(0, 5),
        arrival: train.arrival.substring(0, 5),
        duration: train.duration,
        price: train.price,
        availability: train.availability,
        rating: train.rating,
        type: train.type,
        classes: classes.map(c => c.class),
        amenities: amenities.map(a => a.amenity)
      };
    }));
    
    res.json(enhancedTrains);
  } catch (error) {
    console.error('Error fetching trains:', error);
    res.status(500).json({ message: 'Server error fetching trains' });
  }
});

app.get('/api/trains/:id', async (req, res) => {
  try {
    const trainId = req.params.id;
    
    // Get train
    const [trains] = await db.query('SELECT * FROM trains WHERE id = ?', [trainId]);
    
    if (trains.length === 0) {
      return res.status(404).json({ message: 'Train not found' });
    }
    
    const train = trains[0];
    
    // Get classes
    const [classes] = await db.query(
      'SELECT class FROM train_classes WHERE train_id = ?',
      [trainId]
    );
    
    // Get amenities
    const [amenities] = await db.query(
      'SELECT amenity FROM train_amenities WHERE train_id = ?',
      [trainId]
    );
    
    res.json({
      id: train.id.toString(),
      name: train.name,
      number: train.number,
      from: train.from_station,
      to: train.to_station,
      departure: train.departure.substring(0, 5),
      arrival: train.arrival.substring(0, 5),
      duration: train.duration,
      price: train.price,
      availability: train.availability,
      rating: train.rating,
      type: train.type,
      classes: classes.map(c => c.class),
      amenities: amenities.map(a => a.amenity)
    });
  } catch (error) {
    console.error('Error fetching train:', error);
    res.status(500).json({ message: 'Server error fetching train details' });
  }
});

// Ticket routes
app.post('/api/tickets', authenticateToken, async (req, res) => {
  try {
    const { trainId, journeyDate, className, passengers, totalAmount } = req.body;
    const userId = req.user.id;
    
    // Generate ticket ID
    const ticketId = `T${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Create ticket
    await db.query(
      'INSERT INTO tickets (id, user_id, train_id, journey_date, class, total_amount) VALUES (?, ?, ?, ?, ?, ?)',
      [ticketId, userId, trainId, journeyDate, className, totalAmount]
    );
    
    // Add passengers
    for (const passenger of passengers) {
      await db.query(
        'INSERT INTO passengers (ticket_id, name, age, gender) VALUES (?, ?, ?, ?)',
        [ticketId, passenger.name, passenger.age, passenger.gender]
      );
    }
    
    res.status(201).json({ 
      message: 'Ticket booked successfully',
      ticketId
    });
  } catch (error) {
    console.error('Error booking ticket:', error);
    res.status(500).json({ message: 'Server error booking ticket' });
  }
});

app.get('/api/tickets', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all tickets for user
    const [tickets] = await db.query(`
      SELECT t.*, tr.name, tr.number, tr.from_station, tr.to_station, tr.departure, tr.arrival, tr.duration
      FROM tickets t
      JOIN trains tr ON t.train_id = tr.id
      WHERE t.user_id = ?
      ORDER BY t.booking_date DESC
    `, [userId]);
    
    // Get passengers for each ticket
    const ticketsWithPassengers = await Promise.all(tickets.map(async (ticket) => {
      const [passengers] = await db.query(
        'SELECT name, age, gender FROM passengers WHERE ticket_id = ?',
        [ticket.id]
      );
      
      return {
        id: ticket.id,
        train: {
          name: ticket.name,
          number: ticket.number,
          from: ticket.from_station,
          to: ticket.to_station,
          departure: ticket.departure.substring(0, 5),
          arrival: ticket.arrival.substring(0, 5),
          duration: ticket.duration,
        },
        journeyDate: ticket.journey_date,
        bookingDate: ticket.booking_date,
        class: ticket.class,
        status: ticket.status,
        totalAmount: ticket.total_amount,
        passengers
      };
    }));
    
    res.json(ticketsWithPassengers);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Server error fetching tickets' });
  }
});

app.get('/api/tickets/:id', authenticateToken, async (req, res) => {
  try {
    const ticketId = req.params.id;
    const userId = req.user.id;
    
    // Get ticket
    const [tickets] = await db.query(`
      SELECT t.*, tr.name, tr.number, tr.from_station, tr.to_station, tr.departure, tr.arrival, tr.duration
      FROM tickets t
      JOIN trains tr ON t.train_id = tr.id
      WHERE t.id = ? AND (t.user_id = ? OR ? = (SELECT id FROM users WHERE role = 'admin' AND id = ?))
    `, [ticketId, userId, userId, userId]);
    
    if (tickets.length === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    const ticket = tickets[0];
    
    // Get passengers
    const [passengers] = await db.query(
      'SELECT name, age, gender FROM passengers WHERE ticket_id = ?',
      [ticketId]
    );
    
    res.json({
      id: ticket.id,
      train: {
        name: ticket.name,
        number: ticket.number,
        from: ticket.from_station,
        to: ticket.to_station,
        departure: ticket.departure.substring(0, 5),
        arrival: ticket.arrival.substring(0, 5),
        duration: ticket.duration,
      },
      journeyDate: ticket.journey_date,
      bookingDate: ticket.booking_date,
      class: ticket.class,
      status: ticket.status,
      totalAmount: ticket.total_amount,
      passengers
    });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ message: 'Server error fetching ticket details' });
  }
});

app.put('/api/tickets/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const ticketId = req.params.id;
    const userId = req.user.id;
    
    // Check if ticket exists and belongs to user
    const [tickets] = await db.query(
      'SELECT * FROM tickets WHERE id = ? AND user_id = ?',
      [ticketId, userId]
    );
    
    if (tickets.length === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Update ticket status
    await db.query(
      'UPDATE tickets SET status = ? WHERE id = ?',
      ['cancelled', ticketId]
    );
    
    res.json({ message: 'Ticket cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling ticket:', error);
    res.status(500).json({ message: 'Server error cancelling ticket' });
  }
});

// Admin routes
app.get('/api/admin/dashboard', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get counts
    const [userCount] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "user"');
    const [trainCount] = await db.query('SELECT COUNT(*) as count FROM trains');
    const [ticketCount] = await db.query('SELECT COUNT(*) as count FROM tickets');
    const [cancelledCount] = await db.query('SELECT COUNT(*) as count FROM tickets WHERE status = "cancelled"');
    
    // Get recent bookings
    const [recentBookings] = await db.query(`
      SELECT t.id, t.booking_date, t.journey_date, t.status, t.total_amount,
             u.name as userName, tr.name as trainName
      FROM tickets t
      JOIN users u ON t.user_id = u.id
      JOIN trains tr ON t.train_id = tr.id
      ORDER BY t.booking_date DESC
      LIMIT 10
    `);
    
    res.json({
      stats: {
        userCount: userCount[0].count,
        trainCount: trainCount[0].count,
        ticketCount: ticketCount[0].count,
        cancelledCount: cancelledCount[0].count
      },
      recentBookings
    });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    res.status(500).json({ message: 'Server error fetching admin dashboard data' });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeDatabase();
});
