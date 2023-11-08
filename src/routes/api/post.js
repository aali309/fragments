// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const Fragment = require('../../model/fragment').Fragment;
const logger = require('../../logger');
const express = require('express');
const contentType = require('content-type');
require('dotenv').config();
// eslint-disable-next-line valid-jsdoc

// Support sending various Content-Types on the body up to 5M in size
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // See if we can parse this content type. If we can, `req.body` will be
      // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
      // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  });

module.exports = async (req, res) => {
  if (!Buffer.isBuffer(req.body)) {
    logger.warn('POST /fragments received unsupported media type');
    return res.status(400).json(createErrorResponse(400, 'Bad Request'));
  }

  const fragment = new Fragment({
    ownerId: require('crypto').createHash('sha256').update(req.user).digest('hex'),
    type: req.get('Content-Type'),
    size: req.body.toString().length - 1,
  });

  await fragment.save();
  await fragment.setData(req.body);

  res.set('Location', `${process.env.API_URL}/v1/fragments/${fragment.id}`);
  return res.status(201).json(createSuccessResponse({ status: 'ok', fragment }));
};

module.exports.rawBody = rawBody;
