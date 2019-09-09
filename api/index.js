import auth from './auth/index.js';
import analysis from './analysis/index.js';
import preview from './preview/index.js';
import question from './question/index.js';

export default {
  ...auth,
  ...analysis,
  ...preview,
  ...question
}