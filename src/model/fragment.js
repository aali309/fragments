// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

const validTypes = [
  `text/plain`,
  /*
   Currently, only text/plain is supported. Others will be added later.

  `text/markdown`,
  `text/html`,
  `application/json`,
  `image/png`,
  `image/jpeg`,
  `image/webp`,
  `image/gif`,
  */
];

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    // TODO
    if (ownerId == undefined && type == undefined)
      throw 'ownerIda and type are required to create a new class!';
    else if (ownerId == undefined || type == undefined)
      throw 'ownerIda and type are required to create a new class!';
    else this.ownerId = ownerId;

    for (let i = 0; i < validTypes.length; i++)
      if (type.includes(validTypes[i])) this.type = type;
      else throw 'Invalid type is passed!';

    if (typeof size != 'number' || size < 0) throw 'size must me a number and greater then -1!';
    else this.size = size;

    if (id == undefined || id == '') this.id = randomUUID();
    else this.id = id;

    if (created == undefined) this.created = new Date().toISOString();
    else this.created = created;

    if (updated == undefined) this.updated = new Date().toISOString();
    else this.updated = updated;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    // TODO
    var values = await listFragments(ownerId, expand);
    return Promise.resolve(values);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    // TODO

    var value = await readFragment(ownerId, id);
    if (value == undefined) throw Error();
    return Promise.resolve(value);
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static async delete(ownerId, id) {
    // TODO
    return Promise.resolve(await deleteFragment(ownerId, id));
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  async save() {
    // TODO
    return new Promise((resolve, reject) => {
      writeFragment(this)
        .then(() => {
          this.updated = new Date().toISOString();
          //console.log(this);
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    // TODO
    var obj = await readFragmentData(this.ownerId, this.id);
    const value = Buffer.from(obj);
    return value;
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    // TODO
    if (data == '') throw 'Data is empty or undefined!';
    this.updated = new Date().toISOString();
    this.size++;
    return writeFragmentData(this.ownerId, this.id, data.toString());
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    // TODO
    if (this.type.includes('text')) return true;
    else return false;
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    // TODO
    var types_ = [];
    for (let i = 0; i < validTypes.length; ++i)
      if (this.type.includes(validTypes[i])) types_.push(validTypes[i]);

    return types_;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    // TODO
    for (let i = 0; i < validTypes.length; i++)
      if (value.includes(validTypes[i])) return true;
      else return false;
  }
}

module.exports.Fragment = Fragment;
