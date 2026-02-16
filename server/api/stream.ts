import type { Peer } from 'crossws'

// Store connected clients for real-time updates
const clients: Set<Peer> = new Set()

// Function to broadcast updates to all connected clients
export function broadcastTaskUpdate(data: any) {
  const message = JSON.stringify(data)
  clients.forEach(client => {
    try {
      client.send(message)
    } catch (e) {
      // Client may have disconnected
    }
  })
}

export default defineWebSocketHandler({
  open(peer) {
    clients.add(peer)
  },
  close(peer) {
    clients.delete(peer)
  },
  error(peer, error) {
    clients.delete(peer)
  }
})
