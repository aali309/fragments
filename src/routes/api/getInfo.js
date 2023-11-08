const Fragment = require('../../model/fragment').Fragment;

const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working.

  var ownerId = require('crypto').createHash('sha256').update(req.user).digest('hex');
  var metadata = await Fragment.byId(ownerId, req.params.id);

  console.log('This is a test: ' + metadata); // testing
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
      data: metadata,
    })
  );
};
