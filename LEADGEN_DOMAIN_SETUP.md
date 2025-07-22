# LeadGen.to Domain Setup with Namecheap

## Step 1: Configure DNS Records in Namecheap

### Required DNS Configuration for leadgen.to

You need to set up the following DNS records in your Namecheap account:

#### Primary DNS Records
```
Type: CNAME
Host: www
Value: cname.vercel-dns.com
TTL: 1 hour

Type: A Record
Host: @
Value: 76.76.19.19
TTL: 1 hour

Type: A Record
Host: @
Value: 76.76.21.21
TTL: 1 hour
```

#### Subdomain Support (Optional)
```
Type: CNAME
Host: *
Value: cname.vercel-dns.com
TTL: 1 hour
```

### Namecheap Setup Instructions

1. **Login to Namecheap**
   - Go to https://namecheap.com
   - Login to your account
   - Navigate to "Domain List"

2. **Access DNS Settings**
   - Find "leadgen.to" in your domain list
   - Click "Manage" next to the domain
   - Go to "Advanced DNS" tab

3. **Clear Existing Records**
   - Delete any existing A records for "@" (root domain)
   - Delete any existing CNAME records for "www"

4. **Add New Records**
   
   **Add CNAME for www:**
   - Type: CNAME Record
   - Host: www
   - Value: cname.vercel-dns.com
   - TTL: 1 hour
   
   **Add A Records for root domain:**
   - Type: A Record
   - Host: @
   - Value: 76.76.19.19
   - TTL: 1 hour
   
   - Type: A Record
   - Host: @
   - Value: 76.76.21.21
   - TTL: 1 hour

   **Add Wildcard CNAME (for subdomains):**
   - Type: CNAME Record
   - Host: *
   - Value: cname.vercel-dns.com
   - TTL: 1 hour

5. **Save Changes**
   - Click "Save all changes"
   - DNS propagation can take 24-48 hours

### Verification Commands

After 30-60 minutes, test the DNS setup:

```bash
# Check A records
dig leadgen.to

# Check CNAME records
dig www.leadgen.to

# Check wildcard subdomain
dig test.leadgen.to
```

Expected results:
- `leadgen.to` should resolve to 76.76.19.19 or 76.76.21.21
- `www.leadgen.to` should show CNAME to cname.vercel-dns.com
- `*.leadgen.to` should also resolve via CNAME

### Current Application Support

The codebase already supports:
- ✅ `leadgen.to` - Main platform landing page
- ✅ `www.leadgen.to` - Same as root domain
- ✅ `leadgen.to/brezcode` - BrezCode brand path
- ✅ `leadgen.to/admin` - Admin interface
- ✅ `leadgen.to/login` - User authentication
- ✅ `brezcode.leadgen.to` - Subdomain routing (once DNS is configured)

### Next Steps

After DNS is configured, we'll proceed to:
- Step 2: Deploy to Vercel with custom domain
- Step 3: Configure SSL certificates
- Step 4: Test all routing scenarios
- Step 5: Update application for production