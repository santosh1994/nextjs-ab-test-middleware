const { getCookie } = require("./utils");

const YEAR_IN_MILLI_SEC = 1000 * 60 * 60 * 24 * 365;
const AB_IDENTIFIER_KEY = "__ab_experiment__";

function setAbVariant(req, res, next, experiments) {
  const newAbVariants = {};
  let newExpAdded = false;
  let currAbVariantsSet = getCookie(AB_IDENTIFIER_KEY, req.headers.cookie);

  currAbVariantsSet = currAbVariantsSet
    ? JSON.parse(decodeURIComponent(currAbVariantsSet))
    : {};

  experiments.forEach((experiment) => {
    if (!currAbVariantsSet[experiment.name]) {
      let n = Math.random() * 100;
      let { variants } = experiment;

      if (typeof variants === "function") {
        variants = variants(req, res);
      }

      let variant = variants[0];

      if (
        typeof experiment.customFilter === "undefined" ||
        experiment.customFilter(req, res)
      ) {
        variant = variants.find((v) => {
          if (v.weight >= n) return true;
          n -= v.weight;

          return false;
        });
      }
      newAbVariants[experiment.name] = variant.id;
      newExpAdded = true;
    } else {
      newAbVariants[experiment.name] = currAbVariantsSet[experiment.name];
    }
  });

  if (newExpAdded) {
    res.cookie(AB_IDENTIFIER_KEY, JSON.stringify(newAbVariants), {
      maxAge: YEAR_IN_MILLI_SEC,
    });
  }

  next();
}

module.exports = setAbVariant;
