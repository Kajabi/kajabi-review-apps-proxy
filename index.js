import proxy from '@fly/proxy'
import { responseCache } from "@fly/cache"

// Proxy requests matching the pattern: *.pr-123.kajabi-staging.com to the CNAME
// located at pr-123.kajabi-staging.com, which will be the Review App's
// randomized Heroku hostname.
fly.http.respondWith(function(req) {
  const url = new URL(req.url)
  const identifier = url.host.match(/\.(pr-\d+)\./)[1]
  const lookup = `${identifier}.kajabi-staging.com`

  return resolveDnsRecord(lookup, 'CNAME').then(herokuHostName => {
    return proxy(`https://${herokuHostName}`, {})(req)
  })
})

// Using an HTTP-based DNS resolver here instead of something from the OS since
// the Fly app runtime is v8, not Node. We cache the response for that reason.
async function resolveDnsRecord(name, type) {
  const url = `https://cloudflare-dns.com/dns-query?name=${name}&type=${type}`

  let res = await responseCache.get(url)

  if (!res){
    res = await fetch(url, { method: 'GET', headers: {"Accept": "application/dns-json"} })
    await responseCache.set(url, res, { ttl: 300 })
  }

  const json = await res.json()

  return json["Answer"][0]["data"].slice(0, -1) // remove trailing '.'
}
