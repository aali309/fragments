const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

const getFragments = async (req, res) => {
  const { expand } = req.query;

  if (expand === '1') {
    const fragments = await Fragment.byUser(req.user, true);
    res.status(200).json(createSuccessResponse({ fragments }));
  } else {
    const fragments = await Fragment.byUser(req.user, false);
    res.status(200).json(createSuccessResponse({ fragments }));
  }
};

const getFragmentById = async (req, res, next) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    res.status(200).json(createSuccessResponse(fragment));
  } catch (error) {
    next(error);
  }
};

const getFragmentMetaDataById = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    logger.debug({ fragment }, 'GET /fragments/:id/info');
    res.status(200).json(createSuccessResponse(fragment));
  } catch (error) {
    res.status(500).json(createErrorResponse(500, error.message));
  }
};

module.exports = { getFragments, getFragmentById, getFragmentMetaDataById };
