import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const DB_PATH = path.join(process.cwd(), 'db.json')

interface Ticket {
  id: string
  userId: string
  eventId: string
  currentToken: string
  tokenExpiration: number
  isUsed: boolean
}

interface User {
  id: string
  username: string
  password: string // In a real app, this should be hashed
}

interface DB {
  tickets: Ticket[]
  users: User[]
}

async function readDB(): Promise<DB> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return { tickets: [], users: [] }
  }
}

async function writeDB(db: DB) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2))
}

export async function createUser(username: string, password: string): Promise<User> {
  const db = await readDB()
  const user: User = { id: uuidv4(), username, password }
  db.users.push(user)
  await writeDB(db)
  return user
}

export async function getUser(username: string, password: string): Promise<User | null> {
  const db = await readDB()
  return db.users.find(u => u.username === username && u.password === password) || null
}

export async function createTicket(userId: string, eventId: string): Promise<Ticket> {
  const db = await readDB()
  const ticket: Ticket = {
    id: uuidv4(),
    userId,
    eventId,
    currentToken: uuidv4(),
    tokenExpiration: Date.now() + 30 * 1000, // 30 seconds from now
    isUsed: false
  }
  db.tickets.push(ticket)
  await writeDB(db)
  return ticket
}

export async function getTicket(ticketId: string): Promise<Ticket | null> {
  const db = await readDB()
  return db.tickets.find(t => t.id === ticketId) || null
}

export async function updateTicketToken(ticketId: string): Promise<Ticket | null> {
  const db = await readDB()
  const ticket = db.tickets.find(t => t.id === ticketId)
  if (ticket) {
    ticket.currentToken = uuidv4()
    ticket.tokenExpiration = Date.now() + 30 * 1000 // 30 seconds from now
    await writeDB(db)
  }
  return ticket || null
}

export async function useTicket(ticketId: string): Promise<boolean> {
  const db = await readDB()
  const ticket = db.tickets.find(t => t.id === ticketId)
  if (ticket && !ticket.isUsed) {
    ticket.isUsed = true
    await writeDB(db)
    return true
  }
  return false
}

