# Авто машин түрээсийн вэб систем (жишээ төсөл)

Энэ репо нь HTML/CSS/JS front-end, Node.js + Express back-end, MySQL өгөгдлийн сан бүхий "Авто машин түрээс" системийн жишээ бүтцийг харуулна. Код нь JWT-auth, роль шалгах middleware, үндсэн REST API, мөн демо фронтын хуудсуудыг агуулна.

## Технологи
- Front-end: HTML5, CSS3, JavaScript (Fetch API, localStorage ашигласан).
- Back-end: Node.js 18+, Express 4, bcryptjs, jsonwebtoken, mysql2, morgan, cors.
- Database: MySQL 8.x (schema.sql файлд бүрэн DDL + демо мэдээлэл бий).

## Фолдерийн бүтэц
- `/public` – статик front-end хуудсууд (нүүр, login/register, профайл, машин жагсаалт, захиалга, админ/менежер/жолоочийн самбарууд).
- `/src` – Express сервер
  - `app.js` – Express app, маршрутууд, алдааны менежмент
  - `/routes` – REST API эндпоинтууд
  - `/controllers` – бизнес логик (MySQL query)
  - `/middleware/auth.middleware.js` – JWT баталгаажуулалт, роль шалгах
  - `/config` – орчны тохиргоо (`config.js`) ба MySQL connection pool (`db.js`)
- `/database/schema.sql` – MySQL-ийн бүрэн схем, демо өгөгдөлтэй.

## Түргэн эхлүүлэх
1. Хамаарал суулгах:
   ```bash
   npm install
   ```
2. Орчны хувьсагчийн `.env` файл үүсгэх (сонголт):
   ```bash
   PORT=3000
   JWT_SECRET=super-secret
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpass
   DB_NAME=car_rental
   ```
3. MySQL схемийг импортлох:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
4. Сервер асаах:
   ```bash
   npm start
   ```
   - Express сервер `http://localhost:3000` дээр ажиллана.
   - `public/` фолдер статик сервэрлэгдэнэ, REST API `/api/*` урсгалыг ашиглана.

## Үндсэн REST API (жишээ)
- `POST /api/auth/register` – хэрэглэгч бүртгэх (customer роль)
- `POST /api/auth/login` – JWT авах
- `GET /api/auth/me` – өөрийн мэдээлэл (JWT шаардлагатай)
- `GET /api/cars` – машин жагсаалт, query filter (`category`, `minPrice`, `maxPrice`, `fuel`)
- `POST /api/bookings` – захиалга үүсгэх (customer/admin/manager)
- `PATCH /api/bookings/:id/status` – захиалгын төлөв өөрчлөх (admin/manager/driver)
- `GET /api/payments` – төлбөрийн жагсаалт (admin/manager)
- `GET /api/deliveries` – хүргэлтийн жагсаалт (admin/manager/driver)
- `GET /api/maintenance` – засварын бүртгэл (admin/manager)

## Демо нэвтрэх
`database/schema.sql` дотор bcrypt-ээр hashed нууц үгтэй дараах хэрэглэгчид бий (нууц үг: `password`):
- admin@example.com (admin)
- manager@example.com (manager)
- driver@example.com (driver)
- customer@example.com (customer)

## Туршилт ба цааш хөгжүүлэх санаа
- Front-end-ийг Fetch API ашиглан JWT хадгалалттайгаар REST API-тай холбож, форм submit event дээр API дуудлага хийж болно.
- Favorites, Re-book, илүү нарийн төлбөрийн баталгаажуулалт, GPS хүргэлтийн маршрут зэрэг өргөтгөх боломжтой.
