// TODO : fix types

import { extname } from 'path';
import * as json from './db.json';

const db = json as MimeTypeRecord;

type MimeTypeRecord = Record<
  string,
  {
    source?: string;
    compressible?: boolean;
    charset?: string;
    extensions?: string[];
  }
>;

const EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
const TEXT_TYPE_REGEXP = /^text\//i;
export const extensions = {} as Record<string, string[]>;
export const types = {} as Record<string, string>;

// Populate the extensions/types maps
populateMaps(extensions, types);

export function charset(type: string) {
  if (!type || typeof type !== 'string') {
    return false;
  }

  // TODO: use media-typer
  const match = EXTRACT_TYPE_REGEXP.exec(type);
  const matched = match?.[1];
  const mime =
    match && (db as MimeTypeRecord)[matched?.toLocaleLowerCase() || ''];

  if (mime && mime.charset) {
    return mime.charset;
  }

  // default text/* to utf-8
  if (matched && TEXT_TYPE_REGEXP.test(matched)) {
    return 'UTF-8';
  }

  return false;
}

export const charsets = { lookup: charset };

export function contentType(str: string) {
  // TODO: should this even be in this module?
  if (!str || typeof str !== 'string') {
    return false;
  }

  let mime = str.indexOf('/') === -1 ? lookup(str) : str;

  if (!mime) {
    return false;
  }

  // TODO: use content-type or other module
  if (mime.indexOf('charset') === -1) {
    const charset1 = charset(mime);
    if (charset1) mime += '; charset=' + charset1.toLowerCase();
  }

  return mime;
}

export function extension(type?: string) {
  if (!type || typeof type !== 'string') {
    return false;
  }

  // TODO: use media-typer
  const match = EXTRACT_TYPE_REGEXP.exec(type);

  // get extensions
  const exts = match && extensions[match[1]?.toLowerCase() || ''];

  if (!exts || !exts.length) {
    return false;
  }

  return exts[0];
}

export function extensionFromPath(path: string): boolean | string {
  if (!path || typeof path !== 'string') {
    return false;
  }

  // get the extension ("ext" or ".ext" or full path)
  const extension = extname('x.' + path)
    .toLowerCase()
    .slice(1);
  if (!extension) {
    return false;
  }
  return extension;
}

export function lookup(path: string) {
  const extension = extensionFromPath(path);
  if (!extension) {
    return false;
  }
  return types[extension.toString()] || false;
}

function populateMaps(
  extensions: Record<string, any>,
  types: Record<string, any>
) {
  // source preference (least -> most)
  const preference = ['nginx', 'apache', undefined, 'iana'];

  Object.keys(db).forEach(function forEachMimeType(type) {
    const mime = db[type];
    const exts = mime?.extensions;

    if (!exts || !exts.length) {
      return;
    }

    // mime -> extensions
    extensions[type] = exts;

    // extension -> mime
    for (let i = 0; i < exts.length; i++) {
      const extension = exts[i];
      if (!extension) continue;
      if (types[extension]) {
        const from = preference.indexOf(db[types[extension]]?.source);
        const to = preference.indexOf(mime.source);

        if (
          types[extension] !== 'application/octet-stream' &&
          (from > to ||
            (from === to && types[extension].slice(0, 12) === 'application/'))
        ) {
          // skip the remapping
          continue;
        }
      }

      // set the extension -> mime
      types[extension] = type;
    }
  });
}

//copied from mime-types since db is outdated
