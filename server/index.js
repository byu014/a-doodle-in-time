require('dotenv/config');
const pg = require('pg');
const express = require('express');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const authorizationMiddleware = require('./authorization-middleware');
const staticMiddleware = require('./static-middleware');
const multer = require('multer');
const path = require('path');
const DatauriParser = require('datauri/parser');
const cloudinary = require('cloudinary').v2;
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const storage = multer.memoryStorage();
const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (ALLOWED_FORMATS.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Not supported file type!'), false);
    }
  }
});
const singleUpload = upload.single('image');
const singleUploadCtrl = (req, res, next) => {
  singleUpload(req, res, error => {
    if (error) {
      return res.status(422).send({ message: 'Image upload fail!' });
    }

    next();
  });
};
const parser = new DatauriParser();

const formatBufferTo64 = file => parser.format(path.extname(file.originalname).toString(), file.buffer);

const db = new pg.Pool(
  {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }

  }
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const cloudinaryUpload = file => cloudinary.uploader.upload(file, { folder: 'DrawingApp/' });

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const app = express();

app.use(staticMiddleware);

app.use(express.json({ limit: '500mb' }));

app.post('/api/auth/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
        insert into "users" ("username", "hashedPassword")
        values ($1, $2)
        returning *;
      `;
      const params = [username, hashedPassword];
      return db.query(sql, params);
    })
    .then(result => {
      const [user] = result.rows;
      res.status(201).json(user);
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
    select "userId",
           "hashedPassword"
      from "users"
     where "username" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { userId, hashedPassword } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { userId, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.get('/api/allDoodles', (req, res, next) => {
  const sql = 'select * from "doodles"';
  db.query(sql)
    .then(result => res.json(result.rows))
    .catch(error => next(error));
});

app.get('/api/userDoodles/:userId', (req, res, next) => {
  let { userId } = req.params;
  userId = Number.parseInt(userId);
  if (!Number.isInteger(userId)) {
    throw new ClientError(400, 'userId must be an integer');
  }
  const sql = `select * from "doodles"
    where "userId" = $1
    order by "createdAt" desc, "doodleId" desc;`;
  const params = [userId];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => next(error));
});

app.get('/api/user/:userId', (req, res, next) => {
  let { userId } = req.params;
  userId = Number.parseInt(userId);
  if (!Number.isInteger(userId)) {
    throw new ClientError(400, 'userId must be an integer');
  }
  const sql = `select * from users
    where "userId" = $1;`;
  const params = [userId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows.length) {
        throw new ClientError(404, `user does not exist with userId ${userId}`);
      }
      res.json(result.rows);
    })
    .catch(error => next(error));
});

app.get('/api/doodle/today/:userId', (req, res, next) => {
  let { userId } = req.params;
  userId = Number.parseInt(userId);
  if (!Number.isInteger(userId)) {
    throw new ClientError(400, 'userId must be an integer');
  }
  const sql = 'select * from "doodles" where "createdAt"::date >= NOW()::date and "userId" = $1;';
  const params = [userId];

  db.query(sql, params)
    .then(result => {
      if (!result.rows.length) {
        throw new ClientError(404, `cannot find from today with user ${userId}`);
      }
      res.json(result.rows[0]);
    })
    .catch(error => next(error));
});

app.get('/api/doodle/:doodleId', (req, res, next) => {
  let { doodleId } = req.params;
  doodleId = Number.parseInt(doodleId);
  if (!Number.isInteger(doodleId)) {
    throw new ClientError(400, 'doodleId must be an integer');
  }
  const sql = `select * from "doodles"
    join "users" using ("userId")
    where "doodleId" = $1;`;
  const params = [doodleId];

  db.query(sql, params)
    .then(result => {
      if (!result.rows.length) {
        throw new ClientError(404, `cannot find doodle with doodleId ${doodleId}`);
      }
      res.json(result.rows[0]);
    })
    .catch(error => next(error));
});

app.get('/api/doodles/:fullDate', (req, res, next) => {
  const fullDate = req.params.fullDate.split('-');
  if (fullDate.length !== 3) {
    throw new ClientError(400, 'Date must be in ISO-8601 format (YYYY-MM-DD)');
  }
  const [year, month, date] = fullDate.map(val => Number.parseInt(val));
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(date)) {
    throw new ClientError('Year, Month, and Date values must be integers');
  }

  const sql = `select * from "doodles"
    join "users" using ("userId")
    where "createdAt"::date = $1
    order by "createdAt" desc, "doodleId" desc;`;
  const params = [req.params.fullDate];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => next(error));
});

app.get('/api/favorites/:userId', (req, res, next) => {
  let { userId } = req.params;
  userId = Number.parseInt(userId);
  if (!Number.isInteger(userId)) {
    throw new ClientError(400, 'userId must be an integer');
  }
  const sql = `select * from "favorites"
    join "users" using  ("userId")
    join "doodles" using ("doodleId")
    where "favorites"."userId" = $1
    order by "favoritedAt" desc`;
  const params = [userId];

  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => next(error));
});

app.use(authorizationMiddleware);

app.patch('/api/doodle/:doodleId', (req, res, next) => {
  let { doodleId } = req.params;
  let { title, caption, dataUrl } = req.body;

  if (!dataUrl) {
    throw new ClientError(400, 'dataUrl required');
  }
  if (!caption) {
    caption = '';
  }
  if (!title || !title.length) {
    const date = new Date();
    title = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  doodleId = Number.parseInt(doodleId);
  if (!Number.isInteger(doodleId)) {
    throw new ClientError(400, 'doodleId must be an integer');
  }

  const sql = `update "doodles"
  set "caption" = $2, "title" = $3, "dataUrl" = $4
  where "doodleId" = $1
  returning *;`;
  const params = [doodleId, caption, title, dataUrl];

  db.query(sql, params)
    .then(result => {
      if (!result.rows.length) {
        throw new ClientError(404, `cannot find doodle with doodleId ${doodleId}`);
      }
      res.json(result.rows[0]);
    })
    .catch(error => next(error));
});

app.delete('/api/doodle/:doodleId', (req, res, next) => {
  let { doodleId } = req.params;
  doodleId = Number.parseInt(doodleId);
  if (!Number.isInteger(doodleId)) {
    throw new ClientError(400, 'doodleId must be an integer');
  }
  const sql = `delete from "doodles" where "doodleId" = $1
    returning *;`;
  const params = [doodleId];

  const sql2 = 'delete from "favorites" where "doodleId" = $1 returning *';
  const params2 = [doodleId];
  db.query(sql2, params2)
    .then(() => {
      db.query(sql, params)
        .then(result => {
          if (!result.rows.length) {
            throw new ClientError(404, `cannot find doodle with doodleId ${doodleId}`);
          }
          res.json(result.rows[0]);
        })
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

app.post('/api/doodle', (req, res, next) => {
  let { title, caption, dataUrl, userId } = req.body;
  userId = Number.parseInt(userId);
  if (!dataUrl) {
    throw new ClientError(400, 'dataUrl required');
  }
  if (!caption) {
    caption = '';
  }
  if (!title || !title.length) {
    const date = new Date();
    title = `${monthNames[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
  }
  const sql = `insert into "doodles" ("title", "caption", "dataUrl", "userId")
  values ($1, $2, $3, $4)
  returning *;`;
  const params = [title, caption, dataUrl, userId];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows[0]);
    })
    .catch(error => {
      next(error);
    });
});

app.post('/api/favorite/:doodleId', (req, res, next) => {
  let { doodleId } = req.params;
  doodleId = Number.parseInt(doodleId);
  if (!Number.isInteger(doodleId)) {
    throw new ClientError(400, 'doodleId must be an integer');
  }
  let { userId } = req.body;
  userId = Number.parseInt(userId);
  if (!Number.isInteger(userId)) {
    throw new ClientError(400, 'userId must be an integer');
  }

  const sql = `select * from "favorites"
    where "userId" = $1 and "doodleId" = $2;`;
  const params = [userId, doodleId];

  db.query(sql, params)
    .then(result => {
      if (!result.rows.length) {
        const sql2 = `insert into "favorites" ("userId", "doodleId")
          values ($1, $2)
          returning *;`;
        const params2 = [userId, doodleId];

        db.query(sql2, params2)
          .then(result2 => {
            res.json(result2.rows);
          })
          .catch(error => next(error));
      } else {
        const sql2 = `delete from "favorites"
          where "userId" = $1 and "doodleId" = $2
          returning *;`;
        const params2 = [userId, doodleId];
        db.query(sql2, params2)
          .then(result2 => {
            res.json(result2.rows);
          })
          .catch(error => next(error));
      }
    })
    .catch(error => next(error));
});

app.post('/api/uploadPfp', singleUploadCtrl, async (req, res, next) => {
  let { userId } = req.body;
  userId = Number.parseInt(userId);
  if (!Number.isInteger(userId)) {
    throw new ClientError(400, 'userId must be an integer');
  }

  if (!req.file) {
    throw new ClientError(400, 'image file required');
  }
  const file64 = formatBufferTo64(req.file);
  try {
    const uploadResult = await cloudinaryUpload(file64.content);
    const sql = 'select * from "users" where "userId" = $1';
    const params = [userId];
    db.query(sql, params)
      .then(result => {
        const pfpUrl = result.rows[0].pfpUrl;
        let publicId = pfpUrl.split('/');
        publicId = publicId[publicId.length - 1].split('.')[0];
        if (publicId !== 'default') {
          cloudinary.uploader.destroy(`DrawingApp/${publicId}`);
        }
      })
      .catch(error => next(error));
    const sql2 = `update "users"
      set "pfpUrl" = $1
      where "userId" = $2
      returning *;`;
    const params2 = [uploadResult.url, userId];

    db.query(sql2, params2)
      .then(result => res.json(result.rows[0]))
      .catch(error => next(error));

  } catch (error) {
    next(error);
  }
});

app.patch('/api/user', (req, res, next) => {
  let { userId, bio, location, email } = req.body;
  userId = Number.parseInt(userId);
  if (!Number.isInteger(userId)) {
    throw new ClientError(400, 'userId must be an integer');
  }
  if (!userId || bio === undefined || location === undefined || email === undefined) {
    throw new ClientError(400, 'userId, bio, location, and email required');
  }
  const sql = `update "users"
    set "bio" = $1, "location" = $2, "email" = $3
    where "userId" = $4
    returning *;`;
  const params = [bio, location, email, userId];

  db.query(sql, params)
    .then(result => res.json(result.rows[0]))
    .catch(error => next(error));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
