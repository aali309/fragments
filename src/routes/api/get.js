const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const path = require('path');

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

const getFragmentById = async (req, res) => {
  try {
    const ownerId = req.user;
    const id = path.parse(req.params.id).name;
    const ext = path.parse(req.params.id).ext.slice(1);

    const fragment = await Fragment.byId(ownerId, id);
    const fragmentData = await fragment.getData();

    if (!ext) {
      logger.debug({ fragment }, 'GET /fragments/:id');
      res.setHeader('Content-Type', fragment.type); // Set the correct "Content-Type" header based on the fragment type
      res.status(200).send(fragmentData.toString());
    } else {
      logger.debug({ id: id, ext: ext }, 'GET /fragments/:id.ext');

      if (!Fragment.isSupportedExt(ext)) {
        return res.status(415).json(createErrorResponse(415, 'Extension type is not supported.'));
      }

      const type = Fragment.extValidType(ext); // html -> text/html

      if (!fragment.formats.includes(type)) {
        return res.status(415).json(createErrorResponse(415, 'Conversion is not allowed.'));
      }

      const newFragmentData = fragment.convertData(fragmentData, type);
      logger.debug({ newFragmentData }, 'Converted fragment data');
      res.setHeader('Content-type', type);
      res.status(200).send(newFragmentData);
    }
  } catch (error) {
    res.status(404).json(createErrorResponse(404, error.message));
  }
};

const getFragmentMetaDataById = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    logger.debug({ fragment }, 'GET /fragments/:id/info');
    res.status(200).json(createSuccessResponse(fragment));
  } catch (error) {
    res.status(404).json(createErrorResponse(404, error.message));
  }
};

module.exports = { getFragments, getFragmentById, getFragmentMetaDataById };
