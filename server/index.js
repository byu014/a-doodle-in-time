require('dotenv/config');
const pg = require('pg');
const express = require('express');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');

const db = new pg.Pool(
  {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }

  }
);

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const app = express();

app.use(staticMiddleware);

app.use(express.json({ limit: '500mb' }));

app.post('/api/doodle', (req, res, next) => {
  let { title, caption, dataUrl } = req.body;
  const userId = 1;// update when adding user auth
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
  const sql = 'select * from "doodles" where "doodleId" = $1;';
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

  db.query(sql, params)
    .then(result => {
      if (!result.rows.length) {
        throw new ClientError(404, `cannot find doodle with doodleId ${doodleId}`);
      }
      res.json(result.rows[0]);
    })
    .catch(error => next(error));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
