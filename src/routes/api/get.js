// src/routes/api/get.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const Fragment = require('../../model/fragment').Fragment;
// eslint-disable-next-line valid-jsdoc
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working...
  var metadata;
  var ownerID = require('crypto').createHash('sha256').update(req.user).digest('hex');

  metadata = await Fragment.byUser(ownerID, req.query.expand);

  //console.log(metadata);

  if (!metadata) {
    res.status(404).json(
      createErrorResponse({
        status: 404,
        err: 'Metadata with given id does not exist',
      })
    );
  }

  res.status(200).json(
    createSuccessResponse({
      status: 'ok',
      fragments: [metadata],
    })
  );
};
