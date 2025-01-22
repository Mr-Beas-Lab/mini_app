import type { LocalTunnelConfig } from 'localtunnels'
import { startLocalTunnel } from 'localtunnels'

const config: LocalTunnelConfig = {
  from: 'localhost:5173',
  domain: 'stacksjs.dev', // optional, defaults to the stacksjs.dev domain
  subdomain: 'test', // optional, uses a random subdomain by default
  verbose: true, // optional, defaults to false
}

startLocalTunnel(config)