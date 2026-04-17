# LuxeRide Lite — Free Catalog Demo

> A beautiful, responsive product catalog built with Next.js 15, TypeScript, and MongoDB.  
> Browse products, search, filter, and view details — completely free.

---

## 🚀 Quick Start

### Docker (Recommended)
```bash
docker compose up --build
```
Open **http://localhost:3000**.

### Local Development
```bash
npm install
cp .env.example .env.local
# Edit .env.local with your MongoDB URI
npm run dev
```

---

## What's Included (Free)

- ✅ Product catalog with search & filter
- ✅ Individual product detail pages with specs
- ✅ User authentication (signup/login)
- ✅ Admin panel (User management + Catalog CRUD)
- ✅ Dark mode
- ✅ Responsive design
- ✅ Docker support

---

---

## Environment Variables

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/luxeride
JWT_SECRET=any-random-string
ADMIN_EMAIL=admin@luxeride.com
ADMIN_PASSWORD=admin123
```

---

## License

This project is free for personal and commercial use.

*Built with ❤️ using Next.js, TypeScript, and MongoDB.*
